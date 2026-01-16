import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { createTrack2, createTrack1, createTrack0} from "./models/map.js"
import { createHavac, createHavacEnemy } from './models/vehicle.js';
import {applyLateralSlide, createSpeedDisplay, updateSpeedDisplay, createLapsCount, updateLapDisplay, showFinishScreen, initLight, initRenderer, createCheckPointCount, updateCheckPointDisplay, createBulletCount, updateBulletDisplay, removeAndDispose} from './utils.js';
import {keyboardUpdate, updateVehicleMovement, updateCamera, updateLightMovement} from './control/control.js';
import { collisionSystem } from './models/map.js';
import { OBB } from './models/OBB.js'

let scene, renderer, camera, light;
const container = document.getElementById( 'container' );
const stats = new Stats();
container.appendChild( stats.dom );
scene = new THREE.Scene();
renderer = initRenderer();
const BLOCK_SIZE = 30;

// Camera Setup
let position_camera = new THREE.Vector3(50, 25, 0);
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.copy(position_camera);
camera.lookAt(new THREE.Vector3(1, 0, 0)); 
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

light = initLight(scene);
let keyboard = new KeyboardState();

createTrack1(scene);

// Game Variables
let bulletsInGame = []; // Stores all bullets (Player + Bots)

let trackPoints = {
  "Primeiro" : [[-180, 0, -30], [-150, 0, -270], [90, 0, -240], [60, 0, 0]],
  "Segundo" : [[-180, 0, -30], [-150, 0, -270], [-30, 0, -240], [90, 0, -90]],
  "Terceiro" : [[-90, 0, -30], [-120, 0, -270], [-180, 0, -150], [30, 0, -120]]
}

let isPaused = false;
let clock = new THREE.Clock();

// Create Player
createHavac(scene);

// Create Enemies
createHavacEnemy(scene, "rgba(126, 235, 126, 1)", "rgba(12, 15, 188, 1)", "rgba(235, 151, 126, 1)", 0);
createHavacEnemy(scene, "rgba(204, 153, 13, 1)", "rgba(255, 0, 0, 1)", "rgba(75, 12, 12, 1)", 1);
createHavacEnemy(scene, "rgba(0, 238, 16, 1)", "rgba(0, 118, 14, 1)", "rgba(112, 0, 87, 1)", 2);

const speedDisplay = createSpeedDisplay();
const lapsDisplay = createLapsCount();
const checkPointDisplay = createCheckPointCount();
const bulletDisplay = createBulletCount();

const botRaycaster = new THREE.Raycaster();

render();

function render() {
   stats.update();
   scene.updateMatrixWorld(true);
   requestAnimationFrame(render);

   if (isPaused) return;

   const dt = clock.getDelta();

   const SUBSTEPS = 5; 
   const subDt = dt / SUBSTEPS;

   // --- 1. GATHER ALL VEHICLES ---
   const playerCar = scene.getObjectByName("veiculo_principal");
   const bots = [scene.getObjectByName("enemy0"), scene.getObjectByName("enemy1"), scene.getObjectByName("enemy2")].filter(b => b !== undefined);
   const allVehicles = [];
   if (playerCar) allVehicles.push(playerCar);
   bots.forEach(b => allVehicles.push(b));

   for (let index = 0; index < 5; index++) {
            // --- 2. STUN LOGIC ---
    allVehicles.forEach(v => updateStunTimers(subDt, v, (v === playerCar)));

    // --- 3. VEHICLE-TO-VEHICLE COLLISION ---
    // This prevents cars from driving inside each other
    checkVehicleToVehicleCollision(allVehicles);

    // --- 4. BULLET LOGIC ---
    for (let i = bulletsInGame.length - 1; i >= 0; i--) {
            const bullet = bulletsInGame[i];
            bullet.translateX(-150 * subDt); 
            
            // Correct OBB Update
            if (!bullet.userData.obb) bullet.userData.obb = new OBB();
            bullet.userData.obb.fromBox3(bullet.geometry.boundingBox);
            bullet.userData.obb.applyMatrix4(bullet.matrixWorld);

            let bulletRemoved = false;

            // A. Wall Collision
            if (collisionSystem.checkbulletcolision(bullet.userData.obb)) {
                removeAndDispose(bullet);
                scene.remove(bullet);
                bulletsInGame.splice(i, 1);
                bulletRemoved = true;
            }

            // B. Vehicle Collision
            if (!bulletRemoved) {
                for (const vehicle of allVehicles) {
                    // Skip if this vehicle fired the bullet
                    if (bullet.userData.shooter === vehicle) continue;
                    
                    // Ensure vehicle OBB is up to date
                    if (!vehicle.userData.obb) vehicle.userData.obb = new OBB();
                    // We update vehicle OBBs in their own movement loops, but safety check:
                    // vehicle.userData.obb.fromBox3(vehicle.geometry.boundingBox).applyMatrix4(vehicle.matrixWorld);

                    if (vehicle.userData.obb && bullet.userData.obb.intersectsOBB(vehicle.userData.obb)) {
                        // HIT!
                        applyBulletHit(vehicle, (vehicle === playerCar));
                        
                        removeAndDispose(bullet);
                        scene.remove(bullet);
                        bulletsInGame.splice(i, 1);
                        bulletRemoved = true;
                        break; 
                    }
                }
            }
    }
    // --- 5. BOT LOGIC (Physics + Shooting) ---
    
        bots.forEach(botMesh => {
                if (!botMesh) return;

                // Shoot at Player or other Bots
                updateBotShooting(botMesh, allVehicles, scene);

                // Move
                const botFollower = botMesh.userData.follower;
                botFollower.update(subDt);
                botMesh.updateMatrixWorld();

                // Update OBB correctly
                if (!botMesh.userData.obb) botMesh.userData.obb = new OBB();
                botMesh.userData.obb.fromBox3(botMesh.geometry.boundingBox);
                botMesh.userData.obb.applyMatrix4(botMesh.matrixWorld);

                botMesh.userData.velocity = botFollower.currentSpeed;
                // Wall Collision
                const [isColided, angle, normal, wall] = checkCarCollision(botMesh, botMesh.userData.obb);
                if (isColided) {
                    applyBotCollisionResponse(botMesh, angle, normal, subDt);
                    botFollower.currentSpeed = botMesh.userData.velocity;
                    // console.log("COLIDIU");
                    // if (Math.abs(botFollower.currentSpeed) < 5) botFollower.currentSpeed = 5; 
                }
            });
        

    // --- 6. PLAYER PHYSICS ---
        
    
        updateVehicleMovement(subDt, playerCar, keyboard);
        updateLightMovement(scene, playerCar, scene.getObjectByName("light"));
        
        if (playerCar) {
            // Update OBB
            if (!playerCar.userData.obb) playerCar.userData.obb = new OBB();
            playerCar.userData.obb.fromBox3(playerCar.geometry.boundingBox);
            playerCar.userData.obb.applyMatrix4(playerCar.matrixWorld);

            const [isColided, angle, normal, wall] = checkCarCollision(playerCar);
            if (isColided) 
                applyCollisionResponse(playerCar, angle, normal, subDt);
        }
   }

   if(playerCar.userData.trackNumber == "Terceiro"){
            const jumpPort = scene.getObjectByName("jumpPort");
            if(playerCar.userData.obb.intersectsOBB(jumpPort.userData.obb)){
                // TODO:Criar função da logica do jump port aqui
                jumpPort_moviment(playerCar);
                console.log("Colidiu aqui");
                playerCar.userData.isInAir = true;
            }
            if(playerCar.userData.movimentY > 0 && playerCar.userData.isInAir){
                playerCar.translateY(0.1);
                playerCar.userData.movimentY -= 0.1;
                // console.log(playerCar.userData.movimentY);
            }
            else if(playerCar.userData.movimentY <= 0 && playerCar.userData.isInAir && playerCar.position.y > 0){
                console.log("ue");
                playerCar.translateY(-0.1);
                playerCar.userData.movimentY = 0;
            }
            else if(playerCar.userData.isInAir && playerCar.position.y < 0){
                console.log(playerCar.position.y);
                playerCar.userData.isInAir = false;
                playerCar.position.y = 0.25;
            }
        }
   
   if (playerCar) {
      checkLapCompletion(playerCar);
      checkCheckPointCompletion(playerCar);
   }

   bots.forEach(botMesh => {
        if (!botMesh) return;
        
        checkLapCompletion(botMesh);
        checkCheckPointCompletion(botMesh);
    });

   // --- 7. HUD & INPUT ---
   const result = keyboardUpdate(keyboard, playerCar, dt, scene, cameraHolder, bulletsInGame);

   bulletsInGame = result.bulletsInGame;

   // If Player Fired, we need to mark their bullet's shooter to avoid self-collision
   // This loop finds new bullets that don't have a shooter assigned yet
   bulletsInGame.forEach(b => {
       if (!b.userData.shooter && playerCar) {
           b.userData.shooter = playerCar;
           // If the player control.js spawns bullet at -6, it might still hit. 
           // Ideally update control.js offset too.
       }
   });
   playerCar.updateMatrixWorld(true);

   updateCamera(dt, scene, playerCar.userData.velocity, playerCar.userData.aceleration, keyboard, cameraHolder, false);
   updateSpeedDisplay(playerCar.userData.velocity, speedDisplay);

   updateLapDisplay(playerCar.userData.laps_count, lapsDisplay);
   updateCheckPointDisplay(playerCar.userData.checkpoints_count, checkPointDisplay);
   updateBulletDisplay(playerCar.userData.nBullets, bulletDisplay);

   if(playerCar.userData.laps_count == 4) showFinishScreen();
   bots.forEach(botMesh => {
        if (botMesh.userData.laps_count == 4)
            showFinishScreen("YOU LOSE THE RACE?????");
    });

//    const axes = new THREE.AxesHelper(20);
//    playerCar.add(axes);
   renderer.render(scene, camera);
}

function checkVehicleToVehicleCollision(vehicles) {
    for (let i = 0; i < vehicles.length; i++) {
        for (let j = i + 1; j < vehicles.length; j++) {
            const v1 = vehicles[i];
            const v2 = vehicles[j];
            
            if (!v1.userData.obb || !v2.userData.obb) continue;

            if (v1.userData.obb.intersectsOBB(v2.userData.obb)) {
                // Simple Repulsion: Push them away from each other
                const p1 = v1.position;
                const p2 = v2.position;
                
                const dir = new THREE.Vector3().subVectors(p1, p2).normalize();
                
                // Nudge both cars apart
                const pushForce = 0.2; // Adjustment amount
                v1.position.addScaledVector(dir, pushForce);
                v2.position.addScaledVector(dir, -pushForce);
                
                // Update OBBs immediately so they don't stick
                v1.userData.obb.applyMatrix4(v1.matrixWorld);
                v2.userData.obb.applyMatrix4(v2.matrixWorld);
            }
        }
    }
}

function jumpPort_moviment(vehicle){
    vehicle.userData.movimentY = vehicle.userData.velocity;
    // vehicle.translateY(vehicle.userData.velocity);

}

function applyCollisionResponse(car, angle, normal, dt) {
    let velocity = car.userData.velocity;
    let aceleration = car.userData.aceleration;

    const BLOCK_SIZE = 30;

    const carForward = new THREE.Vector3(-1, 0, 0).applyQuaternion(car.quaternion).normalize();
    const velocityVec = carForward.clone().multiplyScalar(velocity);
    const wallNormal = normal.clone().normalize();

    const projection = velocityVec.dot(wallNormal);

    if (projection < 0) {
        const pushFactor = Math.abs(projection * dt * BLOCK_SIZE) + 0.05;
        car.position.addScaledVector(wallNormal, pushFactor);
        car.userData.updateOBB(); 
    }
    else{
        car.position.addScaledVector(wallNormal, 0.01);
    }

    const dot = velocityVec.dot(wallNormal);
    const slideVec = velocityVec.clone().sub(wallNormal.clone().multiplyScalar(dot));
    
    const wallFriction = 0.98; 
    slideVec.multiplyScalar(wallFriction);
    // console.log(angle);
    if (angle < 30) {
        velocity = -velocity * 0.8; 
        aceleration = 0;
    } else {
        const isReversing = velocityVec.dot(carForward) < 0;
        velocity = slideVec.length();
        if (isReversing) velocity = -velocity; 
        aceleration *= 0.5;

        if (Math.abs(velocity) > 0.05) {
            let targetDir = slideVec.clone().normalize();
            if (targetDir.dot(carForward) < 0) targetDir.negate();

            const xAxis = targetDir.clone().negate(); 
            const yAxis = new THREE.Vector3(0, 1, 0); 
            const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
            xAxis.crossVectors(yAxis, zAxis).normalize();

            const targetRotationMat = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
            const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetRotationMat);
            car.quaternion.slerp(targetQuat, 0.15);
        }
    }

    if (Math.abs(velocity) < 0.1) velocity = 0;
    car.userData.velocity = velocity;
    car.userData.aceleration = aceleration;
    // return [velocity, aceleration];
}

 function applyBotCollisionResponse(base, angle, normal, dt) {
    const follower = base.userData.follower;
    if (!follower) return;

    const BLOCK_SIZE = 30;

    const forward = new THREE.Vector3(-1, 0, 0)
        .applyQuaternion(base.quaternion)
        .normalize();

    const velocityVec = forward.clone()
        .multiplyScalar(follower.currentSpeed);

    const wallNormal = normal.clone().normalize();

    /* ======================
       PUSH OUT DA PAREDE
    ====================== */
    const projection = velocityVec.dot(wallNormal);
    if (projection < 0) {
        const pushFactor =
            Math.abs(projection * dt) + 0.05;
        base.position.addScaledVector(wallNormal, pushFactor);
        base.userData.updateOBB?.();
    }
    else{
        base.position.addScaledVector(wallNormal, 0.05);
    }
    // console.log("colidindo");

    /* ======================
       TRATAMENTO POR ÂNGULO
    ====================== */
    if (angle < 30) {
        // impacto frontal → freada forte
        follower.currentSpeed *= 0.3;
    } else {
        // colisão lateral → vira para fora da parede

        follower.currentSpeed *= 0.9;

        /* ======================
           DIREÇÃO DE FUGA
        ====================== */
        // let escapeDir = wallNormal.clone();
        // escapeDir.y = 0;
        // escapeDir.normalize();

        // // garante que não fique de ré
        // if (escapeDir.dot(forward) < 0) {
        //     escapeDir.negate();
        // }

        // /* ======================
        //    ROTACIONA PARA FORA
        // ====================== */
        // const xAxis = escapeDir.clone().negate();
        // const yAxis = new THREE.Vector3(0, 1, 0);
        // const zAxis = new THREE.Vector3()
        //     .crossVectors(xAxis, yAxis)
        //     .normalize();
        // xAxis.crossVectors(yAxis, zAxis).normalize();

        // const targetMat = new THREE.Matrix4().makeBasis(
        //     xAxis, yAxis, zAxis
        // );
        // const targetQuat = new THREE.Quaternion()
        //     .setFromRotationMatrix(targetMat);

        // // slerp mais agressivo que o player
        // base.quaternion.slerp(targetQuat, 0.35);

        // // temporariamente vira melhor
        // follower.turnSpeed = Math.min(
        //     follower.turnSpeed * 1.3,
        //     4.5
        // );
    }

    if (follower.currentSpeed < 0.1) {
        follower.currentSpeed = 0;
    }
}

function createBulletInteraction(shooter, scene) {
   // Offset ajustado para não colidir com o próprio carro (-22)
   const offset = new THREE.Vector3(-4, 0, 0).applyQuaternion(shooter.quaternion);
   const spawnPos = shooter.position.clone().add(offset);
   
   // --- MALHA IGUAL A DO JOGADOR ---

   const geometry = new THREE.SphereGeometry(1, 20, 20);
   const material = new THREE.MeshPhongMaterial(({ 
                  color: "rgba(255, 0, 0, 1)",
                  flatShading: false,
                  shininess: "100",
                  specular: "rgb(255,255,255)" }));
   const bullet = new THREE.Mesh(geometry, material);
   // --------------------------------
   
   bullet.position.copy(spawnPos);
   bullet.quaternion.copy(shooter.quaternion);
   
   // Física
   bullet.geometry.computeBoundingBox();
   bullet.userData.obb = new OBB();
   bullet.userData.obb.fromBox3(bullet.geometry.boundingBox);
   
   bullet.userData.shooter = shooter; 
   
   scene.add(bullet);
   bulletsInGame.push(bullet); 
}

function updateBotShooting(botMesh, targets, scene) {
    // 1. Checa se tem munição (NOVO)
    if (botMesh.userData.nBullets <= 0) return;

    // 2. Cooldown (1 segundo entre tiros)
    const now = Date.now();
    if (botMesh.userData.lastShotTime && now - botMesh.userData.lastShotTime < 1000) {
        return;
    }

    const botPos = botMesh.position; 
    const botForward = new THREE.Vector3(-1, 0, 0).applyQuaternion(botMesh.quaternion).normalize();

    for (let target of targets) {
        if (target === botMesh) continue; 

        // Distância (80 unidades)
        const distSq = botPos.distanceToSquared(target.position);
        if (distSq > 6400) continue; 

        // Ângulo de Visão (Cone de 10 graus)
        const toTarget = new THREE.Vector3().subVectors(target.position, botPos).normalize();
        const angle = botForward.angleTo(toTarget);
        const angleDeg = THREE.MathUtils.radToDeg(angle);

        if (angleDeg < 10) {
            // ATIRAR!
            createBulletInteraction(botMesh, scene);
            
            // Atualiza estado do bot
            botMesh.userData.lastShotTime = now;
            botMesh.userData.nBullets--; // Gasta uma bala
            
            return; 
        }
    }
}

// Colisão entre os carros e a mureta
function checkCarCollision(car) {
  const [isColided, angle, normal, wall] = collisionSystem.checkCollision(car, scene);
    if (isColided) {
        return [true, angle, normal, wall];
    }
    return [false, null, null, null];
}

function applyBulletHit(vehicleObj, isPlayer = false) {
    if (!vehicleObj.userData.isStunned) {
        vehicleObj.userData.isStunned = true;
        vehicleObj.userData.stunTimer = 3.0; 
        if (!isPlayer && vehicleObj.userData.follower) {
             if (!vehicleObj.userData.follower.baseSpeed) {
                 vehicleObj.userData.follower.baseSpeed = vehicleObj.userData.follower.currentSpeed; 
             }
        }
    }
    if (isPlayer) {
        vehicleObj.userData.velocity *= 0.3;
        vehicleObj.userData.aceleration = 0; 
    } else {
        if (vehicleObj.userData.follower) {
            vehicleObj.userData.follower.currentSpeed = vehicleObj.userData.follower.currentSpeed * 0.3;
        }
    }
}

function updateStunTimers(dt, vehicleObj, isPlayer = false) {
    if (vehicleObj.userData.isStunned) {
        vehicleObj.userData.stunTimer -= dt;
        if (vehicleObj.userData.stunTimer <= 0) {
            vehicleObj.userData.isStunned = false;
            if (!isPlayer && vehicleObj.userData.follower) {
                 vehicleObj.userData.follower.currentSpeed *= 0.3;
                 vehicleObj.userData.follower.aceleration = 0; 
            }
        }
    }
}

// Funções que verificam a posição do carro em relação a volta e a checkpoint
function checkLapCompletion(vehicle) {
   const carPos = vehicle.getWorldPosition(new THREE.Vector3());
   const isInFinishZone = 
   (carPos.x <= 12.5 && carPos.x >= -12.5) && (carPos.z <= 12.5 && carPos.z >= -12.5) ;
   
   if (isInFinishZone && vehicle.userData.checkpoints_count == 4) {
      vehicle.userData.laps_count++;
      vehicle.userData.checkpoints_count = 0;
      console.log(`Lap ${vehicle.userData.laps_count} completed!`);
      vehicle.userData.nBullets = 4;
    //   console.log("AAAAAAAAAAAAAAAAAA");
   }
}

function checkCheckPointCompletion(vehicle) {
  const carPos = vehicle.getWorldPosition(new THREE.Vector3());
  const R = 12.5;
  let points = trackPoints[vehicle.userData.trackNumber];
    // console.log(Array.isArray(points));
    // console.log(points);
    if (vehicle.userData.checkpoints_count >= points.length) return;

    const checkpoint = points[vehicle.userData.checkpoints_count];
    const [x, y, z] = checkpoint;

    const dentro =
        carPos.x >= x - R && carPos.x <= x + R &&
        carPos.z >= z - R && carPos.z <= z + R;

    if (dentro) {
        vehicle.userData.checkpoints_count++;
    }
}

// Funções para controlar o estado do jogo no navegador (pausado, em andamento, ...)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isPaused = true;
    resetKeyboardState();
  } else {
    isPaused = false;
    clock.elapsedTime = 0;
    clock.start();
  }
});

window.addEventListener('blur', () => {
  isPaused = true;
  resetKeyboardState();
});

window.addEventListener('focus', () => {
  isPaused = false;
  clock.elapsedTime = 0;
  clock.start();
});

function resetKeyboardState() {
  if (KeyboardState.status) {
    for (let key in KeyboardState.status) {
      delete KeyboardState.status[key];
    }
  }
}