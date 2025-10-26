import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";

export function createHavac(scene) {
    // --- Materials ---
    const materialBody = setDefaultMaterial(); 
    const materialBase = setDefaultMaterial(); 
    const materialAntenna = setDefaultMaterial();

    // --- Base (main oval body) ---
    const baseGeom = new THREE.CylinderGeometry(5, 5, 0.8, 32);
    const base = new THREE.Mesh(baseGeom, materialBase);
    base.rotateX(THREE.MathUtils.degToRad(90));

    // --- Deck (flat surface) ---
    const deckGeom = new THREE.CylinderGeometry(4.5, 4.5, 0.3, 32);
    const deck = new THREE.Mesh(deckGeom, materialBody);
    deck.position.y = 0.5;
    deck.rotateX(THREE.MathUtils.degToRad(90));
    base.add(deck); 

    // --- Cabin (main block) ---
    const cabinGeom = new THREE.BoxGeometry(4, 1.2, 2.5);
    const cabin = new THREE.Mesh(cabinGeom, materialBody);
    cabin.position.set(0, 1.2, 0);
    base.add(cabin); 

    // --- Cabin roof (angled top) ---
    const roofGeom = new THREE.BoxGeometry(3.5, 1, 2);
    const roof = new THREE.Mesh(roofGeom, materialBody);
    roof.position.set(0, 1.8, 0);
    roof.rotateX(THREE.MathUtils.degToRad(15)); // slight tilt forward
    base.add(roof);

    // --- Antenna support (cylinder) ---
    const supportGeom = new THREE.CylinderGeometry(0.2, 0.4, 1.2, 12);
    const support = new THREE.Mesh(supportGeom, materialAntenna);
    support.position.set(0, 2.8, -1.2);
    base.add(support);

    // --- Antenna sphere ---
    const sphereGeom = new THREE.SphereGeometry(0.6, 12, 12);
    const sphere = new THREE.Mesh(sphereGeom, materialAntenna);
    sphere.position.set(0, 3.5, -1.2);
    base.add(sphere);

    // --- Antenna crossbars ---
    const barGeom = new THREE.BoxGeometry(2, 0.1, 0.1);
    const bar1 = new THREE.Mesh(barGeom, materialAntenna);
    bar1.position.set(0, 3.5, -1.2);
    bar1.rotateZ(THREE.MathUtils.degToRad(45));
    base.add(bar1);

    const bar2 = new THREE.Mesh(barGeom, materialAntenna);
    bar2.position.set(0, 3.5, -1.2);
    bar2.rotateZ(THREE.MathUtils.degToRad(-45));
    base.add(bar2);

    // --- Finally add only the base to the scene ---
    scene.add(base);
}