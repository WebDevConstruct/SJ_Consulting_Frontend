import Link from "next/link";
import { ScrollCue } from "@/components/ui/scroll-cue";

const STAT_ROW = [
  "48,000+ CBT questions",
  "Live JAMB guideline desk",
  "12,000+ aspirants guided",
];

function BubbleSheetMark() {
  const rows = Array.from({ length: 7 });
  const cols = ["A", "B", "C", "D"];

  return (
    <svg
      viewBox="0 0 360 460"
      className="h-full w-full"
      role="img"
      aria-labelledby="bubble-sheet-title"
    >
      <title id="bubble-sheet-title">
        Illustration of an OMR answer sheet with marked responses
      </title>
      <rect
        x="1"
        y="1"
        width="358"
        height="458"
        rx="4"
        fill="none"
        stroke="url(#sheetEdge)"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient id="sheetEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B6F14" />
          <stop offset="50%" stopColor="#E9CD7B" />
          <stop offset="100%" stopColor="#8B6F14" />
        </linearGradient>
      </defs>

      <line x1="30" y1="46" x2="220" y2="46" stroke="#C9A227" strokeWidth="2" opacity="0.55" />
      <line x1="30" y1="60" x2="160" y2="60" stroke="#C9A227" strokeWidth="1" opacity="0.3" />

      {rows.map((_, r) => {
        const y = 110 + r * 46;
        const markedCol = (r * 2 + 1) % 4;
        return (
          <g key={r}>
            <text x="30" y={y + 5} fontSize="12" fill="#C9A227" opacity="0.5">
              {String(r + 1).padStart(2, "0")}
            </text>
            {cols.map((c, ci) => {
              const cx = 66 + ci * 44;
              const isMarked = ci === markedCol;
              return (
                <g key={c}>
                  <circle
                    cx={cx}
                    cy={y}
                    r="11"
                    fill={isMarked ? "url(#dotFill)" : "none"}
                    stroke="#C9A227"
                    strokeWidth={isMarked ? 0 : 1.1}
                    opacity={isMarked ? 1 : 0.35}
                  />
                  <text
                    x={cx}
                    y={y + 4}
                    fontSize="10"
                    textAnchor="middle"
                    fill={isMarked ? "#0A0A0B" : "#C9A227"}
                    opacity={isMarked ? 1 : 0.45}
                  >
                    {c}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      <defs>
        <linearGradient id="dotFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3E4B0" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-paper dark:bg-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-ledger-light opacity-70 dark:bg-ledger-dark" />

      <div className="container-content relative grid grid-cols-1 items-center gap-14  pb-20 md:grid-cols-[1.05fr_0.85fr] md:py-28">
        <div>
          <div className="mb-7 h-[2px] w-14 bg-gold-metal" />
          <h1 className="font-display text-[40px]
           leading-[1.08] tracking-tightest sm:text-[52px] md:text-[62px]">
            A Platform built for a
            <br />
            community of aspirants and undergraduates
            <br />
          enhanced through<br/>
            <span className="text-gold-foil">peer learnings</span>  {" "}
            and {" "}
             <span className="text-gold-foil">close mentorship.</span>
          </h1>
          <p className={`mt-7 max-w-md text-[16.5px] leading-relaxed text-current/70`}>
          One and multiplayer CBT practice or exam simulator features. Various organized types of information through verified news, institutonal guidelines and scholarship oppotunities
         dissemination. One-on-one guidance from mentors and experts. 
        
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="focus-gold rounded-sm border border-gold-400 bg-gold-metal-soft px-7 py-3.5 text-[14.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02]"
            >
              Create your account
            </Link>
            <Link
              href="/about"
              className="focus-gold rounded-sm border border-current/20 px-7 py-3.5 text-[14.5px] font-semibold transition-colors hover:border-gold-400 hover:text-gold-500"
            >
              How it works
            </Link>
          </div>

          {/* <dl className="mt-14 grid grid-cols-1 gap-4 border-t border-current/10 pt-7 sm:grid-cols-3">
            {STAT_ROW.map((stat) => (
              <div key={stat} className="text-[13.5px] text-current/60">
                {stat}
              </div>
            ))}
          </dl> */}
        </div>

        <div className="relative md:flex hidden mx-auto w-full max-w-[320px] animate-floaty md:max-w-none">
          <BubbleSheetMark />
        </div>
      </div>

      <ScrollCue
        label="See what the platform tracks for you"
        targetId="information"
      />
    </section>
  );
}
