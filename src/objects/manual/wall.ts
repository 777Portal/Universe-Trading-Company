import { world } from "../../setupPhysics";
import { scene } from "../../setupThree";
import * as THREE from 'three'
import { stringToColour } from "../../util";
import RAPIER from '@dimforge/rapier3d'

let conveyerMat = new THREE.MeshBasicMaterial();
conveyerMat.color = new THREE.Color(stringToColour(''+0+''+0))
// depoMat.wireframe = true;

const conveyerMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 10, 2.5), conveyerMat)
conveyerMesh.position.set(10, 0, -10);
conveyerMesh.position.y = 0
scene.add(conveyerMesh)

const conveyerBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
conveyerBody.setTranslation(new RAPIER.Vector3(10, 0, -10), false)
const conveyerShape = RAPIER.ColliderDesc.cuboid(1.25, 5, 1.25);
conveyerShape.setFriction(0.1)
world.createCollider(conveyerShape, conveyerBody)