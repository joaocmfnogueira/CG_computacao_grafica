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
  const [isColided, angle, normal] = checkCarCollision(scene.getObjectByName("veiculo_principal"), scene.getObjectByName("veiculo_principal").userData.obb);
//   if (isColided) {
//     const car = scene.getObjectByName("veiculo_principal");
//     console.log("RIGHT VECTOR BEFORE:", car.getWorldDirection(new THREE.Vector3()).clone());
//     console.log("LEFT AXIS BEFORE:", new THREE.Vector3(1,0,0).applyQuaternion(car.quaternion));

//     if(angle < 35 && velocity > 0){
//       // velocity /= 10;
//       console.log(velocity*20);
//       console.log(Math.log(velocity*20));
//       if(velocity > 2){
//         // let recuo = THREE.MathUtils.lerp(0,Math.log(velocity*20), dt);
//         // scene.getObjectByName("veiculo_principal").translateX(0.5);
//         // scene.getObjectByName("veiculo_principal").translateX(recuo);
//         scene.getObjectByName("veiculo_principal").translateX(0.5 + Math.log(velocity*20));
//       }
//       else{
//         scene.getObjectByName("veiculo_principal").translateX(0.5);
//       }
//       velocity = -velocity/2;
//       aceleration = -aceleration;
      
//     }
//     else if(angle < 35 && velocity < 0){
//       if(velocity < -2){
//         scene.getObjectByName("veiculo_principal").translateX(-0.5 - Math.log(-velocity*20));
//       }
//       else{
//         scene.getObjectByName("veiculo_principal").translateX(-0.5);
//       }

//       velocity = -velocity/2;
//       aceleration = -aceleration;
//     }
//     else if(angle >= 35 && angle < 45){
//           velocity = 0;
//           aceleration = 0;
//     }
//     else if (angle >= 45) {

//     // diminui a velocidade conforme o ângulo
//     velocity = velocity / (90 / (90 - (90 - angle)));

    

//     // --- rotação segura ---
//     const targetAngle = THREE.MathUtils.degToRad(90 - angle);
//     const desvio = THREE.MathUtils.lerp(0, targetAngle, dt * (90 - angle));

//     car.rotateY(desvio);

//     // empurra levemente para frente
//     car.translateZ(0.25);
//     console.log("RIGHT VECTOR AFTER:", car.getWorldDirection(new THREE.Vector3()).clone());
//     console.log("LEFT AXIS AFTER:", new THREE.Vector3(1,0,0).applyQuaternion(car.quaternion));
// }
//     else{
//       let aux = velocity;
//           velocity = 0;
//           aceleration = 0;
//           // if(aux > 0){
//           //   scene.getObjectByName("veiculo_principal").translateX(0.5);
//           // }
//           // else{
//           //   scene.getObjectByName("veiculo_principal").translateX(-0.5);
//           // }
//     }
//   }
  if (isColided){
    const car = scene.getObjectByName("veiculo_principal");
    [velocity, aceleration] = applyCollisionResponse(car, angle, normal, dt, velocity, aceleration);
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
  const [isColided, angle, normal] = collisionSystem.checkCollision(car, carBox, scene)
    if (isColided) {
        // Handle collision - stop car, play sound, etc.
        console.log("Collision detected!");
        return [true, angle, normal];
    }
    return [false, null, null];
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


function applyCollisionResponse(car, angle, normal, dt, velocity, acceleration) {

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
    else if (angle >= 35 && angle < 45) {

        velocity = 0;
        acceleration = 0;
    }
    else if (angle >= 45) {

        // desvio lateral sem inverter eixo
        const target = THREE.MathUtils.degToRad(90 - angle);
        const desvio = THREE.MathUtils.lerp(0, target, dt * (90 - angle));

        // rotação suave
        car.rotateY(desvio);

        // empurra o carro para longe da parede
        car.position.addScaledVector(normal, 0.25);

        // diminui velocidade dependendo de quão "lateral" é o choque
        const smooth = 0.01;
        velocity = velocity / (1 + (90 - angle)*smooth);
    }
    else {
        velocity = 0;
        acceleration = 0;
    }

    // **garante que eixos não invertam nunca**
    car.quaternion.normalize();
    return [velocity, acceleration];
}


