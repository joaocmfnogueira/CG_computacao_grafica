import * as THREE from 'three';
import {
   InfoBox
} from "../libs/util/util.js";
import Stats from '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { createTrack2, createTrack1, createTrack0} from "./models/map.js"
import { createHavac, createHavacEnemy } from './models/vehicle.js';
import {applyLateralSlide, createSpeedDisplay, updateSpeedDisplay, createLapsCount, updateLapDisplay, showFinishScreen, initLight, initRenderer, createCheckPointCount, updateCheckPointDisplay, createBulletCount, updateBulletDisplay, removeAndDispose} from './utils.js';
import {keyboardUpdate, updateVehicleMovement, updateCamera} from './control/control.js';
import { collisionSystem } from './models/map.js';
import { WaypointFollower } from './models/WaypointFollower.js';


let scene, renderer, camera, light;
const container = document.getElementById( 'container' );
const stats = new Stats();
container.appendChild( stats.dom );
scene = new THREE.Scene();
renderer = initRenderer();
const BLOCK_SIZE = 30;

// Adicionando a câmera
let position_camera = new THREE.Vector3(50, 25, 0);
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(position_camera);
camera.lookAt(new THREE.Vector3(1, 0, 0)); 
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

// Criando a luz básica e o teclado
light = initLight(scene);
let keyboard = new KeyboardState();

// Criando a pista inicial
createTrack1(scene);

// Variaveis básicas do sistema de tiro
let nBullets = 4;
let bulletsInGame = [];

// Variaveis basicas do veiculo do jogador
let velocity = 0;
let aceleration = 0;
let laps_count = 0;
let checkpoints_count = 0;

// Pista atual
let trackNumber = "Primeiro";

// Localização dos blocos de canto que vão orietar a direção dos bots, o quarto valor é se tem que virar a direita (1) ou esquerda (-1)
// let tracks = {
//   "Primeiro" : [[-180, 0, 0], [-180, 0, -270], [90, 0, -270], [90, 0, 0]],
//   "Segundo" : [[-180, 0, 0], [-180, 0, -270], [-30, 0, -270], [-30, 0, -120], [90, 0, -120], [90, 0, 0]],
//   "Terceiro" : [[-90, 0, 0], [-90, 0, -270], [-210, 0, -270], [-210, 0, -150], [30, 0, -150], [30, 0, 0]]
// }

let tracks = {
  "Primeiro" : [
    new THREE.Vector3(-180, 0,   0),
    new THREE.Vector3(-180, 0, -270),
    new THREE.Vector3(  90, 0, -270),
    new THREE.Vector3(  90, 0,   0)
  ],

  "Segundo" : [
    new THREE.Vector3(-180, 0,    0),
    new THREE.Vector3(-180, 0, -270),
    new THREE.Vector3( -30, 0, -270),
    new THREE.Vector3( -30, 0, -120),
    new THREE.Vector3(  90, 0, -120),
    new THREE.Vector3(  90, 0,    0)
  ],

  "Terceiro" : [
    new THREE.Vector3(-90,  0,   0),
    new THREE.Vector3(-90,  0, -270),
    new THREE.Vector3(-210, 0, -270),
    new THREE.Vector3(-210, 0, -150),
    new THREE.Vector3(  30, 0, -150),
    new THREE.Vector3(  30, 0,    0)
  ]
};


// localização dos checkpoints
let trackPoints = {
  "Primeiro" : [[-180, 0, -30], [-150, 0, -270], [90, 0, -240], [60, 0, 0]],
  "Segundo" : [[-180, 0, -30], [-150, 0, -270], [-30, 0, -240], [90, 0, -90]],
  "Terceiro" : [[-90, 0, -30], [-120, 0, -270], [-180, 0, -150], [30, 0, -120]]
}

// Variavel para pausar o jogo quando acontece troca de telas e outros eventos similares
let isPaused = false;

// Variavel para amarzenar o tempo gasto entre os frames
let clock = new THREE.Clock();


createHavac(scene);

// Criando os veiculos adversários e registrando eles
let enemy1 = createHavacEnemy(scene, "rgba(126, 235, 126, 1)", "rgba(12, 15, 188, 1)", "rgba(235, 151, 126, 1)", 0);
let enemy2 = createHavacEnemy(scene, "rgba(204, 153, 13, 1)", "rgba(255, 0, 0, 1)", "rgba(75, 12, 12, 1)", 1);
let enemy3 = createHavacEnemy(scene, "rgba(0, 238, 16, 1)", "rgba(0, 118, 14, 1)", "rgba(112, 0, 87, 1)", 2);
let enemy4 = createHavacEnemy(scene, "rgba(163, 205, 220, 1)", "rgba(0, 225, 255, 1)", "rgba(0, 0, 0, 1)", 3);

// Constante para exibir o a velocidade do veiculo
const speedDisplay = createSpeedDisplay();

// Constante para exibir a quantidade de voltas que o veiculo fez
const lapsDisplay = createLapsCount();

// Constante pare exibir a quantidade de checkpoints que o veiculo fez
const checkPointDisplay = createCheckPointCount();

// Constante para exibir a quantidade de tiros que ainda resta do jogador
const bulletDisplay = createBulletCount();


const follower = new WaypointFollower(enemy1, tracks["Primeiro"], 50, 5);
const follower2 = new WaypointFollower(enemy2, tracks["Primeiro"], 50, 5);
const follower3 = new WaypointFollower(enemy3, tracks["Primeiro"], 50, 5);
const follower4 = new WaypointFollower(enemy4, tracks["Primeiro"], 50, 5);


render();

function render() {
   stats.update();
   scene.updateMatrixWorld(true);
   requestAnimationFrame(render);

   if (isPaused) return;

   const dt = clock.getDelta();
   
   // --- PHYSICS SUB-STEPPING START ---
   // We divide the frame time into smaller chunks (e.g., 5 steps).
   // This ensures that even at high speeds or low FPS, we catch collisions early.
   const SUBSTEPS = 5; 
   const subDt = dt / SUBSTEPS;

   for (let i = 0; i < SUBSTEPS; i++) {
       // 1. Move the vehicle (Prediction)
       updateVehicleMovement(subDt, scene, velocity, keyboard, scene.getObjectByName("light"));
       
       // 2. Check for collision
       const car = scene.getObjectByName("veiculo_principal");
       const [isColided, angle, normal, wall] = checkCarCollision(car, car.userData.obb);

       // 3. Resolve collision immediately
       if (isColided) {
           [velocity, aceleration] = applyCollisionResponse(car, angle, normal, wall, subDt, velocity, aceleration);
       }
   }
   // --- PHYSICS SUB-STEPPING END ---


   // Update game logic (inputs, followers, displays) using the total dt
   // Note: We pass 'false' for isColided here because we handled physics above
   const result = keyboardUpdate(keyboard, velocity, aceleration, dt, scene, cameraHolder, laps_count, checkpoints_count, trackNumber, nBullets, bulletsInGame, false);
   
   velocity = result.velocity;
   aceleration = result.aceleration;
   laps_count = result.laps_count;
   checkpoints_count = result.checkpoints_count;
   trackNumber = result.trackNumber;
   nBullets = result.nBullets;
   bulletsInGame = result.bulletsInGame;

   // Bullet logic
   for (let i = bulletsInGame.length - 1; i >= 0; i--) {
       const bullet = bulletsInGame[i];
       bullet.translateX(-150 * dt);
       bullet.userData.updateOBB();

       if (collisionSystem.checkbulletcolision(bullet.userData.obb)) {
           removeAndDispose(bullet);
           scene.remove(bullet);
           bulletsInGame.splice(i, 1);
       }
   }

   // Update bots
   follower.update(dt);
   follower2.update(dt);
   follower3.update(dt);
   follower4.update(dt);

   updateCamera(dt, scene, velocity, aceleration, keyboard, cameraHolder, false);
   updateSpeedDisplay(velocity, speedDisplay);

   // Checkpoints and Laps
   const car = scene.getObjectByName("veiculo_principal");
   if (car) {
      const carPosition = car.getWorldPosition(new THREE.Vector3());
      checkLapCompletion(carPosition);
      checkCheckPointCompletion(carPosition, trackNumber);
   }
   
   updateLapDisplay(laps_count, lapsDisplay);
   updateCheckPointDisplay(checkpoints_count, checkPointDisplay);
   updateBulletDisplay(nBullets, bulletDisplay);

   if(laps_count == 4){
       showFinishScreen();
   }

   renderer.render(scene, camera);
}

/* 
Eventos e método auxiliares para em caso de troca de aba ou saída de tela garanta que 
que o jogo pause no momento que saiu.
*/
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isPaused = true;
    console.log("Jogo pausado");
    resetKeyboardState(); // prevent stuck keys
  } else {
    isPaused = false;
    clock.elapsedTime = 0;
    clock.start(); // avoid dt jump
    console.log("Jogo voltou");
  }
});

window.addEventListener('blur', () => {
  isPaused = true;
  console.log("Jogo pausado");
  resetKeyboardState();
});

window.addEventListener('focus', () => {
  isPaused = false;
  clock.elapsedTime = 0;
  clock.start();
  console.log("Jogo voltou");
});

// Método para verificar a colisão do carro
function checkCarCollision(car, carBox) {
  const [isColided, angle, normal, wall] = collisionSystem.checkCollision(car, carBox, scene);
    if (isColided) {
        // Handle collision - stop car, play sound, etc.
        // console.log("Collision detected!");
        return [true, angle, normal, wall];
    }
    return [false, null, null, null];
}

// Método usado para evitar bugs em alguns cenários
function resetKeyboardState() {
  if (KeyboardState.status) {
    for (let key in KeyboardState.status) {
      delete KeyboardState.status[key];
    }
  }
}

// Método para verificar se o carro completou a volta
function checkLapCompletion(carPos) {
   // Check if car is within the finish line area
   const isInFinishZone = 
   (carPos.x <= 12.5 && carPos.x >= -12.5) && (carPos.z <= 12.5 && carPos.z >= -12.5) ;
  //  console.log(isInFinishZone);
  //  console.log(carPos);
   
  //  if (isInFinishZone && !canCompleteLap) {
  //     // Car entered finish zone
  //     canCompleteLap = true;
  //  }
   
   // If car leaves finish zone after entering, complete the lap
   if (isInFinishZone && checkpoints_count == 4) {
      laps_count++;
      checkpoints_count = 0;
      console.log(`Lap ${laps_count} completed!`);
      nBullets = 4;
   }
}

// Método para verificar se o carro passou por um checkpoint
function checkCheckPointCompletion(carPos, trackNumber) {
  const R = 12.5;
  let points = trackPoints[trackNumber];
    // console.log(points.length)
    if (checkpoints_count >= points.length) return;

    const checkpoint = points[checkpoints_count];
    const [x, y, z] = checkpoint;

    const dentro =
      carPos.x >= x - R && carPos.x <= x + R &&
      carPos.z >= z - R && carPos.z <= z + R;

    if (dentro) {
      checkpoints_count++;
    }
}

// Método que aplica a resposta da colisão
function applyCollisionResponse(car, angle, normal, wall, dt, velocity, acceleration) {
    const BLOCK_SIZE = 30;

    // 1. Identify Directions
    // Car's physical forward direction (Local -X axis in World Space)
    const carForward = new THREE.Vector3(-1, 0, 0).applyQuaternion(car.quaternion).normalize();
    const velocityVec = carForward.clone().multiplyScalar(velocity);
    const wallNormal = normal.clone().normalize();

    // 2. Positional Correction (Anti-Tunneling)
    // Push the car out of the wall immediately to stop it from getting stuck
    const projection = velocityVec.dot(wallNormal);
    if (projection < 0) {
        // Calculate how deep we are and push out + a tiny safety margin
        const pushFactor = Math.abs(projection * dt * BLOCK_SIZE) + 0.05;
        car.position.addScaledVector(wallNormal, pushFactor);
        car.userData.updateOBB(); 
    }

    // 3. Calculate Slide Vector
    // Remove the speed that is going INTO the wall, keep the speed along the wall.
    const dot = velocityVec.dot(wallNormal);
    const slideVec = velocityVec.clone().sub(wallNormal.clone().multiplyScalar(dot));
    
    // Apply Wall Friction (slow down while scraping)
    const wallFriction = 0.92; 
    slideVec.multiplyScalar(wallFriction);

    // 4. Update Velocity/Acceleration
    if (angle < 30) {
        // Hard crash (Head on) -> Stop
        velocity = -velocity * 0.3; 
        acceleration = 0;
    } else {
        // Glancing hit -> Slide
        // Check if we are reversing so we keep the sign correct
        const isReversing = velocityVec.dot(carForward) < 0;
        
        velocity = slideVec.length();
        if (isReversing) velocity = -velocity; // Keep negative speed if reversing

        acceleration *= 0.5; // Lose power while sliding

        // --- 5. FIXED ROTATION ALIGNMENT ---
        // We want the car's NOSE (-X) to point along the slide direction.
        
        if (Math.abs(velocity) > 0.05) {
            let targetDir = slideVec.clone().normalize();

            // CRITICAL FIX: Prevent 180 flip.
            // If the slide direction is opposite to where the car is facing 
            // (e.g. sliding backwards), flip the target vector so the nose 
            // still points "forward" relative to the car geometry.
            if (targetDir.dot(carForward) < 0) {
                targetDir.negate();
            }

            // Construct a Rotation Matrix manually for -X Forward geometry
            // We want: Local -X axis -> targetDir
            // Therefore: Local +X axis -> -targetDir
            const xAxis = targetDir.clone().negate(); 
            const yAxis = new THREE.Vector3(0, 1, 0); // World Up
            
            // Z = X cross Y
            const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
            
            // Recalculate X to ensure it's strictly perpendicular to Y and Z
            xAxis.crossVectors(yAxis, zAxis).normalize();

            // Create Matrix
            const targetRotationMat = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
            const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetRotationMat);

            // Smoothly rotate the car to match the wall angle
            // 0.15 is the "stiffness" of the alignment (higher = snaps faster)
            car.quaternion.slerp(targetQuat, 0.15);
        }
    }

    // Stop completely if too slow
    if (Math.abs(velocity) < 0.1) velocity = 0;

    return [velocity, acceleration];
}
