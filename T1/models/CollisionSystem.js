import * as THREE from 'three';

export class CollisionSystem {
    constructor() {
        this.wallBoundingBoxes = [];
    }

    addWall(wallMesh) {
        wallMesh.updateMatrixWorld(true);
        // console.log("wall world pos:", wallMesh.getWorldPosition(new THREE.Vector3()));
        // console.log("wall matrixWorld:", wallMesh.matrixWorld);
        const boundingBox = wallMesh.userData.obb;
        const normals = wallMesh.userData.normals;

        this.wallBoundingBoxes.push({
            mesh: wallMesh,
            boundingBox: boundingBox,
            normals: normals
        });
    }

    checkCollision(car, objectOBB, scene) {

        for (const wall of this.wallBoundingBoxes) {

            if (objectOBB.intersectsOBB(wall.boundingBox)) {
                // debugWallBounding(scene, wall);
                // console.log(wall.boundingBox);
                const normals = wall.normals;
                const carDirection = new THREE.Vector3(0, 0, 1)
                .applyQuaternion(car.quaternion)
                .normalize();
                const collisionNormal = getCollisionNormal(carDirection, normals);

                const angleDeg = collisionAngleDeg(carDirection, collisionNormal);

                console.log("Collision angle:", angleDeg);
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

function getCollisionNormal(carDir, wallNormals) {
    let bestNormal = null;
    let bestDot = -Infinity;

    for (const normal of wallNormals) {
        const dot = Math.abs(carDir.dot(normal));
        if (dot > bestDot) {
            bestDot = dot;
            bestNormal = normal;
        }
    }

    return bestNormal;
}



function collisionAngleDeg(carDir, wallNormal) {
    const dot = Math.abs(carDir.dot(wallNormal));
    return THREE.MathUtils.radToDeg(Math.acos(dot));
}
