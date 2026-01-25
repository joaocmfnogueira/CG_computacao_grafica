import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
import { CollisionSystem } from './CollisionSystem.js';
import {OBB} from "./OBB.js";
import {createOBBHelper} from "../utils.js";
import { CSG } from "../../libs/other/CSGMesh.js";
import { MeshBasicMaterial } from '../../build/three.core.js';
import { texturas } from '../main.js';
import { objetos3D } from '../main.js';
// import { texturas } from '../basicScene.js';
// import { objetos3D } from '../basicScene.js';

// variavel da pista atual
let pista_atual = 1;


export const collisionSystem = new CollisionSystem();

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

    createTunnelWithHoles(scene, 1, 0, 1);


    // createTree1(scene, 2, 3, 2);
    // createTree2(scene, 10, 3, 10);
}

// Cria a primeira pista
export function createTrack1(scene) {
    pista_atual = 1;

    createGround(scene, 'rgb(51, 255, 51)', "areaExterna_pista1");
    
    createSky(scene);

    createTrack1_objects(scene);

    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 0)
            block = createBlock(1, "rgb(219, 96, 58)", "rgb(255,30,30)", 1, "rgb(255,255,255)", 2);
        else if(index == 2)
            block = createBlock(1, "rgba(255, 255, 255, 1)", "rgb(255,30,30)", 1, "rgb(255,255,255)", 1);
        else
            block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(90));
        block.position.set(60 - 30 * index, 0, 0);
        block.name = "block_horizontal1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);
        
        const baseX = 60 - 30 * index;

        const types = [createTree1, createTree2];
        const shuffled = types.sort(() => Math.random() - 0.5);

        const randOffset = () => (Math.random() * 10 - 5);

        const baseZ1 = 25;
        const baseZ2 = -25;

        // ÁRVORE 1 
        if(index%2 == 0){
            shuffled[0](
            scene,
            baseX + randOffset(),
            2.5,
            baseZ1 + randOffset()
        );

        // ÁRVORE 2 
        shuffled[1](
            scene,
            baseX + randOffset(),
            2.5,
            baseZ2 + randOffset()
        );

        }
        
    }

    let blockConer = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    scene.add(blockConer);
    registerWallsForCollision(blockConer);
    debugShowBoundingBoxes(blockConer, scene);


    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 0)
            block = createBlock(1, "rgb(219, 96, 58)", "rgb(255,30,30)", 1, "rgb(255,255,255)", 2);
        else
            block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-180, 0, -30 - 30 * index);
        block.name = "block_vertical1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        if(index == 3){
            let tunnel = createTunnelWithHoles(scene, -180, 0, -120);
            tunnel.rotation.y = THREE.MathUtils.degToRad(90);
        }
    }

    let blockConer2 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)", 2, "rgb(255,30,30)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer2.position.set(-180, 0, -270);
    blockConer2.name = "block_coner2";
    scene.add(blockConer2);
    registerWallsForCollision(blockConer2);
    debugShowBoundingBoxes(blockConer2, scene);


    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 0)
            block = createBlock(1, "rgb(219, 96, 58)", "rgb(255,30,30)", 1, "rgb(255,255,255)", 2);
        else
            block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.rotateZ(THREE.MathUtils.degToRad(270));
        block.position.set(-150 + 30 * index, 0, -270);
        block.name = "block_horizontal2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        // posição base em X
        
            const baseX = -150 + 30 * index;
            

            // sorteia qual tipo vai usar +25 ou -25
            const types = [createTree1, createTree2];
            const shuffled = types.sort(() => Math.random() - 0.5);

            // gera offset de -5 a +5
            const randOffset = () => (Math.random() * 10 - 5);

            // posição base do Z (pode ser +25 ou -25 conforme sorte)
            const baseZ1 = -295;
            const baseZ2 = -245;
            
            if(index%2 == 0 || index == 1){
                // --- ÁRVORE 1 ---
            shuffled[0](
                scene,
                baseX + randOffset(),
                2.5,
                baseZ1 + randOffset()
                
            );
            // --- ÁRVORE 2 ---
            shuffled[1](
                scene,
                baseX + randOffset(),
                2.5,
                baseZ2 + randOffset()
            );

            
            
        }
    }

    let blockConer3 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)");
    blockConer3.rotateZ(THREE.MathUtils.degToRad(0));
    blockConer3.position.set(90, 0, -270);
    blockConer3.name = "block_coner3";
    scene.add(blockConer3);
    registerWallsForCollision(blockConer3);
    debugShowBoundingBoxes(blockConer3, scene);


    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 0)
            block = createBlock(1, "rgb(219, 96, 58)", "rgb(255,30,30)", 1, "rgb(255,255,255)", 2);
        else
            block = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
        block.position.set(90, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        if(index != 0 && index != 7){
            const baseX1 = 115;
            const baseX2 = 65;
            

            // sorteia qual tipo vai usar +25 ou -25
            const types = [createTree1, createTree2];
            const shuffled = types.sort(() => Math.random() - 0.5);

            // gera offset de -5 a +5
            const randOffset = () => (Math.random() * 10 - 5);

            // posição base do Z (pode ser +25 ou -25 conforme sorte)
            const baseZ = -240 + 30 * index;
            
            // --- ÁRVORE 1 ---
            shuffled[0](
                scene,
                baseX1 + randOffset(),
                2.5,
                baseZ + randOffset()
                
            );
            // --- ÁRVORE 2 ---
            shuffled[1](
                scene,
                baseX2 + randOffset(),
                2.5,
                baseZ + randOffset()
            );
        }

    }

    let blockConer4 = createBlock(2, "rgb(100,100,100)", "rgb(255,30,30)", 2, "rgb(255,30,30)");
    blockConer4.rotateZ(THREE.MathUtils.degToRad(-90));
    blockConer4.position.set(90, 0, 0);
    blockConer4.name = "block_coner4";
    scene.add(blockConer4);
    registerWallsForCollision(blockConer4);
    debugShowBoundingBoxes(blockConer4, scene);

}

// Cria a segunda pista
export function createTrack2(scene) {
    pista_atual = 2;

    createGround(scene, 'rgb(246, 255, 160)', "areaExterna_pista2");
    
    createSky(scene);

    createTrack2_objects(scene);

    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 2)
            block = createBlock(1, "rgba(250, 250, 250, 1)", "rgb(255,165,0)", 1, "rgb(255,255,255)", 1);
        else
            block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(90));
        block.position.set(60 - 30 * index, 0, 0);
        block.name = "block_horizontal1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        // posição base em X
        const baseX = 60 - 30 * index;

        // sorteia qual tipo vai usar +25 ou -25
        const baseZ1 = 35;
        const baseZ2 = -35;
        
        createTree2(scene, baseX, 2.5, baseZ1);
        if(index != 7)
            createTree1(scene, baseX, 2.5, baseZ2);
    }

    let blockConer = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-180, 0, 0);
    blockConer.name = "block_coner1";
    scene.add(blockConer);
    registerWallsForCollision(blockConer);
    debugShowBoundingBoxes(blockConer, scene);


    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 0)
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)", 1, "rgb(255,255,255)", 2);
        else
            block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-180, 0, -30 - 30 * index);
        block.name = "block_vertical1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        if(index != 0){
            const baseX1 = -215;
            const baseX2 = -145;

            // posição base do Z (pode ser +25 ou -25 conforme sorte)
            const baseZ = -30 - 30 * index;
            
            createTree2(scene, baseX1, 2.5, baseZ);
            if(index != 7){
                createTree1(scene, baseX2, 2.5, baseZ);
            }
            else if(index == 7){
                createTree2(scene, baseX1, 2.5, -30);
                createTree2(scene, baseX1, 2.5, 0);
            }

            
        }
    }

    let blockConer2 = createBlock(2, "rgb(190,190,190)", "rgb(255,165,0)", 2, "rgb(255,165,0)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer2.position.set(-180, 0, -270);
    blockConer2.name = "block_coner2";
    scene.add(blockConer2);
    registerWallsForCollision(blockConer2);
    debugShowBoundingBoxes(blockConer2, scene);


    for (let index = 0; index < 4; index++) {
        let block;
        if(index == 0)
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)", 1, "rgb(255,255,255)", 2);
        else
            block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
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
        let block;
        if(index == 0)
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)", 1, "rgb(255,255,255)", 2);
        else
            block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
        block.position.set(-30, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);
        if(index == 1){
            let tunnel = createTunnelWithHoles(scene, -30, 0, -240 + 30 * index + 15);
            tunnel.rotation.y = THREE.MathUtils.degToRad(90);
        }

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
        let block;
        if(index == 0)
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)", 1, "rgb(255,255,255)", 2);
        else
            block = createBlock(1, "rgb(190,190,190)", "rgb(255,165,0)");
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

// Cria a terceira pista
export function createTrack3(scene) {
    pista_atual = 3;

    createGround(scene, 'rgb(164, 27, 255)', "areaExterna_pista3");
    
    createSky(scene);

    createTrack3_objects(scene);

    for (let index = 0; index < 3; index++) {
        let block
        if(index == 0)
            block = createBlock(1, "rgba(255, 255, 255, 1)", "rgb(100,30,255)", 1, "rgb(255,255,255)", 1);
        else
            block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
        block.rotateZ(THREE.MathUtils.degToRad(90));
        block.position.set(-30 * index, 0, 0);
        block.name = "block_horizontal1_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);
        
        const baseX = -30 * index;

        // sorteia qual tipo vai usar +25 ou -25
        const types = [createTree1, createTree2];
        const shuffled = types.sort(() => Math.random() - 0.5);

        // gera offset de -5 a +5
        const randOffset = () => (Math.random() * 10 - 5);

        // posição base do Z (pode ser +25 ou -25 conforme sorte)
        const baseZ1 = -25
        const baseZ2 = 25;
        
        // --- ÁRVORE 1 ---
        shuffled[0](
            scene,
            baseX + randOffset(),
            2.5,
            baseZ1 + randOffset()
            
        );
        // --- ÁRVORE 2 ---
        shuffled[1](
            scene,
            baseX + randOffset(),
            2.5,
            baseZ2 + randOffset()
            
        );
    }

    let blockConer = createBlock(2, "rgb(200,100,100)", "rgb(100,30,255)");
    blockConer.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer.position.set(-90, 0, 0);
    blockConer.name = "block_coner1";
    scene.add(blockConer);
    registerWallsForCollision(blockConer);
    debugShowBoundingBoxes(blockConer, scene);


    for (let index = 0; index < 5; index++) {
        if(index == 4){
            // lembrar de colocar um 3 tipo de bloco aqui depois
           let block = createBlock(3, "rgb(200,100,100)", "rgb(100,30,255)");
           block.position.set(-90, 0, -30 - 30 * index);
           scene.add(block);
           registerWallsForCollision(block);
           debugShowBoundingBoxes(block, scene);
        }
        else{
            let block;
            if(index == 0)
                block = createBlock(1, "rgba(187, 173, 173, 1)", "rgb(100,30,255)", 1, "rgb(255,255,255)", 2);
            else
                block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
            block.rotateZ(THREE.MathUtils.degToRad(180));
            block.position.set(-90, 0, -30 - 30 * index);
            block.name = "block_vertical1_" + index;
            scene.add(block);
            registerWallsForCollision(block);
            debugShowBoundingBoxes(block, scene);
            if(index != 0){
                const baseX1 = -115;
                const baseX2 = -65;

                // sorteia qual tipo vai usar +25 ou -25
                const types = [createTree1, createTree2];
                const shuffled = types.sort(() => Math.random() - 0.5);

                // gera offset de -5 a +5
                const randOffset = () => (Math.random() * 10 - 5);

                // posição base do Z (pode ser +25 ou -25 conforme sorte)
                const baseZ = -30 - 30 * index;
                
                // --- ÁRVORE 1 ---
                shuffled[0](
                    scene,
                    baseX1 + randOffset(),
                    2.5,
                    baseZ + randOffset()
                    
                );
                // --- ÁRVORE 2 ---
                shuffled[1](
                    scene,
                    baseX2 + randOffset(),
                    2.5,
                    baseZ + randOffset()
                    
                );
            }
        }
    }

    for (let index = 0; index < 3; index++) {
            let block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
            block.rotateZ(THREE.MathUtils.degToRad(0));
            block.position.set(-90, 0, -180 - 30 * index);
            block.name = "block_vertical1_" + index;
            scene.add(block);
            registerWallsForCollision(block);
            debugShowBoundingBoxes(block, scene);

            
            const baseX1 = -115;
            const baseX2 = -65;

            // sorteia qual tipo vai usar +25 ou -25
            const types = [createTree1, createTree2];
            const shuffled = types.sort(() => Math.random() - 0.5);

            // gera offset de -5 a +5
            const randOffset = () => (Math.random() * 10 - 5);

            // posição base do Z (pode ser +25 ou -25 conforme sorte)
            const baseZ = -180 - 30 * index;
            
            // --- ÁRVORE 1 ---
            shuffled[0](
                scene,
                baseX1 + randOffset(),
                2.5,
                baseZ + randOffset()
                
            );
            // --- ÁRVORE 2 ---
            shuffled[1](
                scene,
                baseX2 + randOffset(),
                2.5,
                baseZ + randOffset()
                
            );
            

    }

    let blockConer2 = createBlock(2, "rgb(200,100,100)", "rgb(100,30,255)", 1, "rgb(255,255,255)");
    blockConer2.rotateZ(THREE.MathUtils.degToRad(0));
    blockConer2.position.set(-90, 0, -270);
    blockConer2.name = "block_coner2";
    scene.add(blockConer2);
    registerWallsForCollision(blockConer2);
    debugShowBoundingBoxes(blockConer2, scene);


    for (let index = 0; index < 3; index++) {
        let block;
            if(index == 0)
                block = createBlock(1, "rgba(187, 173, 173, 1)", "rgb(100,30,255)", 1, "rgb(255,255,255)", 2);
            else
                block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
        block.rotateZ(THREE.MathUtils.degToRad(270));
        block.position.set(-120 - 30 * index, 0, -270);
        block.name = "block_horizontal2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        if(index == 1){
            const baseX = -120 - 30 * index;

            // sorteia qual tipo vai usar +25 ou -25
            const types = [createTree1, createTree2];
            const shuffled = types.sort(() => Math.random() - 0.5);

            // gera offset de -5 a +5
            const randOffset = () => (Math.random() * 10 - 5);

            // posição base do Z (pode ser +25 ou -25 conforme sorte)
            const baseZ1 = -295;
            const baseZ2 = -245;

            
            // --- ÁRVORE 1 ---
            shuffled[0](
                scene,
                baseX + randOffset(),
                2.5,
                baseZ1 + randOffset()
                
            );
            // --- ÁRVORE 2 ---
            shuffled[1](
                scene,
                baseX + randOffset(),
                2.5,
                baseZ2 + randOffset()
                
            );
        }

    }

    let blockConer3 = createBlock(2, "rgb(200,100,100)", "rgb(100,30,255)", 2, "rgb(100,30,255)");
    blockConer3.rotateZ(THREE.MathUtils.degToRad(90));
    blockConer3.position.set(-210, 0, -270);
    blockConer3.name = "block_coner3";
    scene.add(blockConer3);
    registerWallsForCollision(blockConer3);
    debugShowBoundingBoxes(blockConer3, scene);


    for (let index = 0; index < 3; index++) {
        let block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
        block.rotateZ(THREE.MathUtils.degToRad(180));
        block.position.set(-210, 0, -240 + 30 * index);
        block.name = "block_vertical2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        if(index == 1) {
            let tunnel = createTunnelWithHoles(scene, -210, 0, -240 + 30 * index);
            tunnel.rotation.y = THREE.MathUtils.degToRad(90);
        }
    }

    let blockConer4 = createBlock(2, "rgb(200,100,100)", "rgb(100,30,255)", 1);
    blockConer4.rotateZ(THREE.MathUtils.degToRad(180));
    blockConer4.position.set(-210, 0, -150);
    blockConer4.name = "block_coner4";
    scene.add(blockConer4);
    registerWallsForCollision(blockConer4);
    debugShowBoundingBoxes(blockConer4, scene);

    for (let index = 0; index < 3; index++) {
        let block;
            if(index == 0)
                block = createBlock(1, "rgba(187, 173, 173, 1)", "rgb(100,30,255)", 1, "rgb(255,255,255)", 2);
            else
                block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
        block.rotateZ(THREE.MathUtils.degToRad(90));
        block.position.set(-180 + 30 * index, 0, -150);
        block.name = "block_vertical2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        if(index == 1){
            const baseX = -180 + 30 * index;

            // sorteia qual tipo vai usar +25 ou -25
            const types = [createTree1, createTree2];
            const shuffled = types.sort(() => Math.random() - 0.5);

            // gera offset de -5 a +5
            const randOffset = () => (Math.random() * 10 - 5);

            // posição base do Z (pode ser +25 ou -25 conforme sorte)
            const baseZ1 = -175;
            const baseZ2 = -125;

            
            // --- ÁRVORE 1 ---
            shuffled[0](
                scene,
                baseX + randOffset(),
                2.5,
                baseZ1 + randOffset()
                
            );
            // --- ÁRVORE 2 ---
            shuffled[1](
                scene,
                baseX + randOffset(),
                2.5,
                baseZ2 + randOffset()
                
            );
        }
    }

    for (let index = 0; index < 3; index++) {
        if(index == 0){
            let block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
            block.rotateZ(THREE.MathUtils.degToRad(270));
            block.position.set(-60 + 30 * index, 0, -150);
            block.name = "block_vertical2_jumpPort" + index;
            
            const cubeGeometry = new THREE.BoxGeometry(8, 5, 0.5);
            const material = setDefaultMaterial("rgba(15, 228, 199, 1)", null);
            const caixa = new THREE.Mesh(cubeGeometry, material);
            caixa.receiveShadow = true;
            caixa.castShadow = true;
            caixa.name = "jumpPort";

            block.add(caixa);
            caixa.position.set(-5.5, 12.5, 0.25);
            block.updateWorldMatrix(true, true);
            const box = new THREE.Box3().setFromObject(caixa);
            const obb = new OBB().fromBox3(box);

            caixa.userData.boundingBox = box;
            caixa.userData.obb = obb;

            scene.add(block);
            registerWallsForCollision(block);
            debugShowBoundingBoxes(block, scene);
        }
        else if(index != 1){
            let block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
            block.rotateZ(THREE.MathUtils.degToRad(270));
            block.position.set(-60 + 30 * index, 0, -150);
            block.name = "block_vertical2_" + index;
            scene.add(block);
            registerWallsForCollision(block);
            debugShowBoundingBoxes(block, scene);
        }
        if(index != 0){
            const baseX = -60 + 30 * index;

            // sorteia qual tipo vai usar +25 ou -25
            const types = [createTree1, createTree2];
            const shuffled = types.sort(() => Math.random() - 0.5);

            // gera offset de -5 a +5
            const randOffset = () => (Math.random() * 10 - 5);

            // posição base do Z (pode ser +25 ou -25 conforme sorte)
            const baseZ1 = -125;
            const baseZ2 = -175;

            // --- ÁRVORE 1 ---
            shuffled[0](
                scene,
                baseX + randOffset(),
                2.5,
                baseZ1 + randOffset()
            );

            // --- ÁRVORE 2 ---
            shuffled[1](
                scene,
                baseX + randOffset(),
                2.5,
                baseZ2 + randOffset()
            );
        }
    }
    
    let blockConer5 = createBlock(2, "rgb(200,100,100)", "rgb(100,30,255)", 1, "rgb(255,255,255)");
    blockConer5.rotateZ(THREE.MathUtils.degToRad(0));
    blockConer5.position.set(30, 0, -150);
    blockConer5.name = "block_coner4";
    scene.add(blockConer5);
    registerWallsForCollision(blockConer5);
    debugShowBoundingBoxes(blockConer5, scene);

    for (let index = 0; index < 4; index++) {
        let block;
            if(index == 0)
                block = createBlock(1, "rgba(187, 173, 173, 1)", "rgb(100,30,255)", 1, "rgb(255,255,255)", 2);
            else
                block = createBlock(1, "rgb(200,100,100)", "rgb(100,30,255)");
        block.position.set(30, 0, -120 + 30 * index);
        block.name = "block_vertical2_" + index;
        scene.add(block);
        registerWallsForCollision(block);
        debugShowBoundingBoxes(block, scene);

        if(index != 0 && index != 3){
            const baseX1 = 5;
            const baseX2 = 55;


            // sorteia qual tipo vai usar +25 ou -25
            const types = [createTree1, createTree2];
            const shuffled = types.sort(() => Math.random() - 0.5);

            // gera offset de -5 a +5
            const randOffset = () => (Math.random() * 10 - 5);

            // posição base do Z (pode ser +25 ou -25 conforme sorte)
            const baseZ = -120 + 30 * index;

            // --- ÁRVORE 1 ---
            shuffled[0](
                scene,
                baseX1 + randOffset(),
                2.5,
                baseZ + randOffset()
            );

            // --- ÁRVORE 2 ---
            shuffled[1](
                scene,
                baseX2 + randOffset(),
                2.5,
                baseZ + randOffset()
            );

        }
        
    }

    let blockConer6 = createBlock(2, "rgb(200,100,100)", "rgb(100,30,255)", 2, "rgb(100,30,255)");
    blockConer6.rotateZ(THREE.MathUtils.degToRad(-90));
    blockConer6.position.set(30, 0, 0);
    blockConer6.name = "block_coner4";
    scene.add(blockConer6);
    registerWallsForCollision(blockConer6);
    debugShowBoundingBoxes(blockConer6, scene);

    
}

/*Objetos independnetes adicionados ao cenário*/
function createTunnelWithHoles(scene, x, y, z) {

    const tunnelGeom = new THREE.CylinderGeometry(20, 20, 90, 16, 1);
    const tunnelMat = new THREE.MeshStandardMaterial({
        color: 0x777777,
        side: THREE.DoubleSide
    });

    const tunnel = new THREE.Mesh(tunnelGeom, tunnelMat);
    tunnel.rotation.z = Math.PI / 2;
    tunnel.updateMatrixWorld(true);

    const tunnelGeom2 = new THREE.CylinderGeometry(19.5, 19.5, 90, 16, 1);
    const tunnelMat2 = new THREE.MeshStandardMaterial({
        color: 0x777777,
        side: THREE.DoubleSide
    });

    const tunnel2 = new THREE.Mesh(tunnelGeom2, tunnelMat2);
    tunnel2.rotation.z = Math.PI / 2;
    tunnel2.updateMatrixWorld(true);


    const holeCutters = [];
        for (let i = 0; i < 4; i++) {
            const cutter = new THREE.Mesh(
                new THREE.CylinderGeometry(6, 6, 40, 32)
            );

            cutter.position.set(
                -37.5 + i * 25,
                0,
                0
            );

            cutter.updateMatrixWorld(true);
            holeCutters.push(cutter);
        }

    let csg = CSG.fromMesh(tunnel);
    let temp = CSG.fromMesh(tunnel2);
    
    for (const cutter of holeCutters) {
        csg = csg.subtract(CSG.fromMesh(cutter));
    }
    csg = csg.subtract(temp);

    const finalMesh = CSG.toMesh(csg, new THREE.Matrix4());
    finalMesh.material = tunnelMat;

    finalMesh.position.set(x, y, z);
    finalMesh.updateMatrixWorld(true);
    finalMesh.castShadow = true;

    const tex = texturas['tunnel'];
    finalMesh.material.map = tex;

    scene.add(finalMesh);
    return finalMesh;
}

function createGround(scene, color, tex_name) {

    const groundGeometry = new THREE.PlaneGeometry(1500, 1500);
    const groundMaterial = setDefaultMaterial(color); 
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    ground.position.y = -10; 
    ground.receiveShadow = true;
    ground.name = "ground";

    const floor = texturas[tex_name];
    ground.material.map = floor;
    scene.add(ground);
}

function createSky(scene) {
    scene.background = texturas['skybox']; 
}

function createTrack1_objects(scene){
    const towerWood = objetos3D['towerWood_pista1'].clone(true);
    scene.add(towerWood);
    towerWood.position.set(-130, -10, -50);

    const towerWood2 = objetos3D['towerWood_pista1'].clone(true);
    scene.add(towerWood2);
    towerWood2.position.set(40, -10, -50);

    const towerWood3 = objetos3D['towerWood_pista1'].clone(true);
    scene.add(towerWood3);
    towerWood3.position.set(40, -10, -220);
    towerWood3.rotateY(THREE.MathUtils.degToRad(180));

    const barril1 = objetos3D['barril_pista1'].clone(true);
    scene.add(barril1);
    barril1.position.set(60, -10, -40);

    const barril2 = objetos3D['barril_pista1'].clone(true);
    scene.add(barril2);
    barril2.position.set(-150, -10, -40);

    const barril3 = objetos3D['barril_pista1'].clone(true);
    scene.add(barril3);
    barril3.position.set(-10, -10, -220);
}

function createTrack2_objects(scene){
    // adicionadando os objetos 3d na pista
    const piramides1 = objetos3D['piramides_pista2_1'].clone(true);
    scene.add(piramides1);
    piramides1.position.set(-100, 17, -150);

    const piramides2 = objetos3D['piramides_pista2_2'].clone(true);
    scene.add(piramides2);
    piramides2.position.set(-90, 12, -100);
    piramides2.rotateY(THREE.MathUtils.degToRad(90));

    const piramides3 = objetos3D['piramides_pista2_3'].clone(true);
    scene.add(piramides3);
    piramides3.position.set(-80, 7, -190);
    piramides3.rotateY(THREE.MathUtils.degToRad(180));

    const maliTower = objetos3D['maliTower_pista2'].clone(true);
    scene.add(maliTower);
    maliTower.position.set(65, -10, -95);
    maliTower.rotateY(THREE.MathUtils.degToRad(-90));

    const maliTower2 = objetos3D['maliTower_pista2'].clone(true);
    scene.add(maliTower2);
    maliTower2.position.set(-155, -10, -25);
    maliTower2.rotateY(THREE.MathUtils.degToRad(90));

    const maliTower3 = objetos3D['maliTower_pista2'].clone(true);
    scene.add(maliTower3);
    maliTower3.position.set(-155, -10, -245);
}

function createTrack3_objects(scene){
    // adicionadando os objetos 3d na pista
    // spawnAranha(scene, new THREE.Vector3(-30, 0, 0));

    const pumpkin = objetos3D['pumpkin'].clone(true);
    scene.add(pumpkin);
    pumpkin.position.set(-102, -0.3, 11);
    pumpkin.rotateY(THREE.MathUtils.degToRad(230));

    const pumpkin2 = objetos3D['pumpkin'].clone(true);
    scene.add(pumpkin2);
    pumpkin2.position.set(-78, -0.3, -281);
    pumpkin2.rotateY(THREE.MathUtils.degToRad(50));

    const pumpkin3 = objetos3D['pumpkin'].clone(true);
    scene.add(pumpkin3);
    pumpkin3.position.set(42, -0.3, -162);
    pumpkin3.rotateY(THREE.MathUtils.degToRad(50));

    const wranglerman = objetos3D['wranglerman'].clone(true);
    scene.add(wranglerman);
    wranglerman.position.set(-30, -10, -50);
    wranglerman.rotateY(THREE.MathUtils.degToRad(50));

    const wranglerman2 = objetos3D['wranglerman'].clone(true);
    scene.add(wranglerman2);
    wranglerman2.position.set(-30, -10, -250);
    wranglerman2.rotateY(THREE.MathUtils.degToRad(20));

    const wranglerman3 = objetos3D['wranglerman'].clone(true);
    scene.add(wranglerman3);
    wranglerman3.position.set(-130, -10, -200);
    wranglerman3.rotateY(THREE.MathUtils.degToRad(100));

    // console.log(pumpkin);
}




function createTree1(scene, x, y, z){
    let cor1;
    let cor2;
    if(pista_atual == 1){
        cor1 = "rgb(148, 109, 1)";
        cor2 = "rgb(45, 191, 0)";
    }
    else if(pista_atual == 2){
        cor1 = "rgb(214, 183, 96)";
        cor2 = "rgb(138, 255, 103)";
    }
    else{
        cor1 = "rgb(126, 79, 229)";
        cor2 = "rgb(233, 179, 245)";
    }

    const troncoGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 18, 18);
    const troncoMaterial = setDefaultMaterial(cor1);

    const tronco = new THREE.Mesh(troncoGeometry, troncoMaterial);

    const copaGeometry = new THREE.IcosahedronGeometry(4);
    const copaMaterial = setDefaultMaterial(cor2);

    const copa = new THREE.Mesh(copaGeometry, copaMaterial);

    tronco.add(copa);
    copa.translateY(5);

    copa.receiveShadow = true;
    copa.castShadow = true;
    tronco.receiveShadow = true;
    tronco.castShadow = true;
    
    scene.add(tronco);
    tronco.position.set(x, y, z);
    tronco.position.y = -7;
}

function createTree2(scene, x, y, z){
    let cor1;
    let cor2;
    if(pista_atual == 1){
        cor1 = "rgb(110, 79, 0)";
        cor2 = "rgb(22, 86, 3)";
    }
    else if(pista_atual == 2){
        cor1 = "rgb(160, 130, 48)";
        cor2 = "rgb(40, 173, 0)";
    }
    else {
        cor1 = "rgb(17, 0, 87)";
        cor2 = "rgb(1, 246, 238))";
    }
    const troncoGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 18, 18);
    const troncoMaterial = setDefaultMaterial(cor1);

    const tronco = new THREE.Mesh(troncoGeometry, troncoMaterial);

    const copaGeometry = new THREE.ConeGeometry(3, 8, 8);
    const copaMaterial = setDefaultMaterial(cor2);

    const copa = new THREE.Mesh(copaGeometry, copaMaterial);
    // tronco.rotation.x = THREE.MathUtils.degToRad(-90);

    tronco.add(copa);
    copa.translateY(5);
    copa.receiveShadow = true;
    copa.castShadow = true;
    tronco.receiveShadow = true;
    tronco.castShadow = true;
    
    scene.add(tronco);
    tronco.position.set(x, y, z);
    tronco.position.y = -7;
}


// Cria os três tipos de blocos (piso + mureta):
// Primeiro ->  As muretas estão paralelas;
// Segundo -> As muretas estão adjacentes;
// Terceiro -> As muretas estão somente nos cantos;
// tipo_pista_largada_checkpoint -> 1 se for largada, 2 se for checkpoint
function createBlock(type, colorFloor, colorWall, type_pattern = 1, colorConer = "rgb(255,255,255)", tipo_pista_largada_checkpoint = 0) {
    let floor;

    if (type == 1) {
        floor = auxCreateBlock_parallel(colorFloor, colorWall, tipo_pista_largada_checkpoint);
        // console.log(tipo_pista_largada_checkpoint);
    }
    else if (type == 2) {
        floor = auxCreateBlock_Adjacent(colorFloor, colorWall, type_pattern, colorConer);

    }
    else if (type == 3) {
        floor = auxCreateBlock_Corners(colorFloor, colorWall);
    }
    else {
        console.log("algum erro aconteceu");
        return;
    }
    const cubeGeometry = new THREE.BoxGeometry(30, 30, 10);
    let tex;
    let tex2;
    let material;
    let material2;
    let color

    if(pista_atual == 1){
        tex = texturas['lateral1'];
        tex2 = texturas['lateral1.5'];
        color = "rgba(189, 188, 188, 1)";
        
    }
    else if(pista_atual == 2){
        tex = texturas['lateral2'];
        tex2 = texturas['lateral2.5'];
        color = "rgba(255, 255, 255, 1)";
    }
    else{
        tex = texturas['lateral3'];
        tex2 = texturas['lateral3.5'];
        color = "rgba(179, 91, 226, 1)";
    }

    material = new THREE.MeshBasicMaterial({ map: tex, color:color});
    material2 = new THREE.MeshBasicMaterial({ map: tex2, color:color});
    const materialCube = [
        material,
        material,
        material2,
        material2,
        null,
        null
    ];
    const caixa = new THREE.Mesh(cubeGeometry, materialCube);
    caixa.receiveShadow = true;
    caixa.castShadow = true;
    caixa.position.set(0, 0, -5.5);
    floor.add(caixa);
    return floor;
}

// Função auxiliar para criar o tipo de bloco paralelo
function auxCreateBlock_parallel(colorFloor, colorWall, tipo_pista_largada_checkpoint) {

    const floor = createFloor(colorFloor, tipo_pista_largada_checkpoint);

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
function auxCreateBlock_Adjacent(colorFloor, colorWall, type_pattern = 1, colorConer = "rgb(255,255,255)") {

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

// Função auxiliar para criar o tipo de bloco mureta
function auxCreateBlock_Corners(colorFloor, colorWall) {

    const floor = createFloor(colorFloor);

    const wallConer = createWall(colorWall);
    wallConer.name = "conerWall1";
    floor.add(wallConer);
    wallConer.position.set(-12.5, -12.5, 0.5);

    const wallConer2 = createWall(colorWall);
    wallConer2.name = "conerWall2";
    floor.add(wallConer2);
    wallConer2.position.set(-12.5, 12.5, 0.5);

    const wallConer3 = createWall(colorWall);
    wallConer3.name = "conerWall3";
    floor.add(wallConer3);
    wallConer3.position.set(12.5, -12.5, 0.5);

    const wallConer4 = createWall(colorWall);
    wallConer4.name = "conerWall4";
    floor.add(wallConer4);
    wallConer4.position.set(12.5, 12.5, 0.5);
    
    return floor;
}

// Cria um piso
function createFloor(color, tipo_pista_largada_checkpoint) {
    const geometry = new THREE.PlaneGeometry(30, 30);
    const material = setDefaultMaterial(color, null);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = THREE.MathUtils.degToRad(-90);
    plane.receiveShadow = true;

    let tex;

    if(tipo_pista_largada_checkpoint == 1)
        tex = texturas['piso_largada'];
    else if(tipo_pista_largada_checkpoint == 2)
        tex = texturas['piso_checkpoint'];
    else
        tex = texturas['piso'];
    plane.material.map = tex;

    return plane;
}

// Cria uma mureta
function createWall(color) {
    let tex;
    let tex2;

    if(pista_atual == 1)
        tex = texturas['mureta1'];        

    else if(pista_atual == 2){
        tex = texturas['mureta2'];
        tex2 = texturas['mureta2.5'];

    }

    else
        tex = texturas['mureta3'];

    const material = new THREE.MeshBasicMaterial({ map: tex, color:color});

    let material2;
    if(pista_atual == 2)
        material2 = new THREE.MeshBasicMaterial({ map: tex2, color:color});
    else
        material2 = material;
    const materialCube = [
        material2,
        material2,
        material2,
        material2,
        material,
        material2
    ];
    

    const cubeGeometry = new THREE.BoxGeometry(5, 5, 2);
    const cube = new THREE.Mesh(cubeGeometry, materialCube);
    cube.receiveShadow = true;
    cube.castShadow = true;
    
    return cube;
}

// Função para registrar as colisões das muretas de um bloco
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
//   block.traverse(child => {
//     if (child.userData && child.userData.obb && child.geometry) {
//       // create a helper and store it so we can update later
//       const helper = createOBBHelper(child.userData.obb);
//       scene.add(helper);
//       child.userData._bbHelper = helper;
//     //   addWallNormalHelper(child, scene, 5, 0x00ff00);
//     }
//   });
  
}

function addWallNormalHelper(wallMesh, scene, length = 2, color = 0xff0000) {
    // Normal of a plane in local space (pointing +Z in this case)
    const localNormal = new THREE.Vector3(0, -1, 0);

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
    scene.add(arrowHelper);

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
