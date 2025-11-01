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


// métodos para criar e atualizar a tela com a velocidade do veiculo
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

export function updateSpeedDisplay(velocidade, speedDisplay) {
   const speed = Math.abs(velocidade * 20);
   speedDisplay.textContent = `Speed: ${speed.toFixed(2)} km/h`;
}