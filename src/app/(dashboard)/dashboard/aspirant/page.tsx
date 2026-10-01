"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import { useSession } from "@/lib/auth/use-session";
import {Analysis} from "@components/analysis";
import {SettingUpAccount} from "@components/SettingUpAccount";
import {mockApi} from "@lib/auth";
import InitialSetUp from "@components/SettingUpModals/InitialSetUp";
import {useGlobalContext} from "../../../../../Context";
import {AccCompleteSuccess} from "@components/SettingUpModals/AccCompleteSuccess";
const NEXT_JAMB_DATE = new Date("2027-04-10T09:00:00");

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(target.getTime() - Date.now());
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, [target]);

  if (remaining === null) return null;
  const days = Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24)));
  const hours = Math.max(
    0,
    Math.floor((remaining / (1000 * 60 * 60)) % 24)
  );
  return { days, hours };
}

const LEADERBOARD_PREVIEW = [
  { name: "Chiamaka O.", score: 2140 },
  { name: "Damilare K.", score: 1985 },
  { name: "You", score: 1420, isSelf: true },
];



export default function AspirantDashboardPage() {
    const {accountCompletionState,  setAccountCompletionState,
      accountCompleteSuccess, setAccountCompleteSuccess} = useGlobalContext()
//  const accountVerification_needed = mockApi?.getCurrentUser()?.accountVerification === null ? true : false;

  const { user } = useSession();
  const countdown = useCountdown(NEXT_JAMB_DATE);


  // const handleAccountCompletion = ()=> {
    
  // }
  return (
    <div className={`h-full relative  bg-paper-soft dark:bg-ink-soft
     ${accountCompletionState === false && accountCompleteSuccess === false ? "px-6 py-10 md:px-12 md:py-14" : ""} `}>
      {/* ADDING OF COMPONENTS THAT ARE IN  ABSOLUTE STATE */}
      {accountCompletionState &&
       <InitialSetUp Header={"Account Completion Required"} 
      text={"Your data is collected to personalize and customize the feature experience for you."} 
      userProfile={"aspirant"}
      buttonText="Submit"
      buttonClick={()=>{
       setAccountCompletionState(false)
       setAccountCompleteSuccess(true)
      }}
      />}
     { accountCompleteSuccess 
      && <AccCompleteSuccess
      Header={"Account Completion Successful"} 
      text={"Success"} 
      subtext={"You can now access all features of the platform."}
      buttonTextOne={"Study Now"}
        buttonTextTwo={"Practice MCQs"}
        buttonTextThree={"Done"}
        onClickOne={()=> {
          setAccountCompleteSuccess(false)
          }}
         onClickTwo={()=> setAccountCompleteSuccess(false)}
         onClickThree={()=> setAccountCompleteSuccess(false)}
        />
         }
       {/* ADDING OF COMPONENTS THAT ARE IN  ABSOLUTE STATE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 border-b
         border-paper-line pb-8 dark:border-ink-line 
         sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="font-display text-[26px] leading-tight sm:text-[30px]">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}.
          </h1>
          <p className="mt-1.5 text-[14px] text-current/60">
            Here&rsquo;s where your JAMB prep stands today.
          </p>
        </div>

        {countdown ? (
          <div className="rounded-sm border w-1/2 flex flex-col items-end border-gold-400/40 bg-gold-400/5 px-5 py-3 text-right">
            <div className="text-[11px] uppercase tracking-wide text-current/45">
              Countdown to JAMB
            </div>
            <div className="font-display text-[20px] text-gold-600 dark:text-gold-300">
              {countdown.days}d {countdown.hours}h
            </div>
          </div>
        ) : null}
      </motion.div>
   <SettingUpAccount/>
{/* ==============\\\\\\\\\\\\\================== */}
  <Analysis/>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col justify-between rounded-sm border border-paper-line bg-paper-soft p-7 dark:border-ink-line dark:bg-ink-surface"
        >
          <div>

          
            <Users
              className="h-6 w-6 text-gold-500 dark:text-gold-300"
              strokeWidth={1.6}
            />
            <h2 className="mt-4 font-display text-[19px]">
              No peer competitions yet
            </h2>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-current/60">
              Invite a study partner to a peer CBT round once the practice
              engine is live in this build phase.
            </p>
          </div>
          <Link
            href="/dashboard/aspirant/cbt"
            className="focus-gold mt-6 inline-flex w-fit rounded-sm border border-gold-400 bg-gold-metal-soft px-5 py-2.5 text-[13.5px] font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02]"
          >
            Practice questions now
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="rounded-sm border border-paper-line bg-paper-soft p-7 dark:border-ink-line dark:bg-ink-surface"
        >
          <Trophy
            className="h-6 w-6 text-gold-500 dark:text-gold-300"
            strokeWidth={1.6}
          />
          <h2 className="mt-4 font-display text-[19px]">Leaderboard</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {LEADERBOARD_PREVIEW.map((entry, index) => (
              <li
                key={entry.name}
                className={`flex items-center justify-between rounded-sm px-3 py-2 text-[13.5px] ${
                  entry.isSelf
                    ? "border border-gold-400/40 bg-gold-400/5 font-medium"
                    : "text-current/70"
                }`}
              >
                <span>
                  {index + 1}. {entry.name}
                </span>
                <span className="tabular-nums text-current/50">
                  {entry.score.toLocaleString()} pts
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      </div>

);
}
