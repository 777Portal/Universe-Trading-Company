import ThreeMeshUI from "three-mesh-ui";
import { camera, renderer, scene } from "../setupThree";
import { HTMLMesh } from 'three/addons/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/addons/interactive/InteractiveGroup.js';
import { controller1, controller2 } from "../setupVr";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { config, states } from "../states";
import { world } from "../setupPhysics";
import { placeables } from "../objects/placeables/placeable";
import { createButton } from "./createButton";
import { createTile } from "../objects/placeables/createTile";
import { playLeaveAnimation } from "../objects/manual/spaceship";

// import { contain } from "three/src/extras/TextureUtils.js";

export const gui = new GUI()

const miscFolder = gui.addFolder('misc')
miscFolder.add(config, 'deleteTime')
miscFolder.add(config, 'spawnTime')

//@ts-ignore
gui.add( states, 'placingCallback', placeables() );

const statesFolder = gui.addFolder('states')
statesFolder.add( states, 'placing' )
statesFolder.add( states, 'focused' )

const physicsFolder = gui.addFolder('Physics')
physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'z',  -10.0, 10.0, 0.1)

export const buttonOptions = {
    width: 0.4,
    height: 0.15,
    justifyContent: 'center',
    offset: 0.05,
    margin: 0.02,
    borderRadius: 0.075
};

function welcome(){
    const group = new InteractiveGroup();
    group.listenToPointerEvents( renderer, camera );
    group.listenToXRControllerEvents( controller1 );
    group.listenToXRControllerEvents( controller2 );
    scene.add( group );

    const mesh = new HTMLMesh( gui.domElement );
    mesh.position.x = - 0.75;
    mesh.position.y = 1.5;
    mesh.position.z = - 0.5;
    mesh.rotation.y = Math.PI / 4;
    mesh.scale.setScalar( 2 );
    group.add( mesh );

    const container = new ThreeMeshUI.Block({
        height: 4,
        width: 2,
        backgroundOpacity: 0,
        interLine: 0.05
    });

    container.position.set( 0, 0, -2.8 );
	container.rotation.x = -0.35;

    // @ts-ignore // I HATE TYPESCRIPT I HATE TYPESCRIPT I HATE I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT  I HATE TYPESCRIPT 
    // Came back to say, i don't hate typescript (loud incorrect buzzer sound), i hate that mesh ui's block class for some reason doesn't include some of its params. the addon has béen abandoned for like 2yrs
    const buttonContainer = new ThreeMeshUI.Block( {
		justifyContent: 'center',
		contentDirection: 'row-reverse',
        fontFamily: './Hex Girlfriend-msdf/Hex Girlfriend-msdf.json',
        fontTexture: './Hex Girlfriend-msdf/HexGirlfriend.0.png',
		fontSize: 0.07,
		padding: 0.02,
		borderRadius: 0.11
	} );

    container.userData = {uiParent: true}

    const textBlock = new ThreeMeshUI.Block({
        height: 2.1,
        width: 2.5,
        margin: 0.05,
        textAlign: "center",
        fontSize: 0.3,
        padding: 0.03,
    });

    textBlock.add( new ThreeMeshUI.Text( 
        { 
            content: 'Tutorial pane \n (click next)', 
            width: 0.4,
            height: 0.15,
            justifyContent: 'center',
            fontFamily: './Hex Girlfriend-msdf/Hex Girlfriend-msdf.json',
            fontTexture: './Hex Girlfriend-msdf/HexGirlfriend.0.png',
            offset: 0.05,
            fontSize: 0.12,
            margin: 0.02,
            borderRadius: 0.07 
        }
    ) )

    textBlock.name = "tutorial text"

    container.add( textBlock, buttonContainer);

	// const buttonPrevious = createButton( 'back', buttonOptions, movePageOfDialouge, [ -1 ] );
	const buttonNext = createButton( 'next', buttonOptions, movePageOfDialouge, [ 1 ] );

    buttonContainer.add( buttonNext, /*buttonPrevious*/ );

    container.add(buttonContainer)
    
    camera.add(container);
}

let welcomeTexts = [
    'Welcome to untitled automation game!',
    'if you are in vr, trigger buttons to move.\n\n If you are on pc, hold and drag right mouse button',
    'Your mission is simple.\n\n Launch the spaceship by filling its cargo with the required items.',
    'The first factory has been created.\n\n Look around the map, and place conveyer belts to the spaceship\'s base! (squeeze buttons to place in vr!) \n\n click next to hide this gui!',
    '',
    'congrats, you have reached the end of the demo! \n sorry it was so short, I plan on expanding this game in the future to fit with my orginal vision, but i was cut short by a deadline \n\nThanks for playing!',
    ''
]

let index = -1;

export function movePageOfDialouge(movement: number){
    let newVal = index + movement;
    if (newVal < 0 || newVal > welcomeTexts.length-1) return;
    
    index = newVal;
    let tutorialText = scene.getObjectByName('tutorial text');
    // @ts-ignore
    // console.log(tutorialText?.children[1])
    // @ts-ignore
    tutorialText.children[1].set({ content: welcomeTexts[index] })
    
    if ( index == 2 ) {
        createFirstFactory()
    }

    //@ts-ignore
    if (tutorialText.parent.visible == false){
        //@ts-ignore
        tutorialText.parent.visible = true;
    }

    if ( index == 3 || index == 6 ) {
        // @ts-ignore
        tutorialText.parent.visible = false;
    }

    if (index == 6){
        playLeaveAnimation();
    }
}

function createFirstFactory(){
    console.log('created first factory')
    createTile(15, -10, 'defaultTile')
}

welcome();