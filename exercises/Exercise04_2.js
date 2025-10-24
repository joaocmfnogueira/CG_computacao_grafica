import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";
        
import GUI from '../libs/util/dat.gui.module.js'
let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

var esphere1 = create_esphere();
esphere1.position.set(-6,1,-5)
scene.add(esphere1);

var esphere2 = create_esphere();
scene.add(esphere2);
esphere2.position.set(-6,1,5)

const Config_esphere1 = {
  move: false
}

const Config_esphere2 = {
  move: false
}


buildInterface();
render();


function render()
{
  if(Config_esphere1.move && esphere1.position.x < 6) 
    esphere1.translateX(0.5);
  if(Config_esphere2.move && esphere2.position.x < 6) 
    esphere2.translateX(0.5);

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}

function create_esphere(){
    // create a cube
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let esphere = new THREE.Mesh(geometry, material);
    // position the esphere
    esphere.position.set(0.0, 1.0, 0.0);
    // add the esphere to the scene
    return esphere;
}

function buildInterface()
{
  var controls = new function ()
  {
    this.esphere1_moving = function(){
      Config_esphere1.move = true;
    };
    this.esphere2_moving = function(){
      Config_esphere2.move = true;
    };
    this.reseting = function(){
      esphere1.position.set(-6,1,-5);
      esphere2.position.set(-6,1, 5);
      Config_esphere1.move = false;
      Config_esphere2.move = false;
    };
  };

  let gui = new GUI();
    gui.add(controls, 'esphere1_moving',true).name("Esfera 1");
    gui.add(controls, 'esphere2_moving',true).name("Esfera 2");
    gui.add(controls, 'reseting',true).name("Reset");
}