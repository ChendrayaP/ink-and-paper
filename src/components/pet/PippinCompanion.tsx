
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function PippinCompanion() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start sm:bottom-6 sm:left-6">
      {isOpen ? (
        <div className="relative mb-3 w-[min(350px,calc(100vw-2rem))] pb-3 pr-12 sm:pr-16">
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
              className="object-contain object-bottom"
            />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
