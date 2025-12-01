import * as THREE from 'three';
import {
   InfoBox
} from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';
import { createTrack2, createTrack1, createTrack0} from "./models/map.js"
import { createHavac } from './models/vehicle.js';
import {createSpeedDisplay, updateSpeedDisplay, createLapsCount, updateLapDisplay, showFinishScreen, initLight, initRenderer} from './utils.js';
import {keyboardUpdate, updateVehicleMovement, updateCamera, resetVehicle} from './control/control.js';
import { collisionSystem } from './models/map.js';


let scene, renderer, camera, light;
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

let velocity = 0;
let aceleration = 0;
let laps_count = 0;
let canCompleteLap = false;

// Variavel para pausar o jogo quando acontece troca de telas e outros eventos similares
let isPaused = false;

// Variavel para amarzenar o tempo gasto entre os frames
let clock = new THREE.Clock();

// Informações básicas do jogo
let controls = new InfoBox();
controls.add("Basic Controls");
controls.addParagraph();
controls.add("Keyboard commands:");
controls.add("* 1 to change to track1");
controls.add("* 2 to change to track2");
controls.add("* R to reset vehicle");
controls.add("* Arrow keys to drive");
controls.show();

createHavac(scene);

// Constante para exibir o a velocidade do veiculo
const speedDisplay = createSpeedDisplay();

// Constante para exibir a quantidade de voltas que o veiculo fez
const lapsDisplay = createLapsCount();

// Variaveis que definem se houve colisão e em qual angulo


render();

function render() {
   scene.updateMatrixWorld(true);
   requestAnimationFrame(render);

   // Avalia se algum evento de troca de tela ou perca de foco aconteceu, se acontecer, congela as atualizações 
   if (isPaused) return

   const dt = clock.getDelta();
   const result = keyboardUpdate(keyboard, velocity, aceleration, dt, scene, cameraHolder, laps_count);
   velocity = result.velocity;
   aceleration = result.aceleration;
   laps_count = result.laps_count

   updateVehicleMovement(dt, scene, velocity, keyboard, light);
   
  // Avalia a colisão
  const [isColided, angle, normal, wall] = checkCarCollision(scene.getObjectByName("veiculo_principal"), scene.getObjectByName("veiculo_principal").userData.obb);

  if (isColided){
    const car = scene.getObjectByName("veiculo_principal");
    [velocity, aceleration] = applyCollisionResponse(car, angle, normal, wall, dt, velocity, aceleration);
  }
  
  

   updateCamera(dt, scene, velocity, aceleration, keyboard, cameraHolder);

   updateSpeedDisplay(velocity, speedDisplay);

   const car = scene.getObjectByName("veiculo_principal");
   if (car) {
      const carPosition = car.getWorldPosition(new THREE.Vector3());
      // console.log(carPosition)
      
      checkLapCompletion(carPosition);
   }
   updateLapDisplay(laps_count, lapsDisplay);

   if(laps_count == 4){
    showFinishScreen(scene);
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

function checkCarCollision(car, carBox) {
  const [isColided, angle, normal, wall] = collisionSystem.checkCollision(car, carBox, scene);
    if (isColided) {
        // Handle collision - stop car, play sound, etc.
        console.log("Collision detected!");
        return [true, angle, normal, wall];
    }
    return [false, null, null, null];
}

function resetKeyboardState() {
  if (KeyboardState.status) {
    for (let key in KeyboardState.status) {
      delete KeyboardState.status[key];
    }
  }
}

function checkLapCompletion(carPos) {
   // Check if car is within the finish line area
   const isInFinishZone = 
      (carPos.x <= 5 && carPos.x >= 2) && (carPos.z <= 7.5 && carPos.z >= -6) ;
   
   if (isInFinishZone && !canCompleteLap) {
      // Car entered finish zone
      canCompleteLap = true;
   }
   
   // If car leaves finish zone after entering, complete the lap
   if (!isInFinishZone && canCompleteLap) {
      laps_count++;
      canCompleteLap = false;
      console.log(`Lap ${laps_count} completed!`);
   }
}


function applyCollisionResponse(car, angle, normal, wall, dt, velocity, acceleration) {

    // segurança absoluta – evitar quaternions degenerados
    car.quaternion.normalize();
    console.log(velocity)
    if (angle < 35 && velocity > 0) {

        const bump = velocity > 2
            ? 0.5 + Math.log(velocity * 20)
            : 0.5;
        console.log(bump);
        car.translateX(bump);
        velocity = -velocity / 2;
        acceleration = -acceleration;
    }
    else if (angle < 35 && velocity < 0) {

        const bump = velocity < -2
            ? -0.5 - Math.log(-velocity * 20)
            : -0.5;

        car.translateX(bump);
        velocity = -velocity / 2;
        acceleration = -acceleration;
    }
    // else if (angle >= 35 && angle < 45) {

    //     velocity = 0;
    //     acceleration = 0;
    // }
    else if (angle >= 35) {

        // direction car → wall
        const forward = new THREE.Vector3(-1,0,0)
        .applyQuaternion(car.quaternion)
        .normalize();

        // use wall normal, not wall.position
        const wallNormal = normal.clone().normalize();

        // rotation sign: should we rotate left or right to escape the wall?
        const cross = new THREE.Vector3().crossVectors(forward, wallNormal);
        let rotationSign = Math.sign(cross.y);
        // if(wall.mesh.name.includes("rightWall"))
        //     rotationSign *= -1;
        console.log(wall.mesh.name);
        // smooth rotation away from the wall
        const maxRot = THREE.MathUtils.degToRad(0.5);
        car.rotateY(rotationSign * maxRot);

        // push the car slightly away
        car.position.addScaledVector(wallNormal, 0.1);

        // slow down
        const smooth = 0.01;
        velocity = velocity / (1 + (90 - angle) * smooth);
    }
    else {
      // pior caso, que não deve acontecer
      console.log("Algum erro aconteceu com o angulo do veiculo!!!!");
        velocity = 0;
        acceleration = 0;
    }

    // **garante que eixos não invertam nunca**
    car.quaternion.normalize();
    return [velocity, acceleration];
}


