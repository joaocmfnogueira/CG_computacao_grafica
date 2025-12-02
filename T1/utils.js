import { collisionSystem } from './models/map.js';
import * as THREE from 'three';



let finishScreen = null;
let gameCompleted = false;

// Função para remover todos os objetos de uma cena
export function clearScene(scene, options = {}, renderer) {
    if (!scene) {
        console.warn('clearScene: No scene provided');
        return;
    }

    const { ignore = [] } = options;
    
    // Build ignore set (including all descendants)
    const ignoreSet = new Set();
    ignore.forEach(rootIgnored => {
        if (rootIgnored) {
            rootIgnored.traverse(child => ignoreSet.add(child));
        }
    });

    // Remove non-ignored objects safely
    const childrenToRemove = scene.children.filter(child => !ignoreSet.has(child));
    childrenToRemove.forEach(child => {
        removeAndDispose(child, ignoreSet);
        scene.remove(child);
    });

    // Clear external systems (pass as parameter!)
    if (collisionSystem) {
        collisionSystem.wallBoundingBoxes.length = 0;
        // collisionSystem.dynamicObjects.length = 0;
    }

    // Clear renderer caches ONLY
    if (renderer?.renderLists) {
        renderer.renderLists.dispose();
    }
    console.log(scene);
}

function removeAndDispose(object, ignoreSet) {
    if (!object || ignoreSet.has(object)) return;

    // Process children from a static snapshot
    const children = [...object.children];
    children.forEach(child => {
        removeAndDispose(child, ignoreSet);
        object.remove(child);
    });

    disposeObject(object);
}

function disposeObject(object) {
    // Geometry
    if (object.geometry) {
        object.geometry.dispose();
    }

    // Material(s)
    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach(disposeMaterial);
        } else {
            disposeMaterial(object.material);
        }
    }

    // Clean up user data
    object.userData = {};
}

function disposeMaterial(material) {
    // Check material exists and hasn't been disposed
    if (!material || material.disposed) return;

    // Dispose textures
    Object.values(material).forEach(value => {
        if (value?.isTexture) {
            value.dispose();
        }
    });

    material.dispose();
}

// Métodos para criar e atualizar a tela com a velocidade do veiculo
export function createSpeedDisplay() {
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


export function updateSpeedDisplay(velocity, speedDisplay) {
    const speed = Math.abs(velocity * 20);
    speedDisplay.textContent = `Speed: ${speed.toFixed(2)} km/h`;
}

// Métodos para criar e atualizar a tela de contador de voltas
export function updateLapDisplay(lap_count, lapDisplay) {
    const laps = lap_count;
    lapDisplay.textContent = `Lap: ${laps}`;
}


export function createLapsCount() {
   const lapDiv = document.createElement('div');
   lapDiv.style.position = 'absolute';
   lapDiv.style.top = '80px';
   lapDiv.style.right = '10px';
   lapDiv.style.color = '#44ff44';
   lapDiv.style.fontFamily = 'Arial, sans-serif';
   lapDiv.style.fontSize = '24px';
   lapDiv.style.fontWeight = 'bold';
   lapDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
   lapDiv.style.padding = '15px';
   lapDiv.style.borderRadius = '10px';
   lapDiv.style.border = '2px solid #333';
   lapDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
   lapDiv.id = 'lapsDisplay';
   document.body.appendChild(lapDiv);
   
   return lapDiv;
}

// Método para criar a tela de finalização
export function showFinishScreen(scene) {
   if (finishScreen) {
      return;
   }
   finishScreen = document.createElement('div');
   finishScreen.id = 'finishScreen';
   finishScreen.style.position = 'absolute';
   finishScreen.style.top = '0';
   finishScreen.style.left = '0';
   finishScreen.style.width = '100%';
   finishScreen.style.height = '100%';
   finishScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
   finishScreen.style.display = 'flex';
   finishScreen.style.flexDirection = 'column';
   finishScreen.style.justifyContent = 'center';
   finishScreen.style.alignItems = 'center';
   finishScreen.style.color = 'white';
   finishScreen.style.fontFamily = 'Arial, sans-serif';
   finishScreen.style.zIndex = '1000';
   
   const title = document.createElement('h1');
   title.textContent = 'RACE COMPLETED!';
   title.style.fontSize = '4em';
   title.style.color = '#44ff44';
   title.style.marginBottom = '20px';
   title.style.textShadow = '0 0 10px #44ff44';
   
   const message = document.createElement('h2');
   message.textContent = `You completed 4 laps!`;
   message.style.fontSize = '2.5em';
   message.style.marginBottom = '40px';
   message.style.color = '#ffffff';
   
//    const restartButton = document.createElement('button');
//    restartButton.textContent = 'RESTART RACE';
//    restartButton.style.padding = '15px 30px';
//    restartButton.style.fontSize = '1.5em';
//    restartButton.style.backgroundColor = '#44ff44';
//    restartButton.style.color = '#000000';
//    restartButton.style.border = 'none';
//    restartButton.style.borderRadius = '10px';
//    restartButton.style.cursor = 'pointer';
//    restartButton.style.fontWeight = 'bold';
//    restartButton.style.transition = 'all 0.3s ease';
   
//    restartButton.onmouseover = function() {
//       this.style.backgroundColor = '#66ff66';
//       this.style.transform = 'scale(1.05)';
//    };
//    restartButton.onmouseout = function() {
//       this.style.backgroundColor = '#44ff44';
//       this.style.transform = 'scale(1)';
//    };
   
//    restartButton.onclick = function() {
//       closeFinishScreen();
//       resetVehicle(scene);
//    };
   
   finishScreen.appendChild(title);
   finishScreen.appendChild(message);
//    finishScreen.appendChild(restartButton);
   
   document.body.appendChild(finishScreen);
   gameCompleted = true;
}

export function closeFinishScreen() {
   if (finishScreen && finishScreen.parentNode) {
      document.body.removeChild(finishScreen);
      finishScreen = null;
   }
   gameCompleted = false;
}

// Método que cria um helper para o OBB
export function createOBBHelper(obb, color = "rgb(255, 255, 255)") {
    const geometry = new THREE.BufferGeometry();

    // 8 corner points of the OBB
    const pts = [];
    const half = obb.halfSize;

    const signs = [
        [+1, +1, +1],
        [+1, +1, -1],
        [+1, -1, +1],
        [+1, -1, -1],
        [-1, +1, +1],
        [-1, +1, -1],
        [-1, -1, +1],
        [-1, -1, -1],
    ];

    for (const s of signs) {
        const p = new THREE.Vector3(
            s[0] * half.x,
            s[1] * half.y,
            s[2] * half.z
        );
        // transform by OBB rotation + position
        p.applyMatrix3(obb.rotation).add(obb.center);
        pts.push(p);
    }

    // Edges between corners
    const indices = [
        0,1, 0,2, 0,4,
        7,6, 7,5, 7,3,
        1,3, 1,5,
        2,3, 2,6,
        4,5, 4,6
    ];

    const vertices = [];
    for (let i = 0; i < indices.length; i++) {
        const p = pts[indices[i]];
        vertices.push(p.x, p.y, p.z);
    }

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.LineBasicMaterial({ color });
    return new THREE.LineSegments(geometry, material);
}

export function initLight(scene, castShadow = true, position = new THREE.Vector3(10, 50, 75)) {
   let power = Math.PI;
   const ambientLight = new THREE.HemisphereLight(
      'white', // bright sky color
      'darkslategrey', // dim ground color
      0.2 * power, // intensity
   );
   scene.add(ambientLight);
   
   const mainLight = new THREE.DirectionalLight('white', 1 * power);
   mainLight.position.copy(position);
   mainLight.castShadow = castShadow;
   scene.add(mainLight);

   // Directional ligth's shadow uses an OrthographicCamera to set shadow parameteres
   // and its left, right, bottom, top, near and far parameters are, respectively,
   // (-5, 5, -5, 5, 0.5, 500).    
   const shadow = mainLight.shadow;
   shadow.mapSize.width = 2048;
   shadow.mapSize.height = 2048;
   shadow.camera.left = -150;
   shadow.camera.right = 150;
   shadow.camera.top = 50;
   shadow.camera.bottom = -50;

   shadow.camera.near = 1;
   shadow.camera.far = 500;

   shadow.bias = -0.0005;


   mainLight.name = "light";
   return mainLight;
}

export function initRenderer(color = "rgb(0, 0, 0)", shadowMapType = THREE.PCFSoftShadowMap ) {

   //var props = (typeof additionalProperties !== 'undefined' && additionalProperties) ? additionalProperties : {};
   var renderer = new THREE.WebGLRenderer();
   //renderer.useLegacyLights = true;
   renderer.shadowMap.enabled = true;
   renderer.shadowMapSoft = true;
   renderer.shadowMap.type = shadowMapType;

   renderer.setClearColor(new THREE.Color(color));
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.shadowMap.enabled = true;
   document.getElementById("webgl-output").appendChild(renderer.domElement);

   return renderer;
}
