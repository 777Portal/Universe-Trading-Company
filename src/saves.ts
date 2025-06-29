// @ts-ignore
export var save;
if ( !localStorage.save ) {
    save = {
        locations: {
            'UUID': {

            }
        }
    }
}

/**
 * Only to be used when first loading a tile from a savefile / creating a new tile
 * If it exists, this will not update.
 * Only called in the createTile method.
 * @param UUID - key to check for. 
 * @returns Nothing
 * @example
 * preliminarySave("3812-2388-1239-1312", {"currentHeld":9999});
 */
export function preliminarySaveObject(UUID: string, value: {}){
    if (save[UUID]) return;
    else save[UUID] = {};
    save[UUID] = value;
    console.log('added! current save: '+JSON.stringify(save))
}
