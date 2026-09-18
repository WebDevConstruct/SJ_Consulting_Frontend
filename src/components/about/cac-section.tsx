"use client";

import { cac } from "@/lib/mock-data";
import Image from "next/image";
function SealMark() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <linearGradient id="sealRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B6F14" />
          <stop offset="50%" stopColor="#E9CD7B" />
          <stop offset="100%" stopColor="#8B6F14" />
        </linearGradient>
      </defs>
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="url(#sealRing)"
        strokeWidth="2.5"
      />
      <circle
        cx="100"
        cy="100"
        r="76"
        fill="none"
        stroke="#C9A227"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <text
        x="100"
        y="70"
        textAnchor="middle"
        fontSize="11"
        letterSpacing="2"
        fill="#C9A227"
      >
        SJ CONSULT
      </text>
      <text
        x="100"
        y="112"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="30"
        fill="#C9A227"
      >
        SJ
      </text>
      <text
        x="100"
        y="136"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="1.5"
        fill="#C9A227"
        opacity="0.75"
      >
        REGISTERED
      </text>
    </svg>
  );
}

export function CacSection() {
  return (
    <section className="border-t border-paper-line bg-paper dark:border-ink-line dark:bg-ink">
      <div className="container-content gap-10 flex flex-col items-center py-24 text-center md:py-28">
        <div className="w-1/2 h-full cursor-default transition-transform duration-300 ease-out hover:-translate-y-2">
        
          {/* <SealMark /> */}
          <Image src={"/images/SJRegistration.avif"} className="w-70 h-30" alt="SJ CAC" width={500} height={400}/>
        </div>

        <h1 className="mt-9 max-w-lg font-display text-[34px] leading-tight sm:text-[40px]">
          A registered consulting service, dedicated in creating a supportive environment for students.
        </h1>

        <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-current/65">
          Registration number {cac.regNumber} &middot; operating since{" "}
          {cac.establishedYear}.
        </p>

        <ul className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {cac.points.map((point) => (
            <li
              key={point}
              className="rounded-sm border border-paper-line px-5 py-5 text-left text-[13.5px] leading-relaxed text-current/70 dark:border-ink-line"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
