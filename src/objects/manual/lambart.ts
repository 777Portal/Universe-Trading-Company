import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/Addons.js'
import { scene } from '../../setupThree'

import RAPIER from '@dimforge/rapier3d'
import { dynamicBodies, world } from '../../setupPhysics'

export const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
cubeMesh.castShadow = true
scene.add(cubeMesh)
    
const cubeLabelDiv = document.createElement( 'div' );
cubeLabelDiv.className = 'label';
cubeLabelDiv.textContent = 'Lamabart';
cubeLabelDiv.style.backgroundColor = 'transparent';

const cubeLabel = new CSS2DObject( cubeLabelDiv );
cubeLabel.position.set( -0.5, 0.7, 0 ); // abs value :((
cubeLabel.center.set( 0, 1 );
cubeLabel.visible = true;
cubeMesh.add( cubeLabel );
cubeLabel.layers.set( 0 );

const cubeBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setCanSleep(false))
const cubeShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(35).setRestitution(1.1)
world.createCollider(cubeShape, cubeBody)
dynamicBodies.push([cubeMesh, cubeBody])