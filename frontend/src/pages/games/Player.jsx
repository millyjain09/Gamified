import { useFrame } from "@react-three/fiber";

export default function Player({ playerRef }) {
  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const speed = 5;

    if (window.keys?.["w"]) playerRef.current.position.z -= speed * delta;
    if (window.keys?.["s"]) playerRef.current.position.z += speed * delta;
    if (window.keys?.["a"]) playerRef.current.position.x -= speed * delta;
    if (window.keys?.["d"]) playerRef.current.position.x += speed * delta;
  });

  return (
    <mesh ref={playerRef} position={[0, 0.5, 0]}>
      <boxGeometry />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}