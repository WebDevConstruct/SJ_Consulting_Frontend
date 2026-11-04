"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Users, User } from "lucide-react";
import {Analysis} from "@components/analysis";
import {SettingUpAccount} from "@components/SettingUpAccount";
import InitialSetUp from "@components/SettingUpModals/InitialSetUp";
import {useGlobalContext} from "../../../../../Context";
import {AccCompleteSuccess} from "@components/SettingUpModals/AccCompleteSuccess";
import type {AspirantAccountVerificationType} from "@lib/auth/types";
import {useRouter} from "next/navigation";
import {createClient} from "@lib/supabase/client";
import {useStatusToast} from  "@/components/ui/status-toast";
import type {usermetadata} from "@/types/UserTypes";
import {useDashboardPreview} from "../../../../hooks/use-dashboard-preview";
import { LeaderboardPreview } from "@/components/dashboard/leaderboard-preview";
import { PerformanceAnalysis } from "@/components/dashboard/performance-analysis";




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
  const { preview, loading, error } = useDashboardPreview();
  const route = useRouter();
  const supabase = createClient();
    const {accountCompletionState,  setAccountCompletionState,
      accountCompleteSuccess, collegeValue, departmentValue,
       facultyValue, setAccountCompleteSuccess, setDepartmentValue,
        setCollegeValue, setFacultyValue, userAuthInfo, setUserAuthInfo} = useGlobalContext()
//  const accountVerification_needed = mockApi?.getCurrentUser()?.accountVerification === null ? true : false;

  const countdown = useCountdown(NEXT_JAMB_DATE);
  
     const {showToast} = useStatusToast()

  const UserRetrievalFunc = async()=> {
    await supabase?.auth?.getUser()
    .then((response)=> {
      if(response?.data?.user){
        setUserAuthInfo(response?.data?.user?.user_metadata as unknown as usermetadata)
      }
    }).catch((error)=> {
     showToast({
      kind : "error",
      title : "User Info Retrieval Error",
      message : "The System Failed to retrieve your user Information"
    })
    route?.replace("/signin")
    })
  
  }

  useEffect(()=> {
     async function RetrievalFromSupabase(){
      await UserRetrievalFunc()
     }
     RetrievalFromSupabase();
  },[])

  const accountCompletionFunc  = ()=> {
 // CLEARING OF STATES
     setAccountCompletionState(false)
       setAccountCompleteSuccess(true)
       setDepartmentValue("")
       setCollegeValue("");
       setFacultyValue("")
}



const checkAspirantMetaData : boolean 
= userAuthInfo?.account_verification
 && Object.keys(userAuthInfo?.account_verification).length === 0 ? true : false;


  // const handleAccountCompletion = ()=> {
    
  // }
  return (
    <div className={`h-full relative  bg-paper-soft dark:bg-ink-soft
     ${accountCompletionState === false && accountCompleteSuccess === false ? "w-full px-5 py-10 md:w-full " : ""} `}>
   
      {/* ADDING OF COMPONENTS THAT ARE IN  ABSOLUTE STATE */}
      {checkAspirantMetaData &&
       <InitialSetUp Header={"Account Completion Required"} 
      text={`Your data is collected to personalize and customize the feature experience for you.`} 
      buttonText="Submit"
      setInitialSetUpState={()=>{
        accountCompletionFunc();
      }}
      />}
     { accountCompleteSuccess 
      && <AccCompleteSuccess
      Header={"Account Completion Successful"} 
      text={"Success"} 
      subtext={"You can now access all features of the platform."}
      buttonTextOne={"Study Now"}
        buttonTextTwo={"Done"}
     
        onClickOne={()=> {
          setAccountCompleteSuccess(false)
          route?.replace("/dashboard/aspirant/study")
          }}
         onClickTwo={()=> setAccountCompleteSuccess(false)}

        />
         }
       {/* ADDING OF COMPONENTS THAT ARE IN  ABSOLUTE STATE */}
      <motion.div
      
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 border-b
         border-paper-line pb-8 dark:border-ink-line 
         sm:items-center sm:justify-between"
      >
        <div className="flex justify-between gap-5 items-center">
        <div className="flex justify-start w-full">
          <h1 className="font-display text-[26px] text-start uppercase leading-tight sm:text-[30px]">
            Welcome back, {userAuthInfo?.username  ?  userAuthInfo?.username :  "Hi there"} 👋.
          </h1>
          
        </div>





        <Link href="/dashboard/aspirant/profile"  className="border border-gold-300 dark:bg-ink-soft 
  d w-[50px] h-10 rounded-full bg-paper-soft">
          <User className="h-10 w-10 p-3 text-ink dark:text-paper-surface"/>
          </Link>
          </div>
       
        
       
      {countdown ? (
          <div className="rounded-md border lg:w-1/2 justify-end w-full  flex flex-col items-end border-gold-400/40 bg-gold-400/5 px-5 py-3 text-right">
            <p className="text-[11px] text-start uppercase tracking-wide text-current/45">
              JAMB COUNTDOWN
            </p>
            <p className="font-display text-[20px] text-start text-gold-600 dark:text-gold-300">
              {countdown.days}d {countdown.hours}h
            </p>
          </div>
        ) : null}
      
  
      </motion.div>
      
  {  checkAspirantMetaData && (
   <SettingUpAccount affirm_account_verification={true}/>
   )   }
{/* ==============\\\\\\\\\\\\\================== */}
     <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <PerformanceAnalysis
        preview={preview}
        loading={loading}
        error={error}
      />

      <LeaderboardPreview
        preview={preview}
        loading={loading}
        error={error}
      />
    </div>

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

        {/* <motion.div
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
        </motion.div> */}
    
      </div>
      </div>

);
}
