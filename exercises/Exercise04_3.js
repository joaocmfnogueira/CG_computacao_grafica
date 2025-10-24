import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {
   initRenderer,
   initCamera,
   initDefaultBasicLight,
   setDefaultMaterial,
   InfoBox,
   SecondaryBox,
   onWindowResize,
   createGroundPlaneXZ
} from "../libs/util/util.js";

let scene, renderer, camera, material, material2, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
material2 = setDefaultMaterial("rgb(255,200,0)");
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

let shootBall = false;

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Use to scale the cube
var scale = 1.0;

// Show text information onscreen
showInformation();

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cube = new THREE.Mesh(cubeGeometry, material);
// position the cube
cube.position.set(0.0, 2.0, 0.0);
// add the cube to the scene
scene.add(cube);

var sphGeo = new THREE.SphereGeometry(1, 20, 20);
var sphere = new THREE.Mesh(sphGeo, material2);
sphere.position.set(0, 0, 3);
cube.add(sphere);

var cubeAxesHelper = new THREE.AxesHelper(9);
cube.add(cubeAxesHelper);

let ball =  {
   esfera: sphere,
   disparada: false
};

let balls = [];
balls.push(ball);

render();


//-------------------------------------------------------------------------------
function render() {
   balls.forEach(element => {
      if (element.disparada)
         element.esfera.translateZ(0.15)
   });

   keyboardUpdate();
   requestAnimationFrame(render); // Show events
   renderer.render(scene, camera) // Render scene
   console.log(balls);
}

//-- Aux functions --------------------------------------------------------------
function keyboardUpdate() {
   keyboard.update();
   let angle = THREE.MathUtils.degToRad(5);
   if (keyboard.pressed("left")) cube.rotateY(angle);
   if (keyboard.pressed("right")) cube.rotateY(-angle);
   if (keyboard.pressed("up")) cube.translateZ(1);
   if (keyboard.pressed("down")) cube.translateZ(-1);

   if (keyboard.down("space")) {

      balls.at(-1).disparada = true;
      scene.attach(balls.at(-1).esfera);
      let sphere2 = esfera();
      cube.add(sphere2)
      let ball2 = {
         esfera: sphere2,
         disparada: false
      };
      balls.push(ball2);
   }
}

function showInformation() {
   // Use this to show information onscreen
   var controls = new InfoBox();
   controls.add("Animation - Attach");
   controls.addParagraph();
   controls.add("Use keyboard arrows to rotate/move the cube.");
   controls.add("Press 'space' to shoot the ball");
   controls.show();
}

function esfera(){
   var sphGeo = new THREE.SphereGeometry(1, 20, 20);
   var sphere = new THREE.Mesh(sphGeo, material2);
   sphere.position.set(0, 0, 3);
   return sphere;
}
