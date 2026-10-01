interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="px-6 py-16 md:px-12 md:py-20">
      <div className="h-[2px] w-12 bg-gold-metal" />
      <h1 className="mt-6 font-display text-[28px] leading-tight sm:text-[32px]">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-current/60">
        {description}
      </p>
      <p className="mt-6 inline-block rounded-sm border border-paper-line px-4 py-2 text-[12.5px] font-medium text-current/50 dark:border-ink-line">
        Coming in a later build phase
      </p>
    </div>
  );
}
