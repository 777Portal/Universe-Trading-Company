import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
export const scene = new THREE.Scene()
scene.background = new THREE.Color(0x808080);

// export var baseReferenceSpace: XRReferenceSpace | null;
// @ts-ignore
export var baseReferenceSpace;

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 2, 5)
scene.add(camera);

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.type = THREE.VSMShadowMap

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

renderer.xr.enabled = true
renderer.xr.addEventListener( 'sessionstart', () => baseReferenceSpace = renderer.xr.getReferenceSpace() );

document.body.appendChild(renderer.domElement)

export const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );
labelRenderer.domElement.style.pointerEvents = 'none';

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
})

export const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true
controls.target.y = 1 

let depoMat = new THREE.MeshPhongMaterial();
depoMat.wireframe = true;

export const placingIndicator = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 2.5), depoMat)
placingIndicator.position.y = 0
scene.add(placingIndicator)

const loader = new GLTFLoader();
// Load a glTF resource
loader.load(
    // resource URL
    './arrow/arrow.gltf',
    function ( gltf ) {
        gltf.scene.scale.add(new THREE.Vector3(1, 1, 1));
        gltf.scene.rotateY(1.57079632)
        placingIndicator.add( gltf.scene );
    },

    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened' + error);
    }
);

export var sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

export var sun = new THREE.Vector3();
sun.setFromSphericalCoords( 1, 1, 1 );
sky.material.uniforms.sunPosition.value.copy( sun );