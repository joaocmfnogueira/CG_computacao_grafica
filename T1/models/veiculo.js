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
    const boxGeo = new THREE.BoxGeometry(5, 1, 2.5);
    const box = new THREE.Mesh(boxGeo, materialBase);
    box.position.y = 1;
    return box;
}

// function createBase(materialBase){
//     let cilinder1 = createCilinder(materialBase);
//     cilinder1.position.y = 0.5;
//     cilinder1.position.z = 8;
//     let cilinder2 = createCilinder(materialBase);
//     cilinder2.position.y = 0.5;
//     cilinder2.position.z = 6;
//     return cilinder1, cilinder2;
// }



// function createCilinder(materialBase){
//     const baseGeom = new THREE.CylinderGeometry(0.75, 0.75, 10, 32);
//     const base = new THREE.Mesh(baseGeom, materialBase);
//     base.rotateZ(THREE.MathUtils.degToRad(90));
//     return base;
// }