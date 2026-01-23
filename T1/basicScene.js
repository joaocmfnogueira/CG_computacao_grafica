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
import { loadGLBFile } from './utils.js';

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

loadGLBFile(scene, '../../T1/assets/Pyramid.glb', 50);

export const texturas = {
    "areaExterna_pista1" : carregarTextura('../T1/assets/grass_18k.jpg', 20, 20),
    "areaExterna_pista2" : carregarTextura('../assets/textures/sand.jpg'),
    "areaExterna_pista3" : carregarTextura('../T1/assets/volcano_floor.png', 20, 20),
    "skybox" : skybox,
    "tunnel" : carregarTextura('../assets/textures/darkcement.jpg', 1, 1),
    "piso" : carregarTextura('../T1/assets/01tizeta_asphalts.png', 4, 4),
    "piso_largada" : carregarTextura('../T1/assets/bw_marble_tile_04-512x512.png', 4, 4),
    "piso_checkpoint" : carregarTextura('../T1/assets/bw_marble_tile_04-512x512_0.png', 4, 4),
    "vehicle1" : carregarTextura('../T1/assets/trak2_plate2b.png', 1, 1),
    "vehicle2" : carregarTextura('../T1/assets/image.png', 4, 4),
    "vehicle3" : carregarTextura('../T1/assets/image(2).png', 1, 1),
    "vehicle4" : carregarTextura('../T1/assets/new2-texture.jpg', 1, 1),
    "lateral1" : carregarTextura('../assets/textures/stone.jpg', 1, 1),
    "lateral1.5" : carregarTextura('../T1/assets/stone.jpg', 1, 1),
    "lateral2" : carregarTextura('../assets/textures/stonewall.jpg', 1, 1),
    "lateral2.5" : carregarTextura('../assets/textures/stonewallrot.jpg', 1, 1),
    "lateral3" : carregarTextura('../T1/assets/trak2_tile1a.png', 1, 1),
    "lateral3.5" : carregarTextura('../T1/assets/trak2_tile1a.png', 1, 1),
    "mureta1" : carregarTextura('../assets/textures/crate.jpg', 1, 1),
    "mureta2" : carregarTextura('../T1/assets/wo_marble_tile_08-512x512.png', 1, 1),
    "mureta2.5" : carregarTextura('../T1/assets/wo_marble_tile_08-512x512.png', 1, 1),
    "mureta3" : carregarTextura('../T1/assets/new_2.3_mureta.png', 1, 1)
};


createTrack3(scene);
createHavac(scene);

createHavacEnemy(scene, "rgb(82, 123, 236)", "rgb(18, 21, 199)", "rgb(112, 145, 238)", 0);
createHavacEnemy(scene, "rgb(240, 83, 83)", "rgba(255, 0, 0, 1)", "rgb(223, 105, 105)", 1);
createHavacEnemy(scene, "rgba(0, 238, 16, 1)", "rgba(0, 118, 14, 1)", "rgb(124, 216, 71)", 2);
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