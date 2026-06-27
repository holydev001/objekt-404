import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

const DRACO_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

export function preloadArtifactModels(urls: string[]) {
  urls.forEach((url) => useGLTF.preload(url, DRACO_PATH));
}

const failedLocalModels = new Set<string>();

function useResolvableModelUrl(url: string, fallbackUrl?: string) {
  const [probe, setProbe] = useState(() => ({
    source: url,
    resolved: fallbackUrl && failedLocalModels.has(url) ? fallbackUrl : fallbackUrl ? undefined : url,
  }));

  useEffect(() => {
    if (!fallbackUrl) {
      setProbe({ source: url, resolved: url });
      return;
    }

    if (failedLocalModels.has(url)) {
      setProbe({ source: url, resolved: fallbackUrl });
      return;
    }

    let cancelled = false;
    setProbe({ source: url, resolved: undefined });

    fetch(url, { method: "HEAD", cache: "no-store" })
      .then((response) => {
        if (cancelled) return;
        if (response.ok) {
          setProbe({ source: url, resolved: url });
          return;
        }
        failedLocalModels.add(url);
        setProbe({ source: url, resolved: fallbackUrl });
      })
      .catch(() => {
        if (cancelled) return;
        failedLocalModels.add(url);
        setProbe({ source: url, resolved: fallbackUrl });
      });

    return () => {
      cancelled = true;
    };
  }, [fallbackUrl, url]);

  const resolvedUrl = probe.source === url ? probe.resolved : undefined;

  return {
    resolvedUrl,
    markLocalFailed: useCallback(() => {
      if (!fallbackUrl) return;
      failedLocalModels.add(url);
      setProbe({ source: url, resolved: fallbackUrl });
    }, [fallbackUrl, url]),
  };
}

function Model({
  url,
  fitSize = 2.75,
  positionY = 0,
  scrollProgress,
}: {
  url: string;
  fitSize?: number;
  positionY?: number;
  scrollProgress: React.MutableRefObject<number>;
}) {
  const { scene } = useGLTF(url, DRACO_PATH);
  const ref = useRef<THREE.Group>(null);
  const { model, scale, center } = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const centerVector = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centerVector);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;

    return {
      model: clone,
      scale: fitSize / maxAxis,
      center: centerVector,
    };
  }, [fitSize, scene]);

  useFrame((state) => {
    if (!ref.current) return;
    const p = scrollProgress.current;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.25 + p * Math.PI * 2;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.15 + p * 0.6;
    ref.current.position.x = Math.sin(p * Math.PI * 2) * 1.4;
    ref.current.position.y = Math.cos(p * Math.PI) * 0.24 + positionY;
  });

  return (
    <group ref={ref}>
      <primitive object={model} scale={scale} position={[-center.x * scale, -center.y * scale, -center.z * scale]} />
    </group>
  );
}

function ArtifactLoader() {
  return (
    <Html center>
      <div className="font-mono text-[10px] tracking-widest uppercase text-acid whitespace-nowrap">
        Loading artifact
      </div>
    </Html>
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; resetKey: string; onError: () => void; onRetry: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-widest text-acid">
          <span>Artifact signal lost</span>
          <button
            type="button"
            onClick={() => {
              this.props.onRetry();
              this.setState({ hasError: false });
            }}
            className="border border-acid px-3 py-1 hover:bg-acid hover:text-ink transition"
          >
            ↻ Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function Rings({ accent, secondary }: { accent: string; secondary: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * 0.1;
    ref.current.rotation.x = s.clock.elapsedTime * 0.05;
  });
  return (
    <group ref={ref}>
      {[2.5, 3.2, 4].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, 0, 0]}>
          <torusGeometry args={[r, 0.005, 16, 200]} />
          <meshBasicMaterial color={i === 1 ? accent : secondary} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene({
  scrollProgress,
  modelUrl,
  modelFallbackUrl,
  modelFitSize,
  modelPositionY,
  accent = "#d7ff3a",
  secondary = "#ff2e7e",
}: {
  scrollProgress: React.MutableRefObject<number>;
  modelUrl: string;
  modelFallbackUrl?: string;
  modelFitSize?: number;
  modelPositionY?: number;
  accent?: string;
  secondary?: string;
}) {
  const { resolvedUrl, markLocalFailed } = useResolvableModelUrl(modelUrl, modelFallbackUrl);

  return (
    <SceneErrorBoundary
      resetKey={resolvedUrl ?? modelUrl}
      onError={markLocalFailed}
      onRetry={() => {
        try {
          useGLTF.clear(resolvedUrl ?? modelUrl);
        } catch {
          // no-op
        }
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color={accent} />
        <directionalLight position={[-5, -3, -2]} intensity={0.8} color={secondary} />
        <spotLight position={[0, 8, 0]} intensity={2} angle={0.6} penumbra={1} color="#ffffff" />
        <Suspense fallback={<ArtifactLoader />}>
          {resolvedUrl ? (
            <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
              <Model
                key={resolvedUrl}
                url={resolvedUrl}
                fitSize={modelFitSize}
                positionY={modelPositionY}
                scrollProgress={scrollProgress}
              />
            </Float>
          ) : (
            <ArtifactLoader />
          )}
          <Environment preset="city" />
        </Suspense>
        <Rings accent={accent} secondary={secondary} />
        <ContactShadows position={[0, -1.6, 0]} opacity={0.5} blur={2.5} scale={8} resolution={256} color="#000" frames={1} />
      </Canvas>
    </SceneErrorBoundary>
  );
}
