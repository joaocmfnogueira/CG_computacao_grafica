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
import {CubeTextureLoaderSingleFile} from '../../libs/util/cubeTextureLoaderSingleFile.js';
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

let skybox = new CubeTextureLoaderSingleFile().loadSingle('../T1/assets/Sky3.png', 1);

export const texturas = {
    "areaExterna_pista1" : carregarTextura('../T1/assets/grass_18k.jpg'),
    "areaExterna_pista2" : carregarTextura('../assets/textures/sand.jpg'),
    "areaExterna_pista3" : carregarTextura('../T1/assets/volcano_floor.png'),
    "skybox" : skybox,
    "tunnel" : carregarTextura('../assets/textures/darkcement.jpg', 1, 1),
    "piso" : carregarTextura('../T1/assets/01tizeta_asphalts.png', 1, 1)
};


createTrack3(scene);
createHavac(scene);

createHavacEnemy(scene, "rgba(126, 235, 126, 1)", "rgba(12, 15, 188, 1)", "rgba(235, 151, 126, 1)", 0);
createHavacEnemy(scene, "rgba(204, 153, 13, 1)", "rgba(255, 0, 0, 1)", "rgba(75, 12, 12, 1)", 1);
createHavacEnemy(scene, "rgba(0, 238, 16, 1)", "rgba(0, 118, 14, 1)", "rgba(112, 0, 87, 1)", 2);
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

function carregarTextura(path, repeatX = 10, repeatY = 10){
    const textureLoader = new THREE.TextureLoader();
    textureLoader.wrapS = THREE.RepeatWrapping;
    textureLoader.wrapT = THREE.RepeatWrapping;
    const floor  = textureLoader.load(path);
    floor.colorSpace = THREE.SRGBColorSpace;
    floor.wrapS = THREE.RepeatWrapping;
    floor.wrapT = THREE.RepeatWrapping;
    floor.repeat.set(repeatX, repeatY);
    floor.needsUpdate = true;
    return floor;
}