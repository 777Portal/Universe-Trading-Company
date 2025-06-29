import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import * as THREE from 'three'

export let config = {
    deleteTime: 10000,
    spawnTime: 500
}  

export let states = {
  placing: false,
  locationX: 0,
  locationZ: 0,
  rotation: 0,
  lastHovered: undefined as CSS2DObject | undefined,
  BUTTON_INTERSECTION: undefined as THREE.Object3D | undefined,
  INTERSECTION: undefined as THREE.Vector3 | undefined,
  currentlyHovered: undefined as CSS2DObject | undefined,
  placingCallback: function () { alert('None selected.') },
  focused: true,
}

