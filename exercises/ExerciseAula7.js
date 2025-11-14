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
        onWindowResize,
        initDefaultBasicLight} from "../libs/util/util.js";
import { DirectionalLight } from '../build/three.core.js';

let scene, renderer, camera, light, lightSphere, lightPosition, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene

// criando renderer
renderer = initRenderer("rgb(30, 30, 42)");
// initDefaultBasicLight(scene);

let ambientLight = new THREE.AmbientLight("rgb(150,150,150)");
scene.add( ambientLight );

camera = initCamera(new THREE.Vector3(1, 1.5, 3.0)); // Init camera in this position
scene.add(camera); // Add camera to the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
// criando luz direcional
lightPosition = new THREE.Vector3(1.6, 0.8, 1.6);
light = new THREE.DirectionalLight("rgb(255, 255,255)", 5);
light.position.copy(lightPosition);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;


scene.add(light);

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

// criando bule de chá
let teaPotGeometry = new TeapotGeometry(0.3);
let teaPotMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(255,20,20)",
    shininess: 300
});
let teaPot = new THREE.Mesh(teaPotGeometry, teaPotMaterial);
teaPot.castShadow = true;
teaPot.receiveShadow = true;
teaPot.position.set(0,0.3,0.3);
scene.add(teaPot);


// criando esfera
let sphereGeometry = new THREE.SphereGeometry(0.3);
let sphereMaterial = new THREE.MeshLambertMaterial({
    color: "rgba(90, 218, 109, 1)",
});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);
sphere.position.set(-0.75, 0.3, -0.4);

// criando cone
let coneGeometry = new THREE.CylinderGeometry(0.05, 0.4, 1.2, 20);
let coneMaterial = new THREE.MeshPhongMaterial({
    color: "rgba(159, 218, 226, 1)",
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