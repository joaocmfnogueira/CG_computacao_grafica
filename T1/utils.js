import * as THREE from 'three';
import {resetVehicle} from './control/control.js';

let finishScreen = null;
let gameCompleted = false;

// Função para remover todos os objetos de uma cena
export function clearScene(scene) {
    while (scene.children.length > 0) {
        const object = scene.children[0];

        scene.remove(object);

        disposeObject(object);
    }
}

function disposeObject(object) {
    if (object.geometry) {
        object.geometry.dispose();
    }

    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach(material => disposeMaterial(material));
        } else {
            disposeMaterial(object.material);
        }
    }

    if (object.material && object.material.map) {
        object.material.map.dispose();
    }

    if (object.children) {
        for (let i = 0; i < object.children.length; i++) {
            disposeObject(object.children[i]);
        }
    }
}

function disposeMaterial(material) {
    for (const key in material) {
        const value = material[key];
        if (value && value.isTexture) {
            value.dispose();
        }
    }
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
