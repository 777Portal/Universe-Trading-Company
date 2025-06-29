// import { createTileUi } from "../../gui/createTileUi";
import { addonCreateSpawner } from "./createSpawner";
// import { createWall } from "./createWall";

// function debugFunny(){
//     alert('test')
// }

const conveyerTile: placeableTile = {
    cost: 0,
    labelText: 'conveyer',
    model: './conveyer/conveyer.gltf',
    scale: [2.5, 2.35, 2.5],
    position: [0,-0.5,0],
    boundingBoxes: [
        {
            scale: [2.5, 1, 2.5],
            position: [0, 0, 0],
            rotationTranslation: [0,0,0],
            addons: [],
            userdata: { 
                conveyor: true
            }
        },
        {
            scale: [2.5, 0.25, 0.25],
            position: [0, 0.65, 1.15],
            rotationTranslation: [1.15,0,-1.15],
            userdata: { 
                conveyor: false
            }
        },
        {
            scale: [2.5, 0.25, 0.25],
            position: [0, 0.65, -1.15],
            rotationTranslation: [-1.15,0,1.15],
            userdata: { 
                conveyor: false
            }
        }
    ]
};

const conveyerTileFlat: placeableTile = {
    cost: 0,
    labelText: 'flat conveyer',
    model: './conveyer/conveyer_flat.gltf',
    scale: [2.5, 2.35, 2.5],
    position: [0,-0.5,0],
    boundingBoxes: [
        {
            scale: [2.5, 1, 2.5],
            position: [0, 0, 0],
            rotationTranslation: [0,0,0],
            addons: [],
            userdata: { 
                conveyor: true
            }
        }
    ]
};


const defaultTile: placeableTile = {
    cost: 1,
    labelText: 'default_spawner',
    model: './default/default.gltf',
    scale: [1, 1, 1],
    position: [0,-0.5,0],
    boundingBoxes: [
        {
            scale: [0.1, 0.1, 0.1],
            position: [0, 0, 0],
            rotationTranslation: [0,0,0],
            addons: [addonCreateSpawner],
            userdata: {
                child: './default/default.gltf',
                rate: 1000,
                spawnerText: 'debug',
                spawnerSellValue: 10
            }
        },
    ]
}

const spaceship: placeableTile = {
    cost: 1,
    labelText: 'spaceship',
    model: './spaceship/spaceship.gltf',
    scale: [10, 10, 10],
    position: [0,-0.5,0],
    boundingBoxes: [
        {
            scale: [7.5, 9.25, 7.5],
            position: [0, 0, 0],
            rotationTranslation: [0,0,0],
            useCollisionEvents: true,
            userdata: { 
                conveyor: true,
                addLoadLocation: true

            }
        },
        {
            scale: [10, 1, 10],
            position: [0, 4.4, 0],
            rotationTranslation: [0, 0, 0],
            userdata: { 
                conveyor: false,
                addLoadLocation: true
            },
        }
    ]
}

export const placeableTiles: Record<string, placeableTile> = {
    conveyerTile, spaceship, defaultTile, conveyerTileFlat
};

type BoundingBox = {
    scale: number[];
    useCollisionEvents ? : boolean;
    position: number[];
    rotationTranslation: number[];
    userdata ? : {};
    /**
     * Calls a function. Will get passed mesh object that originated the function
    */
    addons?: Function[];
}

type placeableTile = {
    /**
     * The amount of money added to balance when sold
     */
    cost: number;

    /**
     * What its text label will display
     */
    labelText: string;

    /**
     * The parent model
     */
    model: string;

    /**
     * The parent scale
     */
    scale?: number[];

    /**
     * The parent position
     */
    position?: number[];

    /**
     * The physics objects (fixed)
     */
    boundingBoxes: BoundingBox[];
};