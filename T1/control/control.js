import * as THREE from 'three';
import {
   initDefaultBasicLight,
   InfoBox,
   onWindowResize
} from "../../libs/util/util.js";
import { createTrack1, createTrack2, createTrack3 } from "../models/map.js"
import { createHavac, createHavacEnemy } from '../models/vehicle.js';
import { clearScene } from '../utils.js';
import { initLight} from '../utils.js';
import {OBB} from "../models/OBB.js";
import { createOBBHelper } from '../utils.js';

// import { collisionSystem } from './models/map.js';

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
const MAX_REVERSE_SPEED = -0.5;   
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

let lastShotTime = 0;
const shotCooldown = 300; // tempo em milissegundos (ex: 300ms)

export function keyboardUpdate(keyboard, vehicle, dt, scene, cameraHolder, bulletsInGame) {
   keyboard.update();
   const now = performance.now();

   let velocity = vehicle.userData.velocity;
   let aceleration = vehicle.userData.aceleration;
   let laps_count = vehicle.userData.laps_count;
   let checkpoints_count = vehicle.userData.checkpoints_count;
   let trackNumber = vehicle.userData.trackNumber;
   let nBullets = vehicle.userData.nBullets;


   if(nBullets > 0 && ((keyboard.pressed("Z")) || (keyboard.pressed("space"))) && (now - lastShotTime) >= shotCooldown){
         lastShotTime = now;
         let matBullet = new THREE.MeshPhongMaterial(({ 
               color: "rgba(255, 0, 0, 1)",
               flatShading: false,
               shininess: "100",
               specular: "rgb(255,255,255)" }));
         let bulletGeo = new THREE.SphereGeometry(1, 20, 20);
         let bullet = new THREE.Mesh(bulletGeo, matBullet);
         bullet.position.set(-3, 0, 0);

         bullet.userData.boundingBox = new THREE.Box3().setFromObject(bullet);
         const obb = new OBB().fromBox3(bullet.userData.boundingBox);
         bullet.userData.obb = obb;

         vehicle.add(bullet);
         scene.attach(bullet);

         const obbHelper = createOBBHelper(bullet.userData.obb, "rgb(255, 255, 255)");
         
             // impedir do helper desaparecer depois de um tempo
             obbHelper.frustumCulled = false;
         
             obbHelper.name = "obbHelper";
             obbHelper.visible = false;
             scene.add(obbHelper);
         
             // Constantes temporarias 
             const tempMat4 = new THREE.Matrix4();
             const tempMat3 = new THREE.Matrix3();
         
             bullet.userData.updateOBB = function() {
                 bullet.updateMatrixWorld(true);
         
                 const mw = bullet.matrixWorld;
         
                 // Atualiza o centro
                 bullet.userData.obb.center.setFromMatrixPosition(mw);
         
                 // Obtem a rotação
                 tempMat4.extractRotation(mw);           
                 tempMat3.setFromMatrix4(tempMat4); 
         
                 bullet.userData.obb.rotation.copy(tempMat3);
         
                 // Atualiza o helper
               //   updateOBBHelper(bullet.userData.obb, obbHelper);
             };
         // console.log("ue");
         bulletsInGame.push(bullet);
         nBullets--;
   }

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
      checkpoints_count = 0;
      nBullets = 4;
      bulletsInGame = [];

      // trackNumber = 0;
   } 
   if (keyboard.down("1")){
      switchTrack(1, scene, cameraHolder);
      velocity = 0;
      aceleration = 0;
      laps_count = 0;
      checkpoints_count = 0;
      trackNumber = "Primeiro";
      nBullets = 4;
      bulletsInGame = [];
   } 
   if (keyboard.down("2")){
      switchTrack(2, scene, cameraHolder);
      velocity = 0;
      aceleration = 0;
      laps_count = 0;
      checkpoints_count = 0;
      trackNumber = "Segundo";
      nBullets = 4;
      bulletsInGame = [];
   } 
   if (keyboard.down("3")){
      switchTrack(3, scene, cameraHolder);
      velocity = 0;
      aceleration = 0;
      laps_count = 0;
      checkpoints_count = 0;
      trackNumber = "Terceiro";
      nBullets = 4;
      bulletsInGame = [];
   } 

   vehicle.userData.velocity = velocity;
   vehicle.userData.aceleration = aceleration;
   vehicle.userData.laps_count = laps_count;
   vehicle.userData.checkpoints_count = checkpoints_count;
   vehicle.userData.trackNumber = trackNumber;
   vehicle.userData.nBullets = nBullets;

   return {bulletsInGame};
}

export function updateVehicleMovement(dt, vehicle, keyboard) {
   // const vehicle = scene.getObjectByName("veiculo_principal");
   if (!vehicle) return;

   let velocity = vehicle.userData.velocity;

   // Reduz resposta da direção conforme velocidade
   const speedFactor = Math.min(Math.abs(velocity) / MAX_FORWARD_SPEED, 1);
   const effectiveRotationSpeed = ROTATION_SENSITIVITY * (1 - speedFactor * 1.5);

   if (keyboard.pressed("left") && (velocity > 0.1)){
      vehicle.rotateY(effectiveRotationSpeed * dt);
   }  
   if (keyboard.pressed("right") && (velocity > 0.1)){
      vehicle.rotateY(-effectiveRotationSpeed * dt);
   } 
   if (keyboard.pressed("left") && (velocity < -0.1)){
      vehicle.rotateY(-effectiveRotationSpeed * dt);
   }  
   if (keyboard.pressed("right") && (velocity < -0.1)){
      vehicle.rotateY(effectiveRotationSpeed * dt);
   } 

   vehicle.translateX(-velocity * dt * BLOCK_SIZE);
   vehicle.userData.boundingBox.setFromObject(vehicle);
   vehicle.userData.updateOBB();
   // console.log(vehicle.castShadow);
}

export function updateLightMovement(scene, vehicle, light) {
   
   // Pega posições atuais (para extrair a direção original)
   const oldLightPos = new THREE.Vector3().copy(light.position);
   const oldTargetPos = new THREE.Vector3();
   light.target.getWorldPosition(oldTargetPos);

   // Direção original da luz (do light -> target)
   const baseDir = new THREE.Vector3().subVectors(oldTargetPos, oldLightPos).normalize();

   // Calcula o ponto À FRENTE do carro no mundo (sem rotacionar a luz)
   const localFront = new THREE.Vector3(-75, 0, 0); // ajuste 50 conforme quiser (distância à frente)
   const worldFront = localFront.clone().applyMatrix4(vehicle.matrixWorld);

   // Define o novo target na frente do carro
   light.target.position.copy(worldFront);
   light.target.updateMatrixWorld();

   // Escolhe quão longe posicionar a luz atrás do novo target
   const desiredDistance = 140; // quanto mais alto, maior o alcance aparente (ajuste)
   const newLightPos = worldFront.clone().sub(baseDir.clone().multiplyScalar(desiredDistance));

   // Aplica nova posição da luz (mantendo a mesma direção base)
   light.position.copy(newLightPos);
   light.updateMatrixWorld();

   // const dirHelper = new THREE.DirectionalLightHelper(light, 10); // 10 = tamanho da seta
   // scene.add(dirHelper);

   // const shadowHelper = new THREE.CameraHelper(light.shadow.camera);
   // scene.add(shadowHelper);

   // console.log(light.position);
}

export function updateCamera(dt, scene, velocity, aceleration, keyboard, cameraHolder, isColided) {
    const vehicle = scene.getObjectByName("veiculo_principal");
    if (!vehicle) return;

    // --- JITTER FIX START: Initialize Smoothing State ---
    // We store a "smoothed" position/rotation inside the cameraHolder's userData
    // This acts as a buffer between the jittery physics car and the camera.
    if (!cameraHolder.userData.smoothPosition) {
        cameraHolder.userData.smoothPosition = vehicle.position.clone();
        cameraHolder.userData.smoothQuaternion = vehicle.quaternion.clone();
    }

    // 1. Determine how tightly we follow the car
    // If colliding, we lower the speed (2.0) to ignore vibrations.
    // If normal, we follow quickly (10.0) to feel responsive.
    const smoothingSpeed = isColided ? 2.0 : 10.0; 
    
    // 2. Update the "Ghost" position/rotation
    // We LERP (Linear Interpolate) towards the real car, filtering out high-frequency noise.
    cameraHolder.userData.smoothPosition.lerp(vehicle.position, smoothingSpeed * dt);
    cameraHolder.userData.smoothQuaternion.slerp(vehicle.quaternion, smoothingSpeed * dt);

    // 3. Define the source for calculations
    // INSTEAD of using 'vehicle', we use our smooth ghost values.
    const sourcePos = cameraHolder.userData.smoothPosition;
    const sourceQuat = cameraHolder.userData.smoothQuaternion;
    // --- JITTER FIX END ---


    // Calculate target distance based on acceleration
    const speedFactor = Math.abs(velocity) / MAX_FORWARD_SPEED;
    const accelerationFactor = Math.max(0, aceleration) / ACCELERATION_RATE;
    
    const targetDistance = CAMERA_BASE_DISTANCE + 
                          (speedFactor * CAMERA_ACCELERATION_OFFSET) + 
                          (accelerationFactor * CAMERA_ACCELERATION_OFFSET * 0.9);

    const targetHeight = CAMERA_BASE_HEIGHT + (speedFactor * 5);

    // Smooth interpolation for distance/height
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

    // Lateral inclination logic
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
        turnProgressLeft = 0;
        turnProgressRight = 0;
    }

    currentLateralOffset = THREE.MathUtils.lerp(currentLateralOffset, targetLateralOffset, CAMERA_SMOOTHNESS * dt * 0.8);
    currentLookAhead = THREE.MathUtils.lerp(currentLookAhead, targetLookAhead, CAMERA_SMOOTHNESS * dt * 0.8);

    // Update Camera Position
    const camera = cameraHolder.children[0];
    if (camera) {
        // NOTE: We now use 'sourceQuat' and 'sourcePos' instead of vehicle.quaternion/position
        
        const behindOffset = new THREE.Vector3(currentCameraDistance, 0, 0);
        behindOffset.applyQuaternion(sourceQuat);
        
        const lateralOffset = new THREE.Vector3(0, 0, currentLateralOffset);
        lateralOffset.applyQuaternion(sourceQuat);
        
        const lookAheadOffset = new THREE.Vector3(-currentLookAhead * currentCameraDistance, 0, 0);
        lookAheadOffset.applyQuaternion(sourceQuat);

        // Set camera position
        camera.position.copy(sourcePos)
            .add(behindOffset)
            .add(lateralOffset)
            .add(new THREE.Vector3(0, currentCameraHeight, 0));

        // Look At Point (also smoothed)
        const lookAtPoint = sourcePos.clone()
            .add(lookAheadOffset)
            .add(new THREE.Vector3(0, currentCameraHeight * 0.3, 0));
        
        camera.lookAt(lookAtPoint);
    }
}

function switchTrack(trackNumber, scene, cameraHolder) {
   clearScene(scene, { ignore: [cameraHolder] });
   let trackNumberString;
   if (trackNumber === 1){
      createTrack1(scene);
      trackNumberString = "Primeiro";
   } 
   else if (trackNumber === 2){
      createTrack2(scene);
      trackNumberString = "Segundo";

   } 
   else if (trackNumber === 3){
      createTrack3(scene);
      trackNumberString = "Terceiro";

   } 

   initLight(scene);
   createHavac(scene, trackNumberString);
   
   createHavacEnemy(scene, "rgba(126, 235, 126, 1)", "rgba(12, 15, 188, 1)", "rgba(235, 151, 126, 1)", 0, trackNumberString);
   createHavacEnemy(scene, "rgba(204, 153, 13, 1)", "rgba(255, 0, 0, 1)", "rgba(75, 12, 12, 1)", 1, trackNumberString);
   createHavacEnemy(scene, "rgba(0, 238, 16, 1)", "rgba(0, 118, 14, 1)", "rgba(112, 0, 87, 1)", 2, trackNumberString);
   
   resetVehicle(scene);

   // cameraHolder was preserved, so just re-add it
   scene.add(cameraHolder);
}

export function resetVehicle(scene) {
   const vehicle = scene.getObjectByName("veiculo_principal");
   if (vehicle) {
      // vehicle.position.set(0, 0.25, 0);
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


