import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";

export default function Character({ playerRef }) {
  const group = useRef();

  const isMoving = playerRef.current?.userData?.isMoving;

  const idle = useGLTF("/models/idle.glb");
  const walk = useGLTF("/models/walk.glb");

  const { actions: idleActions } = useAnimations(idle.animations, group);
  const { actions: walkActions } = useAnimations(walk.animations, group);

  useEffect(() => {
    if (!idleActions || !walkActions) return;

    // stop all first
    Object.values(idleActions).forEach(a => a.stop());
    Object.values(walkActions).forEach(a => a.stop());

    if (isMoving) {
      Object.values(walkActions)[0]?.reset().play();
    } else {
      Object.values(idleActions)[0]?.reset().play();
    }
  }, [isMoving, idleActions, walkActions]);

  return (
    <group ref={group}>
      <primitive
        ref={playerRef}
        object={isMoving ? walk.scene : idle.scene}
        scale={0.01}
        position={[0, -1.2, 0]}
      />
    </group>
  );
}