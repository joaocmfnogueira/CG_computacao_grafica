import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        initDefaultSpotlight,
        onWindowResize, 
        lightFollowingCamera} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(10, 10, 10)); // Init camera in this position
var light = initDefaultSpotlight(scene, new THREE.Vector3(0, 0, 30)); // Use default light

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Create the cube
let loader = new THREE.TextureLoader();
let geometry = new THREE.BoxGeometry(5, 5, 5);
let cubeMaterials = [
    setMaterial('../assets/textures/tiles.jpg', 1, 1, 0, 0),
    setMaterial('../assets/textures/tiles.jpg', 1, 1, 0.333, 0),
    setMaterial('../assets/textures/tiles.jpg', 1, 1, 0, 0.333), 
    setMaterial('../assets/textures/tiles.jpg', 1, 1, 0.666, 0), 
    setMaterial('../assets/textures/tiles.jpg', 1, 1, 0.666, 0.666), 
    setMaterial('../assets/textures/tiles.jpg', 1, 1, 0.666, 0.333) 
];
let cube = new THREE.Mesh(geometry, cubeMaterials);
scene.add(cube);

// To access textures individually, you should use their indexes
console.log(cube.material[0].map)

render();

// Function to set a texture
function setMaterial(file, repeatU = 1, repeatV = 1, offsetx, offsety, color = 'rgb(255,255,255)'){
   let mat = new THREE.MeshBasicMaterial({ map: loader.load(file), color:color});
      mat.map.colorSpace = THREE.SRGBColorSpace;
   mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
   mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
   mat.map.repeat.set(repeatU,repeatV); 
   mat.map.offset.x = offsetx;
   mat.map.offset.y = offsety;
   mat.map.repeat.x = 0.333;
   mat.map.repeat.y = 0.333;
   return mat;
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  lightFollowingCamera(light, camera) // Makes light follow the camera
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
