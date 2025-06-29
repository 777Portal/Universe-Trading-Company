import './style.css'

import { states, config } from './states';

import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'

import ThreeMeshUI from 'three-mesh-ui';
import RAPIER from '@dimforge/rapier3d'

import './setupPhysics'
import { world, dynamicBodies } from './setupPhysics'

import './setupThree'
import { camera, renderer, labelRenderer, scene, controls } from './setupThree';

import './setupVr'

import './objects/manual/setupLights'

import './objects/manual/wall'

import './clickHandler'

import './gui/welcome'

import './objects/placeables/preload'

import './objects/placeables/createTile'

import './objects/manual/spaceship'
import { vrRaycast } from './setupVr';
import './gui/selectionGui'
import { rotateState } from './gui/selectionGui';
import { save } from './saves';
import { movePageOfDialouge } from './gui/welcome';
import { mixers } from './objects/manual/spaceship';

const stats = new Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()
let delta

export const toDeleteDynamic: number[] = [];
export const toDeleteStatic: number[] = [];

function moveMoveableObjects() {
  try {
    let moveable = scene.children.filter((child) => child.userData?.moveableOnConveyer === true);

    let conveyors: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child.userData?.conveyor === true) {
        conveyors.push(child);
      }
    });

    const updates: { handle: RAPIER.ColliderHandle, linvel: RAPIER.Vector3, reset: boolean }[] = [];

    for (let object of moveable) {
      const origin = object.position.clone();
      const direction = new THREE.Vector3(0, -1, 0);
      const raycaster = new THREE.Raycaster(origin, direction);
      
      const intersects = raycaster.intersectObjects(conveyors, true);

      const collider = object.userData.collider;
      // updates.push({ handle: collider.handle, linvel, reset: true });

      if ( intersects.length < 0 ) {
        console.log('no intersections found for items')
        // alert(' n');
        let linvel = new RAPIER.Vector3(0, -9.8, 0); 
        updates.push({ handle: collider.handle, linvel, reset: true });
      }

      if ( intersects.length > 0 && intersects[0].distance >= 3 ) {
        // console.log('closest is < 3 ' + intersects[0].distance )
        let linvel = new RAPIER.Vector3(0, -9.8, 0); 
        updates.push({ handle: collider.handle, linvel, reset: true });
      }

      if (intersects.length > 0 && intersects[0].distance <= 0.4) {
        const hit = intersects[0];
        const collider = object.userData.collider;
        
        if (collider?.applyImpulse) {
          let linvel;
          let newHit = findConveyorParent(hit.object);
          // console.log(newHit)
          // console.log(intersects[0].distance, object.userData.moveableOnConveyer)

          // @ts-ignore
          switch (newHit.userData.rotation) {
            case 0: linvel = new RAPIER.Vector3(5.5, -1, 0); break;
            case 3: linvel = new RAPIER.Vector3(0, -1, 5.5); break;
            case 2: linvel = new RAPIER.Vector3(-5.5, -1, 0); break;
            case 1: linvel = new RAPIER.Vector3(0, -1, -5.5); break;
            default: linvel = new RAPIER.Vector3(0, -1, 0);
          }
          // linvel = new RAPIER.Vector3(0, 10, 0);
          updates.push({ handle: collider.handle, linvel, reset: false });
        }
      }
    }
    
    for (let update of updates) {
      const collider = world.getCollider(update.handle);
      if (!collider) continue;
      
      const bodyHandle = collider.parent();
      if (bodyHandle === null) continue;

      const body = world.getRigidBody(bodyHandle.handle);
      if (!body) continue;
      
      if (update.reset){
      } else {
        body.setLinvel(update.linvel, false); 
      }
    }
    
  } catch (error) {
    console.error(error)
  }
}

function findConveyorParent(obj: THREE.Object3D): THREE.Object3D | null {
  let current: THREE.Object3D | null = obj;

  while (current !== null) {
    if (current.userData?.conveyor === true) {
      return current;
    }
    current = current.parent;
  }

  return null;
}

let eventQueue = new RAPIER.EventQueue(true);

renderer.setAnimationLoop(render);
// function handleEverythingElse

// requestAnimationFrame(render)
function render() {
  delta = clock.getDelta()

  world.timestep = Math.min(delta, 1)
  highLightHovered();

  eventQueue.drainCollisionEvents((handle1, handle2, started) => {
    const collider1 = world.getCollider(handle1);
    const collider2 = world.getCollider(handle2);
    if (!collider1 || !collider2) return;

    const parent1 = collider1.parent();
    const parent2 = collider2.parent();
    if (!parent1 || !parent2) return;

    const userData1 = parent1.userData;
    const userData2 = parent2.userData;

    //@ts-ignore
    const isDepo1 = userData1?.addLoadLocation === true;
    // @ts-ignore
    const isDepo2 = userData2?.addLoadLocation === true;

    //@ts-ignore
    const isSellable1 = userData1.hasOwnProperty('value');
    
    //@ts-ignore
    const isSellable2 = userData2.hasOwnProperty('value');
    
    if (started && (isSellable1 || isSellable2) && (isDepo1 || isDepo2)) {
      const dynamicBody = isDepo1 ? parent2 : parent1;
      const staticBody = isDepo1 ? parent1: parent2;


      try {
        // @ts-ignore
        // REFACTOR, CAN CAUSE ISSUES IF IT DOESN't EXIST
        console.log(staticBody.userData.UUID, save, save[staticBody.userData.UUID]);
        //@ts-ignore
        if (!save[staticBody.userData.UUID].currentHold) {
          //@ts-ignore
          save[staticBody.userData.UUID].currentHold = 0;
        }
        //@ts-ignore
        save[staticBody.userData.UUID].currentHold += dynamicBody.userData.value;
  
        // @ts-ignore
        if ( save[staticBody.userData.UUID].currentHold === 1000) {
          //@ts-ignore;
          movePageOfDialouge(1)
          // alert('reached end of demo!')
        } else {
          //@ts-ignore
          console.log('current hold: '+save[staticBody.userData.UUID].currentHold)
        }
      } catch (err) {
        console.error(' error while saving: ' + err)
      }

      for (let i = 0; i < dynamicBodies.length; i++) {
        const body = dynamicBodies[i];
        if (body[1] === dynamicBody) {
          dynamicBody.setLinvel(new RAPIER.Vector3(1, 20, 1), true);
          toDeleteDynamic.push(i);
        }
      }
    }
  }); 

  for (const mixer of mixers) {
    mixer.update(delta);
  }

  for (let i = 0, n = dynamicBodies.length; i < n; i++) {
    let currentDate = new Date().getTime();
    let timeDiff = currentDate - new Date(dynamicBodies[i][0].userData.timestamp).getTime();

    if (timeDiff > config.deleteTime) {
      toDeleteDynamic.push(i);
    }
  }

  for (const index of toDeleteDynamic.sort((a, b) => b - a)) {
    const [mesh, rigidBody] = dynamicBodies[index];
    
    world.removeRigidBody(rigidBody);
    scene.remove(mesh);
    console.log('removed mesh ' + mesh.toJSON())
    dynamicBodies.splice(index, 1);

    renderer.renderLists.dispose();
  }
  toDeleteDynamic.length = 0;
  
  for (let i = 0; i < dynamicBodies.length; i++) {
    const body = dynamicBodies[i];
    body[0].position.copy(body[1].translation());
    body[0].quaternion.copy(body[1].rotation());
  }

  moveMoveableObjects()
  
  world.step(eventQueue);

  controls.update()

  ThreeMeshUI.update();

  renderer.render(scene, camera)
  labelRenderer.render( scene, camera );

  stats.update()
  vrRaycast();

  // for (const child of camera.children){
  //   // child.quaternion.slerp( camera.quaternion, 0.01 );
  // }
}


function highLightHovered(){  
  if (states.lastHovered !== states.currentlyHovered) {
    if (states.lastHovered) {
      states.lastHovered.visible = false;
      states.lastHovered.element.style.display = 'none';
      // console.log('hiding', states.lastHovered);  
    }

    if (states.currentlyHovered) {
      states.currentlyHovered.visible = true;
      states.currentlyHovered.element.style.display = 'block';
    }
  
    states.lastHovered = states.currentlyHovered;
  }
  
}

window.onblur = function(){  
  states.focused=false;  
}  
window.onfocus = function(){  
  states.focused=true;  
}


document.addEventListener("keydown", handleKeyDown);
function handleKeyDown(e:any) {
  if (e.code == 'KeyR'){
    rotateState();
  }
}

controls.update();

render()