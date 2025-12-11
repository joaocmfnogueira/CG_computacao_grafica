import * as THREE from 'three';
import {
   InfoBox
} from "../libs/util/util.js";
import Stats from '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { createTrack2, createTrack1, createTrack0} from "./models/map.js"
import { createHavac, createHavacEnemy } from './models/vehicle.js';
import {createSpeedDisplay, updateSpeedDisplay, createLapsCount, updateLapDisplay, showFinishScreen, initLight, initRenderer, createCheckPointCount, updateCheckPointDisplay, createBulletCount, updateBulletDisplay, removeAndDispose} from './utils.js';
import {keyboardUpdate, updateVehicleMovement, updateCamera} from './control/control.js';
import { collisionSystem } from './models/map.js';
import { WaypointFollower } from './models/WaypointFollower.js';


let scene, renderer, camera, light;
const container = document.getElementById( 'container' );
const stats = new Stats();
container.appendChild( stats.dom );
scene = new THREE.Scene();
renderer = initRenderer();

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

   // Avalia se algum evento de troca de tela ou perca de foco aconteceu, se acontecer, congela as atualizações 
   if (isPaused) return
    // console.log(bulletsInGame);
   const dt = clock.getDelta();
   const [isColided, angle, normal, wall] = checkCarCollision(scene.getObjectByName("veiculo_principal"), scene.getObjectByName("veiculo_principal").userData.obb);

    if (isColided){
      const car = scene.getObjectByName("veiculo_principal");
      [velocity, aceleration] = applyCollisionResponse(car, angle, normal, wall, dt, velocity, aceleration);
    }
   const result = keyboardUpdate(keyboard, velocity, aceleration, dt, scene, cameraHolder, laps_count, checkpoints_count, trackNumber, nBullets, bulletsInGame, isColided);
   velocity = result.velocity;
   aceleration = result.aceleration;
   laps_count = result.laps_count;
   checkpoints_count = result.checkpoints_count;
   trackNumber = result.trackNumber;
   nBullets = result.nBullets;
   bulletsInGame = result.bulletsInGame;

  for (let i = bulletsInGame.length - 1; i >= 0; i--) {
    const bullet = bulletsInGame[i];

    bullet.translateX(-150 * dt);
    bullet.userData.updateOBB();

    if (collisionSystem.checkbulletcolision(bullet.userData.obb)) {

        // remove from scene
        removeAndDispose(bullet);
        scene.remove(bullet);

        // remove from array
        bulletsInGame.splice(i, 1);
    }
}

  updateVehicleMovement(dt, scene, velocity, keyboard, scene.getObjectByName("light"));
  follower.update(dt);
  follower2.update(dt);
  follower3.update(dt);
  follower4.update(dt);

  //  updateEnemyMovement(dt);
    // Avalia a colisão
    
  
  

   updateCamera(dt, scene, velocity, aceleration, keyboard, cameraHolder, isColided);

   updateSpeedDisplay(velocity, speedDisplay);

   const car = scene.getObjectByName("veiculo_principal");
  //  console.log(car.position);
   if (car) {
      const carPosition = car.getWorldPosition(new THREE.Vector3());
      // console.log(carPosition)
      
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
    const DT = dt * 50;
    car.quaternion.normalize();
    
    // Calcula a direção forward do carro
    const forward = new THREE.Vector3(-1, 0, 0)
        .applyQuaternion(car.quaternion)
        .normalize();
    
    const wallNormal = normal.clone().normalize();
    
    // Calcula o quanto o carro está se movendo em direção à parede
    const dotProduct = forward.dot(wallNormal);
    const movingTowardWall = dotProduct > 0;
    
    // Fator baseado na velocidade (quanto mais rápido, mais forte a resposta)
    const speedFactor = Math.min(Math.abs(velocity) / 10, 1);
    
    if (angle < 40) {
        if (angle < 40) {
        const direction = Math.sign(velocity);
        const speed = Math.abs(velocity);
        
        const bump = speed > 2
            ? (0.5 * DT + Math.log(speed * 20) * DT) * direction
            : 0.5 * DT * direction;
        
        car.translateX(bump);
        velocity = -velocity / 2;
        acceleration = -acceleration;
    }
    }
    else if (angle >= 40) {
        // Colisão lateral - física mais realista
        
        // 1. Calcula a penetração atual (estimativa)
        const penetrationDepth = (1 + speedFactor) * 0.3 * DT;
        
        // 2. Correção de posição PRIORITÁRIA - empurra para fora da parede
        // Usa a normal da parede para empurrar o carro para fora
        car.position.addScaledVector(wallNormal, penetrationDepth);
        
        // 3. Se o carro está se movendo em direção à parede, reflete a velocidade
        if (movingTowardWall && Math.abs(velocity) > 0.1) {
            // Calcula o vetor tangente à parede
            const up = new THREE.Vector3(0, 1, 0);
            const tangent = new THREE.Vector3()
                .crossVectors(wallNormal, up)
                .normalize();
            
            // Calcula quanto da velocidade vai contra a parede
            const velocityAgainstWall = velocity * dotProduct;
            
            // Reduz drasticamente a componente da velocidade contra a parede
            const velocityReduction = 0.9 + (0.1 * (90 - angle) / 50); // Maior redução para ângulos mais agudos
            
            // Remove a componente contra a parede
            velocity = velocity - (velocityAgainstWall * velocityReduction);
            
            // Mantém a componente tangencial (deslizamento)
            const tangentVelocity = velocity * forward.dot(tangent);
            
            // 4. Ajusta a direção para deslizar ao longo da parede
            if (Math.abs(tangentVelocity) > 0.1) {
                // Determina se deve girar para esquerda ou direita
                const cross = new THREE.Vector3().crossVectors(forward, tangent);
                const rotationSign = Math.sign(cross.y);
                
                // Aplica rotação suave mas significativa
                const rotationAmount = THREE.MathUtils.degToRad(
                    0.8 * DT * Math.sign(tangentVelocity) * (1 + speedFactor)
                );
                
                car.rotateY(rotationAmount);
            }
            
            // 5. Reduz aceleração na direção da parede
            const accelerationReduction = 0.5 + (0.5 * Math.abs(dotProduct));
            acceleration *= (1 - accelerationReduction);
        }
        
        // 6. Amortecimento adicional para evitar oscilações
        velocity *= 0.95;
    }
    else {
        // Caso de segurança
        velocity *= 0.8;
        acceleration *= 0.8;
    }
    
    // Limitações para estabilidade
    if (Math.abs(velocity) < 0.05) velocity = 0;
    if (Math.abs(acceleration) < 0.05) acceleration = 0;
    
    car.quaternion.normalize();
    return [velocity, acceleration];
}



