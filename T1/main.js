import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
   initRenderer,
   initCamera,
   initDefaultBasicLight,
   InfoBox,
   onWindowResize
} from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';
import { createTrack1 } from "./models/mapa.js"
import { createHavac } from './models/veiculo.js';
import {createSpeedDisplay, updateSpeedDisplay} from './utils.js';
import {keyboardUpdate, updateVehicleMovement, updateCamera} from './control.js';

let scene, renderer, camera, light, orbit;
scene = new THREE.Scene();
renderer = initRenderer();

// adicionando a camera
let position_camera = new THREE.Vector3(50, 25, 0);
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(position_camera);
camera.lookAt(new THREE.Vector3(1, 0, 0)); // or camera.lookAt(0, 0, 0);

let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);

scene.add(cameraHolder);

light = initDefaultBasicLight(scene);

// To use the keyboard
let keyboard = new KeyboardState();

// Criando a pista inicial
createTrack1(scene);

// Vehicle physics parameters - TUNED FOR BETTER GAMEPLAY
let velocidade = 0;
let aceleracao = 0;

// letiavel para pausar o jogo quando acontece troca de telas e outros eventos similares
let isPaused = false;

let clock = new THREE.Clock();

// Use this to show information onscreen
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

render();

function render() {
   requestAnimationFrame(render);

   if (isPaused) return

   const dt = clock.getDelta();
   const result = keyboardUpdate(keyboard, velocidade, aceleracao, dt, scene, cameraHolder);
   velocidade = result.velocidade;
   aceleracao = result.aceleracao;

   updateVehicleMovement(dt, scene, velocidade, keyboard, cameraHolder);
   updateCamera(dt, scene, velocidade, aceleracao, keyboard, cameraHolder);

   updateSpeedDisplay(velocidade, speedDisplay);
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

function resetKeyboardState() {
  if (KeyboardState.status) {
    for (let key in KeyboardState.status) {
      delete KeyboardState.status[key];
    }
  }
}
