import { spawners } from "./minerTypes";
import { placeableTiles } from "./tileTypes"; 
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';

export var loaded: { [key: string]: GLTF } = {};

for (const spawnerName in spawners) {
    const name = spawnerName; // capture the current value
    let spawner = spawners[name]

    preload(spawner.child.model, spawner.child.scale, spawner.child.position)
}

for (const tileName in placeableTiles) {
    let currentTile = placeableTiles[tileName];
    let scale = currentTile.scale ?? [0, 0, 0];
    let position = currentTile.position ?? [0, 0, 0];

    for (let i = 0; i < currentTile.boundingBoxes.length; i++) {
        let currentBoxOfChild = currentTile.boundingBoxes[i];
        if (!currentBoxOfChild?.userdata) continue;
        // @ts-ignore
        if (currentBoxOfChild?.userdata?.child === true) {
            // @ts-ignore
            preload(currentBoxOfChild.userdata.child, [1,1,1], [0,0,0]);
        }
    }

    preload(currentTile.model, scale, position);
}


function preload(link:string, scale: number[], position: number[]){
    console.log('preloading ' + link)
    const loader = new GLTFLoader();
    // Load a glTF resource
    loader.load(
        // resource URL
        link,
        function ( gltf ) {
            // console.log(gltf);
            // console.log(gltf.animations)

            gltf.scene.scale.set(scale[0], scale[1], scale[2]);
            gltf.scene.position.set(position[0], position[1], position[2]);

            loaded[link] = gltf;
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
}