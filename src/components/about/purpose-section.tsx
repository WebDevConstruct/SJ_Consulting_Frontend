import { purpose } from "@/lib/mock-data";

export function PurposeSection() {
  return (
    <section className="border-t border-paper-line bg-paper dark:border-ink-line dark:bg-ink">
      <div className="container-content py-24 md:py-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.7fr_1fr] md:gap-16">
          <div>
            <div className="mb-6 h-[2px] w-14 bg-gold-metal" />
            <h2 className="font-display text-[30px] leading-tight sm:text-[36px]">
              {purpose.title}
            </h2>
          </div>
          <div className="space-y-5">
            {purpose.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-2xl text-[15.5px] leading-relaxed text-current/70"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
