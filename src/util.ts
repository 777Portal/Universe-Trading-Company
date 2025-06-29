import * as THREE from 'three'
export var stringToColour = function(str:string) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

let gridSize = 0.5;

export function snap(x: number): number {
    return Math.floor((x / gridSize) + 0.5) * gridSize;
}

export function snapVector(v: { x: number, y: number, z: number }) {
    return {
        x: snap(v.x),
        y: snap(v.y),
        z: snap(v.z),
    };
}

export function findParentByAttribute(obj: THREE.Object3D, property: string): THREE.Object3D | null {
    let current: THREE.Object3D | null = obj;
  
    while (current !== null) {
        if (current.userData?.[property] === true) {
            return current;
        }
        current = current.parent;
    }
  
    return null;
  }

export function spawnAllSpawners(){   
}