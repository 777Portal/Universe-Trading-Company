import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';

import RAPIER from '@dimforge/rapier3d'

import { createSelleable } from "./createSellable";
import { config, states } from '../../states';
import { spawners } from "./minerTypes";

import { scene } from '../../setupThree'
import { world } from '../../setupPhysics'
import { stringToColour } from "../../util";
import { loaded } from './preload';

export var createdSpawners: [THREE.Object3D, RAPIER.RigidBody][] = []

export var activeSpawners: [Number]

export function addonCreateSpawner(object : THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>){
    let childGLB = loaded[object.userData.child]
    console.log(object.userData.child, childGLB, loaded, object.userData)

    let rate = object.userData.rate ? object.userData.rate : config.spawnTime;
    
    let callback = setInterval(myCallback, rate, childGLB, object.position.x, object.position.z, object.userData.spawnerText, object.userData.spawnerSellValue, {}); 
    activeSpawners.push(callback);
}

export function createSpawner(xCord:number, zCord: number, type: string){
    console.log(spawners[type])
    let spawner = spawners[type];

    let depoMat = new THREE.MeshBasicMaterial();
    depoMat.color = new THREE.Color(stringToColour(type))
    // depoMat.wireframe = true;

    const depoMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1, 2.5), depoMat)
    depoMesh.position.set(xCord, 0, zCord);
    depoMesh.position.y = 0
    scene.add(depoMesh)

    const depoBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
    depoBody.setTranslation(new RAPIER.Vector3(xCord, 0, zCord), false)
    const depoShape = RAPIER.ColliderDesc.cuboid(1.25, 0.5, 1.25);
    depoShape.setFriction(0.1)
    // depoShape.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
    world.createCollider(depoShape, depoBody)
    depoBody.userData = {conveyor: true}

    let rate = spawner.rate ? spawner.rate : config.spawnTime;

    const loader = new GLTFLoader();

    // Load a glTF resource
    loader.load(
        // resource URL
        spawner.child.model,
        function ( gltf ) {
            console.log(gltf);

            // var object = gltf.scene;
            gltf.scene.scale.set(spawner.child.scale[0], spawner.child.scale[1], spawner.child.scale[2]);
            gltf.scene.position.set(spawner.child.position[0], spawner.child.position[1], spawner.child.position[2]);
            
            depoMesh.userData.child = gltf;
            
            let callback = setInterval(myCallback, rate, depoMesh.userData.child, xCord, zCord, spawner.labelText, spawner.value, spawner.child); 
            depoMesh.userData.callback = callback;
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

    createdSpawners.push([ depoMesh, depoBody ])
}

function myCallback(childMesh: GLTF, xCord:number, zCord: number, labelText:Text, value:number, childInfo:JSON) {
    if (!states.focused) return;
    createSelleable(childMesh, xCord, zCord, labelText, value, childInfo)
}