import * as THREE from 'three';
import Stats from './models/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { createTrack2, createTrack1, createTrack0} from "./models/map.js"
import { createHavac, createHavacEnemy } from './models/vehicle.js';
import {applyLateralSlide, createSpeedDisplay, updateSpeedDisplay, createLapsCount, updateLapDisplay, showFinishScreen, initLight, initRenderer, createCheckPointCount, updateCheckPointDisplay, createBulletCount, updateBulletDisplay, removeAndDispose, loadGLBFile} from './utils.js';
import {keyboardUpdate, updateVehicleMovement, updateCamera, updateLightMovement} from './control/control.js';
import { collisionSystem } from './models/map.js';
import { OBB } from './models/OBB.js'
import {CubeTextureLoaderSingleFile} from './models/cubeTextureLoaderSingleFile.js';

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
var listener = new THREE.AudioListener();
camera.add(listener);
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

light = initLight(scene);

let keyboard = new KeyboardState();


// Game Variables
let bulletsInGame = []; // Stores all bullets (Player + Bots)
let trackPoints = {
    "Primeiro" : [[-180, 0, -30], [-150, 0, -270], [90, 0, -240], [60, 0, 0]],
    "Segundo" : [[-180, 0, -30], [-150, 0, -270], [-30, 0, -240], [90, 0, -90]],
    "Terceiro" : [[-90, 0, -30], [-120, 0, -270], [-180, 0, -150], [30, 0, -120]]
};

let isPaused = false;
let clock = new THREE.Clock();
let gameStarted = false;
let loadingScreen = null;
let assetList = null;
let startButton = null;
let startButtonClicked = false;
let verificadorInicial = false;
let inputEnabled = false;

const speedDisplay = createSpeedDisplay();
const lapsDisplay = createLapsCount();
const checkPointDisplay = createCheckPointCount();
const bulletDisplay = createBulletCount();

// --- Queue Logic Variables ---
let loadedAssetsQueue = [];
let isThreeJsLoadingFinished = false;
let isQueueRunning = false;

// Carregando as texturas
const manager = new THREE.LoadingManager();

manager.onStart = () => {
    showLoadingScreen();
    // Reset variables on start
    verificadorInicial = false;
    loadedAssetsQueue = [];
    isThreeJsLoadingFinished = false;
    isQueueRunning = false;
};

// Instead of updating UI immediately, we push to a queue
manager.onProgress = (url, loaded, total) => {
    loadedAssetsQueue.push(`Processing: ${url}`);
    
    // Start the visual loop if it hasn't started yet
    if (!isQueueRunning) {
        processQueue();
    }
};

// We don't hide the screen here anymore. We just flag that Three.js is done.
// The Queue processor will handle the UI update when it finishes its delays.
manager.onLoad = () => {
    isThreeJsLoadingFinished = true;
};

manager.onError = (url) => {
    console.error("Erro ao carregar:", url);
};

let audioLoader = new THREE.AudioLoader(manager);

// create a audio source of music theme
const track01 = new THREE.Audio(listener);
audioLoader.load('../../0_assets_T3/01 Bad to the Bone.mp3', function (buffer) {
   track01.setBuffer(buffer);
   track01.setLoop(true);
   track01.setVolume(0.3);
});

const track02 = new THREE.Audio(listener);
audioLoader.load('../../0_assets_T3/02 Paranoid.mp3', function (buffer) {
   track02.setBuffer(buffer);
   track02.setLoop(true);
   track02.setVolume(0.3);
});

const track03 = new THREE.Audio(listener);
audioLoader.load('../../0_assets_T3/04 Peter Gunn.mp3', function (buffer) {
   track03.setBuffer(buffer);
   track03.setLoop(true);
   track03.setVolume(0.3);
});

// Audio of the last lap
const ultimaVolta = new THREE.Audio(listener);
audioLoader.load('../../0_assets_T3/lastLap.mp3', function (buffer) {
   ultimaVolta.setBuffer(buffer);
   ultimaVolta.setVolume(0.3);
});

// Audio of the start of the race
const start1 = new THREE.Audio(listener);
audioLoader.load('../../0_assets_T3/start01.mp3', function (buffer) {
   start1.setBuffer(buffer);
   start1.setVolume(0.3);
});

const start2 = new THREE.Audio(listener);
audioLoader.load('../../0_assets_T3/start02.mp3', function (buffer) {
   start2.setBuffer(buffer);
   start2.setVolume(0.3);
});

// Create sound effects of the bullet     
const disparo = new THREE.PositionalAudio(listener);
audioLoader.load('../../T1/assets/Futuristic Shotgun Single Shot.wav', function (buffer) {
   disparo.setBuffer(buffer);
   disparo.setVolume(0.3);
}); 

const atingido = new THREE.PositionalAudio(listener);
audioLoader.load('../../T1/assets/explosion09.wav', function (buffer) {
   atingido.setBuffer(buffer);
   atingido.setVolume(0.3);
}); 




const textureLoader = new THREE.TextureLoader(manager);

let skybox = new CubeTextureLoaderSingleFile(manager).loadSingle('../T1/assets/Sky3.png', 1);

export const objetos3D = {
    "towerWood_pista1" : await loadGLBFile('../../T1/assets/Tower.glb', 50, manager),
    "barril_pista1" : await loadGLBFile('../../T1/assets/barril.glb', 5, manager),
    "piramides_pista2_1" : await loadGLBFile('../../T1/assets/Pyramid.glb', 50, manager),
    "piramides_pista2_2" : await loadGLBFile('../../T1/assets/Pyramid.glb', 40, manager),
    "piramides_pista2_3" : await loadGLBFile('../../T1/assets/Pyramid.glb', 30, manager),
    "maliTower_pista2" : await loadGLBFile('../../T1/assets/mali_defense_tower.glb', 50, manager),
    "pumpkin" : await loadGLBFile('../../T1/assets/pumpkin.glb', 10, manager),
    "wranglerman" : await loadGLBFile('../../T1/assets/wranglerman.glb', 10, manager),
}

export const texturas = {
    "areaExterna_pista1" : carregarTextura('../T1/assets/grass_18k.jpg', 20, 20),
    "areaExterna_pista2" : carregarTextura('../assets/textures/sand.jpg'),
    "areaExterna_pista3" : carregarTextura('../T1/assets/volcano_floor.png', 20, 20),
    "skybox" : skybox,
    "tunnel" : carregarTextura('../assets/textures/darkcement.jpg', 1, 1),
    "piso" : carregarTextura('../T1/assets/01tizeta_asphalts.png', 4, 4),
    "piso_largada" : carregarTextura('../T1/assets/bw_marble_tile_04-512x512.png', 4, 4),
    "piso_checkpoint" : carregarTextura('../T1/assets/bw_marble_tile_04-512x512_0.png', 4, 4),
    "vehicle1" : carregarTextura('../T1/assets/trak2_plate2b.png', 1, 1),
    "vehicle2" : carregarTextura('../T1/assets/image.png', 4, 4),
    "vehicle3" : carregarTextura('../T1/assets/image(2).png', 1, 1),
    "vehicle4" : carregarTextura('../T1/assets/new2-texture.jpg', 1, 1),
    "lateral1" : carregarTextura('../assets/textures/stone.jpg', 1, 1),
    "lateral1.5" : carregarTextura('../T1/assets/stone.jpg', 1, 1),
    "lateral2" : carregarTextura('../assets/textures/stonewall.jpg', 1, 1),
    "lateral2.5" : carregarTextura('../assets/textures/stonewallrot.jpg', 1, 1),
    "lateral3" : carregarTextura('../T1/assets/trak2_tile1a.png', 1, 1),
    "lateral3.5" : carregarTextura('../T1/assets/trak2_tile1a.png', 1, 1),
    "mureta1" : carregarTextura('../assets/textures/crate.jpg', 1, 1),
    "mureta2" : carregarTextura('../T1/assets/wo_marble_tile_08-512x512.png', 1, 1),
    "mureta2.5" : carregarTextura('../T1/assets/wo_marble_tile_08-512x512.png', 1, 1),
    "mureta3" : carregarTextura('../T1/assets/new_2.3_mureta.png', 1, 1)
};

function render() {
    requestAnimationFrame(render);
    if (!gameStarted){
        return;
    } 
    if (isPaused){
        return;
    } 
    if (!startButtonClicked){
        return;
    } 
    
    // if (!verificadorInicial) return;
    
    
   scene.updateMatrixWorld(true);
   const dt = clock.getDelta();

   const SUBSTEPS = 5; 
   const subDt = dt / SUBSTEPS;

   // --- 1. GATHER ALL VEHICLES ---
   const playerCar = scene.getObjectByName("veiculo_principal");
   const bots = [scene.getObjectByName("enemy0"), scene.getObjectByName("enemy1"), scene.getObjectByName("enemy2")].filter(b => b !== undefined);
   const allVehicles = [];
   if (playerCar) allVehicles.push(playerCar);
   bots.forEach(b => allVehicles.push(b));

   if(playerCar.userData.velocity > 0 && !verificadorInicial){
        playerCar.userData.velocity = 0;
        playerCar.userData.aceleration = 0;
        resetKeyboardState();
        verificadorInicial = true;
        return;
    }

//    console.log(playerCar.userData.velocity);
//    console.log(playerCar.userData.aceleration);

   for (let index = 0; index < SUBSTEPS; index++) {
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
   const result = keyboardUpdate(keyboard, playerCar, dt, scene, cameraHolder, bulletsInGame, verificadorInicial);
   bulletsInGame = result.bulletsInGame;
   verificadorInicial = result.verificador;

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
   stats.update();
//    console.log(stats);
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
  if (!gameStarted) return;
  if (document.hidden) {
    console.log("jogo pausado");
    isPaused = true;
    resetKeyboardState();
  } else {
    console.log("era para o jogo voltar");
    isPaused = false;
    clock.elapsedTime = 0;
    clock.start();
  }
});

window.addEventListener('blur', () => {
  if (!gameStarted) return;
  isPaused = true;
  resetKeyboardState();
});

window.addEventListener('focus', () => {
  if (!gameStarted) return;
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

function carregarTextura(path, repeatX = 10, repeatY = 10){
    const texture = textureLoader.load(path);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);

    return texture;
}

// --- VISUAL QUEUE PROCESSOR (The Delay Logic) ---
function processQueue() {
    isQueueRunning = true;

    if (loadedAssetsQueue.length > 0) {
        // 1. Get the next asset from the queue
        const currentAsset = loadedAssetsQueue.shift();
        
        // 2. Update the UI to show only this specific asset
        const assetLabel = document.getElementById("current-asset-name");
        if (assetLabel) assetLabel.textContent = currentAsset;

        // 3. Wait 2 seconds before processing the next one 

// [Image of timer clock]

        setTimeout(processQueue, 100); 

    } else {
        // Queue is empty. Check if Three.js is actually done loading.
        if (isThreeJsLoadingFinished) {
            showStartScreenState();
        } else {
            // Queue is empty, but Three.js is still downloading large files. 
            // Check again in a short moment.
            setTimeout(processQueue, 100); 
        }
    }
}

function showStartScreenState() {
    document.getElementById("loading-text").textContent = "Carregamento concluído!";
    
    // Hide the spinner and the asset name text
    document.querySelector(".spinner").style.display = "none";
    document.getElementById("current-asset-name").style.display = "none";

    // Show and Setup Button
    startButton.style.display = "inline-block"; // inline-block helps with centering usually
    
    startButton.onclick = () => {
        if(!startButtonClicked){
            hideLoadingScreen();
            initScene();

            if (typeof gameStarted !== 'undefined' && !gameStarted) {
                startButtonClicked = true;
                gameStarted = true;
                resetKeyboardState();
                verificadorInicial = false;
                requestAnimationFrame(render);
            }
            
        }
    };
}

// --- HTML & CSS UPDATES ---

function showLoadingScreen() {
    // Remove existing if any
    const existing = document.getElementById("loading-screen");
    if(existing) existing.remove();

    loadingScreen = document.createElement("div");
    loadingScreen.id = "loading-screen";

    // Modified HTML: Removed <ul>, added <p id="current-asset-name">
    loadingScreen.innerHTML = `
        <div class="loading-container">
            <div id="loading-content">
                <div class="spinner"></div>
                <p id="loading-text">Carregando assets...</p>
                <p id="current-asset-name" style="color: #00ffff; font-size: 12px; height: 20px;">Initializing...</p>
            </div>

            <button id="start-button" style="display:none;">START</button>
        </div>
    `;

    Object.assign(loadingScreen.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "9999"
    });

    document.body.appendChild(loadingScreen);

    startButton = document.getElementById("start-button");
    injectLoadingStyles();
}

function hideLoadingScreen() {
    if (!loadingScreen) return;
    loadingScreen.style.opacity = "0";
    loadingScreen.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
        if (loadingScreen && loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
        }
        loadingScreen = null;
    }, 500);
}

function injectLoadingStyles() {
    if (document.getElementById("loading-style")) return;

    const style = document.createElement("style");
    style.id = "loading-style";
    style.textContent = `
        .loading-container {
            text-align: center;
            color: white;
            font-family: Arial, sans-serif;
            width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center; /* Helper for centering flex children */
            justify-content: center;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 6px solid #ccc;
            border-top-color: #00ffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }

        /* Styling for the Single Asset Text */
        #current-asset-name {
            margin-top: 5px;
            opacity: 0.8;
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        button {
            margin-top: 20px;
            padding: 12px 40px;
            font-size: 18px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
            background: #00ffff;
            color: black;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function initScene(){
    // criando pista
    createTrack1(scene);

    // Create Player
    createHavac(scene);

    // Create Enemies
    createHavacEnemy(scene, "rgb(82, 123, 236)", "rgb(18, 21, 199)", "rgb(112, 145, 238)", 0);
    createHavacEnemy(scene, "rgb(240, 83, 83)", "rgba(255, 0, 0, 1)", "rgb(223, 105, 105)", 1);
    createHavacEnemy(scene, "rgba(0, 238, 16, 1)", "rgba(0, 118, 14, 1)", "rgb(124, 216, 71)", 2);
}
