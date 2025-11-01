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
import {keyboardUpdate, updateVehicleMovement} from './control.js';

let scene, renderer, camera, light, orbit;
scene = new THREE.Scene();
renderer = initRenderer();
camera = initCamera(new THREE.Vector3(0, 150, 230));
light = initDefaultBasicLight(scene);
orbit = new OrbitControls(camera, renderer.domElement);

// To use the keyboard
var keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Criando a pista inicial
createTrack1(scene);

// Vehicle physics parameters - TUNED FOR BETTER GAMEPLAY
let velocidade = 0;
let aceleracao = 0;

// variavel para pausar o jogo quando acontece troca de telas e outros eventos similares
let isPaused = false;

var clock = new THREE.Clock();

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
   const result = keyboardUpdate(keyboard, velocidade, aceleracao, dt, scene);
   velocidade = result.velocidade;
   aceleracao = result.aceleracao;

   updateVehicleMovement(dt, scene, velocidade, keyboard);
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
