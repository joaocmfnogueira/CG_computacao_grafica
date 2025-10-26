import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize} from "../libs/util/util.js";
import {createTrack1, createTrack2, } from "./models/mapa.js"
import KeyboardState from '../libs/util/KeyboardState.js';
import {clearScene } from './utils.js';
import { createHavac } from './models/veiculo.js';
// import { keyboardUpdate } from './control.js';

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 150, 230)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// To use the keyboard
var keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
// let plane = createBlock(1, "rgb(100,100,100)", "rgb(255,30,30)");
// scene.add(plane);
scene = createTrack1(scene);
// let block = auxCreateBlock2("rgb(100,100,100)", "rgb(255,30,30)")
// scene.add(block);

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Controls");
controls.addParagraph();
controls.add("Keyboard commands:");
controls.add("* 1 to change to track1");
controls.add("* 2 to change to track2");
controls.show();

render();
// createHavac(scene);
function render()
{
  keyboardUpdate(keyboard);
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

function keyboardUpdate(keyboard) {
   keyboard.update();
//    if (keyboard.pressed("left"));
//    if (keyboard.pressed("right"));
//    if (keyboard.pressed("up"));
//    if (keyboard.pressed("x"));
//    if (keyboard.pressed("down"));

   if (keyboard.down("1")) {
    clearScene(scene);
    scene = createTrack1(scene);
    light = initDefaultBasicLight(scene);
    // scene = createHavac(scene);
   }

   if (keyboard.down("2")) {
    clearScene(scene);
    scene = createTrack2(scene);
    light = initDefaultBasicLight(scene);
    // scene = createHavac(scene);
   }
}

