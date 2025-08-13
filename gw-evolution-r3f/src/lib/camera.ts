import { Controller } from "@react-spring/core";
import * as THREE from "three";

export type ZoomOpts = {
  duration?: number; // ms, default 700
  offset?: THREE.Vector3; // relative offset from target
};

/**
 * Animate a PerspectiveCamera's position and lookAt toward a target.
 * Returns a Promise that resolves when the animation finishes.
 */
export function zoomTo(camera: THREE.PerspectiveCamera, target: THREE.Vector3, opts: ZoomOpts = {}) {
  const { duration = 700, offset = new THREE.Vector3(2.5, 2.5, 2.5) } = opts;
  const startPos = camera.position.clone();
  const endPos = target.clone().add(offset);
  const startLook = new THREE.Vector3();
  camera.getWorldDirection(startLook);
  const startLookAt = camera.position.clone().add(startLook);
  const endLookAt = target.clone();

  // Imperative spring using @react-spring/core Controller
  return new Promise<void>((resolve) => {
    const ctrl = new Controller({ t: 0 });
    ctrl.start({
      from: { t: 0 },
      to: { t: 1 },
      config: { duration },
      onChange: (res) => {
        const t = (res.value as any).t as number;
        camera.position.lerpVectors(startPos, endPos, t);
        const look = new THREE.Vector3().lerpVectors(startLookAt, endLookAt, t);
        camera.lookAt(look);
      },
      onRest: () => {
        resolve();
      },
    });
  });
}
