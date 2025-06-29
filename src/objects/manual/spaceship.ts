import { createTile } from "../placeables/createTile";
import { loaded } from "../placeables/preload";
import * as THREE from 'three'
export const mixers: THREE.AnimationMixer[] = [];

let parent = await createTile(0, -10, 'spaceship');

// terrible terrible hack... its 1:22am
export function playLeaveAnimation(){
    const modelGroup = parent.getObjectByProperty('type', 'Group');
    
    const gltf = loaded["./spaceship/spaceship.gltf"];
    if (gltf && gltf.animations.length > 0 && modelGroup) {
        const mixer = new THREE.AnimationMixer(modelGroup);
        const action = mixer.clipAction(gltf.animations[0]); 
        action.play();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;       
        console.error(gltf, modelGroup)
    
        mixers.push(mixer); 
    }
} 