import * as THREE from 'three'

// @ts-ignore
import { renderer, labelRenderer, camera, placingIndicator, scene } from './setupThree'

import { cubeMesh } from './objects/manual/lambart'
import { floorMesh } from './objects/manual/floor'

import { dynamicBodies, world } from './setupPhysics'

import { CSS2DObject } from 'three/examples/jsm/Addons.js'
import { findParentByAttribute, snap } from './util'
import { states } from './states'
import { toDeleteDynamic } from './main'

// @ts-ignore compiler thinks its not being used for some reason
var BUTTON_INTERSECTION = states.BUTTON_INTERSECTION
// import { staticObjects } from './objects/placeables/createTile'

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

renderer.domElement.addEventListener('mousemove', (e) => {
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
  
    raycaster.setFromCamera(mouse, camera)
  
    const intersectsRigid = raycaster.intersectObjects(
      [...dynamicBodies.map(pair => pair[0])],
      false
    )
  
    const intersectsBaseplate = raycaster.intersectObjects(
      [floorMesh],
      false
    )
  
    if (intersectsRigid.length) {
      dynamicBodies.forEach((b, i) => {
        i
        if (b[0] === intersectsRigid[0].object) // matches
        {
          if (b[0]?.userData?.clickEvent) {
            // console.log(b[0].userData)
            // let type = b[0].userData.clickEvent;
            let hasLabel = b[0].userData.hasLabel
            if (hasLabel){
              for( let child of b[0].children ){
                if (child instanceof CSS2DObject)
                  states.currentlyHovered = child
                  // console.log(child);
              }
              // console.log(b[0])
            }
          }
          // b[1].applyImpulse(new RAPIER.Vector3(0, 10, 0), true)
        }
        // b[0] === intersects[0].object && b[1].applyImpulse(new RAPIER.Vector3(0, 10, 0), true)
      })
    }
  
    if (intersectsBaseplate.length) { 
      if (intersectsBaseplate[0].object == floorMesh) {
        states.locationZ = intersectsBaseplate[0].point.z;
        states.locationX = intersectsBaseplate[0].point.x;
        if ( !states.placing ) return;
        placingIndicator.position.set( snap(intersectsBaseplate[0].point.x), snap(0), snap(intersectsBaseplate[0].point.z) )
        // createSpawner(intersectsBaseplate[0].point.x, intersectsBaseplate[0].point.z, "debug")
      } 
      
      // b[0] === intersects[0].object && b[1].applyImpulse(new RAPIER.Vector3(0, 10, 0), true)
    }
  })

renderer.domElement.addEventListener('click', (e) => {
    mouse.set(
      (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
  
    raycaster.setFromCamera(mouse, camera)

    let tileDeleteButtons: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child.userData?.deleteBlockButton === true) {
        tileDeleteButtons.push(child);
      }
    });

    const intersectsTileDeleteButtons = raycaster.intersectObjects(
      tileDeleteButtons,
    )

    // console.log('delete buttons: ' + tileDeleteButtons.length + ' larger then 1: '+ (intersectsTileDeleteButtons.length > 0))    
    if (intersectsTileDeleteButtons.length > 0){
      console.log('clicked delete button @' + intersectsTileDeleteButtons[0].object.position.toString() )
      
      let parent = findParentByAttribute(intersectsTileDeleteButtons[0].object, 'uiParent')
      let holder = parent?.parent?.parent
      if (!holder || typeof holder == null ) return;
      
      let children = holder.children;
      for (let i = 0; i < holder.children.length; i++){
        let child = children[i];
        for (let z = 0; z < dynamicBodies.length; z++) {
          const body = dynamicBodies[z];
          if (body[0] === child) {
            console.log('scheduled ' + z + ' for deletion')
            toDeleteDynamic.push(z);
            scene.remove(holder)
          }
        }
      }      

      console.log('scheduled ' + toDeleteDynamic.length + ' for deletion on next tick')

      holder.visible = false;
    }

    let buttons: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child.userData?.isButton === true) {
        buttons.push(child);
      }
    });

    const intersectsButton = raycaster.intersectObjects( [ ...buttons ] );
  
    // console.log(intersectsButton.length)
    if ( intersectsButton.length > 0 ) {  
      BUTTON_INTERSECTION = intersectsButton[ 0 ].object;
      
      let foundFunction = false;
      let current = intersectsButton[ 0 ].object;

      while (current?.parent && !foundFunction) {
          if (current.userData?.hasOwnProperty('callback')) {
              foundFunction = true;
              break;
          }

          current = current.parent;
      }

      if (!foundFunction) return console.warn('Couldn\'t find parent for button :(');

      const args = current.userData.args ?? [];
      current.userData.callback(...args);
      return;
    }

    const intersectsRigid = raycaster.intersectObjects(
      [cubeMesh, ...dynamicBodies.map(pair => pair[0])],
      false
    )
  
    const intersectsBaseplate = raycaster.intersectObjects(
      [floorMesh, cubeMesh, ...dynamicBodies.map(pair => pair[0])],
      false
    )
  
    if (intersectsRigid.length) {
      dynamicBodies.forEach((b, i) => {
        if (b[0] === intersectsRigid[0].object) // matches
        {
          if (b[0]?.userData?.clickEvent) {
            // console.log(b[0].userData)
            let type = b[0].userData.clickEvent;
            switch (type){
              case 'add':
                world.removeRigidBody(dynamicBodies[i][1]);
                b[0].visible = false;
                dynamicBodies.splice(i, 1);
                break;
            }
          }
        }
      })
    }
  
    // console.log(intersectsBaseplate.length)
    if (intersectsBaseplate.length) { 
      if (intersectsBaseplate[0].object == floorMesh) {
        states.locationX = intersectsBaseplate[0].point.x;
        states.locationZ = intersectsBaseplate[0].point.z;
        if ( !states.placing ) return;
        states.placingCallback();
      }
    }
})