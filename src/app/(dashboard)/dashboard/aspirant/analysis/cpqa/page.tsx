"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Search } from "lucide-react";
import { DeepNavHeader } from "@/components/dashboard/deep-nav-header";
import { getMockAttempts } from "@/lib/analysis/mock-attempts";
import type { PerformancePeriod, RecentAttempt } from "@/lib/analysis/types";

const PERIOD_OPTIONS: { value: PerformancePeriod; label: string }[] = [
  { value: "daily", label: "Daily (last 24h)" },
  { value: "weekly", label: "Weekly (last 7 days)" },
  { value: "monthly", label: "Monthly (last 30 days)" },
];

const PERIOD_DAYS: Record<PerformancePeriod, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

const allAttempts = getMockAttempts();

function filterAttempts(
  attempts: RecentAttempt[],
  query: string,
  period: PerformancePeriod
): RecentAttempt[] {
  const cutoff = Date.now() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000;
  const q = query.trim().toLowerCase();

  return attempts
    .filter((a) => new Date(a.attempted_at).getTime() >= cutoff)
    .filter((a) => {
      if (!q) return true;
      return (
        a.subject.toLowerCase().includes(q) ||
        a.track_type.toLowerCase().includes(q) ||
        a.mode.toLowerCase().includes(q)
      );
    })
    .sort(
      (a, b) =>
        new Date(a.attempted_at).getTime() - new Date(b.attempted_at).getTime()
    );
}

export default function CpqaPage() {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<PerformancePeriod>("monthly");
  const [results, setResults] = useState<RecentAttempt[]>(() =>
    filterAttempts(allAttempts, "", "monthly")
  );

  const handleQuery = () => {
    setResults(filterAttempts(allAttempts, query, period));
  };

  const chartData = useMemo(
    () =>
      results.map((a) => ({
        date: new Date(a.attempted_at).toLocaleDateString("en-NG", {
          month: "short",
          day: "numeric",
        }),
        score_pct: a.score_pct,
      })),
    [results]
  );

  return (
    <>
      <DeepNavHeader
        trail={[
          { label: "Analysis", href: "/dashboard/aspirant/analysis" },
          { label: "CPQA", href: "/dashboard/aspirant/analysis/cpqa" },
        ]}
      />
      <div className="px-6 py-10 md:px-12 md:py-14">
        <p className="max-w-lg text-[14.5px] leading-relaxed text-current/65">
          Every CBT round you&rsquo;ve practiced — solo and peer, across
          every track. Leave the search empty to see everything.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="cpqa-query"
              className="text-[13px] font-medium text-current/70"
            >
              Search subject or track
            </label>
            <div className="relative mt-1.5">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-current/40" />
              <input
                id="cpqa-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Mathematics, peer, topic…"
                className="focus-gold w-full rounded-sm border border-paper-line bg-paper py-2.5 pl-10 pr-3 text-base text-current placeholder:text-current/35 dark:border-ink-line dark:bg-ink-surface md:text-[14px]"
              />
            </div>
          </div>

          <div className="sm:w-56">
            <label
              htmlFor="cpqa-period"
              className="text-[13px] font-medium text-current/70"
            >
              Performance period
            </label>
            <select
              id="cpqa-period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as PerformancePeriod)}
              className="focus-gold mt-1.5 w-full rounded-sm border border-paper-line bg-paper px-3 py-2.5 text-base text-current dark:border-ink-line dark:bg-ink-surface md:text-[14px]"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleQuery}
            className="focus-gold rounded-sm border border-gold-400 bg-gold-metal-soft px-6 py-2.5 text-[14px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.01]"
          >
            Run query
          </button>
        </div>

        <div className="mt-10 rounded-sm border border-paper-line bg-paper-soft p-5 dark:border-ink-line dark:bg-ink-surface">
          <h2 className="text-[13.5px] font-medium text-current/70">
            Score trend ({results.length} attempt{results.length === 1 ? "" : "s"})
          </h2>
          <div className="mt-4 h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
                    axisLine={{ stroke: "currentColor", opacity: 0.15 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
                    axisLine={{ stroke: "currentColor", opacity: 0.15 }}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--tw-color-ink, #0A0A0B)",
                      border: "1px solid #C9A227",
                      borderRadius: 4,
                      fontSize: 12.5,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score_pct"
                    stroke="#C9A227"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#C9A227" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-[13.5px] text-current/40">
                No attempts in this range yet.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col divide-y divide-paper-line overflow-hidden rounded-sm border border-paper-line dark:divide-ink-line dark:border-ink-line">
          {results.length === 0 ? (
            <div className="px-5 py-6 text-[13.5px] text-current/50">
              Nothing matches that query in this period.
            </div>
          ) : (
            results
              .slice()
              .reverse()
              .map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-4 bg-paper px-5 py-3.5 dark:bg-ink"
                >
                  <div>
                    <div className="text-[14px] font-medium">{a.subject}</div>
                    <div className="mt-0.5 text-[12.5px] capitalize text-current/50">
                      {a.track_type} &middot; {a.mode} &middot; {a.exam_type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-medium text-gold-600 dark:text-gold-300">
                      {a.score}/{a.total_questions}
                    </div>
                    <div className="mt-0.5 text-[12px] text-current/40">
                      {new Date(a.attempted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}
