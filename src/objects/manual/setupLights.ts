import * as THREE from 'three'
import { scene } from "../../setupThree"

// const light1 = new THREE.SpotLight(undefined, Math.PI * 10)
// light1.position.set(-2.5, 10, 5)
// light1.angle = Math.PI / 3
// light1.penumbra = 0.5
// light1.castShadow = true
// light1.shadow.blurSamples = 10
// light1.shadow.radius = 5
// scene.add(light1)

// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
// hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
// hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
// hemiLight.position.set( 0, 500, 0 );
// // const hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ); 
// scene.add( hemiLight );

// const light2 = light1.clone()
// light2.position.set(-2.5, 5, 5)
// scene.add(light2)

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.position.set( -1, 0.75, 1 );
dirLight.position.multiplyScalar( 50);
dirLight.name = "dirlight";
dirLight.shadow.bias = -0.0002;

// dirLight.castShadow = true;

scene.add( dirLight );

dirLight.castShadow = true;

// dirLight.shadowCameraFar = 3500;
// dirLight.shadowBias = -0.0001;
// dirLight.shadowDarkness = 0.35;
