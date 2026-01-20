import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
import { CollisionSystem } from './CollisionSystem.js';
import {OBB} from "./OBB.js";
import {createOBBHelper} from "../utils.js";
import { CSG } from "../../libs/other/CSGMesh.js";
import { MeshBasicMaterial } from '../../build/three.core.js';
// import { texturas } from '../main.js';
import { texturas } from '../basicScene.js';


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

    createGround(scene, 'rgb(51, 255, 51)', "areaExterna_pista1");
    
    createSky(scene);

    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 0)
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,30,30)");
        else if(index == 2)
            block = createBlock(1, "rgba(108, 20, 20, 1)", "rgb(255,30,30)");
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
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,30,30)");
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
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,30,30)");
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
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,30,30)");
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
    createGround(scene, 'rgb(246, 255, 160)', "areaExterna_pista2");
    
    createSky(scene);


    for (let index = 0; index < 8; index++) {
        let block;
        if(index == 2)
            block = createBlock(1, "rgba(108, 20, 20, 1)", "rgb(255,165,0)");
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
        const types = [createTree1, createTree2];
        const shuffled = types.sort(() => Math.random() - 0.5);

        // gera offset de -5 a +5
        const randOffset = () => (Math.random() * 10 - 5);

        // posição base do Z (pode ser +25 ou -25 conforme sorte)
        const baseZ1 = 25;
        const baseZ2 = -25;

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
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)");
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
            const baseX2 = -155;

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
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)");
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
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)");
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
            block = createBlock(1, "rgba(192, 90, 0, 1)", "rgb(255,165,0)");
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

    createGround(scene, 'rgb(164, 27, 255)', "areaExterna_pista3");
    
    createSky(scene);

    for (let index = 0; index < 3; index++) {
        let block
        if(index == 0)
            block = createBlock(1, "rgba(108, 20, 20, 1)", "rgb(100,30,255)");
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
                block = createBlock(1, "rgba(187, 173, 173, 1)", "rgb(100,30,255)");
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
                block = createBlock(1, "rgba(187, 173, 173, 1)", "rgb(100,30,255)");
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
                block = createBlock(1, "rgba(187, 173, 173, 1)", "rgb(100,30,255)");
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
                block = createBlock(1, "rgba(187, 173, 173, 1)", "rgb(100,30,255)");
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

function createTree1(scene, x, y, z){
    const troncoGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 18, 18);
    const troncoMaterial = setDefaultMaterial("rgba(139, 69, 19, 1)");

    const tronco = new THREE.Mesh(troncoGeometry, troncoMaterial);

    const copaGeometry = new THREE.IcosahedronGeometry(4);
    const copaMaterial = setDefaultMaterial("rgba(70, 214, 77, 1)");

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
    const troncoGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 18, 18);
    const troncoMaterial = setDefaultMaterial("rgba(139, 69, 19, 1)");

    const tronco = new THREE.Mesh(troncoGeometry, troncoMaterial);

    const copaGeometry = new THREE.ConeGeometry(3, 8, 8);
    const copaMaterial = setDefaultMaterial("rgba(4, 104, 9, 1)");

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
function createBlock(type, colorFloor, colorWall, type_pattern = 1, colorConer = "rgb(255,255,255)") {
    let floor;
    if (type == 1) {
        floor = auxCreateBlock_parallel(colorFloor, colorWall);
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
    const tex = texturas['lateral1'];
    const material = new THREE.MeshBasicMaterial({ map: tex, color:"rgb(100, 100, 100)"});
    const materialCube = [
        material,
        material,
        material,
        null,
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
function createFloor(color) {
    const geometry = new THREE.PlaneGeometry(30, 30);
    const material = setDefaultMaterial(color, null);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = THREE.MathUtils.degToRad(-90);
    plane.receiveShadow = true;

    const tex = texturas['piso'];
    plane.material.map = tex;

    return plane;
}

// Cria uma mureta
function createWall(color) {
    const cubeGeometry = new THREE.BoxGeometry(5, 5, 2);
    const material = setDefaultMaterial(color, null);
    const cube = new THREE.Mesh(cubeGeometry, material);
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
  block.traverse(child => {
    if (child.userData && child.userData.obb && child.geometry) {
      // create a helper and store it so we can update later
      const helper = createOBBHelper(child.userData.obb);
      scene.add(helper);
      child.userData._bbHelper = helper;
    //   addWallNormalHelper(child, scene, 5, 0x00ff00);
    }
  });
  
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
