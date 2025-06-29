import * as THREE from 'three'

import RAPIER from '@dimforge/rapier3d'

import { scene } from '../../setupThree'
import { world } from '../../setupPhysics'
import { stringToColour } from "../../util";

export var createdConveyers: [THREE.Object3D, RAPIER.RigidBody][] = []

export function createWall(xCord:number, zCord: number,){
    let conveyerMat = new THREE.MeshBasicMaterial();
    conveyerMat.color = new THREE.Color(stringToColour(''+xCord+''+zCord))
    // depoMat.wireframe = true;

    const conveyerMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 10, 2.5), conveyerMat)
    conveyerMesh.position.set(xCord, 0, zCord);
    conveyerMesh.position.y = 0
    scene.add(conveyerMesh)

    const conveyerBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
    conveyerBody.setTranslation(new RAPIER.Vector3(xCord, 0, zCord), false)
    const conveyerShape = RAPIER.ColliderDesc.cuboid(1.25, 5, 1.25);
    conveyerShape.setFriction(0.1)
    // conveyerShape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
    world.createCollider(conveyerShape, conveyerBody)

    createdConveyers.push([ conveyerMesh, conveyerBody ])
}