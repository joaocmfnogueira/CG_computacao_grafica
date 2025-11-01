import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
   initRenderer,
   initCamera,
   initDefaultBasicLight,
   InfoBox,
   onWindowResize
} from "../libs/util/util.js";
import { createTrack1, createTrack2 } from "./models/mapa.js"
import { createHavac } from './models/veiculo.js';
import { clearScene } from './utils.js';

// Ajuste para pista 
const BLOCK_SIZE = 30;

// Parâmetros de ajuste de camera
const CAMERA_BASE_DISTANCE = 30;
const CAMERA_BASE_HEIGHT = 15;
const CAMERA_ACCELERATION_OFFSET = 50; // Additional distance when accelerating
const CAMERA_TURN_OFFSET = 8; // Lateral offset during turns
const CAMERA_SMOOTHNESS = 10; // Higher = smoother but slower camera
const CAMERA_LOOK_AHEAD = 0.4; // How much to look ahead of the vehicle

// Parâmetros de movimento ajustados à escala 
const MAX_FORWARD_SPEED = 10;   // unidades por segundo (~1 bloco em 3 s)
const MAX_REVERSE_SPEED = -4;   // velocidade máxima de ré
const ACCELERATION_RATE = 30;    // aceleração suave
const DECELERATION_RATE = 40;    // desaceleração
const BRAKE_POWER = 100;         // freio forte
const FRICTION = 0.98;          // atrito mais leve
const ROTATION_SENSITIVITY = 1.8; // rotação mais fluida

let currentCameraDistance = CAMERA_BASE_DISTANCE;
let currentCameraHeight = CAMERA_BASE_HEIGHT;
let currentLateralOffset = 0;
let currentLookAhead = 0;
let turnProgressLeft = 0;
let turnProgressRight = 0;

export function keyboardUpdate(keyboard, velocidade, aceleracao, dt, scene, cameraHolder) {
   keyboard.update();

   /* 
   Evento em que caso a aceleração e o freio aconteca simultaneamente ou nenhum deles 
   aconteça, é para aplicar o atrito.
   */
   if(((keyboard.pressed("up") || keyboard.pressed("X")) && keyboard.pressed("down"))
   || (!(keyboard.pressed("up") || keyboard.pressed("X")) && !keyboard.pressed("down"))){
      if (velocidade > 0) aceleracao = Math.max(aceleracao - 1.5 * dt, 0);
      else if (velocidade < 0) aceleracao = Math.min(aceleracao + 1.5 * dt, 0);

      velocidade *= FRICTION;
      if (Math.abs(velocidade) < 0.05) velocidade = 0;
   }
   
   // ACELERAÇÃO 
   else if (keyboard.pressed("up") || keyboard.pressed("X")) {
      if (velocidade >= 0) {
         aceleracao = Math.min(aceleracao + ACCELERATION_RATE * dt, 80);
      } else {
         aceleracao = Math.min(aceleracao + BRAKE_POWER * dt * 2, 120);
      }
   }
   // RÉ / FREIO 
   else if (keyboard.pressed("down")) {
      if (velocidade > 0) {
         aceleracao = Math.max(aceleracao - BRAKE_POWER * dt, -10);
      } else {
         aceleracao = Math.max(aceleracao - DECELERATION_RATE * dt, -2);
      }
   }

   

   // Atualiza velocidade 
   velocidade += aceleracao * dt;

   // Limites 
   if (velocidade > MAX_FORWARD_SPEED) {
      velocidade = MAX_FORWARD_SPEED;
      aceleracao = Math.min(aceleracao, 0);
   }
   if (velocidade < MAX_REVERSE_SPEED) {
      velocidade = MAX_REVERSE_SPEED;
      aceleracao = Math.max(aceleracao, 0);
   }

   // --- Reduz aceleração gradualmente ---
   aceleracao *= 0.9 * dt;
   if (Math.abs(aceleracao) < 0.5) aceleracao = 0;


   // --- Reset / troca de pista ---
   if (keyboard.down("R")){
      resetVehicle(scene);
      velocidade = 0;
      aceleracao = 0;
   } 
   if (keyboard.down("1")){
      switchTrack(1, scene, cameraHolder);
      velocidade = 0;
      aceleracao = 0;
   } 
   if (keyboard.down("2")){
      switchTrack(2, scene, cameraHolder);
      velocidade = 0;
      aceleracao = 0;
   } 

   return { velocidade, aceleracao };
}

export function updateVehicleMovement(dt, scene, velocidade, keyboard, cameraHolder) {
   const vehicle = scene.getObjectByName("veiculo_principal");
   if (!vehicle) return;

   // Reduz resposta da direção conforme velocidade
   const speedFactor = Math.min(Math.abs(velocidade) / MAX_FORWARD_SPEED, 1);
   const effectiveRotationSpeed = ROTATION_SENSITIVITY * (1 - speedFactor * 0.6);

   if (keyboard.pressed("left") && (velocidade < -0.1 || velocidade > 0.1)){
      vehicle.rotation.y += effectiveRotationSpeed * dt;
      // cameraHolder.rotation.y += effectiveRotationSpeed * dt;
   }  
   if (keyboard.pressed("right") && (velocidade < -0.1 || velocidade > 0.1)){
      vehicle.rotation.y -= effectiveRotationSpeed * dt;
      // cameraHolder.rotation.y -= effectiveRotationSpeed * dt;
   } 

   vehicle.translateX(-velocidade * dt * BLOCK_SIZE);
   // cameraHolder.translateX(-velocidade * dt * BLOCK_SIZE);
   
}

 export function updateCamera(dt, scene, velocidade, aceleracao, keyboard, cameraHolder) {
    const vehicle = scene.getObjectByName("veiculo_principal");
    if (!vehicle) return;

    // Calculate target camera distance based on speed and acceleration
    const speedFactor = Math.abs(velocidade) / MAX_FORWARD_SPEED;
    const accelerationFactor = Math.max(0, aceleracao) / ACCELERATION_RATE;
    
    // Target distance increases with speed and acceleration
    const targetDistance = CAMERA_BASE_DISTANCE + 
                          (speedFactor * CAMERA_ACCELERATION_OFFSET) + 
                          (accelerationFactor * CAMERA_ACCELERATION_OFFSET * 0.9);

    // Target height also changes slightly with speed
    const targetHeight = CAMERA_BASE_HEIGHT + (speedFactor * 5);

    // Smoothly interpolate camera distance and height
    currentCameraDistance = THREE.MathUtils.lerp(
        currentCameraDistance, 
        targetDistance, 
        CAMERA_SMOOTHNESS * dt
    );
    currentCameraHeight = THREE.MathUtils.lerp(
        currentCameraHeight, 
        targetHeight, 
        CAMERA_SMOOTHNESS * dt
    );

    // Calculate turn-based lateral offset
    let targetLateralOffset = 0;
    let targetLookAhead = 0;
    
    // Track how long keys have been pressed
    if (Math.abs(velocidade) > 1) {
        if (keyboard.pressed("left")) {
            // Gradually increase the offset based on how long left is pressed
            turnProgressLeft = Math.min(turnProgressLeft + dt * 2, 1); // Ramp up to full effect
            turnProgressRight = Math.max(turnProgressRight - dt * 3, 0); // Quickly release right
            
            targetLateralOffset = CAMERA_TURN_OFFSET * turnProgressLeft;
            targetLookAhead = -CAMERA_LOOK_AHEAD * turnProgressLeft;
            
        } else if (keyboard.pressed("right")) {
            // Gradually increase the offset based on how long right is pressed
            turnProgressRight = Math.min(turnProgressRight + dt * 2, 1); // Ramp up to full effect
            turnProgressLeft = Math.max(turnProgressLeft - dt * 3, 0); // Quickly release left
            
            targetLateralOffset = -CAMERA_TURN_OFFSET * turnProgressRight;
            targetLookAhead = CAMERA_LOOK_AHEAD * turnProgressRight;
            
        } else {
            // Gradually return to center when no keys are pressed
            turnProgressLeft = Math.max(turnProgressLeft - dt * 2, 0);
            turnProgressRight = Math.max(turnProgressRight - dt * 2, 0);
            
            // Apply some residual offset based on remaining progress
            targetLateralOffset = (CAMERA_TURN_OFFSET * turnProgressLeft) + 
                                 (-CAMERA_TURN_OFFSET * turnProgressRight);
            targetLookAhead = (-CAMERA_LOOK_AHEAD * turnProgressLeft) + 
                             (CAMERA_LOOK_AHEAD * turnProgressRight);
        }
    } else {
        // Reset turn progress when not moving
        turnProgressLeft = 0;
        turnProgressRight = 0;
    }

    // Smoothly interpolate lateral offset and look ahead
    currentLateralOffset = THREE.MathUtils.lerp(
        currentLateralOffset, 
        targetLateralOffset, 
        CAMERA_SMOOTHNESS * dt * 0.8
    );
    currentLookAhead = THREE.MathUtils.lerp(
        currentLookAhead, 
        targetLookAhead, 
        CAMERA_SMOOTHNESS * dt * 0.8
    );

    // Update camera position relative to vehicle
    const camera = cameraHolder.children[0];
    if (camera) {
        // Calculate camera position behind and above the vehicle
        const behindOffset = new THREE.Vector3(currentCameraDistance, 0, 0);
        behindOffset.applyQuaternion(vehicle.quaternion);
        
        const lateralOffset = new THREE.Vector3(0, 0, currentLateralOffset);
        lateralOffset.applyQuaternion(vehicle.quaternion);
        
        // Calculate look ahead position
        const lookAheadOffset = new THREE.Vector3(-currentLookAhead * currentCameraDistance, 0, 0);
        lookAheadOffset.applyQuaternion(vehicle.quaternion);

        // Set camera position
        camera.position.copy(vehicle.position)
            .add(behindOffset)
            .add(lateralOffset)
            .add(new THREE.Vector3(0, currentCameraHeight, 0));

        // Make camera look at a point ahead of the vehicle
        const lookAtPoint = vehicle.position.clone()
            .add(lookAheadOffset)
            .add(new THREE.Vector3(0, currentCameraHeight * 0.3, 0));
        
        camera.lookAt(lookAtPoint);
    }
 }

function switchTrack(trackNumber, scene, cameraHolder) {
   clearScene(scene);

   if (trackNumber === 1) createTrack1(scene);
   else if (trackNumber === 2) createTrack2(scene);

   initDefaultBasicLight(scene);
   createHavac(scene);
   resetVehicle(scene);
   scene.add(cameraHolder);
}

function resetVehicle(scene) {
   const vehicle = scene.getObjectByName("veiculo_principal");
   if (vehicle) {
      vehicle.position.set(0, 1, 0);
      vehicle.rotation.set(0, 0, 0);
   }

   // Reset camera parameters
    currentCameraDistance = CAMERA_BASE_DISTANCE;
    currentCameraHeight = CAMERA_BASE_HEIGHT;
    currentLateralOffset = 0;
    currentLookAhead = 0;
    turnProgressLeft = 0;
    turnProgressRight = 0;
}