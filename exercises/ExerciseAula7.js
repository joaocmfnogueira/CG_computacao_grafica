import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        initCamera,
        initDefaultSpotlight,
        initDefaultDirectionalLighting,
        createGroundPlane,
        createLightSphere,        
        onWindowResize} from "../libs/util/util.js";

let scene, renderer, camera, light, lightSphere, lightPosition, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(1, 1.5, 3.0)); // Init camera in this position
scene.add(camera); // Add camera to the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

lightPosition = new THREE.Vector3(1.6, 0.8, 1.6);
light = initDefaultSpotlight(scene, lightPosition, 5); // Use default light
lightSphere = createLightSphere(scene, 0.1, 10, 10, lightPosition);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var groundPlane = createGroundPlane(4.0, 4.0, 50, 50); // width and height
  groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// create a cube
// let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
// let cube = new THREE.Mesh(cubeGeometry, material);
// // position the cube
// cube.position.set(0.0, 2.0, 0.0);
// // add the cube to the scene
// scene.add(cube);

// Use this to show information onscreen

// create a teapot
let teaPotGeometry = new TeapotGeometry(0.3);
let teaPotMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(255,20,20)",
    shininess: 400
});
let teaPot = new THREE.Mesh(teaPotGeometry, teaPotMaterial);
teaPot.castShadow = true;
teaPot.position.set(0,0.25,0);
scene.add(teaPot);
let sphereGeometry = new THREE.SphereGeometry(0.4);
let sphereMaterial = new THREE.MeshLambertMaterial({
    color: "rgba(90, 218, 109, 1)",
});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);
sphere.position.set(-1, 0.4, -1);

let coneGeometry = new THREE.ConeGeometry(0.4, 1.2);
let coneMaterial = new THREE.MeshPhongMaterial({
    color: "rgba(114, 232, 210, 1)",
    shininess: 200,
    flatShading: true
});
let cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.castShadow = true;
cone.position.set(1, 0.6, 1);
scene.add(cone);
render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}