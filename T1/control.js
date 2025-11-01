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

// Parâmetros de movimento ajustados à escala 
const MAX_FORWARD_SPEED = 10;   // unidades por segundo (~1 bloco em 3 s)
const MAX_REVERSE_SPEED = -4;   // velocidade máxima de ré
const ACCELERATION_RATE = 30;    // aceleração suave
const DECELERATION_RATE = 40;    // desaceleração
const BRAKE_POWER = 100;         // freio forte
const FRICTION = 0.98;          // atrito mais leve
const ROTATION_SENSITIVITY = 1.8; // rotação mais fluida

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

   if (keyboard.pressed("left") && (velocidade < -0.05 || velocidade > 0.05)){
      vehicle.rotation.y += effectiveRotationSpeed * dt;
      cameraHolder.rotation.y += effectiveRotationSpeed * dt;
   }  
   if (keyboard.pressed("right") && (velocidade < -0.05 || velocidade > 0.05)){
      vehicle.rotation.y -= effectiveRotationSpeed * dt;
      cameraHolder.rotation.y -= effectiveRotationSpeed * dt;
   } 

   vehicle.translateX(-velocidade * dt * BLOCK_SIZE);
   cameraHolder.translateX(-velocidade * dt * BLOCK_SIZE);
   
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
}