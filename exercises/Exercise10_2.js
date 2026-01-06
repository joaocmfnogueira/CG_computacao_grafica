import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        createGroundPlane,
        createLightSphere,        
        onWindowResize} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information  var renderer = initRenderer();    // View function in util/utils
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(25, 20, 45);
  camera.up.set( 0, 1, 0 );

var ambientLight = new THREE.AmbientLight("rgba(233, 233, 233, 1)");
   ambientLight.intensity = 10;
scene.add(ambientLight);

var lightPosition = new THREE.Vector3(5, 5, 0.0);
  var light = new THREE.SpotLight(0xffffff);
  light.position.copy(lightPosition);
  light.castShadow = true;
  light.penumbra = 0.5;    
  light.intensity = 30;
scene.add(light);

var lightSphere = createLightSphere(scene, 0.1, 10, 10, lightPosition);  

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

//-- Scene Objects -----------------------------------------------------------
// Ground
var groundPlane = createGroundPlane(10.0, 10.0, 100, 100); // width and height
  groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Cube
// var cilinderSize = 0.6;
var sphereGeometry = new THREE.SphereGeometry(3, 64, 64);
let colormap = 	new THREE.TextureLoader().load("../assets/textures/displacement/rockWall.jpg");
    colormap.colorSpace = THREE.SRGBColorSpace;
let normalmap = new THREE.TextureLoader().load("../assets/textures/displacement/rockWall_Normal.jpg");
let dispmap = 	new THREE.TextureLoader().load("../assets/textures/displacement/rockWall_Height.jpg");

let mat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color:"white",
    map: colormap,
    normalMap: normalmap,
    displacementMap: dispmap,
    displacementScale: 0.2
});
mat.map.repeat.x = 3;
mat.map.repeat.y = 4;
// mat.normalScale.set(0.7, 0.7);

let mesh = new THREE.Mesh(sphereGeometry, mat);
mesh.position.y = 3.5;
scene.add(mesh);
//----------------------------------------------------------------------------
//-- Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var floor  = textureLoader.load('../assets/textures/floorWood.jpg');
    floor.colorSpace = THREE.SRGBColorSpace;


var sun = textureLoader.load('../assets/textures/sun.jpg');


// Apply texture to the 'map' property of the respective materials' objects
groundPlane.material.map = floor;
lightSphere.material.map = sun;

render();


function render()
{
  stats.update();
  trackballControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
