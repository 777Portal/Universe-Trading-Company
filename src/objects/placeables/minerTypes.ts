type Spawner = {
    /**
     * The amount of money added to balance when sold
     */
    value: number;
    /**
     * What its children's text label will display
     */
    labelText: string;
    /**
     * The rate at which it spawns (config.spawnTime if not def)
     */
    rate ? : number;
    /**
     * The parent model
     */
    model ? : string;

    /**
     * The parent scale
     */
    scale ? : number[];

    /**
     * The spawned stuff
     */
    child: {
        scale: number[];
        position: number[];
        model: string;
    };    
};

const debug: Spawner = {
    value: 1,
    labelText: 'Minecraft steve??? (debug spawn)',
    rate: 250,
    child: {
        model: './steve/source/model.gltf',
        scale: [1, 1, 1],
        position: [0, -1, 0]
    }
};

const apple: Spawner = {
    value: 10,
    labelText: 'Apple',
    model: '/apple/scene.gltf',
    scale: [0.5, 0.5, 0.5],
    rate: 1000,
    child: {
        model: './apple-mine/Apple.gltf',
        scale: [0.5, 0.5, 0.5],
        position: [0, -0.20, 0]
    }
};


const grapes: Spawner = {
    value: 100,
    labelText: 'Grapes',
    model: '/grapes/grapes.gltf',
    scale: [0.5, 0.5, 0.5],
    rate: 1000,
    child: {
        model: './grapes/grapes.gltf',
        scale: [1, 1, 1],
        position: [0, -0.35, 0]
    }
};

export const spawners: Record<string, Spawner> = {
    debug,
    apple,
    grapes
};