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
import KeyboardState from '../libs/util/KeyboardState.js';

import { switchTrack_teste } from './control/control.js';

let keyboard = new KeyboardState();

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


let clock = new THREE.Clock();


createTrack3(scene);
createHavac(scene);

render();
function render()
{
  keyboard.update(); // 👈 OBRIGATÓRIO
  if(keyboard.down("1")) 
    switchTrack_teste(1, scene, camera);
  if(keyboard.down("2")) 
      switchTrack_teste(2, scene, camera);
  if(keyboard.down("3")) 
      switchTrack_teste(3, scene, camera);


  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}