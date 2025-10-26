
/*
pensar em talvez usar a ideia de alocar os objetos em outra 
variavel e só usar o metodo remove (ganharia em desempenho
porém aumentaria o gasto de memoria):


// Cache for temporarily removed objects
const cache = [];

function hideAllObjects(scene) {
    while (scene.children.length > 0) {
        const obj = scene.children.pop();
        cache.push(obj); // store reference
    }
}

function restoreAllObjects(scene) {
    for (const obj of cache) {
        scene.add(obj);
    }
    cache.length = 0; // clear cache after restoring
}
*/

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