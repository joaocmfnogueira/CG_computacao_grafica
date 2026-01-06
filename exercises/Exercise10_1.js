import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import {OrbitControls} from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {initRenderer, 
		initCamera,
		onWindowResize,
		lightFollowingCamera,
		initDefaultSpotlight,
        } from "../libs/util/util.js";

let scene = new THREE.Scene();
let camera = initCamera(new THREE.Vector3(0, 0, 15)); // Init camera in this position
let renderer = initRenderer(); 
	renderer.setClearColor(new THREE.Color("lightslategray"));
let light = initDefaultSpotlight(scene, camera.position, 500);
let orbitcontrols = new OrbitControls (camera, renderer.domElement);
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
var keyboard = new KeyboardState();

// Create main object
let geom = new THREE.BoxGeometry(5, 5, 0.5);
let colormap = 	new THREE.TextureLoader().load("../assets/textures/NormalMapping/cross.png");
    colormap.colorSpace = THREE.SRGBColorSpace;
let normalmap = new THREE.TextureLoader().load("../assets/textures/NormalMapping/crossNormal.png");

let sidemap = new THREE.TextureLoader().load("../assets/textures/NormalMapping/crossSide.png");

let topmap = new THREE.TextureLoader().load("../assets/textures/NormalMapping/crossTop.png");


let mat = new THREE.MeshStandardMaterial({
	side: THREE.DoubleSide,
	color:"white",
	map: colormap,
	normalMap: normalmap
});

let matTop = new THREE.MeshStandardMaterial({
	side: THREE.DoubleSide,
	color:"white",
	map: topmap
});

let matSide = new THREE.MeshStandardMaterial({
	side: THREE.DoubleSide,
	color:"white",
	map: sidemap
});

mat.normalScale.set(0.7, 0.7);

let cubeMaterials = [
    matTop,
    matTop,
    matSide,
    matSide,
    mat,
    mat
];

let mesh = new THREE.Mesh(geom, cubeMaterials);
scene.add(mesh);
// setTextureOptions(mesh.material, 3, 0.7); // Set repeat and wrapping modes

// setup the control gui
// buildInterface()
render();

//-- Functions ------------------------------------------------------
function keyboardUpdate() {

  keyboard.update();

  // Keyboard.pressed - execute while is pressed
  if ( keyboard.pressed("A") )  mesh.rotateY( THREE.MathUtils.degToRad(-1) );
  if ( keyboard.pressed("D") )  mesh.rotateY(  THREE.MathUtils.degToRad(1) );
  if ( keyboard.pressed("W") )  mesh.rotateX(  THREE.MathUtils.degToRad(1) );
  if ( keyboard.pressed("S") )  mesh.rotateX( THREE.MathUtils.degToRad(-1) );


}

function render() {
	lightFollowingCamera(light, camera);
	requestAnimationFrame(render);
    keyboardUpdate();
	renderer.render(scene, camera);
}