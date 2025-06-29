import ThreeMeshUI from "three-mesh-ui";
import { camera, placingIndicator, scene } from "../setupThree";
import { createButton } from "./createButton";
import { buttonOptions } from "./welcome";
import * as THREE from 'three'
import { placeableTiles } from "../objects/placeables/tileTypes";
import { loaded } from "../objects/placeables/preload";
import { states } from "../states";
import { createTile } from "../objects/placeables/createTile";
import { snap } from "../util";

const container = new ThreeMeshUI.Block({
    // width: 1.2,
    height: 0.6,
    padding: 0.05,
    backgroundColor: new THREE.Color(0x333333),
    width: 0.5,
    backgroundOpacity: 0,
    // interLine: 0.05,
    fontFamily: './Hex Girlfriend-msdf/Hex Girlfriend-msdf.json',
    fontTexture: './Hex Girlfriend-msdf/HexGirlfriend.0.png',
});

const imageBlock = new ThreeMeshUI.Block({
    height: 0.5,
    width: 0.5,
});

container.add( imageBlock )

container.userData = {uiParent: true}

// @ts-ignore
const buttonContainer = new ThreeMeshUI.Block( {
    justifyContent: 'center',
    contentDirection: 'row-reverse',
    fontFamily: './Hex Girlfriend-msdf/Hex Girlfriend-msdf.json',
    fontTexture: './Hex Girlfriend-msdf/HexGirlfriend.0.png',
    fontSize: 0.07,
    padding: 0.02,
    borderRadius: 0.11
});

const textBlock = new ThreeMeshUI.Block({
    width: 1.2,
    height: 0.6,
    margin: 0.05,
    textAlign: "center",
    fontSize: 0.3,
    padding: 0.03,
});

textBlock.add( new ThreeMeshUI.Text( 
    { 
        content: 'tile to place', 
        width: 1.2,
        height: 0.6,
        justifyContent: 'center',
        fontFamily: './Hex Girlfriend-msdf/Hex Girlfriend-msdf.json',
        fontTexture: './Hex Girlfriend-msdf/HexGirlfriend.0.png',
        offset: 0.05,
        fontSize: 0.12,
        margin: 0.02,
        borderRadius: 0.07 
    }
) )

textBlock.name = 'placeableTitle'

// @ts-ignore
let added = []
var group = new THREE.Group();
for (const tileName in placeableTiles) {
    const name = tileName; // capture the current value
    let tile = placeableTiles[name];

    if (tile.cost !== 0) continue;

    while (!loaded[tile.model]) {
        await new Promise(res => setTimeout(res, 1000));
    }

    if (loaded[tile.model]){
        let clone = loaded[tile.model]?.scene.clone();
        clone.scale.set(0.5, 0.5, 0.5);
        clone.position.set(0, 0, 0)
        clone.rotateX(.8)

        clone.visible = false;
        // @ts-ignore
        tile.magic = tileName;
        clone.userData = tile
        added.push(clone);

        // console.log('adding ' + clone)
        console.log(clone)

        imageBlock.add(clone);
    }
}

added[0].visible = true;
// @ts-ignore
states.placingCallback = () => createTile(snap(states.locationX), snap(states.locationZ), added[0].userData.magic)

let index = 0;
function showObject(dir: number){
    var newIndex =( index + dir );
    console.log('called, showobject, new index: ' + newIndex)
    if (newIndex < added.length && newIndex > -1){
        // @ts-ignore
        added[index].visible = false;
        // @ts-ignore
        added[newIndex].visible = true;

        // @ts-ignore
        states.placingCallback = () => createTile(snap(states.locationX), snap(states.locationZ), added[newIndex].userData.magic)

        let title = scene.getObjectByName('placeableTitle');
        // @ts-ignore
        title.children[1].set({ content: added[newIndex].userData.labelText })

        index = newIndex;
    }
}
export function rotateState() {
    states.rotation = (states.rotation + 1) % 4;

    placingIndicator.rotateY(Math.PI / 2);

    // @ts-ignore
    for (let mesh of added) {
        mesh.rotation.y = 0;
        mesh.rotateY((Math.PI / 2) * states.rotation);
    }
}

function togglePlacing(){
    states.placing = !states.placing
}

console.log(group)
container.add( textBlock, buttonContainer);

const buttonNext = createButton( 'next', buttonOptions, showObject, [ 1 ] );

const place = createButton( 'place (pc)', buttonOptions, togglePlacing, [ 1 ] );

const rotate = createButton( 'rotate', buttonOptions, rotateState, [ 1 ] );

const buttonPrevious = createButton( 'back', buttonOptions, showObject, [ -1 ] );

buttonContainer.add( buttonNext, rotate, place, buttonPrevious );

container.position.set(0, -0.3, -3);
camera.add(container);
console.log('\n\n\n added container');