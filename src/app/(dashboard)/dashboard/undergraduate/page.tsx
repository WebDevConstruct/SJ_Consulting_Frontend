"use client";
import { useEffect, useState} from "react";
import { useGlobalContext } from "../../../../../Context";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter} from "next/navigation";
import { Building2, GraduationCap, TruckElectric, User } from "lucide-react";
import {  usermetadata } from "@/types//UserTypes"
import { createClient } from "@lib/supabase/client";
import {useStatusToast} from  "@/components/ui/status-toast";
import InitialSetUp from "@components/undergraduates/InitialSetUp";
import {AccCompleteSuccess} from "@components/SettingUpModals/AccCompleteSuccess";
import {SettingUpAccount} from "@components/SettingUpAccount";
import {useDashboardPreview} from "../../../../hooks/use-dashboard-preview";
import { LeaderboardPreview } from "@/components/dashboard/leaderboard-preview";
import { PerformanceAnalysis } from "@/components/dashboard/performance-analysis";

export default function UndergraduateDashboardPage() {
  //const { user } = useSession();
  //const year = user?.undergraduate?.year ?? 1;
  const {preview, loading, error} = useDashboardPreview();


   const route = useRouter();
    const supabase = createClient();
      const {accountCompletionState,  setAccountCompletionState,
        accountCompleteSuccess, collegeValue, departmentValue, facultyValue, setAccountCompleteSuccess, setDepartmentValue, setCollegeValue, setFacultyValue} = useGlobalContext()
  //  const accountVerification_needed = mockApi?.getCurrentUser()?.accountVerification === null ? true : false;
  const [userAuthInfo, setUserAuthInfo] = useState<usermetadata>({} as usermetadata)
    
    
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
  
  console.log("checkAspirantMetaData", checkAspirantMetaData)
  return (
    <div className={`relative
          ${ checkAspirantMetaData === true &&
           accountCompletionState === false
            && accountCompleteSuccess === false ? "w-full px-5 py-10 md:w-full " : 
            checkAspirantMetaData === false && accountCompletionState === false ? "w-full px-5 py-10 md:w-full " : ""} `}>
         
        
      {/* ADDING OF COMPONENTS THAT ARE IN  ABSOLUTE STATE */}
      {checkAspirantMetaData &&  accountCompletionState === true  && 
       <InitialSetUp header={"Account Completion Required"} 
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
          route?.replace("/dashboard/undergraduate/cbt")
          }}
         onClickTwo={()=> setAccountCompleteSuccess(false)}

        />
         }
   <motion.div
      
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 border-b
         border-paper-line pb-8 dark:border-ink-line 
         sm:items-center sm:justify-between"
      >
        <div className="flex justify-between gap-5">
        <div className="flex justify-start w-full">
          <h1 className="font-display text-[26px] text-start uppercase leading-tight sm:text-[30px]">
            Welcome back, {userAuthInfo?.username  ?  userAuthInfo?.username :  "Hi there"} 👋.
          </h1>
          
        </div>





        <Link href="/dashboard/undergraduates/profile" className="border border-gold-300 w-[50px] h-10 rounded-full">
          <User className="h-10 w-10 p-3 text-ink"/>
          </Link>
          </div>
       
        
       
    
          <div className="rounded-md border lg:w-1/2 justify-end w-full  flex flex-col items-end border-gold-400/40 bg-gold-400/5 px-5 py-3 text-right">
            <p className="text-[11px] text-start uppercase tracking-wide text-current/45">
              ACADEMIC SESSION AS BEGUN
            </p>
            <p className="font-display text-[20px] text-start text-gold-600 dark:text-gold-300">
                  PLAY GAMES WITH FRIENDS
            </p>
          </div>
     
      
  
      </motion.div>


   <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-paper-line pb-8 dark:border-ink-line"
      >
{  checkAspirantMetaData && (
   <SettingUpAccount affirm_account_verification={true}/>
   )   }
   </motion.div>
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
