declare module 'three-mesh-ui/examples/utils/VRControl.js' {
    import { WebGLRenderer, Group, Matrix4, Ray, Vector3 } from 'three';
  
    interface VRControlOutput {
      controllers: Group[];
      controllerGrips: Group[];
      setFromController: (controllerID: number, ray: Ray) => void;
      setPointerAt: (controllerID: number, vec: Vector3) => void;
    }
  
    export default function VRControl(renderer: WebGLRenderer): VRControlOutput;
  }
  