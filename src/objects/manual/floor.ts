import * as THREE from 'three'
import { scene } from '../../setupThree'

import RAPIER from '@dimforge/rapier3d'
import { world } from '../../setupPhysics'

export const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhongMaterial())
floorMesh.receiveShadow = true
floorMesh.position.y = -1
scene.add(floorMesh)

const floorBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0))
floorBody.userData = {isGround:true};
const floorShape = RAPIER.ColliderDesc.cuboid(50, 0.5, 50)
floorShape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
floorShape.friction = Infinity;
world.createCollider(floorShape, floorBody)