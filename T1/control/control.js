import * as THREE from 'three';
import {
   initDefaultBasicLight,
   InfoBox,
   onWindowResize
} from "../../libs/util/util.js";
import { createTrack1, createTrack2 } from "../models/map.js"
import { createHavac } from '../models/vehicle.js';
import { clearScene } from '../utils.js';

// Ajuste para pista 
const BLOCK_SIZE = 30;

// Parâmetros de ajuste de camera
const CAMERA_BASE_DISTANCE = 20;
const CAMERA_BASE_HEIGHT = 10;
const CAMERA_ACCELERATION_OFFSET = 30; 
const CAMERA_TURN_OFFSET = 15; 
const CAMERA_SMOOTHNESS = 10; 
const CAMERA_LOOK_AHEAD = 0.4;

// Parâmetros de movimento ajustados à escala 
const MAX_FORWARD_SPEED = 10;  
const MAX_REVERSE_SPEED = -4;   
const ACCELERATION_RATE = 30;    
const DECELERATION_RATE = 40;  
const BRAKE_POWER = 100;       
const FRICTION = 0.98;       
const ROTATION_SENSITIVITY = 1.8; 

let currentCameraDistance = CAMERA_BASE_DISTANCE;
let currentCameraHeight = CAMERA_BASE_HEIGHT;
let currentLateralOffset = 0;
let currentLookAhead = 0;
let turnProgressLeft = 0;
let turnProgressRight = 0;

export function keyboardUpdate(keyboard, velocity, aceleration, dt, scene, cameraHolder, laps_count) {
   keyboard.update();

   /* 
   Evento em que caso a aceleração e o freio aconteca simultaneamente ou nenhum deles 
   aconteça, é para aplicar o atrito.
   */
   if(((keyboard.pressed("up") || keyboard.pressed("X")) && keyboard.pressed("down"))
   || (!(keyboard.pressed("up") || keyboard.pressed("X")) && !keyboard.pressed("down"))){
      if (velocity > 0) aceleration = Math.max(aceleration - 1.5 * dt, 0);
      else if (velocity < 0) aceleration = Math.min(aceleration + 1.5 * dt, 0);

      velocity *= FRICTION;
      if (Math.abs(velocity) < 0.05) velocity = 0;
   }
   
   // Aceleração
   else if (keyboard.pressed("up") || keyboard.pressed("X")) {
      if (velocity >= 0) {
         aceleration = Math.min(aceleration + ACCELERATION_RATE * dt, 80);
      } else {
         aceleration = Math.min(aceleration + BRAKE_POWER * dt * 2, 120);
      }
   }
   // Ré/freio
   else if (keyboard.pressed("down")) {
      if (velocity > 0) {
         aceleration = Math.max(aceleration - BRAKE_POWER * dt, -10);
      } else {
         aceleration = Math.max(aceleration - DECELERATION_RATE * dt, -2);
      }
   }

   

   // Atualiza velocidade
   velocity += aceleration * dt;

   // Limites 
   if (velocity > MAX_FORWARD_SPEED) {
      velocity = MAX_FORWARD_SPEED;
      aceleration = Math.min(aceleration, 0);
   }
   if (velocity < MAX_REVERSE_SPEED) {
      velocity = MAX_REVERSE_SPEED;
      aceleration = Math.max(aceleration, 0);
   }

   // Reduz aceleração gradualmente 
   aceleration *= 0.9 * dt;
   if (Math.abs(aceleration) < 0.5) aceleration = 0;


   // Reset/troca de pista 
   if (keyboard.down("R")){
      resetVehicle(scene);
      velocity = 0;
      aceleration = 0;
      laps_count = 0;
   } 
   if (keyboard.down("1")){
      switchTrack(1, scene, cameraHolder);
      velocity = 0;
      aceleration = 0;
      laps_count = 0;
   } 
   if (keyboard.down("2")){
      switchTrack(2, scene, cameraHolder);
      velocity = 0;
      aceleration = 0;
      laps_count = 0;
   } 

   return { velocity, aceleration, laps_count };
}

export function updateVehicleMovement(dt, scene, velocity, keyboard, cameraHolder) {
   const vehicle = scene.getObjectByName("veiculo_principal");
   if (!vehicle) return;

   // Reduz resposta da direção conforme velocidade
   const speedFactor = Math.min(Math.abs(velocity) / MAX_FORWARD_SPEED, 1);
   const effectiveRotationSpeed = ROTATION_SENSITIVITY * (1 - speedFactor * 1.5);

   if (keyboard.pressed("left") && (velocity > 0.1)){
      vehicle.rotation.y += effectiveRotationSpeed * dt;
   }  
   if (keyboard.pressed("right") && (velocity > 0.1)){
      vehicle.rotation.y -= effectiveRotationSpeed * dt;
   } 
   if (keyboard.pressed("left") && (velocity < -0.1)){
      vehicle.rotation.y -= effectiveRotationSpeed * dt;
   }  
   if (keyboard.pressed("right") && (velocity < -0.1)){
      vehicle.rotation.y += effectiveRotationSpeed * dt;
   } 

   vehicle.translateX(-velocity * dt * BLOCK_SIZE);
   
}

export function updateCamera(dt, scene, velocity, aceleration, keyboard, cameraHolder) {
    const vehicle = scene.getObjectByName("veiculo_principal");
    if (!vehicle) return;

    // Calcula a distancia da camera com o veiculo com base na aceleração
    const speedFactor = Math.abs(velocity) / MAX_FORWARD_SPEED;
    const accelerationFactor = Math.max(0, aceleration) / ACCELERATION_RATE;
    
    const targetDistance = CAMERA_BASE_DISTANCE + 
                          (speedFactor * CAMERA_ACCELERATION_OFFSET) + 
                          (accelerationFactor * CAMERA_ACCELERATION_OFFSET * 0.9);

   // Altera levemente a altura da camera em relação a aceleração
    const targetHeight = CAMERA_BASE_HEIGHT + (speedFactor * 5);

    // Interpolação suave usando o lerp para a distancia e altura
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

    // Criando a logica de incrinação da camera em relação ao veiculo com base no tempo as setas laterais estão pressionadas
    let targetLateralOffset = 0;
    let targetLookAhead = 0;
    
    if (Math.abs(velocity) > 0.1) {
        if (keyboard.pressed("left")) {
            turnProgressLeft = Math.min(turnProgressLeft + dt * 2, 1);
            turnProgressRight = Math.max(turnProgressRight - dt * 3, 0);
            
            targetLateralOffset = CAMERA_TURN_OFFSET * turnProgressLeft;
            targetLookAhead = -CAMERA_LOOK_AHEAD * turnProgressLeft;
            
        } else if (keyboard.pressed("right")) {
            turnProgressRight = Math.min(turnProgressRight + dt * 2, 1); 
            turnProgressLeft = Math.max(turnProgressLeft - dt * 3, 0); 
            
            targetLateralOffset = -CAMERA_TURN_OFFSET * turnProgressRight;
            targetLookAhead = CAMERA_LOOK_AHEAD * turnProgressRight;
            
        } else {
            turnProgressLeft = Math.max(turnProgressLeft - dt * 2, 0);
            turnProgressRight = Math.max(turnProgressRight - dt * 2, 0);
            
            targetLateralOffset = (CAMERA_TURN_OFFSET * turnProgressLeft) + (-CAMERA_TURN_OFFSET * turnProgressRight);
            targetLookAhead = (-CAMERA_LOOK_AHEAD * turnProgressLeft) + (CAMERA_LOOK_AHEAD * turnProgressRight);
        }
    } else {
        // Reset turn progress when not moving
        turnProgressLeft = 0;
        turnProgressRight = 0;
    }

    // Interpolação suave nas laterais usando o lerp
    currentLateralOffset = THREE.MathUtils.lerp(currentLateralOffset, targetLateralOffset, CAMERA_SMOOTHNESS * dt * 0.8);
    currentLookAhead = THREE.MathUtils.lerp(currentLookAhead, targetLookAhead, CAMERA_SMOOTHNESS * dt * 0.8);

    // Atualização da camera em relação ao veículo
    const camera = cameraHolder.children[0];
    if (camera) {
        const behindOffset = new THREE.Vector3(currentCameraDistance, 0, 0);
        behindOffset.applyQuaternion(vehicle.quaternion);
        
        const lateralOffset = new THREE.Vector3(0, 0, currentLateralOffset);
        lateralOffset.applyQuaternion(vehicle.quaternion);
        
        const lookAheadOffset = new THREE.Vector3(-currentLookAhead * currentCameraDistance, 0, 0);
        lookAheadOffset.applyQuaternion(vehicle.quaternion);

        // Colocando a posição da camera
        camera.position.copy(vehicle.position)
            .add(behindOffset)
            .add(lateralOffset)
            .add(new THREE.Vector3(0, currentCameraHeight, 0));

        // Apontando a camera para uma posição a frente do veiculo
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

export function resetVehicle(scene) {
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