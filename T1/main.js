import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
   initRenderer,
   initCamera,
   initDefaultBasicLight,
   InfoBox,
   onWindowResize
} from "../libs/util/util.js";
import { createTrack1, createTrack2, } from "./models/mapa.js"
import KeyboardState from '../libs/util/KeyboardState.js';
import { clearScene } from './utils.js';
import { createHavac } from './models/veiculo.js';

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
const MAX_FORWARD_SPEED = 250;   // top speed (was 45)
const MAX_REVERSE_SPEED = -80;   // reverse top speed
const ACCELERATION_RATE = 80;    // stronger acceleration
const DECELERATION_RATE = 50;    // stronger braking
const BRAKE_POWER = 120;         // hard brake
const FRICTION = 0.96;           // mild friction
const ROTATION_SENSITIVITY = 2.5; // slightly smoother turns

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
controls.addParagraph();
controls.add("Speed: " + Math.abs(velocidade).toFixed(1) + " units/s");
controls.show();

createHavac(scene);

// Create speed display
const speedDisplay = createSpeedDisplay();

render();

function render() {
   const dt = clock.getDelta();
   keyboardUpdate(keyboard);
   updateVehicleMovement(dt);
   updateSpeedDisplay();
   requestAnimationFrame(render);
   renderer.render(scene, camera);
}

function updateVehicleMovement(dt) {
   const vehicle = scene.getObjectByName("veiculo_principal");
   if (!vehicle) return;

   // Apply speed-dependent rotation (more realistic handling)
   const speedFactor = Math.min(Math.abs(velocidade) / MAX_FORWARD_SPEED, 1);
   const effectiveRotationSpeed = ROTATION_SENSITIVITY * (1 - speedFactor * 0.6); // Less responsive at high speeds

   // Rotation with speed-dependent sensitivity
   if (keyboard.pressed("left")) {
      vehicle.rotation.y += effectiveRotationSpeed * dt;
   }
   if (keyboard.pressed("right")) {
      vehicle.rotation.y -= effectiveRotationSpeed * dt;
   }

   // ✅ Move vehicle forward/backward according to its orientation and speed
   if (Math.abs(velocidade) > 0.01) {
      const forward = new THREE.Vector3(-1, 0, 0); // Vehicle’s forward direction
      forward.applyEuler(vehicle.rotation);        // Rotate forward vector by current orientation
      forward.multiplyScalar(velocidade * dt * 1000);     // Scale by velocity and deltaTime
      vehicle.position.add(forward);               // Apply movement
   }
}

function keyboardUpdate(keyboard) {
   keyboard.update();

   // ACCELERATION - More responsive but with better progression
   if (keyboard.pressed("up") || keyboard.pressed("X")) {
      if (velocidade >= 0) {
         // Normal acceleration when moving forward or stationary
         aceleracao = Math.min(aceleracao + ACCELERATION_RATE, 8);
      } else {
         // Strong braking when moving backward and trying to go forward
         aceleracao = Math.min(aceleracao + BRAKE_POWER * 2, 10);
      }
   }
   
   // BRAKING/REVERSE - Better differentiation between braking and reversing
   if (keyboard.pressed("down")) {
      if (velocidade > 0) {
         // Braking when moving forward
         aceleracao = Math.max(aceleracao - BRAKE_POWER, -6);
      } else {
         // Reverse acceleration when stationary or moving backward
         aceleracao = Math.max(aceleracao - DECELERATION_RATE, -4);
      }
   }

   // FRICTION & COASTING - More realistic deceleration
   if (!keyboard.pressed("up") && !keyboard.pressed("down") && !keyboard.pressed("X")) {
      if (velocidade > 0) {
         aceleracao = Math.max(aceleracao - 1.5, -2); // Gentle engine braking
      } else if (velocidade < 0) {
         aceleracao = Math.min(aceleracao + 1.5, 2); // Reverse equivalent
      }
      console.log("Velocidade:", velocidade.toFixed(2), "Aceleracao:", aceleracao.toFixed(2));
      
      // Additional friction
      // velocidade *= FRICTION;
      // if (Math.abs(velocidade) < 0.5) velocidade = 0;
   }

   // Update velocity with realistic limits
   velocidade += aceleracao * clock.getDelta();
   
   // Apply speed limits with smoother transitions
   if (velocidade > MAX_FORWARD_SPEED) {
      velocidade = MAX_FORWARD_SPEED;
      aceleracao = Math.min(aceleracao, 0); // Stop accelerating at max speed
   }
   if (velocidade < MAX_REVERSE_SPEED) {
      velocidade = MAX_REVERSE_SPEED;
      aceleracao = Math.max(aceleracao, 0); // Stop decelerating at max reverse
   }

   // Reset acceleration over time for more natural feel
   aceleracao *= 0.95;
   if (Math.abs(aceleracao) < 0.1) aceleracao = 0;

   // TRACK SWITCHING & RESET
   if (keyboard.down("R")) {
      resetVehicle();
   }

   if (keyboard.down("1")) switchTrack(1);
   if (keyboard.down("2")) switchTrack(2);
}

function resetVehicle() {
   const vehicle = scene.getObjectByName("veiculo_principal");
   if (vehicle) {
      vehicle.position.set(0, 1, 0); // Slightly elevated to avoid ground clipping
      vehicle.rotation.set(0, 0, 0);
      velocidade = 0;
      aceleracao = 0;
   }
}

function switchTrack(trackNumber) {
   clearScene(scene);

   if (trackNumber === 1) {
      createTrack1(scene);
   } else if (trackNumber === 2) {
      createTrack2(scene);
   }

   light = initDefaultBasicLight(scene);
   createHavac(scene);
   resetVehicle();
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
   speedDisplay.textContent = `Speed: ${speed.toFixed(10) * 1000} km/h`;
   
   // Color coding based on speed
   if (speed > MAX_FORWARD_SPEED * 0.8) {
      speedDisplay.style.color = '#ff4444'; // Red - very fast
   } else if (speed > MAX_FORWARD_SPEED * 0.5) {
      speedDisplay.style.color = '#ffaa00'; // Orange - fast
   } else if (speed > MAX_FORWARD_SPEED * 0.2) {
      speedDisplay.style.color = '#ffff44'; // Yellow - medium
   } else {
      speedDisplay.style.color = '#44ff44'; // Green - slow
   }
   
   // Update controls display as well
   updateControlsSpeedDisplay(speed);
}

function updateControlsSpeedDisplay(speed) {
   // This function would update the InfoBox speed display
   // Implementation depends on your InfoBox API
   const speedText = `Speed: ${speed.toFixed(1)} km/h`;
   // You might need to modify this based on how your InfoBox works
}