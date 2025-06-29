import * as THREE from 'three'
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { scene, renderer, baseReferenceSpace, placingIndicator } from './setupThree';

var INTERSECTION = states.INTERSECTION
var BUTTON_INTERSECTION = states.BUTTON_INTERSECTION

let marker = new THREE.Mesh(
    new THREE.CircleGeometry( 0.25, 32 ).rotateX( - Math.PI / 2 ),
    new THREE.MeshBasicMaterial( { color: 0xbcbcbc } )
);


scene.add( marker );
export var raycaster = new THREE.Raycaster();

// controllers

function onSelectStart(this: THREE.Object3D) {
    console.log('starting vr selection')
    this.userData.isSelecting = true;

}

function onSelectEnd(this: THREE.Object3D) {
    console.log('ending vr selection')
    this.userData.isSelecting = false;

    if (BUTTON_INTERSECTION) {
        try {
            let foundFunction = false;
            let current = BUTTON_INTERSECTION;
    
            while (current?.parent && !foundFunction) {
                if (current.userData?.hasOwnProperty('callback')) {
                    foundFunction = true;
                    break;
                }

                current = current.parent;
            }
    
            if (!foundFunction) return console.warn('Couldn\'t find parent for button :(');
    
            const args = current.userData.args ?? [];
            current.userData.callback(...args);
        } catch (error) {
            console.error('Error encountered when attempting to run callback function on button:', error);
        }
    }    

    if ( INTERSECTION ) {
        const offsetPosition = { x: - INTERSECTION.x, y: - INTERSECTION.y, z: - INTERSECTION.z, w: 1 };
        const offsetRotation = new THREE.Quaternion();
        const transform = new XRRigidTransform( offsetPosition, offsetRotation );
        const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace( transform );

        renderer.xr.setReferenceSpace( teleportSpaceOffset );
    }

}

function onSqueezeStart(this: THREE.Object3D) {
    console.log('starting vr squeeze')
    this.userData.isSelecting = true;
}

function onSqueezeEnd(this: THREE.Object3D) {
    console.log('ending vr squeeze')
    this.userData.isSelecting = false;

    if ( INTERSECTION ) {
        states.locationX = INTERSECTION.x;
        states.locationZ = INTERSECTION.z;
        // if ( !states.placing ) return;
        console.log('calling ' + states.placingCallback())
        states.placingCallback();
    }
}

export var controller1 = renderer.xr.getController( 0 );
controller1.addEventListener( 'selectstart', onSelectStart );
controller1.addEventListener( 'selectend', onSelectEnd );

controller1.addEventListener( 'squeezestart', onSqueezeStart );
controller1.addEventListener( 'squeezeend', onSqueezeEnd );

controller1.addEventListener('connected', function (this: THREE.Object3D, event) {
    console.log('vr controler 1 connected')

    const box = new THREE.Box3().setFromObject(this);
    const size = new THREE.Vector3();
    box.getSize(size);

    const desc = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, 10, 0))
    const controllerShape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);

    var controllerCollider = world.createCollider(controllerShape, desc)
    this.userData.collider = controllerCollider

    const controller = buildController(event.data);
    if (controller) {
        this.userData.gamepad = event.data.gamepad;
        this.add(controller);
    }
});

controller1.addEventListener( 'disconnected', function (this: THREE.Object3D) {
    console.log('vr controler 1 disconnected')
    world.removeCollider(this.userData.collider, true);
    this.remove( this.children[ 0 ] );

} );

scene.add( controller1 );

export var controller2 = renderer.xr.getController( 1 );
controller2.addEventListener( 'selectstart', onSelectStart );
controller2.addEventListener( 'selectend', onSelectEnd );

controller2.addEventListener( 'connected', function (this: THREE.Object3D, event) {
    console.log('vr controler 2 connected')
    const box = new THREE.Box3().setFromObject(this);
    const size = new THREE.Vector3();
    box.getSize(size);

    const desc = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, 10, 0))
    const controllerShape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);

    var controllerCollider = world.createCollider(controllerShape, desc)
    this.userData.collider = controllerCollider

    const controller = buildController(event.data);
    if (controller) {
        this.add( controller );
}} );

controller2.addEventListener( 'disconnected', function (this: THREE.Object3D) {
    console.log('vr controler 2 disconnected')
    world.removeCollider(this.userData.collider, true);
    this.remove( this.children[ 0 ] );
} );

scene.add( controller2 );

// The XRControllerModelFactory will automatically fetch controller models
// that match what the user is holding as closely as possible. The models
// should be attached to the object returned from getControllerGrip in
// order to match the orientation of the held device.

const controllerModelFactory = new XRControllerModelFactory();

var controllerGrip1 = renderer.xr.getControllerGrip( 0 );
controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
scene.add( controllerGrip1 );

var controllerGrip2 = renderer.xr.getControllerGrip( 1 );
controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
scene.add( controllerGrip2 );

function buildController(data: XRInputSource) {
    let geometry, material;
    console.log('target ray mode is '+data.targetRayMode)
    switch ( data.targetRayMode ) {

        case 'tracked-pointer':

            geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

            material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

            return new THREE.Line( geometry, material );

        case 'gaze':

            geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
            material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
            return new THREE.Mesh( geometry, material );

    }
}

const tempMatrix = new THREE.Matrix4();

export function vrRaycast() {

    INTERSECTION = undefined;
    BUTTON_INTERSECTION = undefined

    let buttons: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child.userData?.isButton === true) {
        buttons.push(child);
      }
    });

    if ( controller1.userData.isSelecting === true ) {

        tempMatrix.identity().extractRotation( controller1.matrixWorld );

        raycaster.ray.origin.setFromMatrixPosition( controller1.matrixWorld );
        raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

        const intersectsGround = raycaster.intersectObjects( [ floorMesh ] );
        const intersectsButton = raycaster.intersectObjects( [ ...buttons ] );

        if ( intersectsButton.length > 0 ) {
            
            BUTTON_INTERSECTION = intersectsButton[ 0 ].object;
        } else if ( intersectsGround.length > 0 ) {

            INTERSECTION = intersectsGround[ 0 ].point;

            const gamepad = controller1.userData.gamepad;
            const supportHaptic = 'hapticActuators' in gamepad && gamepad.hapticActuators != null && gamepad.hapticActuators.length > 0;
            if ( supportHaptic ) {
                gamepad.hapticActuators[ 0 ].pulse( 0.8, 100 );
            }

        }

        let line = controller1.children[0];
        if ( (intersectsButton.length > 0) || intersectsGround.length > 0 ) {
            // @ts-ignore
            if (line.material){
                // @ts-ignore
                line.material.color = new THREE.Color().setHex( 0x21b0fe );
            }
        } else {
            // @ts-ignore
            if (line.material){
                // @ts-ignore
                line.material.color = new THREE.Color();
            }
        }
        
    } else if ( controller2.userData.isSelecting === true ) {

        tempMatrix.identity().extractRotation( controller2.matrixWorld );

        raycaster.ray.origin.setFromMatrixPosition( controller2.matrixWorld );
        raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

        const intersectsGround = raycaster.intersectObjects( [ floorMesh ] );
        const intersectsButton = raycaster.intersectObjects( [ ...buttons ] );

        if ( intersectsButton.length > 0 ) {
            
            BUTTON_INTERSECTION = intersectsButton[ 0 ].object;

        } else if ( intersectsGround.length > 0 ) {

            INTERSECTION = intersectsGround[ 0 ].point;

            const gamepad = controller2.userData.gamepad;
            const supportHaptic = 'hapticActuators' in gamepad && gamepad.hapticActuators != null && gamepad.hapticActuators.length > 0;
            if ( supportHaptic ) {
                gamepad.hapticActuators[ 0 ].pulse( 0.8, 100 );
            }
            
        }

        let line = controller2.children[0];
        if ( (intersectsButton.length > 0) || intersectsGround.length > 0 ) {
            // @ts-ignore
            if (line.material){
                // @ts-ignore
                line.material.color = new THREE.Color().setHex( 0x21b0fe );
            }
        } else {
            // @ts-ignore
            if (line.material){
                // @ts-ignore
                line.material.color = new THREE.Color();
            }
        }
    }

    if (controller1.userData.collider) {
        const rigidBody = controller1.userData.collider.parent();
        if (rigidBody) {
            const pos = controller1.getWorldPosition(new THREE.Vector3());
            const quat = controller1.getWorldQuaternion(new THREE.Quaternion());
    
            rigidBody.setTranslation({ x: pos.x, y: pos.y, z: pos.z }, true);
            rigidBody.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
        }
    }

    if (controller2.userData.collider) {
        const rigidBody = controller2.userData.collider.parent();
        if (rigidBody) {
            const pos = controller2.getWorldPosition(new THREE.Vector3());
            const quat = controller2.getWorldQuaternion(new THREE.Quaternion());
    
            rigidBody.setTranslation({ x: pos.x, y: pos.y, z: pos.z }, true);
            rigidBody.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
        }
    }

    if ( INTERSECTION ) { 
        marker.position.copy( INTERSECTION );
        placingIndicator.position.copy( INTERSECTION )
    }
    marker.visible = INTERSECTION !== undefined;
}


document.body.appendChild( VRButton.createButton( renderer ) );

import { floorMesh } from './objects/manual/floor';
import { states } from './states';
import RAPIER from '@dimforge/rapier3d'
import { world } from './setupPhysics';