import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
   initRenderer,
   initCamera,
   initDefaultBasicLight,
   InfoBox,
   onWindowResize
} from "../libs/util/util.js";
import { createTrack1 } from "./models/mapa.js"
import KeyboardState from '../libs/util/KeyboardState.js';
import { createHavac } from './models/veiculo.js';
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

createTrack1(scene);

// Vehicle physics parameters - TUNED FOR BETTER GAMEPLAY
let velocidade = 0;
let aceleracao = 0;


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

// Create speed display
const speedDisplay = createSpeedDisplay();

render();

function render() {
   const dt = clock.getDelta();
   const result = keyboardUpdate(keyboard, velocidade, aceleracao, dt, scene);
   velocidade = result.velocidade;
   aceleracao = result.aceleracao;

   updateVehicleMovement(dt, scene, velocidade, keyboard);
   updateSpeedDisplay();
   requestAnimationFrame(render);
   renderer.render(scene, camera);
}



function createSpeedDisplay() {
   const speedDiv = document.createElement('div');
   speedDiv.style.position = 'absolute';
   speedDiv.style.top = '10px';
   speedDiv.style.right = '10px';
   speedDiv.style.color = '#44ff44';
   speedDiv.style.fontFamily = 'Arial, sans-serif';
   speedDiv.style.fontSize = '24px';
   speedDiv.style.fontWeight = 'bold';
   speedDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
   speedDiv.style.padding = '15px';
   speedDiv.style.borderRadius = '10px';
   speedDiv.style.border = '2px solid #333';
   speedDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
   speedDiv.id = 'speedDisplay';
   document.body.appendChild(speedDiv);
   
   return speedDiv;
}

function updateSpeedDisplay() {
   const speed = Math.abs(velocidade);
   speedDisplay.textContent = `Speed: ${speed.toFixed(2)} km/h`;
   
   // Update controls display as well
   updateControlsSpeedDisplay(speed);
}

function updateControlsSpeedDisplay(speed) {
   // This function would update the InfoBox speed display
   // Implementation depends on your InfoBox API
   const speedText = `Speed: ${speed.toFixed(1)} km/h`;
   // You might need to modify this based on how your InfoBox works
}