import { loaded } from './preload';

import * as THREE from 'three'

import RAPIER from '@dimforge/rapier3d'

// export var staticObjects: [THREE.Object3D, RAPIER.RigidBody][] = []

import { scene } from '../../setupThree'
import { dynamicBodies, world } from '../../setupPhysics'
import { stringToColour } from "../../util";
import { placeableTiles } from './tileTypes';
import { states } from '../../states';
import { preliminarySaveObject } from '../../saves';
// import { createTileUi } from '../../gui/createTileUi';

export async function createTile(xCord: number, zCord: number, type: string, overwriteUUID ? : string ): Promise<THREE.Group> {
    // console.log(placeableTiles[type]);
    
    let uuid;
    if (overwriteUUID) {
        uuid = overwriteUUID;
    }
    uuid = self.crypto.randomUUID();
    preliminarySaveObject(uuid, { uuid, x:xCord, z:zCord })
    
    let tile = placeableTiles[type];

    let parent = new THREE.Group();
    if (tile.boundingBoxes[0].userdata) {
        const clonedParentUserData = structuredClone(tile.boundingBoxes[0].userdata);
        // @ts-ignore
        clonedParentUserData.rotation = states.rotation;
        // @ts-ignore
        clonedParentUserData.UUID = uuid;
        parent.userData = clonedParentUserData;
    }      

    for (let boundingBox of tile.boundingBoxes) {
        let correct = getCorrectNumberForRotation(boundingBox.rotationTranslation, states.rotation)

        let boundingMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(stringToColour(`${xCord}${zCord}`)),
            wireframe: true
        });

        const geometry = new THREE.BoxGeometry(
            boundingBox.scale[0],
            boundingBox.scale[1],
            boundingBox.scale[2]
        );

        const boundingMesh = new THREE.Mesh(geometry, boundingMat);

        const rotationY = states.rotation * Math.PI / 2;

        boundingMesh.position.set(
            xCord + boundingBox.position[0] + correct.x,
            boundingBox.position[1] + correct.y,
            zCord + boundingBox.position[2] + correct.z
        );

        boundingMesh.rotation.y = rotationY;

        while (!loaded[tile.model]) {
            await new Promise(res => setTimeout(res, 1000));
        }

        if (loaded[tile.model] && parent.children.length <= 0){
            boundingMesh.add(loaded[tile.model]?.scene.clone());
        }

        parent.add(boundingMesh);

        const boundingBody = world.createRigidBody(
            RAPIER.RigidBodyDesc.fixed()
                .setTranslation(
                    xCord + boundingBox.position[0] + correct.x,
                    boundingBox.position[1] + correct.y,
                    zCord + boundingBox.position[2] + correct.z
                )
                .setRotation({ x: 0, y: Math.sin(rotationY / 2), z: 0, w: Math.cos(rotationY / 2) })
        );

        const boundingShape = RAPIER.ColliderDesc.cuboid(
            boundingBox.scale[0] / 2,
            boundingBox.scale[1] / 2,
            boundingBox.scale[2] / 2
        )
            .setFriction(0.1)
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

        // @ts-ignore
        if (boundingBox.userdata) {
            const clonedUserData = structuredClone(boundingBox.userdata);
            
            // @ts-ignore
            clonedUserData.rotation = states.rotation;
            // @ts-ignore
            clonedUserData.UUID = uuid;
            
            boundingBody.userData = clonedUserData;
            boundingMesh.userData = clonedUserData;
        }

        if (boundingBox.addons && boundingBox.addons?.length > 0){
            for (const func of boundingBox.addons){
                try {
                    func(boundingMesh);
                } catch (error) {
                    console.warn('error when attempting to run ' + func + ' - ' + error)
                }
            }
        }

        // if (boundingBox.userdata) boundingBody.userData = boundingBox.userdata;
        let colider = world.createCollider(boundingShape, boundingBody);
        console.log(colider)

        dynamicBodies.push([boundingMesh, boundingBody]);
    }
    if (parent instanceof THREE.Object3D ) { 
        scene.add(parent);
    }else {
        console.warn('No parent found in createTil')
    }

    return parent;
}

function getCorrectNumberForRotation(translations: number[], dir:number){
    let x = translations[0]
    let y = translations[1];
    let z = translations[2];

    switch (dir) {
        case 0: {
            x = 0;
            y = 0
            z = 0;
            break
        }
        case 1: {
            break;
        }
        case 2:
            x = 0;
            y = 0
            z = 0;
            break
        case 3: {
            break
        }
    }

    return {x,y,z}
}

