import * as THREE from 'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneXZ
} from "../../libs/util/util.js";


export function createTrack1(scene) {
    for (let index = 0; index < 8; index++) {
        let bloco = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        bloco.position.set(0, 0, -30 * index);
        scene.add(bloco);
    }
    return scene
}

export function createTrack2(scene) {

}

// Cria os dois tipos de blocos (piso + mureta):
// Primeiro ->  As muretas estão paralelas;
// Segundo -> As muretas estão adjacentes;
function createBlock(type, colorFloor, colorWall) {
    if (type == 1) {
        let floor = auxCreateBlock1(colorFloor, colorWall);
        return floor;
    }
    else if (type == 2) {
        let floor = auxCreateBlock2(colorFloor, colorWall);
        return floor;
    }
    else {
        console.log("algum erro aconteceu");
        return;
    }
}

// Função auxiliar para criar o tipo de bloco paralelo
function auxCreateBlock1(colorFloor, colorWall) {
    let floor = createFloor(colorFloor);
    for (let index = 0; index < 6; index++) {
        if (index % 2 == 0) {
            let wall = createWall("rgb(255,255,255)");
            wall.name = "muretaEsquerda" + index;
            floor.add(wall);
            wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
        else {
            let wall = createWall(colorWall);
            wall.name = "muretaEsquerda" + index;
            floor.add(wall);
            wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
    }

    for (let index = 0; index < 6; index++) {
        if (index % 2 == 0) {
            let wall = createWall("rgb(255,255,255)");
            wall.name = "muretaDireita" + index;
            floor.add(wall);
            wall.translateX(-12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
        else {
            let wall = createWall(colorWall);
            wall.name = "muretaDireita" + index;
            floor.add(wall);
            wall.translateX(-12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
    }
    console.log(floor);
    return floor;
}

// Função auxiliar para criar o tipo de bloco adjacente
function auxCreateBlock2(colorFloor, colorWall) {
    let floor = createFloor(colorFloor);
    for (let index = 0; index < 6; index++) {
        if (index % 2 == 0) {
            let wall = createWall("rgb(255,255,255)");
            wall.name = "muretaEsquerda" + index;
            floor.add(wall);
            wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
        else {
            let wall = createWall(colorWall);
            wall.name = "muretaEsquerda" + index;
            floor.add(wall);
            wall.translateX(12.5).translateZ(1).translateY(-12.5 + 5 * index);
        }
    }

    for (let index = 0; index < 5; index++) {
        if (index % 2 == 0) {
            let wall = createWall("rgb(255,255,255)");
            wall.name = "muretaDireita" + index;
            floor.add(wall);
            wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
        }
        else {
            let wall = createWall(colorWall);
            wall.name = "muretaDireita" + index;
            floor.add(wall);
            wall.translateX(-12.5 + 5 * index).translateZ(1).translateY(12.5);
        }
    }
    console.log(floor);
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