import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
import {OBB} from "./OBB.js";
import {createOBBHelper} from "../utils.js";


export function createHavac(scene) {    
    // Materiais
    const materialBase = setDefaultMaterial("rgba(235, 126, 211, 1)"); 
    const materialBody = setDefaultMaterial("rgba(136, 83, 167, 1)"); 
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
    base.castShadow = true;
    base.receiveShadow = true;
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
        updateOBBHelper(base.userData.obb, obbHelper);
    };
}



function createBase(materialBase){
    function createCapsule(height){
        const baseGeom = new THREE.CapsuleGeometry(0.25, height);
        const base = new THREE.Mesh(baseGeom, materialBase);
        base.rotateZ(THREE.MathUtils.degToRad(90));
        return base;
    }

    function create_base_back(){
        const boxGeo = new THREE.BoxGeometry(5, 0.5, 3);
        const box = new THREE.Mesh(boxGeo, materialBase);
        box.position.y = 1;

        const capsule1 = createCapsule(5);
        capsule1.position.y = 0;
        capsule1.position.z = -1.5;

        const capsule2 = createCapsule(5);
        capsule2.position.y = 0;
        capsule2.position.z = 1.5;

        const capsule3 = createCapsule(3)
        capsule3.position.x = 2.5;
        capsule3.rotation.y = THREE.MathUtils.degToRad(90);

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

        const geometry2 = new THREE.CylinderGeometry( 1.5, 1.5, 0.5, 100); 
        const cylinder = new THREE.Mesh( geometry2, materialBase );
        // cylinder.rotateZ(THREE.MathUtils.degToRad(90));
        cylinder.rotateX(THREE.MathUtils.degToRad(90));

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
        return box;
    }

    function create_base_front(){

        const geometry2 = new THREE.CylinderGeometry( 1.5, 1.5, 0.3, 100); 
        const cylinder = new THREE.Mesh( geometry2, materialBody );
        // cylinder.rotateZ(THREE.MathUtils.degToRad(90));
        // cylinder.rotateX(THREE.MathUtils.degToRad(90));

        return cylinder;
    }

    function create_head(){
        const length = 2.5, width = 0.5;
        const shape = new THREE.Shape();
        shape.moveTo( 0,0 );
        shape.lineTo( 0, width );
        shape.lineTo( length, width );
        shape.lineTo( length, 0 );
        shape.lineTo( 0, 0 );
        const geometry = new THREE.ExtrudeGeometry( shape );
        const material = materialBody;
        const mesh = new THREE.Mesh( geometry, material ) ;

        return mesh
    }

    const back = create_base_back();

    const front = create_base_front();
        front.position.x = -2.5;

    const head = create_head();
    head.scale.set(1,1,1.5);
        head.position.x = -2;
        head.position.y = 0.1;
        head.position.z = -0.7;

    back.add(front);
    back.position.y = 0.2;
    back.position.x = 0.1;

    back.add(head);

    return back;

}

function createAntenna(materialAntenna){
    const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.75 );
    const material = materialAntenna;
    const cone = new THREE.Mesh(geometry, material);
    cone.position.y = 0.5;
    cone.position.x = 2;

    const geometry2 = new THREE.SphereGeometry( 0.4, 18, 9, 0, 2*Math.PI, 2*Math.PI, 2*Math.PI);
    const material2 = setDefaultMaterial("rgba(235, 126, 211, 1)");
    const sphere = new THREE.Mesh(geometry2, material2);

    const geometry3 = new THREE.BoxGeometry( 0.1, 0.2, 1 );
    const material3 = setDefaultMaterial("rgba(235, 126, 211, 1)");
    const box = new THREE.Mesh(geometry3, material3);
    box.position.x = 0.5;
    box.rotateX(THREE.MathUtils.degToRad(35));

    sphere.position.y = 0.6;
    sphere.add(box);
    cone.add(sphere);

    return cone;
}

function createBBHelper(bb, color = "rgb(255, 255, 255)")
{
   let helper = new THREE.Box3Helper( bb, color );
   scene.add( helper );
   return helper;
}


function updateOBBHelper(obb, helper) {
    const pos = helper.geometry.attributes.position;
    const vertices = pos.array;

    const half = obb.halfSize;
    const signs = [
        [+1, +1, +1],
        [+1, +1, -1],
        [+1, -1, +1],
        [+1, -1, -1],
        [-1, +1, +1],
        [-1, +1, -1],
        [-1, -1, +1],
        [-1, -1, -1],
    ];

    const corners = [];
    for (const s of signs) {
        const p = new THREE.Vector3(
            s[0] * half.x,
            s[1] * half.y,
            s[2] * half.z
        );
        p.applyMatrix3(obb.rotation).add(obb.center);
        corners.push(p);
    }

    const idx = [
        0,1, 0,2, 0,4,
        7,6, 7,5, 7,3,
        1,3, 1,5,
        2,3, 2,6,
        4,5, 4,6
    ];

    for (let i = 0; i < idx.length; i++) {
        const p = corners[idx[i]];
        vertices[i * 3] = p.x;
        vertices[i * 3 + 1] = p.y;
        vertices[i * 3 + 2] = p.z;
    }

    pos.needsUpdate = true;
}


