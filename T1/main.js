import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        InfoBox,
        onWindowResize} from "../libs/util/util.js";
import {createTrack1, createTrack2, } from "./models/mapa.js"
import KeyboardState from '../libs/util/KeyboardState.js';
import {clearScene } from './utils.js';
import { createHavac } from './models/veiculo.js';
// import { keyboardUpdate } from './control.js';

let scene, renderer, camera, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 150, 230)); // Init camera in this position
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// To use the keyboard
var keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

createTrack1(scene);

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Controls");
controls.addParagraph();
controls.add("Keyboard commands:");
controls.add("* 1 to change to track1");
controls.add("* 2 to change to track2");
controls.show();

createHavac(scene);
render();
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
    createTrack1(scene);
    light = initDefaultBasicLight(scene);
    createHavac(scene);
   }

   if (keyboard.down("2")) {
    clearScene(scene);
    createTrack2(scene);
    light = initDefaultBasicLight(scene);
    createHavac(scene);
   }
}

