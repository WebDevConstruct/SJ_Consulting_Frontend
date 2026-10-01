"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, GraduationCap } from "lucide-react";
import { useSession } from "@/lib/auth/use-session";

export default function UndergraduateDashboardPage() {
  const { user } = useSession();
  //const year = user?.undergraduate?.year ?? 1;

  return (
    <div className="px-6 py-10 md:px-12 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-paper-line pb-8 dark:border-ink-line"
      >
        <h1 className="font-display text-[26px] leading-tight sm:text-[30px]">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}.
        </h1>
        <p className="mt-1.5 text-[14px] text-current/60">
          Year &middot; UNILAG undergraduate
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-sm border border-paper-line bg-paper-soft p-7 dark:border-ink-line dark:bg-ink-surface"
        >
          <Building2
            className="h-6 w-6 text-gold-500 dark:text-gold-300"
            strokeWidth={1.6}
          />
          <h2 className="mt-4 font-display text-[19px]">Accommodation</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-current/60">
            No accommodation on file yet.
          </p>
          <span className="mt-4 inline-block rounded-sm border border-paper-line px-3 py-1.5 text-[12px] text-current/50 dark:border-ink-line">
            Listings land in a later build phase
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="rounded-sm border border-paper-line bg-paper-soft p-7 dark:border-ink-line dark:bg-ink-surface"
        >
          <GraduationCap
            className="h-6 w-6 text-gold-500 dark:text-gold-300"
            strokeWidth={1.6}
          />
          <h2 className="mt-4 font-display text-[19px]">GST</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-current/60">
            Year 1 and Year 2 GST modules, once payment access is wired in.
          </p>
          <Link
            href="/dashboard/undergraduate/gst"
            className="focus-gold mt-4 inline-flex w-fit rounded-sm border border-gold-400 bg-gold-metal-soft px-5 py-2.5 text-[13.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02]"
          >
            View GST
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
