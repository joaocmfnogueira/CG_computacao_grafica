
import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize} from "../libs/util/util.js";

// export function keyboardUpdate(keyboard) {
//    keyboard.update();
// //    if (keyboard.pressed("left"));
// //    if (keyboard.pressed("right"));
// //    if (keyboard.pressed("up"));
// //    if (keyboard.pressed("x"));
// //    if (keyboard.pressed("down"));

//    if (keyboard.down("1")) {
//    }

//    if (keyboard.down("2")) {
//    }
// }