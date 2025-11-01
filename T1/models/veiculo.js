import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";

export function createHavac(scene) {    
    // --- Materials ---
    const materialBase = setDefaultMaterial("rgba(15, 137, 88, 1)"); 
    const materialBody = setDefaultMaterial(); 
    const materialAntenna = setDefaultMaterial();

    // --- Base (main oval body) ---
    const base = createBase(materialBase);
    const antenna = createAntenna(materialAntenna);

    base.scale.set(1,1,1);
    base.add(antenna);




    base.name = "veiculo_principal";
    scene.add(base);
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

}

function createAntenna(materialAntenna){
    const geometry = new THREE.CylinderGeometry( 0.1, 0.2, 0.75 );
    const material = materialAntenna;
    const cone = new THREE.Mesh(geometry, material);
    cone.position.y = 0.5;
    cone.position.x = 1.5;

    const geometry2 = new THREE.SphereGeometry( 0.4, 18, 9, 0, 2*Math.PI, 2*Math.PI, 2*Math.PI);
    const material2 = materialAntenna;
    const sphere = new THREE.Mesh(geometry2, material2);

    sphere.position.y = 0.6;
    cone.add(sphere);

    return cone;
}



