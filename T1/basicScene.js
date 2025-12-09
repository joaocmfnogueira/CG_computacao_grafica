import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

import {createHavac, createHavacEnemy} from "./models/vehicle.js";
import{createTrack0, createTrack1,createTrack2,createTrack3} from "./models/map.js";
import { WaypointFollower } from './models/WaypointFollower.js';

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
camera = initCamera(new THREE.Vector3(100, 350, 490)); // Init camera in this position
scene.add(camera); // Add camera to the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

let trackNumber = "Primeiro";

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

let enemy1 = createHavacEnemy(scene, "rgba(126, 235, 126, 1)", "rgba(12, 15, 188, 1)", "rgba(235, 151, 126, 1)", 0);
let enemy2 = createHavacEnemy(scene, "rgba(204, 153, 13, 1)", "rgba(255, 0, 0, 1)", "rgba(75, 12, 12, 1)", 1);
let enemy3 = createHavacEnemy(scene, "rgba(0, 238, 16, 1)", "rgba(0, 118, 14, 1)", "rgba(112, 0, 87, 1)", 2);
let enemy4 = createHavacEnemy(scene, "rgba(163, 205, 220, 1)", "rgba(0, 225, 255, 1)", "rgba(0, 0, 0, 1)", 3);

const follower = new WaypointFollower(enemy1, tracks["Terceiro"], 50, 5);
const follower2 = new WaypointFollower(enemy2, tracks["Terceiro"], 50, 5);
const follower3 = new WaypointFollower(enemy3, tracks["Terceiro"], 50, 5);
const follower4 = new WaypointFollower(enemy4, tracks["Terceiro"], 50, 5);

let clock = new THREE.Clock();

// create the ground plane
// let plane = createGroundPlaneXZ(20, 20)
// scene.add(plane);
createTrack3(scene);
createHavac(scene);
// createHavac(scene);


// Use this to show information onscreen
// let controls = new InfoBox();
//   controls.add("Basic Scene");
//   controls.addParagraph();
//   controls.add("Use mouse to interact:");
//   controls.add("* Left button to rotate");
//   controls.add("* Right button to translate (pan)");
//   controls.add("* Scroll to zoom in/out.");
//   controls.show();

render();
function render()
{
  const dt = clock.getDelta();
  follower.update(dt);
  follower2.update(dt);
  follower3.update(dt);
  follower4.update(dt);

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}