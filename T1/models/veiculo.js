import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";

export function createHavac(scene) {    
    // --- Materials ---
    const materialBase = setDefaultMaterial(); 
    const materialBody = setDefaultMaterial(); 
    const materialAntenna = setDefaultMaterial();

    // --- Base (main oval body) ---
    const base = createBase(materialBase);

    base.scale.set(1,1,1);
    base.name = "veiculo_principal";
    scene.add(base);
}



function createBase(materialBase){
    const boxGeo = new THREE.BoxGeometry(5, 0.4, 2.5);
    const box = new THREE.Mesh(boxGeo, materialBase);
    box.position.y = 1;
    let cilinder1 = createCilinder(materialBase, 5);
    cilinder1.position.y = 0;
    cilinder1.position.z = -1.5;
    let cilinder2 = createCilinder(materialBase, 5);
    cilinder2.position.y = 0;
    cilinder2.position.z = 1.5;
    let cilinder3 = createCilinder(materialBase, 3)
    cilinder3.position.x = 2.5;
    cilinder3.rotation.y = THREE.MathUtils.degToRad(90);
    let torus = createTorus(materialBase);
    torus.position.x = -2.5;
    box.add(cilinder1);
    box.add(cilinder2);
    box.add(cilinder3);
    box.add(torus);
    return box;
}


function createCilinder(materialBase, height){
    const baseGeom = new THREE.CapsuleGeometry(0.25, height);
    const base = new THREE.Mesh(baseGeom, materialBase);
    base.rotateZ(THREE.MathUtils.degToRad(90));
    return base;
}

function createTorus(materialBase){
    const geometry = new THREE.TorusGeometry( 1.5, 0.25, 16, 100, Math.PI); 
    const torus = new THREE.Mesh( geometry, materialBase );
    torus.rotateZ(THREE.MathUtils.degToRad(90));
    torus.rotateY(THREE.MathUtils.degToRad(90));

    return torus;
}