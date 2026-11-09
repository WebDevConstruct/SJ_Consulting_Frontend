"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpenCheck,  ScrollText } from "lucide-react";
import { GlossyCard } from "@/components/study/glossy-card";
import { type StartedSession, SubmissionResult,  } from "@/lib/study/cbt-api";
import type { CbtMode, } from "@/lib/study/types";
import { AccountCompletionRequired } from "@/components/SettingUpModals/AccounCompletionRequired";
import { createClient } from "@/lib/supabase/client";
import  {type SubjectOption, type TopicOption, type CombinationOption}  from "@/components/study/SoloTrackModal"

import { usermetadata } from "@/types/UserTypes";
import {useGlobalContext} from "../../../../../../Context"
import {useStatusToast} from "@/components/ui/status-toast";
type Modal =
  | "none"
  | "subject-select"
  | "cbt-mode"
  | "solo-mode" | 
  "solo-track" 
  | "timing";




export default function StudyHubPage() {
  const supabase = createClient();
  const {showToast} = useStatusToast();

const {userAuthInfo} = useGlobalContext()

  const router = useRouter();
  


  








//CHECKING RESULT AFTERWARDS


 const checkAccountVerification = Object.keys(userAuthInfo?.account_verification || {}).length > 0 ? true : false;


  return (
    <div className="px-6 py-10 md:px-12 md:py-14">
      <div className="h-[2px] w-12 bg-gold-metal" />
      <h1 className="mt-6 font-display text-[28px] leading-tight sm:text-[32px]">
        Study
      </h1>
      <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-current/65">
        Everything here opens as a quick step-by-step flow rather than a new
        page to hunt through: pick a card, answer a couple of short prompts,
        and you&rsquo;re straight into it. Topic materials open as their own
        page (with a way back to Study at the top); solo and peer practice
        rounds open full-screen so nothing distracts from the questions.
      </p>


   <div >
   { checkAccountVerification ? (
   <div>
   
   

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <GlossyCard
          icon={BookOpenCheck}
          title="Study"
          description="Course Outlines and Study materials for each course are here"
          onClick={() => {
            showToast({
              kind : "info",
              title : "Coming Soon",
              message : "This feature is coming soon, please check back later"
            })
          }}
        />
        <GlossyCard
          icon={ScrollText}
          title="Practice MCQs (CBT)"
          description="Solo or with a friend — leaderboard ranking and incentives, split by subject, topic or combination."
          onClick={() => router?.replace("/dashboard/undergraduate/study/cbt")}
          delay={0.08}
        />
      </div>

      
    </div>
    
    ) : (
      <AccountCompletionRequired />
    )}
    </div>
    </div>
  )
}

