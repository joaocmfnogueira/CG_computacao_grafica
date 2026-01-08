import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
import {OBB} from "./OBB.js";
import {createOBBHelper, updateOBBHelper} from "../utils.js";
import { WaypointFollower } from './WaypointFollower.js';
// criar carro do jogador
export function createHavac(scene) {    
    // Materiais
    const materialBase = setDefaultMaterial("rgba(235, 126, 211, 1)"); 
    const materialBody = new THREE.MeshPhongMaterial(({ 
        color: "rgba(136, 83, 167, 1)",
        flatShading: false,
        shininess: "100",
        specular: "rgb(255,255,255)" }));
    // const materialBody = setDefaultMaterial("rgba(136, 83, 167, 1)");
    const materialAntenna = setDefaultMaterial("rgba(136, 83, 167, 1)");

    // Base
    const base = createBase(materialBase);
    const antenna = createAntenna(materialAntenna, "rgba(235, 126, 211, 1)");
    const body = createBody(materialBody)

    base.scale.set(1,1,1);

    body.add(antenna);
    body.scale.set(1,1,1);
    base.add(body);


    base.name = "veiculo_principal";
    // body.castShadow = true;
    // body.receiveShadow = true;
    // base.castShadow = true;
    // base.receiveShadow = true;
    // antenna.castShadow = true;
    // antenna.receiveShadow = true;


    // base.translateY(-0.5);
    scene.add(base);

    base.userData.boundingBox = new THREE.Box3().setFromObject(base);
    const obb = new OBB().fromBox3(base.userData.boundingBox);
    base.userData.obb = obb;

    const obbHelper = createOBBHelper(base.userData.obb, "rgb(255, 255, 255)");

    // impedir do helper desaparecer depois de um tempo
    obbHelper.frustumCulled = false;

    obbHelper.name = "obbHelper";
    obbHelper.visible = false;
    scene.add(obbHelper);

    // Constantes temporarias 
    const tempMat4 = new THREE.Matrix4();
    const tempMat3 = new THREE.Matrix3();

    base.userData.updateOBB = function() {
        base.updateMatrixWorld(true);

        const mw = base.matrixWorld;

        // Atualiza o centro
        base.userData.obb.center.setFromMatrixPosition(mw);

        // Obtem a rotação
        tempMat4.extractRotation(mw);           
        tempMat3.setFromMatrix4(tempMat4); 

        base.userData.obb.rotation.copy(tempMat3);

        // Atualiza o helper
        // updateOBBHelper(base.userData.obb, obbHelper);
    };
}

let tracks = {
  "Primeiro" : [
    new THREE.Vector3(-180, 0,   0),
    new THREE.Vector3(-180, 0, -270),
    new THREE.Vector3(  90, 0, -270),
    new THREE.Vector3(  90, 0,   0)
  ],

  "Segundo" : [
    new THREE.Vector3(-180, 0,    0),
    new THREE.Vector3(-180, 0, -270),
    new THREE.Vector3( -30, 0, -270),
    new THREE.Vector3( -30, 0, -120),
    new THREE.Vector3(  90, 0, -120),
    new THREE.Vector3(  90, 0,    0)
  ],

  "Terceiro" : [
    new THREE.Vector3(-90,  0,   0),
    new THREE.Vector3(-90,  0, -270),
    new THREE.Vector3(-210, 0, -270),
    new THREE.Vector3(-210, 0, -150),
    new THREE.Vector3(  30, 0, -150),
    new THREE.Vector3(  30, 0,    0)
  ]
};

// criar carro dos inimigos
export function createHavacEnemy(scene, colorBase, colorBody, colorAntenna, id, tracksNumber = "Primeiro"){

    const materialBase = setDefaultMaterial(colorBase); 
    const materialBody = new THREE.MeshPhongMaterial(({ 
        color: colorBody,
        flatShading: false,
        shininess: "100",
        specular: "rgb(255,255,255)" }));
    // const materialBody = setDefaultMaterial("rgba(136, 83, 167, 1)");
    const materialAntenna = setDefaultMaterial(colorAntenna);
    const base = createBase(materialBase);
    const antenna = createAntenna(materialAntenna, colorBase);
    antenna.castShadow = true;
    const body = createBody(materialBody)

    base.scale.set(1,1,1);

    body.add(antenna);
    body.scale.set(1,1,1);
    base.add(body);


    base.name = "veiculo_inimigo_" + id;
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);
    if(id == 0){
        base.position.x = 7.8;
        base.position.z = -7.8;
    }
    if(id == 1){
        base.position.x = 3.9;
        base.position.z = -3.9;
    }
    if(id == 2){
        base.position.x =  -3.9;
        base.position.z =  3.9;
    }
        
    if(id == 3){
        base.position.x =  -7.8;
        base.position.z =  7.8;
    }
        
    base.userData.boundingBox = new THREE.Box3().setFromObject(base);
    const obb = new OBB().fromBox3(base.userData.boundingBox);
    base.userData.obb = obb;

    const obbHelper = createOBBHelper(base.userData.obb, "rgb(255, 255, 255)");

    // impedir do helper desaparecer depois de um tempo
    obbHelper.frustumCulled = false;

    obbHelper.name = "obbHelper";
    obbHelper.visible = false;
    scene.add(obbHelper);

    // Constantes temporarias 
    const tempMat4 = new THREE.Matrix4();
    const tempMat3 = new THREE.Matrix3();
    
    // Criando um waypointFolower
    const follower = new WaypointFollower(base, tracks[tracksNumber], 20, 5);
    base.userData.follower = follower;

    base.name = "enemy" + id;

    base.userData.updateOBB = function() {
        base.updateMatrixWorld(true);

        const mw = base.matrixWorld;

        // Atualiza o centro
        base.userData.obb.center.setFromMatrixPosition(mw);

        // Obtem a rotação
        tempMat4.extractRotation(mw);           
        tempMat3.setFromMatrix4(tempMat4); 

        base.userData.obb.rotation.copy(tempMat3);

        // Atualiza o helper
        updateOBBHelper(base.userData.obb, obbHelper);
    };
    return base;
}


function createBase(materialBase){
    function createCapsule(height){
        const baseGeom = new THREE.CapsuleGeometry(0.25, height);
        const base = new THREE.Mesh(baseGeom, materialBase);
        base.rotateZ(THREE.MathUtils.degToRad(90));
        base.castShadow = true;
        base.receiveShadow = true;
        return base;
    }

    function create_base_back(){
        const boxGeo = new THREE.BoxGeometry(5, 0.5, 3);
        const box = new THREE.Mesh(boxGeo, materialBase);
        box.position.y = 0.25;
        box.receiveShadow = true;
        box.castShadow = true;

        const capsule1 = createCapsule(5);
        capsule1.position.y = 0;
        capsule1.position.z = -1.5;
        capsule1.receiveShadow = true;
        capsule1.castShadow = true;

        const capsule2 = createCapsule(5);
        capsule2.position.y = 0;
        capsule2.position.z = 1.5;
        capsule2.receiveShadow = true;
        capsule2.castShadow = true;

        const capsule3 = createCapsule(3)
        capsule3.position.x = 2.5;
        capsule3.rotation.y = THREE.MathUtils.degToRad(90);
        capsule3.receiveShadow = true;
        capsule3.castShadow = true;

        box.add(capsule1);
        box.add(capsule2);
        box.add(capsule3);
        return box;
    }

    function create_base_front(){
        const geometry = new THREE.TorusGeometry( 1.5, 0.25, 16, 100, Math.PI); 
        const front = new THREE.Mesh( geometry, materialBase );
        front.rotateZ(THREE.MathUtils.degToRad(90));
        front.rotateY(THREE.MathUtils.degToRad(90));
        front.receiveShadow = true;
        front.castShadow = true;

        const geometry2 = new THREE.CylinderGeometry( 1.5, 1.5, 0.5, 100); 
        const cylinder = new THREE.Mesh( geometry2, materialBase );
        // cylinder.rotateZ(THREE.MathUtils.degToRad(90));
        cylinder.rotateX(THREE.MathUtils.degToRad(90));
        cylinder.receiveShadow = true;
        cylinder.castShadow = true;

        front.add(cylinder);

        return front;
    }

    const back = create_base_back();

    const front = create_base_front();
        front.position.x = -2.5;
    
    back.add(front);
    return back;
}

function createBody(materialBody){
    function create_base_back(){
        const boxGeo = new THREE.BoxGeometry(5, 0.3, 3);
        const box = new THREE.Mesh(boxGeo, materialBody);
        box.receiveShadow = true;
        box.castShadow = true;
        return box;
    }

    function create_base_front(){

        const geometry2 = new THREE.CylinderGeometry( 1.5, 1.5, 0.3, 100); 
        const cylinder = new THREE.Mesh( geometry2, materialBody );
        // cylinder.rotateZ(THREE.MathUtils.degToRad(90));
        // cylinder.rotateX(THREE.MathUtils.degToRad(90));
        cylinder.receiveShadow = true;
        cylinder.castShadow = true;
        return cylinder;
    }

    function create_head(){
        
        const geometry = new THREE.SphereGeometry(1, 64, 64, 0, Math.PI);
        const material = materialBody;
        const mesh = new THREE.Mesh( geometry, material ) ;
        mesh.rotateX(-Math.PI/2);
        // mesh.position.x = 3;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        return mesh
    }

    const back = create_base_back();

    const front = create_base_front();
        front.position.x = -2.5;

    const head = create_head();
    head.scale.set(2,1.25,1.2);
    head.position.x = -1;
        // head.position.x = -2;
        // head.position.y = 0.1;
        // head.position.z = -0.7;

    back.add(front);
    back.position.y = 0.2;
    back.position.x = 0.1;

    back.add(head);

    return back;

}

function createAntenna(materialAntenna, color){
    const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.75 );
    const material = materialAntenna;
    const cone = new THREE.Mesh(geometry, material);
    cone.position.y = 0.5;
    cone.position.x = 2;
    cone.receiveShadow = true;
    cone.castShadow = true;

    const geometry2 = new THREE.SphereGeometry( 0.4, 18, 9, 0, 2*Math.PI, 2*Math.PI, 2*Math.PI);
    const material2 = setDefaultMaterial(color);
    const sphere = new THREE.Mesh(geometry2, material2);
    sphere.receiveShadow = true;
    sphere.castShadow = true;

    const geometry3 = new THREE.BoxGeometry( 0.1, 0.2, 1 );
    const material3 = setDefaultMaterial(color);
    const box = new THREE.Mesh(geometry3, material3);
    box.position.x = 0.5;
    box.rotateX(THREE.MathUtils.degToRad(35));
    box.receiveShadow = true;
    box.castShadow = true;

    sphere.position.y = 0.6;
    sphere.add(box);
    cone.add(sphere);

    return cone;
}




