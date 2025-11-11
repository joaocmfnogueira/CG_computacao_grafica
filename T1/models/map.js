import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
import { CollisionSystem } from './CollisionSystem.js';

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
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);
    }

    let blockConer = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    updateBoundingBoxes(blockConer);
    registerWallsForCollision(blockConer);
    scene.add(blockConer);
    debugShowBoundingBoxes(blockConer, scene);


    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-180, 0, -30 - 30 * index);
        block.name = "block_vertical1_" + index;
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer2 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)", 2, "rgb(255,30,30)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer2.position.set(-180, 0, -270);
    blockConer2.name = "block_coner2";
    updateBoundingBoxes(blockConer2);
    registerWallsForCollision(blockConer2);
    scene.add(blockConer2);
    debugShowBoundingBoxes(blockConer2, scene);


    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(270));
        block.position.set(-150 + 30 * index, 0, -270);
        block.name = "block_horizontal2_" + index;
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer3 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)");
    blockConer3.rotateZ(THREE.MathUtils.degToRad(0));
    blockConer3.position.set(90, 0, -270);
    blockConer3.name = "block_coner3";
    updateBoundingBoxes(blockConer3);
    registerWallsForCollision(blockConer3);
    scene.add(blockConer3);
    debugShowBoundingBoxes(blockConer3, scene);


    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.position.set(90, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer4 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)", 2, "rgb(255,30,30)");
    blockConer4.rotateZ(THREE.MathUtils.degToRad(-90));
    blockConer4.position.set(90, 0, 0);
    blockConer4.name = "block_coner4";
    updateBoundingBoxes(blockConer4);
    registerWallsForCollision(blockConer4);
    scene.add(blockConer4);
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
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    updateBoundingBoxes(blockConer);
    registerWallsForCollision(blockConer);
    scene.add(blockConer);
    debugShowBoundingBoxes(blockConer, scene);


    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-180, 0, -30 - 30 * index);
        block.name = "block_vertical1_" + index;
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer2 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer2.position.set(-180, 0, -270);
    blockConer2.name = "block_coner2";
    updateBoundingBoxes(blockConer2);
    registerWallsForCollision(blockConer2);
    scene.add(blockConer2);
    debugShowBoundingBoxes(blockConer2, scene);


    for (let index = 0; index < 4; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(270));
        block.position.set(-150 + 30 * index, 0, -270);
        block.name = "block_horizontal2_" + index;
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer3 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)");
    blockConer3.position.set(-30, 0, -270);
    blockConer3.name = "block_coner3";
    updateBoundingBoxes(blockConer3);
    registerWallsForCollision(blockConer3);
    scene.add(blockConer3);
    debugShowBoundingBoxes(blockConer3, scene);


    for (let index = 0; index < 4; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.position.set(-30, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer4 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer4.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer4.position.set(-30, 0, -120);
    blockConer4.name = "block_coner4";
    updateBoundingBoxes(blockConer4);
    registerWallsForCollision(blockConer4);
    scene.add(blockConer4);
    debugShowBoundingBoxes(blockConer4, scene);


    for (let index = 0; index < 3; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(-90))
        block.position.set(30 * index, 0, -120);
        block.name = "block_horizontal3_" + index;
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer5 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)");
    blockConer5.position.set(90, 0, -120);
    blockConer5.name = "block_coner5";
    updateBoundingBoxes(blockConer5);
    registerWallsForCollision(blockConer5);
    scene.add(blockConer5);
    debugShowBoundingBoxes(blockConer5, scene);


    for (let index = 0; index < 3; index++) {
        let block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        // block.rotateZ(THREE.MathUtils.degToRad(-90))
        block.position.set(90, 0, -90 + 30 * index);
        block.name = "block_vertical3_" + index;
        updateBoundingBoxes(block);
        registerWallsForCollision(block);
        scene.add(block);
        debugShowBoundingBoxes(block, scene);

    }

    let blockConer6 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer6.rotateZ(THREE.MathUtils.degToRad(-90));
    blockConer6.position.set(90, 0, 0);
    blockConer6.name = "block_coner6";
    updateBoundingBoxes(blockConer6);
    registerWallsForCollision(blockConer6);
    scene.add(blockConer6);
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
    let floor = createFloor(colorFloor);
    for (let index = 0; index < 6; index++) {
        if (index % 2 == 0) {
            let wall = createWall("rgb(255,255,255)", new THREE.Vector3(1, 0, 0));
            wall.name = "leftWall" + index;
            floor.add(wall);
            wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
        else {
            let wall = createWall(colorWall, new THREE.Vector3(1, 0, 0));
            wall.name = "leftWall" + index;
            floor.add(wall);
            wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
    }

    for (let index = 0; index < 6; index++) {
        if (index % 2 == 0) {
            let wall = createWall("rgb(255,255,255)", new THREE.Vector3(-1, 0, 0));
            wall.name = "rightWall" + index;
            floor.add(wall);
            wall.translateX(-12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
        else {
            let wall = createWall(colorWall, new THREE.Vector3(-1, 0, 0));
            wall.name = "rightWall" + index;
            floor.add(wall);
            wall.translateX(-12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
    }
    // console.log(floor);
    return floor;
}

// Função auxiliar para criar o tipo de bloco adjacente
function auxCreateCreate_Adjacent(colorFloor, colorWall, type_pattern = 1, colorConer = "rgb(255,255,255)") {
    if (type_pattern == 1) {
        let floor = createFloor(colorFloor);
        for (let index = 0; index < 6; index++) {
            if (index % 2 == 0) {
                let wall = createWall("rgb(255,255,255)", new THREE.Vector3(1, 0, 0));
                wall.name = "leftWall" + index;
                floor.add(wall);
                wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
            }
            else {
                let wall = createWall(colorWall, new THREE.Vector3(1, 0, 0));
                wall.name = "leftWall" + index;
                floor.add(wall);
                wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
            }
        }

        for (let index = 0; index < 5; index++) {
            if (index % 2 == 0) {
                let wall = createWall("rgb(255,255,255)", new THREE.Vector3(0, 0, -1));
                wall.name = "rightWall" + index;
                floor.add(wall);
                wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
            }
            else {
                let wall = createWall(colorWall, new THREE.Vector3(0, 0, -1));
                wall.name = "rightWall" + index;
                floor.add(wall);
                wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
            }
        }
        // console.log(floor);

        let wallConer = createWall(colorConer, new THREE.Vector3(1, 0, 0));
        wallConer.name = "conerWall";
        floor.add(wallConer);
        wallConer.translateX(-12.5).translateZ(1).translateY(-12.5);

        return floor;
    }
    else if (type_pattern == 2) {
        let floor = createFloor(colorFloor);
        for (let index = 0; index < 6; index++) {
            if (index % 2 == 0) {
                let wall = createWall(colorWall, new THREE.Vector3(1, 0, 0));
                wall.name = "leftWall" + index;
                floor.add(wall);
                wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
            }
            else {
                let wall = createWall("rgb(255,255,255)", new THREE.Vector3(1, 0, 0));
                wall.name = "leftWall" + index;
                floor.add(wall);
                wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
            }
        }

        for (let index = 0; index < 5; index++) {
            if (index % 2 == 0) {
                let wall = createWall(colorWall, new THREE.Vector3(0, 0, -1));
                wall.name = "rightWall" + index;
                floor.add(wall);
                wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
            }
            else {
                let wall = createWall("rgb(255,255,255)", new THREE.Vector3(0, 0, -1));
                wall.name = "rightWall" + index;
                floor.add(wall);
                wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
            }
        }
        // console.log(floor);

        let wallConer = createWall(colorConer, new THREE.Vector3(1, 0, 0));
        wallConer.name = "conerWall";
        floor.add(wallConer);
        wallConer.translateX(-12.5).translateZ(1).translateY(-12.5);

        return floor;
    }
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
function createWall(color, normal = new THREE.Vector3(0, 0, 1)) {
    const cubeGeometry = new THREE.BoxGeometry(5, 5, 2);
    const material = setDefaultMaterial(color, null);
    const cube = new THREE.Mesh(cubeGeometry, material);

    // Criando e armazenando a caixa delimitadora na mureta
    let bbCube = new THREE.Box3().setFromObject(cube);
    cube.userData.boundingBox = bbCube;
    cube.userData.surfaceNormal = normal; 
    
    return cube;
}

// Registras as muretas no sistema de colisão
function registerWallsForCollision(block) {
    block.traverse((child) => {
        if (child.name && child.name.includes("Wall")) {
            collisionSystem.addWall(child);
        }
    });
}

// Atualiza a posição das boudingbox
function updateBoundingBoxes(block) {
  block.traverse(child => {
    if (child.userData.boundingBox) {
      child.userData.boundingBox.setFromObject(child);
    }
  });
}

// Visualizador de boudingbox
function debugShowBoundingBoxes(block, scene) {
  block.traverse(child => {
    if (child.userData && child.userData.boundingBox) {
      // make sure world matrix is up to date
      child.updateWorldMatrix(true, false);

      // recompute then create helper
      child.userData.boundingBox.setFromObject(child);
      const helper = new THREE.Box3Helper(child.userData.boundingBox, 0xff0000);
      helper.name = 'BBhelper_' + (child.name || child.id);
      scene.add(helper);
    }
  });
}