import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
// import { scene } from "../setupThree";

export function createTileUi( object : THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>, position?: {x?:number, y?:number, z?:number}){
    const container = new ThreeMeshUI.Block({
        height: 4,
        width: 2,
        backgroundOpacity: 0,
        interLine: 0.05
    });

    container.userData = {uiParent: true}
    
    const size = object.scale.y // (new THREE.Vector3());
    container.position.set(position?.x ?? 0, size+0.5, position?.z ?? 0);
    container.rotation.x = -0.55;
    
    const imageBlock = new ThreeMeshUI.Block({
        height: 2,
        width: 2,
    });

    const objectClone = object.clone();
    objectClone.userData = {};
    objectClone.scale.set(0.5, 0.5, 0.5);
    objectClone.position.set(0, 0, 0)
    objectClone.rotateX(1.5)

    console.log(container.userData, container, objectClone.userData, objectClone)
    
    imageBlock.add(objectClone);

    const textBlock = new ThreeMeshUI.Block({
        height: 0.4,
        width: 2.5,
        margin: 0.05,
    });
        
    const buttonsBlock = new ThreeMeshUI.Block({
        height: 0.4,
        width: 10,
        margin: 0.05,
        backgroundOpacity: 0,
    });
    
    container.add(imageBlock, textBlock, buttonsBlock);
    
    //@ts-ignore
    container.set({
        fontFamily: './fonts/Roboto-msdf.json',
        fontTexture: './fonts/Roboto-msdf.png',
    });
    
    const text = new ThreeMeshUI.Text({
        textAlign: "center",
        content:
          "TILE UIIIIIIIII!",
        fontSize: 0.3,
        justifyContent: "end",
        padding: 0.03,
    });

    textBlock.add(
        new ThreeMeshUI.Text({
          content: "...",
          fontSize: 0.10,
        //   fontColor: new THREE.Color(0xefffe8),
        })
    );

    const deleteBlock = new ThreeMeshUI.Block({
        height: 0.4,
        width: 1,
        margin: 0.05,
        borderRadius: 0.075
    });

    deleteBlock.userData = { deleteBlockButton: true }

    const deleteButton = new ThreeMeshUI.Text({
        fontColor: new THREE.Color( 1, 0, 0 ),
        textAlign: "center",
        fontSize: 0.20,
        content:
          "Delete tile",
    });
    
    const closeBlock = new ThreeMeshUI.Block({
        height: 0.4,
        width: 1,
        margin: 0.05,
        borderRadius: 0.075
    });

    const closeButton = new ThreeMeshUI.Text({
        fontColor: new THREE.Color( 1, 0, 0 ),
        textAlign: "center",
        fontSize: 0.20,
        content:
          "close ui",
    });

    deleteBlock.add(deleteButton);
    buttonsBlock.add(deleteBlock)
    
    closeBlock.add(closeButton)
    buttonsBlock.add(closeBlock)

    textBlock.add(text);
    
    object.add(container)
}
