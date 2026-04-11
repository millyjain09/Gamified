import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Character from "./Character";

export default function World({ setNear }) {
  const playerRef = useRef();
  const houseRef = useRef();
  const { camera } = useThree();

  const [nearHouse, setNearHouse] = useState(false);

  useFrame((_, delta) => {
    if (!playerRef.current || !houseRef.current) return;

    const speed = 5;
    let isMoving = false; // 🔥 NEW

    // 🎮 MOVEMENT + DETECT
    if (window.keys?.["w"]) {
      playerRef.current.position.z -= speed * delta;
      isMoving = true;
    }
    if (window.keys?.["s"]) {
      playerRef.current.position.z += speed * delta;
      isMoving = true;
    }
    if (window.keys?.["a"]) {
      playerRef.current.position.x -= speed * delta;
      isMoving = true;
    }
    if (window.keys?.["d"]) {
      playerRef.current.position.x += speed * delta;
      isMoving = true;
    }

    // 🔥 STORE movement state ON REF (important trick)
    playerRef.current.userData.isMoving = isMoving;

    const playerPos = playerRef.current.position;
    const housePos = houseRef.current.position;

    // 🎥 CAMERA FOLLOW
    const target = new THREE.Vector3(
      playerPos.x,
      playerPos.y + 2,
      playerPos.z + 5
    );

    camera.position.lerp(target, 0.1);
    camera.lookAt(playerPos);

    // 📏 DISTANCE CHECK
    const isNear = playerPos.distanceTo(housePos) < 3;

    setNearHouse(isNear);
    setNear(isNear);
  });

  return (
    <>
      {/* 🌍 Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* 🧍 CHARACTER */}
      <Character playerRef={playerRef} />

      {/* 🏠 House */}
      <mesh ref={houseRef} position={[5, 1, -5]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={nearHouse ? "yellow" : "blue"} />
      </mesh>
    </>
  );
}