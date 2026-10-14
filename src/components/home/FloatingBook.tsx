"use client";

import { useEffect, useRef } from "react";

/*
  A restrained, CSS-only 3D hardcover for the homepage hero. It shows the real
  published cover at a gentle three-quarter angle with a shaded spine, page
  leaves along the fore-edge, soft contact shadow, and a slow float. No 3D
  library and no replacement artwork — depth is pure CSS transforms + shadows.

  Motion:
   - The float is a CSS animation (globals.css), so it is automatically
     neutralised by the site-wide prefers-reduced-motion reset.
   - The desktop cursor tilt is a progressive enhancement only: it runs solely
     on a fine pointer with motion allowed, and is a no-op otherwise (touch,
     reduced-motion). With JS off, the static three-quarter view still renders.
*/

const BASE_RY = -24; // three-quarter: left binding toward the viewer
const BASE_RX = 5;

export function FloatingBook({
  cover,
  title,
}: {
  cover: string | null;
  title: string;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const book = bookRef.current;
    if (!scene || !book) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
      return; // touch devices and reduced-motion users keep the static tilt
    }

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = scene.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        book.style.setProperty("--ry", `${BASE_RY + px * 12}deg`);
        book.style.setProperty("--rx", `${BASE_RX - py * 8}deg`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      book.style.setProperty("--ry", `${BASE_RY}deg`);
      book.style.setProperty("--rx", `${BASE_RX}deg`);
    };

    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", reset);
    return () => {
      scene.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", reset);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative mx-auto w-full max-w-[260px] [perspective:1600px] sm:max-w-[270px]"
    >
      {/* soft contact shadow cast on the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-[-5%] h-10 rounded-[50%] bg-ink/25 blur-2xl"
      />

      {/* gentle float (outer) — neutralised under reduced-motion by globals.css */}
      <div className="ink-float [transform-style:preserve-3d]">
        {/* the book: static three-quarter + optional cursor tilt */}
        <div
          ref={bookRef}
          className="relative aspect-[2/3] w-full [transform-style:preserve-3d] [transform:rotateY(var(--ry))_rotateX(var(--rx))] transition-transform duration-200 ease-out will-change-transform"
          style={
            {
              "--ry": `${BASE_RY}deg`,
              "--rx": `${BASE_RX}deg`,
            } as React.CSSProperties
          }
        >
          {/* hardcover body behind the front face (depth) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[2px] bg-paper-dark [transform:translateZ(-20px)]"
          />
          {/* page leaves along the fore-edge (right) */}
          <div
            aria-hidden="true"
            className="absolute inset-y-[2%] right-[-6px] w-[12px] rounded-r-[2px] [transform:translateZ(-10px)] [background:repeating-linear-gradient(to_bottom,#efe7d8_0px,#efe7d8_1px,#d9cdb8_1px,#d9cdb8_2px)]"
          />

          {/* front cover */}
          <div className="absolute inset-0 overflow-hidden rounded-l-[2px] rounded-r-[3px] border border-ink/15 bg-paper shadow-[0_28px_55px_-18px_rgba(44,33,26,0.45),0_10px_20px_-12px_rgba(44,33,26,0.35)]">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={`Cover of ${title}`}
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-ink p-6 text-center">
                <span className="font-display text-2xl leading-tight text-paper">
                  {title}
                </span>
              </div>
            )}

            {/* spine shading along the binding (left) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-[12%] bg-gradient-to-r from-ink/45 via-ink/15 to-transparent"
            />
            {/* thin highlight just off the binding */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-[12%] w-px bg-white/20"
            />
            {/* soft top-corner sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/15"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
