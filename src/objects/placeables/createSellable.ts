import * as THREE from 'three'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import RAPIER from '@dimforge/rapier3d'
import type { GLTF } from 'three/examples/jsm/Addons.js';

import { scene } from '../../setupThree'
import { dynamicBodies, world } from '../../setupPhysics'

export function createSelleable(childGLB: GLTF, xCord:number, zCord:number, labelText: Text, value:number, childInfo: JSON){
    childInfo
    let cubeMat = new THREE.MeshNormalMaterial();
    cubeMat.wireframe = true
    
    const box = new THREE.Box3().setFromObject( childGLB.scene ); 
    const size = box.getSize(new THREE.Vector3());
    
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), cubeMat)
    mesh.castShadow = true
    scene.add(mesh)
    
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(xCord, 5, zCord).setCanSleep(false))
    body.resetForces(false);
    body.resetTorques(false);
    requestAnimationFrame(() => {
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setGravityScale(1, true);
    });
    
    body.userData = { value, parent: cubeMat }

    const shape = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2).setMass(1).setRestitution(0.4)

    world.createCollider(shape, body)
    dynamicBodies.push([mesh, body])
    
    mesh.userData.collider = body;
    mesh.userData.clickEvent = "add";
    mesh.userData.hasLabel = true;
    mesh.userData.value = value;
    mesh.userData.moveableOnConveyer = true;
    mesh.userData.timestamp = new Date();
    
    const cubeLabelDiv = document.createElement( 'div' );
    cubeLabelDiv.className = 'label';
    cubeLabelDiv.textContent = ''+labelText;
    cubeLabelDiv.style.backgroundColor = 'transparent';
    
    const cubeLabel = new CSS2DObject( cubeLabelDiv );
    cubeLabel.position.set( -0.5, 0.7, 0 ); // abs value :((
    cubeLabel.center.set( 0, 1 );
    cubeLabel.visible = false;
    mesh.add( cubeLabel );
    mesh.add( childGLB.scene.clone() );
    // cubeLabel.layers.set( 0 );
}