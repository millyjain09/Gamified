import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import World from "./World";

export default function AlgoVerse() {
  const [enter, setEnter] = useState(false);
  const [near, setNear] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    window.keys = {};

    const down = (e) => {
      window.keys[e.key.toLowerCase()] = true;

      if (e.key.toLowerCase() === "e" && near) {
        setFade(true);

        setTimeout(() => {
          setEnter(true);
        }, 1000);
      }
    };

    const up = (e) => {
      window.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [near]);

  if (enter) {
    return (
      <div
        style={{
          background: "black",
          color: "white",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>🚪 Entering Escape Room...</h1>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 6, 10], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} />

        <World setNear={setNear} />
      </Canvas>

      {near && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "20px",
          }}
        >
          Press E to Enter
        </div>
      )}

      {fade && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "black",
            opacity: 0.8,
            transition: "opacity 1s",
          }}
        />
      )}
    </div>
  );
}