import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";

// Criar a primeira pista
export function createTrack1(scene) {
    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(90));
        block.position.set(60 - 30 * index, 0, 0);
        block.name = "block_horizontal1_" + index;
        scene.add(block);
    }

    let blockConer = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    scene.add(blockConer);

    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-180, 0, -30 - 30 * index);
        block.name = "block_vertical1_" + index;
        scene.add(block);
    }

    let blockConer2 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)", 2, "rgb(255,30,30)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer2.position.set(-180, 0, -270);
    blockConer.name = "block_coner2";
    scene.add(blockConer2);

    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(270));
        block.position.set(-150 + 30 * index, 0, -270);
        block.name = "block_horizontal2_" + index;
        scene.add(block);
    }

    let blockConer3 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)");
    blockConer3.rotateZ(THREE.MathUtils.degToRad(0));
    blockConer3.position.set(90, 0, -270);
    blockConer.name = "block_coner3";
    scene.add(blockConer3);

    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.position.set(90, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        scene.add(block);
    }

    let blockConer4 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)", 2, "rgb(255,30,30)");
    blockConer4.rotateZ(THREE.MathUtils.degToRad(-90));
    blockConer4.position.set(90, 0, 0);
    blockConer.name = "block_coner4";
    scene.add(blockConer4);

    return scene
}

// Criar a segunda pista
export function createTrack2(scene) {
    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(90));
        block.position.set(60 - 30 * index, 0, 0);
        block.name = "block_horizontal1_" + index;
        scene.add(block);
    }

    let blockConer = createBlock(2, "rgb(100,100,100)", "rgb(255,165,0)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    scene.add(blockConer);

    for (let index = 0; index < 8; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-180, 0, -30 - 30 * index);
        block.name = "block_vertical1_" + index;
        scene.add(block);
    }

    let blockConer2 = createBlock(2, "rgb(100,100,100)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer2.position.set(-180, 0, -270);
    blockConer.name = "block_coner2";
    scene.add(blockConer2);

    for (let index = 0; index < 4; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(270));
        block.position.set(-150 + 30 * index, 0, -270);
        block.name = "block_horizontal2_" + index;
        scene.add(block);
    }

    let blockConer3 = createBlock(2, "rgb(100,100,100)", "rgb(255,165,0)");
    blockConer3.position.set(-30, 0, -270);
    blockConer.name = "block_coner3";
    scene.add(blockConer3);

    for (let index = 0; index < 4; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,165,0)");
        block.position.set(-30, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        scene.add(block);
    }

    let blockConer4 = createBlock(2, "rgb(100,100,100)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer4.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer4.position.set(-30, 0, -120);
    blockConer.name = "block_coner4";
    scene.add(blockConer4);

    for (let index = 0; index < 3; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(-90))
        block.position.set(30 * index, 0, -120);
        block.name = "block_horizontal3_" + index;
        scene.add(block);
    }

    let blockConer5 = createBlock(2, "rgb(100,100,100)", "rgb(255,165,0)");
    blockConer5.position.set(90, 0, -120);
    blockConer.name = "block_coner5";
    scene.add(blockConer5);

    for (let index = 0; index < 3; index++) {
        let block = createBlock(1, "rgb(100,100,100)", "rgb(255,165,0)");
        // block.rotateZ(THREE.MathUtils.degToRad(-90))
        block.position.set(90, 0, -90 + 30 * index);
        block.name = "block_vertical3_" + index;
        scene.add(block);
    }

    let blockConer6 = createBlock(2, "rgb(100,100,100)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer6.rotateZ(THREE.MathUtils.degToRad(-90));
    blockConer6.position.set(90, 0, 0);
    blockConer.name = "block_coner5";
    scene.add(blockConer6);

    return scene
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
            let wall = createWall("rgb(255,255,255)");
            wall.name = "leftWall" + index;
            floor.add(wall);
            wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
        else {
            let wall = createWall(colorWall);
            wall.name = "leftWall" + index;
            floor.add(wall);
            wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
    }

    for (let index = 0; index < 6; index++) {
        if (index % 2 == 0) {
            let wall = createWall("rgb(255,255,255)");
            wall.name = "rightWall" + index;
            floor.add(wall);
            wall.translateX(-12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
        else {
            let wall = createWall(colorWall);
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
                let wall = createWall("rgb(255,255,255)");
                wall.name = "leftWall" + index;
                floor.add(wall);
                wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
            }
            else {
                let wall = createWall(colorWall);
                wall.name = "leftWall" + index;
                floor.add(wall);
                wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
            }
        }

        for (let index = 0; index < 5; index++) {
            if (index % 2 == 0) {
                let wall = createWall("rgb(255,255,255)");
                wall.name = "rightWall" + index;
                floor.add(wall);
                wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
            }
            else {
                let wall = createWall(colorWall);
                wall.name = "rightWall" + index;
                floor.add(wall);
                wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
            }
        }
        // console.log(floor);

        let wallConer = createWall(colorConer);
        wallConer.name = "conerWall";
        floor.add(wallConer);
        wallConer.translateX(-12.5).translateZ(1).translateY(-12.5);

        return floor;
    }
    else if (type_pattern == 2) {
        let floor = createFloor(colorFloor);
        for (let index = 0; index < 6; index++) {
            if (index % 2 == 0) {
                let wall = createWall(colorWall);
                wall.name = "leftWall" + index;
                floor.add(wall);
                wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
            }
            else {
                let wall = createWall("rgb(255,255,255)");
                wall.name = "leftWall" + index;
                floor.add(wall);
                wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
            }
        }

        for (let index = 0; index < 5; index++) {
            if (index % 2 == 0) {
                let wall = createWall(colorWall);
                wall.name = "rightWall" + index;
                floor.add(wall);
                wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
            }
            else {
                let wall = createWall("rgb(255,255,255)");
                wall.name = "rightWall" + index;
                floor.add(wall);
                wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
            }
        }
        // console.log(floor);

        let wallConer = createWall(colorConer);
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
function createWall(color) {
    const cubeGeometry = new THREE.BoxGeometry(5, 5, 2);
    const material = setDefaultMaterial(color, null);
    const cube = new THREE.Mesh(cubeGeometry, material);
    return cube;
}