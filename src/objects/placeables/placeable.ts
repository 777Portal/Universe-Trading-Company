import { createSpawner } from "./createSpawner";
import { spawners } from "./minerTypes"
import { states } from '../../states';
import { snap } from "../../util";
// import { createConveyer } from "./createConveyer";
import { createWall } from "./createWall";
import { createTile } from "./createTile";
import { placeableTiles } from "./tileTypes";

export var placeables = () => {
    let placeableObjects: { [key: string]: () => void } = {
        // conveyer: () => createTile(snap(states.locationX), snap(states.locationZ), 'conveyerTile'),
        wall: () => createWall(snap(states.locationX), snap(states.locationZ))
    }

    for (const spawnerName in spawners) {
        const name = spawnerName; // capture the current value
        placeableObjects[name] = () => createSpawner(snap(states.locationX), snap(states.locationZ), name);
    }

    for (const spawnerName in placeableTiles) {
        const name = spawnerName; // capture the current value
        placeableObjects[name] = () => createTile(snap(states.locationX), snap(states.locationZ), name);
    }

    
    return placeableObjects
}