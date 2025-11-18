import * as THREE from 'three';

export class CollisionSystem {
    constructor() {
        this.wallBoundingBoxes = [];
    }

    addWall(wallMesh) {
        wallMesh.updateMatrixWorld(true);
        // console.log("wall world pos:", wallMesh.getWorldPosition(new THREE.Vector3()));
        // console.log("wall matrixWorld:", wallMesh.matrixWorld);
        const boundingBox = wallMesh.userData.boundingBox;

        this.wallBoundingBoxes.push({
            mesh: wallMesh,
            boundingBox: boundingBox
        });
    }

    checkCollision(objectMesh, scene) {
        const objectBox = new THREE.Box3().setFromObject(objectMesh);

        for (const wall of this.wallBoundingBoxes) {

            if (objectBox.intersectsBox(wall.boundingBox)) {
                debugWallBounding(scene, wall);
                // console.log(wall);
                return true;
            }
        }
        return false;
    }
}

export function debugWallBounding(scene, wall) {

    const bb = wall.boundingBox.clone();

    const bbHelper = new THREE.Box3Helper(bb, 0xff0000);
    const meshHelper = new THREE.BoxHelper(wall.mesh, 0x00ff00);
    meshHelper.update();

    scene.add(bbHelper);
    scene.add(meshHelper);

    wall.mesh.userData._debug = [bbHelper, meshHelper];
}
