import { CAMERA_MODE_INSPECT } from "./camera-system.js";
import { setMatrixWorld } from "../utils/three-utils";

export class ScenePreviewCameraSystem {
  constructor() {
    this.entities = [];
    this.tick = this.tick.bind(this);
  }

  register(el) {
    this.entities.push(el);
  }

  unregister(el) {
    this.entities.splice(this.entities.indexOf(el, 1));
  }

  tick = (function() {
    let viewingCamera;
    let viewingRig;
    let uiRoot;
    const rigRelativeToCamera = new THREE.Matrix4();
    const rigMatrix = new THREE.Matrix4();
    const cameraMatrixInverse = new THREE.Matrix4();
    return function tick() {
      viewingCamera = viewingCamera || document.getElementById("viewing-camera");
      viewingRig = viewingRig || document.getElementById("viewing-rig");
      uiRoot = uiRoot || document.getElementById("ui-root");
      const entered = viewingCamera && viewingCamera.sceneEl.is("entered");
      const isGhost = !entered && uiRoot && uiRoot.firstChild && uiRoot.firstChild.classList.contains("isGhost");
      for (let i = 0; i < this.entities.length; i++) {
        const el = this.entities[i];
        const hubsSystems = AFRAME.scenes[0].systems["hubs-systems"];
        if (el && (!hubsSystems || (hubsSystems.cameraSystem.mode !== CAMERA_MODE_INSPECT && !isGhost && !entered))) {
          el.components["scene-preview-camera"].tick2();
          if (hubsSystems && viewingCamera) {
            el.object3D.updateMatrices();
            rigRelativeToCamera
              .copy(viewingRig.object3D.matrixWorld)
              .premultiply(cameraMatrixInverse.getInverse(viewingCamera.object3D.matrixWorld));
            rigMatrix.multiplyMatrices(el.object3D.matrixWorld, rigRelativeToCamera);
            setMatrixWorld(viewingRig.object3D, rigMatrix);
            setMatrixWorld(viewingCamera.object3D, el.object3D.matrixWorld);
          }
        }
      }
    };
  })();
}
