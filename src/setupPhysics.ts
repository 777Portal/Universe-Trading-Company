import RAPIER from '@dimforge/rapier3d'
import * as THREE from 'three'

export const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0)
export const world = new RAPIER.World(gravity)
export var dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = []
