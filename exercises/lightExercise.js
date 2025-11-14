import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";

let scene, renderer, camera, orbit;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
   renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.lookAt(0, 0, 0);
   camera.position.set(10, 10, 10);
   camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 3 );
  axesHelper.visible = false;
scene.add( axesHelper );

// tipos de luz
let dirPosition = new THREE.Vector3(2, 2, 4)
const dirLight = new THREE.DirectionalLight('white', 1.0);
dirLight.visible = false;
dirLight.position.copy(dirPosition);

let ambientLight = new THREE.AmbientLight("rgb(50,50,50)");
ambientLight.visible = true;
scene.add( ambientLight );

let spotlightPosition = new THREE.Vector3(1.4, 3, 0);
let spotLight = new THREE.SpotLight("rgb(255,255,255)", 5);
spotLight.position.copy(spotlightPosition);
spotLight.angle = THREE.MathUtils.degToRad(40);
spotLight.target.position.set(2.2, 0.4, 0.0)
spotLight.castShadow = true;
spotLight.visible = true;
spotLight.decay = 2;
spotLight.penumbra = 0.5;
spotLight.intensity = 20;
scene.add(spotLight)
scene.add(spotLight.target)

let lightSphere = createLightSphere(scene, 0.1, 10, 10, spotlightPosition);
lightSphere.visible = false;
scene.add(lightSphere);

// Criando os objetos na cena
let cylinderGeometry1 = new THREE.CylinderGeometry(0.2, 0.2, 0.8);
let cylinderMaterial1 = new THREE.MeshLambertMaterial({
    color: "rgba(191, 43, 142, 1)",
});
let cylinder_pink = new THREE.Mesh(cylinderGeometry1, cylinderMaterial1);
cylinder_pink.castShadow = true;
cylinder_pink.position.set(0.2, 0.4, 3);
scene.add(cylinder_pink);

let cylinderGeometry2 = new THREE.CylinderGeometry(0.2, 0.2, 0.8);
let cylinderMaterial2 = new THREE.MeshLambertMaterial({
    color: "rgba(210, 229, 71, 1)",
});
let cylinder_yellow = new THREE.Mesh(cylinderGeometry2, cylinderMaterial2);
cylinder_yellow.castShadow = true;
cylinder_yellow.position.set(1.2, 0.4, -1.6);
scene.add(cylinder_yellow);

let boxGeometry1 = new THREE.BoxGeometry(0.5, 0.8, 0.5);
let boxMaterial1 = new THREE.MeshLambertMaterial({
    color: "rgba(243, 13, 13, 1)",
});
let redBox = new THREE.Mesh(boxGeometry1, boxMaterial1);
redBox.castShadow = true;
redBox.position.set(3.2, 0.4, 0.1);
scene.add(redBox);

let boxGeometry2 = new THREE.BoxGeometry(0.5, 0.8, 0.5);
let boxMaterial2 = new THREE.MeshLambertMaterial({
    color: "rgba(19, 187, 30, 1)",
});
let greenBox = new THREE.Mesh(boxGeometry2, boxMaterial2);
greenBox.castShadow = true;
greenBox.position.set(3.2, 0.4, 2.1);
scene.add(greenBox);



scene.add(dirLight);  

// Load default scene
loadLightPostScene(scene)

// REMOVA ESTA LINHA APÓS CONFIGURAR AS LUZES DESTE EXERCÍCIO
// initDefaultBasicLight(scene);

//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function buildInterface()
{
  // GUI interface
  let gui = new GUI();
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
