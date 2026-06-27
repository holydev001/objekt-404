import { createFileRoute } from "@tanstack/react-router";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene, { preloadArtifactModels } from "@/components/Scene";
import Cursor from "@/components/Cursor";
import { ARTIFACTS } from "@/lib/artifacts";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const scrollProgress = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const [activeId, setActiveId] = useState(ARTIFACTS[0].id);
  const active = ARTIFACTS.find((a) => a.id === activeId) ?? ARTIFACTS[0];
  const adjacent = ARTIFACTS.filter((a) => a.id !== active.id);
  const artifactTheme = {
    "--acid": active.accent,
    "--magenta": active.secondary,
  } as CSSProperties;

  useEffect(() => {
    const others = ARTIFACTS.filter((a) => a.id !== activeId).map((a) => a.fallbackUrl ?? a.url);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const handle = w.requestIdleCallback
      ? w.requestIdleCallback(() => preloadArtifactModels(others), { timeout: 3000 })
      : window.setTimeout(() => preloadArtifactModels(others), 1500);
    void handle;


    const ctx = gsap.context(() => {
      const chars = heroTitle.current?.querySelectorAll<HTMLSpanElement>("[data-char]");
      if (chars) {
        gsap.from(chars, {
          yPercent: 120,
          rotate: 8,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.025,
          delay: 0.3,
        });
      }

      gsap.from("[data-fade]", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.8,
      });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = parseFloat(el.dataset.count || "0");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
          onUpdate: () => { el.textContent = Math.floor(obj.v).toLocaleString(); },
        });
      });

      gsap.to("[data-stage-label]", {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-stage]",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={artifactTheme} className="grain relative bg-ink text-bone min-h-screen">
      <Cursor />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene
          scrollProgress={scrollProgress}
          modelUrl={active.url}
          modelFallbackUrl={active.fallbackUrl}
          modelFitSize={active.fitSize}
          modelPositionY={active.positionY}
          accent={active.lightAccent}
          secondary={active.lightSecondary}
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 mix-blend-difference">
        <a href="#" className="font-mono text-sm tracking-widest">◉ OBJEKT//404</a>
        <nav className="hidden md:flex gap-8 font-mono text-xs tracking-widest uppercase">
          <a href="#artifact" className="hover:text-acid transition">Artifact</a>
          <a href="#dossier" className="hover:text-acid transition">Dossier</a>
          <a href="#index" className="hover:text-acid transition">Index</a>
          <a href="#transmit" className="hover:text-acid transition">Transmit</a>
        </nav>
        <a href="#transmit" className="font-mono text-xs tracking-widest border border-bone px-4 py-2 hover:bg-acid hover:text-ink hover:border-acid transition">
          ENTER →
        </a>
      </header>

      <section className="relative z-10 min-h-screen flex flex-col justify-between px-6 md:px-10 pt-32 pb-10">
        <div className="flex items-start justify-between font-mono text-[10px] tracking-widest uppercase opacity-60">
          <div data-fade>
            <div>SERIAL / ARTIFACT.{active.serial}</div>
            <div>ORIGIN / {active.origin}</div>
          </div>
          <div className="text-right" data-fade>
            <div>BROADCAST / {active.transmission}</div>
            <div className="text-acid">● TRANSMITTING</div>
          </div>
        </div>

        <div>
          <div className="font-mono text-xs tracking-widest text-acid mb-4" data-fade>
            [ ARTIFACT.{active.serial} — CIRCA {active.year} ]
          </div>
          <h1
            key={active.id}
            ref={heroTitle}
            className="font-display font-light text-[18vw] md:text-[14vw] leading-[0.85] tracking-tighter -ml-2"
          >
            <span className="inline-block overflow-hidden align-bottom">
              {active.shortName.split("").map((c, i) => (
                <span key={i} data-char className="inline-block">{c}</span>
              ))}
            </span>
            <br />
            <span className="inline-block overflow-hidden align-bottom italic text-acid">
              {active.tag.split("").map((c, i) => (
                <span key={i} data-char className="inline-block">{c}</span>
              ))}
            </span>
          </h1>

          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl">
            <p className="md:col-span-2 text-xl md:text-2xl text-balance font-light leading-snug" data-fade>
              {active.heroCopy}
            </p>
            <div className="font-mono text-xs leading-relaxed opacity-70" data-fade>
              <div className="text-acid mb-2">// INSTRUCTIONS</div>
              {active.instructions.map((instruction) => (
                <span key={instruction}>{instruction}<br/></span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between font-mono text-[10px] tracking-widest uppercase opacity-60" data-fade>
          <div>↓ SCROLL / INTERFACE</div>
          <div>22.06.2098 · 04:17 UTC</div>
        </div>
      </section>

      <section className="relative z-10 border-y border-line bg-ink/40 backdrop-blur-sm overflow-hidden py-6">
        <div className="flex gap-12 animate-marquee whitespace-nowrap font-display font-light text-5xl md:text-7xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12 items-center shrink-0">
              {["UNCATALOGUED", "★", "POST-PHYSICAL", "★", "OBJECT.PERMANENCE", "★", "RENDERED.IN.REAL.TIME", "★", "DO NOT TOUCH", "★"].map((t, i) => (
                <span key={i} className={i % 2 ? "text-acid" : ""}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="artifact" data-stage className="relative z-10 min-h-[200vh] px-6 md:px-10 py-32 overflow-hidden">
        <div data-stage-label className="font-display font-light text-[22vw] leading-none whitespace-nowrap opacity-[0.06] absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none">
          ROTATE · INSPECT · DECODE ·
        </div>

        <div className="relative grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4 md:col-start-1" data-reveal>
            <div className="font-mono text-xs text-acid mb-3">{active.material.eyebrow}</div>
            <h3 className="font-display text-3xl md:text-4xl font-light leading-tight mb-4">
              {active.material.title}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {active.material.body}
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9 mt-[60vh]" data-reveal>
            <div className="font-mono text-xs text-acid mb-3">{active.behaviour.eyebrow}</div>
            <h3 className="font-display text-3xl md:text-4xl font-light leading-tight mb-4">
              {active.behaviour.title}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {active.behaviour.body}
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-2 mt-[60vh]" data-reveal>
            <div className="font-mono text-xs text-acid mb-3">{active.statusCopy.eyebrow}</div>
            <h3 className="font-display text-3xl md:text-4xl font-light leading-tight mb-4">
              {active.statusCopy.title} <span className="text-magenta italic">{active.statusCopy.highlight}</span>
            </h3>
          </div>
        </div>
      </section>

      <section id="dossier" className="relative z-10 bg-ink/80 backdrop-blur-md px-6 md:px-10 py-32 border-t border-line">
        <div className="flex items-end justify-between mb-16" data-reveal>
          <div>
            <div className="font-mono text-xs text-acid mb-3">// FIELD DOSSIER</div>
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight">
              Vital <span className="italic text-acid">signs</span>.
            </h2>
          </div>
          <div className="font-mono text-xs opacity-60 hidden md:block">REV.04 / SIGNED.HV</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line">
          {active.dossier.map((s) => (
            <div key={s.k} className="bg-ink p-6 md:p-8" data-reveal>
              <div className="font-mono text-[10px] tracking-widest opacity-60 mb-4">{s.k}</div>
              <div className="font-display text-4xl md:text-6xl font-light">
                <span data-count={s.v}>0</span><span className="text-acid">{s.suf}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-line mt-px">
          {active.cards.map((c, i) => (
            <div key={i} className="bg-ink p-8 md:p-10 group hover:bg-acid hover:text-ink transition-colors duration-500" data-reveal>
              <div className="font-mono text-xs opacity-60 group-hover:opacity-100 mb-6">0{i + 1}</div>
              <div className="font-display text-3xl font-light mb-4">{c.t}.</div>
              <p className="text-sm opacity-70 group-hover:opacity-100 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="index" className="relative z-10 px-6 md:px-10 py-32 border-t border-line bg-ink/60 backdrop-blur-md">
        <div className="grid md:grid-cols-12 gap-8 mb-16" data-reveal>
          <div className="md:col-span-4">
            <div className="font-mono text-xs text-acid mb-3">// CATALOGUE</div>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-none">
              Adjacent <span className="italic">artifacts</span>.
            </h2>
          </div>
          <p className="md:col-span-5 md:col-start-8 text-lg opacity-70 self-end leading-relaxed">
            Objects recovered alongside {active.name}. Select an adjacent artifact and the transmission retunes around it.
          </p>
        </div>

        <ul className="divide-y divide-line border-y border-line font-display">
          {adjacent.map((artifact) => (
            <li key={artifact.id} className="group" data-reveal>
              <button
                type="button"
                onClick={() => setActiveId(artifact.id)}
                className="grid w-full grid-cols-12 gap-4 py-6 md:py-8 items-center text-left transition-all hover:pl-6"
              >
                <span className="col-span-2 font-mono text-xs opacity-50">{artifact.serial}</span>
                <span className="col-span-6 text-2xl md:text-4xl font-light group-hover:text-acid transition-colors">{artifact.name}</span>
                <span className="col-span-2 font-mono text-xs opacity-50">{artifact.year}</span>
                <span className={`col-span-2 font-mono text-xs text-right ${artifact.status === "ACTIVE" ? "text-acid" : artifact.status === "LOST" ? "text-magenta" : "opacity-50"}`}>● {artifact.status}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section id="transmit" className="relative z-10 px-6 md:px-10 py-40 border-t border-line bg-ink/80 backdrop-blur-md">
        <div className="max-w-5xl">
          <div className="font-mono text-xs text-acid mb-6" data-reveal>// END.TRANSMISSION</div>
          <h2 className="font-display text-[12vw] md:text-[8vw] leading-[0.9] font-light tracking-tighter mb-12" data-reveal>
            Stop reading.<br/>
            <span className="italic">Start </span>
            <span className="text-acid">{active.endVerb}.</span>
          </h2>
          <div className="flex flex-wrap gap-4" data-reveal>
            <a href="#artifact" className="group inline-flex items-center gap-4 bg-acid text-ink px-8 py-5 font-mono text-xs tracking-widest hover:bg-bone transition-colors">
              GRAB THE OBJECT
              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a href="#" className="inline-flex items-center gap-4 border border-bone px-8 py-5 font-mono text-xs tracking-widest hover:border-acid hover:text-acid transition">
              REQUEST DOSSIER
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 md:px-10 py-10 border-t border-line bg-ink font-mono text-[10px] tracking-widest uppercase opacity-60">
        <div className="flex flex-wrap justify-between gap-4">
          <div>© 2098 OBJEKT//404 — UNCATALOGUED ARTIFACTS DEPT.</div>
          <div>BUILT IN REAL TIME · NEVER THE SAME TWICE</div>
          <div className="text-acid">● STILL TRANSMITTING</div>
        </div>
      </footer>
    </div>
  );
}
