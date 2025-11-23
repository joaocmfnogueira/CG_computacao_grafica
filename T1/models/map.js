import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
import { CollisionSystem } from './CollisionSystem.js';
import {OBB} from "./OBB.js";
import {createOBBHelper} from "../utils.js";

export const collisionSystem = new CollisionSystem();

export function createGround(scene) {

    const groundGeometry = new THREE.PlaneGeometry(3000, 3000);
    const groundMaterial = setDefaultMaterial("rgba(87, 215, 138, 1)"); 
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    ground.position.y = -0.1; 
    ground.receiveShadow = true;
    ground.name = "ground";
    
    scene.add(ground);
}

export function createSky(scene) {
    scene.background = new THREE.Color(0x87CEEB); 
}

// Pista de teste
export function createTrack0(scene) {

    createGround(scene);
    
    createSky(scene);
    

    let blockConer = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    scene.add(blockConer);
    registerWallsForCollision(blockConer);
    debugShowBoundingBoxes(blockConer, scene);


    

    

}
// Criar a primeira pista
export function createTrack1(scene) {

    createGround(scene);
    
    createSky(scene);

    for (let index = 0; index < 8; index++) {
        let block
        if(index == 2)
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,30,30)");
        else
            block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(90));
        block.position.set(60 - 30 * index, 0, 0);
        block.name = "block_horizontal1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);
    }

    let blockConer = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    scene.add(blockConer);
    registerWallsForCollision(blockConer);
    debugShowBoundingBoxes(blockConer, scene);


    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-180, 0, -30 - 30 * index);
        block.name = "block_vertical1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer2 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)", 2, "rgb(255,30,30)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer2.position.set(-180, 0, -270);
    blockConer2.name = "block_coner2";
    scene.add(blockConer2);
    registerWallsForCollision(blockConer2);
    debugShowBoundingBoxes(blockConer2, scene);


    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(270));
        block.position.set(-150 + 30 * index, 0, -270);
        block.name = "block_horizontal2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer3 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)");
    blockConer3.rotateZ(THREE.MathUtils.degToRad(0));
    blockConer3.position.set(90, 0, -270);
    blockConer3.name = "block_coner3";
    scene.add(blockConer3);
    registerWallsForCollision(blockConer3);
    debugShowBoundingBoxes(blockConer3, scene);


    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.position.set(90, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer4 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)", 2, "rgb(255,30,30)");
    blockConer4.rotateZ(THREE.MathUtils.degToRad(-90));
    blockConer4.position.set(90, 0, 0);
    blockConer4.name = "block_coner4";
    scene.add(blockConer4);
    registerWallsForCollision(blockConer4);
    debugShowBoundingBoxes(blockConer4, scene);

}

// Criar a segunda pista
export function createTrack2(scene) {
    createGround(scene);
    
    createSky(scene);


    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 2)
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)");
        else
            block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(90));
        block.position.set(60 - 30 * index, 0, 0);
        block.name = "block_horizontal1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    scene.add(blockConer);
    registerWallsForCollision(blockConer);
    debugShowBoundingBoxes(blockConer, scene);


    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-180, 0, -30 - 30 * index);
        block.name = "block_vertical1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer2 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer2.position.set(-180, 0, -270);
    blockConer2.name = "block_coner2";
    scene.add(blockConer2);
    registerWallsForCollision(blockConer2);
    debugShowBoundingBoxes(blockConer2, scene);


    for (let index = 0; index < 4; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(270));
        block.position.set(-150 + 30 * index, 0, -270);
        block.name = "block_horizontal2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer3 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)");
    blockConer3.position.set(-30, 0, -270);
    blockConer3.name = "block_coner3";
    scene.add(blockConer3);
    registerWallsForCollision(blockConer3);
    debugShowBoundingBoxes(blockConer3, scene);


    for (let index = 0; index < 4; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.position.set(-30, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer4 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer4.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer4.position.set(-30, 0, -120);
    blockConer4.name = "block_coner4";
    scene.add(blockConer4);
    registerWallsForCollision(blockConer4);
    debugShowBoundingBoxes(blockConer4, scene);


    for (let index = 0; index < 3; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(-90))
        block.position.set(30 * index, 0, -120);
        block.name = "block_horizontal3_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer5 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)");
    blockConer5.position.set(90, 0, -120);
    blockConer5.name = "block_coner5";
    scene.add(blockConer5);
    registerWallsForCollision(blockConer5);
    debugShowBoundingBoxes(blockConer5, scene);


    for (let index = 0; index < 3; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        // block.rotateZ(THREE.MathUtils.degToRad(-90))
        block.position.set(90, 0, -90 + 30 * index);
        block.name = "block_vertical3_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer6 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer6.rotateZ(THREE.MathUtils.degToRad(-90));
    blockConer6.position.set(90, 0, 0);
    blockConer6.name = "block_coner6";
    scene.add(blockConer6);
    registerWallsForCollision(blockConer6);
    debugShowBoundingBoxes(blockConer6, scene);

}

// Cria os dois tipos de blocos (piso + mureta):
// Primeiro ->  As muretas estão paralelas;
// Segundo -> As muretas estão adjacentes;
function createBlock(type, colorFloor, colorWall, type_pattern = 1, colorConer = "rgb(255,255,255)") {
    if (type == 1) {
        let floor = auxCreateBlock_parallel(colorFloor, colorWall);
        return floor;
    }
    else if (type == 2) {
        let floor = auxCreateCreate_Adjacent(colorFloor, colorWall, type_pattern, colorConer);
        return floor;
    }
    else {
        console.log("algum erro aconteceu");
        return;
    }
}

// Função auxiliar para criar o tipo de bloco paralelo
function auxCreateBlock_parallel(colorFloor, colorWall) {

    const floor = createFloor(colorFloor);

    for (let index = 0; index < 6; index++) {
        const col = (index % 2 === 0) 
            ? "rgb(255,255,255)" 
            : colorWall;

        const wall = createWall(col);
        wall.name = "Pararell_leftWall";

        floor.add(wall);

        wall.position.set(12.5, -12.5 + 5 * index, 0.5);
    }

    for (let index = 0; index < 6; index++) {
        const col = (index % 2 === 0) 
            ? "rgb(255,255,255)" 
            : colorWall;

        const wall = createWall(col);
        wall.name = "Pararell_rightWall";

        floor.add(wall);

        wall.position.set(-12.5, -12.5 + 5 * index, 0.5);
    }

    return floor;
}


// Função auxiliar para criar o tipo de bloco adjacente
function auxCreateCreate_Adjacent(colorFloor, colorWall, type_pattern = 1, colorConer = "rgb(255,255,255)") {

    const floor = createFloor(colorFloor);

    for (let index = 0; index < 6; index++) {

        const isEven = (index % 2 === 0);
        const col = (type_pattern === 1)
            ? (isEven ? "rgb(255,255,255)" : colorWall)
            : (isEven ? colorWall : "rgb(255,255,255)");

        const wall = createWall(col);
        wall.name = "Adjacent_leftWall";

        floor.add(wall);

        wall.position.set(12.5, -12.5 + 5 * index, 0.5);
    }

    for (let index = 0; index < 5; index++) {

        const isEven = (index % 2 === 0);
        const col = (type_pattern === 1)
            ? (isEven ? "rgb(255,255,255)" : colorWall)
            : (isEven ? colorWall : "rgb(255,255,255)");

        const wall = createWall(col);
        wall.name = "Adjacent_rightWall";

        floor.add(wall);

        wall.position.set(-12.5 + 5 * index, 12.5, 0.5);
    }

    if (!floor.getObjectByName("conerWall")) {

        const wallConer = createWall(colorConer);
        wallConer.name = "conerWall";

        floor.add(wallConer);

        wallConer.position.set(-12.5, -12.5, 0.5);
    }

    return floor;
}


// Cria um piso
function createFloor(color) {
    const geometry = new THREE.PlaneGeometry(30, 30);
    const material = setDefaultMaterial(color, null);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = THREE.MathUtils.degToRad(-90);
    return plane;
}

// Cria uma mureta
function createWall(color) {
    const cubeGeometry = new THREE.BoxGeometry(5, 5, 2);
    const material = setDefaultMaterial(color, null);
    const cube = new THREE.Mesh(cubeGeometry, material);
    
    return cube;
}

// Função para registrar as colisões
function registerWallsForCollision(block) {
  block.updateMatrixWorld(true);

  block.traverse(child => {
    if (child.name && child.name.includes("Wall") && child.geometry) {
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => (m.side = THREE.DoubleSide));
            } else {
                child.material.side = THREE.DoubleSide;
            }
        }

      child.userData.boundingBox = new THREE.Box3().setFromObject(child);

      child.userData.obb = new OBB().fromBox3(child.userData.boundingBox);
        
      child.userData.normals = getWallNormalsFromOBB(child.userData.obb);
      collisionSystem.addWall(child);

    //   console.log(child.userData.obb);
    }
  });
}



// Visualizador de boudingbox
function debugShowBoundingBoxes(block, scene) {
// // helper from box3
//   block.traverse(child => {
//     if (child.userData && child.userData.boundingBox && child.geometry) {
//       // create a helper and store it so we can update later
//       const helper = new THREE.Box3Helper(child.userData.boundingBox.clone(), 0xff0000);
//       scene.add(helper);
//       child.userData._bbHelper = helper;
//     }
//   });

// // helper from OBB
  block.traverse(child => {
    if (child.userData && child.userData.obb && child.geometry) {
      // create a helper and store it so we can update later
      const helper = createOBBHelper(child.userData.obb);
      scene.add(helper);
      child.userData._bbHelper = helper;
      addWallNormalHelper(child, scene, 5, 0x00ff00);
    }
  });
  
}


export function addWallNormalHelper(wallMesh, scene, length = 2, color = 0xff0000) {
    // Normal of a plane in local space (pointing +Z in this case)
    const localNormal = new THREE.Vector3(1, 0, 0);

    // Transform it to world space
    const worldNormal = localNormal.clone().applyQuaternion(wallMesh.getWorldQuaternion(new THREE.Quaternion()));

    // Create the helper
    const arrowHelper = new THREE.ArrowHelper(
        worldNormal.clone().normalize(),
        wallMesh.getWorldPosition(new THREE.Vector3()),
        length,
        color
    );

    arrowHelper.userData.wall = wallMesh; // store reference
    // scene.add(arrowHelper);

    return arrowHelper;
}

function getWallNormalsFromOBB(obb) {

    const normals = [];

    // Extract axes from OBB.rotation
    const rot = obb.rotation;

    const axisX = new THREE.Vector3(rot.elements[0], rot.elements[1], rot.elements[2]).normalize();
    const axisY = new THREE.Vector3(rot.elements[3], rot.elements[4], rot.elements[5]).normalize();
    const axisZ = new THREE.Vector3(rot.elements[6], rot.elements[7], rot.elements[8]).normalize();

    // 6 face normals
    normals.push(axisX.clone());
    normals.push(axisX.clone().negate());

    normals.push(axisY.clone());
    normals.push(axisY.clone().negate());

    normals.push(axisZ.clone());
    normals.push(axisZ.clone().negate());

    // console.log(normals);
    return normals;
}






