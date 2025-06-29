import ThreeMeshUI from "three-mesh-ui";

export function createButton(buttonText: string, buttonOptions: ThreeMeshUI.BlockOptions, callback: Function, args: any [] ){

    const container = new ThreeMeshUI.Block({
        height: 4,
        width: 2,
        backgroundOpacity: 0,
        interLine: 0.05
    });

    container.position.set( 0, 1, -1.8 );
	container.rotation.x = -0.35;

	const button = new ThreeMeshUI.Block( buttonOptions );
	button.add(
		new ThreeMeshUI.Text( { content: buttonText } ),
    );

    button.userData = {isButton: true, callback, args};
    return button;
}