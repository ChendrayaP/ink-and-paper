
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function PippinCompanion() {
  // Start with the greeting panel open on first load so visitors see Pippin's
  // welcome; the close button collapses it to the compact bubble, which reopens
  // the panel on tap.
  const [isOpen, setIsOpen] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // The floating "Hi!" greeting appears once when the companion first mounts.
  // This component is rendered a single time in the persistent public layout,
  // so mount happens only on the initial page load / full visit, not on
  // client-side navigation — no session persistence is needed. The greeting
  // is temporary and hides itself after a few seconds.
  useEffect(() => {
    const timer = window.setTimeout(() => setShowGreeting(false), 3800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start sm:bottom-6 sm:left-6">
      <style>{`
        @keyframes pippin-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes pippin-hi { 0% { opacity: 0; transform: translateY(5px) scale(0.96); } 14% { opacity: 1; transform: translateY(0) scale(1); } 82% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-3px) scale(0.98); } }
        @keyframes pippin-fade-rest { 0% { opacity: 1; } 8% { opacity: 0; } 30% { opacity: 0; } 42% { opacity: 1; } 54% { opacity: 0; } 76% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes pippin-fade-wave { 0% { opacity: 0; } 8% { opacity: 1; } 30% { opacity: 1; } 42% { opacity: 0; } 54% { opacity: 1; } 76% { opacity: 1; } 100% { opacity: 0; } }
        .pippin-rest-layer { animation: pippin-bob 3.4s ease-in-out infinite, pippin-fade-rest 4.2s ease-in-out 0.5s 1 both; will-change: transform, opacity; }
        .pippin-wave-layer { animation: pippin-bob 3.4s ease-in-out infinite, pippin-fade-wave 4.2s ease-in-out 0.5s 1 both; will-change: transform, opacity; }
        .pippin-hi { animation: pippin-hi 3.8s ease-in-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .pippin-rest-layer { animation: none; }
          .pippin-wave-layer { animation: none; }
          .pippin-hi { animation: none; }
        }
      `}</style>
      {isOpen ? (
        <div className="relative mb-3 w-[min(350px,calc(100vw-2rem))] pb-3 pr-12 sm:pr-16">
          {showGreeting ? (
            <div
              aria-hidden="true"
              className="pippin-hi pointer-events-none absolute -top-11 right-8 z-30 rounded-full border border-[#efd8b5] bg-[#fffaf1] px-4 py-2 text-base font-semibold text-[#70451f] shadow-[0_6px_16px_rgba(65,43,25,0.16)] sm:-top-12 sm:right-12"
            >
              Hi! 👋
            </div>
          ) : null}

          <section
  id="pippin-message"
  aria-label="Pippin reading companion"
  
className="relative min-h-[135px] overflow-hidden rounded-[22px] border-2 border-[#e7bd7e] bg-[#fff8ec] px-4 py-4 pr-16 text-[#493321] shadow-[0_8px_24px_rgba(65,43,25,0.12)] sm:min-h-[150px] sm:px-5 sm:py-5 sm:pr-20"
>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[5px] rounded-[20px] border border-[#eadcc5]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 -top-3 text-[#d8ae70] opacity-80"
            >
              <svg viewBox="0 0 100 120" className="h-24 w-20 sm:h-28 sm:w-24" fill="none">
                <path d="M10 112 Q42 64 72 8" stroke="currentColor" strokeWidth="2" />
                <path d="M27 82 Q5 78 8 60 Q28 61 27 82Z" fill="currentColor" />
                <path d="M39 62 Q66 65 67 43 Q46 43 39 62Z" fill="currentColor" />
                <path d="M52 39 Q29 34 34 16 Q53 20 52 39Z" fill="currentColor" />
                <path d="M19 99 Q44 103 48 84 Q28 82 19 99Z" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10 max-w-[270px] pt-2 sm:pt-3">
              <p className="font-serif text-2xl leading-tight text-[#593821] sm:text-[30px]">
                Hello, I’m Pippin!
              </p>

              <p className="mt-3 max-w-[245px] text-sm leading-6 text-[#715b49] sm:text-base">
                I’m happy you’re here. Find a cozy spot and enjoy a good story.
                <span aria-hidden="true"> ♥</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Pippin message"
              className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#efd8b5] bg-[#fffaf1] text-2xl leading-none text-[#70451f] shadow-sm transition-colors hover:bg-[#f5e6cf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b603d]"
            >
              ×
            </button>
          </section>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1 right-0 z-20 h-[220px] w-[190px] translate-x-6 sm:-right-1 sm:h-[245px] sm:w-[210px] sm:translate-x-6"
          >
            <Image
              src="/pets/pippin-transparent.png"
              alt=""
              fill
              sizes="(max-width: 640px) 180px, 210px"
              className="object-contain object-bottom pippin-rest-layer"
            />
            <Image
              src="/pets/pippin-wave.png"
              alt=""
              fill
              sizes="(max-width: 640px) 180px, 210px"
              className="object-contain object-bottom opacity-0 pippin-wave-layer"
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          {showGreeting ? (
            <div
              aria-hidden="true"
              className="pippin-hi pointer-events-none absolute bottom-[86px] left-1 z-30 whitespace-nowrap rounded-full border border-[#efd8b5] bg-[#fffaf1] px-4 py-2 text-base font-semibold text-[#70451f] shadow-[0_6px_16px_rgba(65,43,25,0.16)]"
            >
              Hi! 👋
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Meet Pippin, your reading companion"
            aria-expanded={false}
            aria-controls="pippin-message"
            className="relative flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border border-[#dfbd83] bg-[#fff8ec] p-0 shadow-[0_4px_16px_rgba(65,43,25,0.18)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b603d] motion-reduce:transition-none"
          >
            <Image
              src="/pets/pippin-transparent.png"
              alt=""
              fill
              sizes="76px"
              className="scale-125 rounded-full object-cover"
            />
          </button>
        </div>
      )}
    </div>
  );
}
