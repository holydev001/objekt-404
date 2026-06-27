import { useEffect, useRef, useState } from "react";

/**
 * Futuristic reticle cursor.
 * - rAF-driven (no GSAP) → cheaper than per-event style writes
 * - GPU-only transforms (translate3d + rotate + scale)
 * - Hover-aware: morphs over <a>, <button>, [data-cursor="hover"]
 * - Hidden on touch / coarse pointers
 */
export default function Cursor() {
  const reticle = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    let raf = 0;
    let running = true;

    const tick = () => {
      // critically damped follow
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      if (reticle.current) {
        reticle.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      if (label.current) {
        label.current.style.transform = `translate3d(${pos.x + 22}px, ${pos.y + 18}px, 0)`;
      }
      if (running) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest('a, button, [role="button"], [data-cursor="hover"]');
      setHover(interactive);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.style.cursor = "none";

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.style.cursor = "";
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={reticle}
        aria-hidden
        className="fixed left-0 top-0 z-[200] pointer-events-none will-change-transform mix-blend-difference"
      >
        <div
          className={`relative transition-[width,height] duration-300 ease-out ${
            hover ? "w-14 h-14" : "w-9 h-9"
          }`}
        >
          {/* spinning ring */}
          <svg
            viewBox="0 0 40 40"
            className={`absolute inset-0 w-full h-full text-acid origin-center ${
              hover ? "animate-[spin_2s_linear_infinite]" : "animate-[spin_8s_linear_infinite]"
            }`}
          >
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="2 4 18 4 2 4 18 4"
              opacity="0.9"
            />
          </svg>
          {/* corner brackets */}
          <span className="absolute -top-0.5 -left-0.5 w-2 h-2 border-l border-t border-acid" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 border-r border-t border-acid" />
          <span className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-l border-b border-acid" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-r border-b border-acid" />
          {/* center dot / pulse */}
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid transition-all duration-200 ${
              hover ? "w-2 h-2 opacity-100" : "w-1 h-1 opacity-90"
            }`}
            style={{ boxShadow: "0 0 8px var(--acid)" }}
          />
        </div>
      </div>
      <div
        ref={label}
        aria-hidden
        className="fixed left-0 top-0 z-[200] pointer-events-none will-change-transform font-mono text-[9px] tracking-[0.2em] uppercase text-acid mix-blend-difference"
      >
        {hover ? "◉ ENGAGE" : "▸ SCAN"}
      </div>
    </>
  );
}
