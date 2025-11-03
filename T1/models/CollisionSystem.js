import * as THREE from 'three';

export class CollisionSystem {
    constructor() {
        this.wallBoundingBoxes = [];
    }

    // Adiciona a mureta na lista de boundingBoxes
    addWall(wallMesh) {
        const boundingBox = new THREE.Box3().setFromObject(wallMesh);
        this.wallBoundingBoxes.push({
            mesh: wallMesh,
            boundingBox: boundingBox
        });
    }

    // Avalia se o veiculo colidiu com alguma boundingBox
    checkCollision(objectMesh) {
        const objectBox = new THREE.Box3().setFromObject(objectMesh);
        
        for (const wall of this.wallBoundingBoxes) {
            wall.boundingBox.setFromObject(wall.mesh);
            
            if (objectBox.intersectsBox(wall.boundingBox)) {
                return true; 
            }
        }
        return false;
    }
}