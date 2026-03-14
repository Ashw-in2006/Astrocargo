import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function EarthModel() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Earth */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a4a7a"
          emissive="#0a2a4a"
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Landmasses overlay */}
      <Sphere args={[2.01, 32, 32]} ref={atmosphereRef}>
        <meshStandardMaterial
          color="#2d8a4e"
          transparent
          opacity={0.4}
          roughness={1}
          wireframe
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.15, 32, 32]}>
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[2.4, 32, 32]}>
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
        <torusGeometry args={[3.5, 0.008, 8, 128]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.4} />
      </mesh>

      {/* Satellite dots on orbit */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * 3.5,
            Math.sin(angle) * 3.5 * Math.sin(Math.PI / 2.2),
            Math.sin(angle) * 3.5 * Math.cos(Math.PI / 2.2),
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
      ))}

      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#2979FF" />
    </group>
  );
}
