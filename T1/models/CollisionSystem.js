import * as THREE from 'three';
// const raycaster = new THREE.Raycaster();

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
            const result = objectOBB.intersectsOBB(wall.boundingBox);
            if (result) {
                // debugWallBounding(scene, wall);
                // console.log(wall.boundingBox);
                const normals = wall.normals;
                const carDirection = new THREE.Vector3(-1, 0, 0)
                .applyQuaternion(car.quaternion)
                .normalize();
                const collisionNormal = getCollisionNormal(carDirection, normals, wall.mesh, car.position);

                const angleDeg = collisionAngleDeg(carDirection, collisionNormal);

                console.log(collisionNormal)
                console.log("Collision angle:", angleDeg);
                // console.log(wall.mesh)
                
                return [true, angleDeg, collisionNormal];
            }
        }
        return [false, null, null];
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

function getCollisionNormal(carDir, wallNormals, wallMesh, carPosition) {
    let bestNormal = null;

    //
    // 1) Your existing special cases
    //
    if (wallMesh.name === "Pararell_leftWall") {
        const localNormal = new THREE.Vector3(-1, 0, 0);
        return localNormal.clone().applyQuaternion(wallMesh.getWorldQuaternion(new THREE.Quaternion()));
    }
    if (wallMesh.name === "Pararell_rightWall") {
        const localNormal = new THREE.Vector3(1, 0, 0);
        return localNormal.clone().applyQuaternion(wallMesh.getWorldQuaternion(new THREE.Quaternion()));
    }
    if (wallMesh.name === "Adjacent_leftWall") {
        const localNormal = new THREE.Vector3(1, 0, 0);
        return localNormal.clone().applyQuaternion(wallMesh.getWorldQuaternion(new THREE.Quaternion()));
    }
    if (wallMesh.name === "Adjacent_rightWall") {
        const localNormal = new THREE.Vector3(0, -1, 0);
        return localNormal.clone().applyQuaternion(wallMesh.getWorldQuaternion(new THREE.Quaternion()));
    }

    //
    // 2) Fallback case → Use raycasting to detect the true collided face
    //
    // This handles the "corner" case or any future ambiguous wall shapes.
    //
    // Create ray from car → wall
    console.log(carPosition)
    const wallCenter = new THREE.Vector3();
    wallMesh.getWorldPosition(wallCenter);

    const rayDir = wallCenter.sub(carPosition).normalize();

    const raycaster = new THREE.Raycaster();
    raycaster.set(carPosition, rayDir);

    // Get triangle that was actually hit
    const hits = raycaster.intersectObject(wallMesh, true);

    if (hits.length > 0) {
        const hit = hits[0];

        // Transform triangle normal to world space
        const normal = hit.face.normal.clone();

        const normalMatrix = new THREE.Matrix3().getNormalMatrix(wallMesh.matrixWorld);
        normal.applyMatrix3(normalMatrix).normalize();
        // console.log(normal);
        console.log("Raycast foi");
        return normal;
    }

    //
    // 3) Emergency fallback (should not happen)
    //
    console.log("Raycast não foi");
    const localNormal = new THREE.Vector3(-1, 0, 0);
    return localNormal.clone().applyQuaternion(wallMesh.getWorldQuaternion(new THREE.Quaternion()));
}



function collisionAngleDeg(carDir, wallNormal) {
    const dot = Math.abs(carDir.dot(wallNormal));
    return THREE.MathUtils.radToDeg(Math.acos(dot));
}
