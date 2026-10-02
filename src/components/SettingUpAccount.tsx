"use client"
import React from "react";
import {ArrowRight} from "lucide-react";
import Image from "next/image";
import {useGlobalContext} from "../../Context"
import {mockApi} from "@lib/auth"
export const SettingUpAccount = ()=> {
    const {accountCompletionState,  setAccountCompletionState} = useGlobalContext();
    const account_completion = mockApi?.getCurrentUser()?.accountVerification
    return (
        <div className="flex flex-col gap-2 w-full my-3 bg-white dark:bg-ink 
         rounded-md border animate-none p-5">
            <div onClick={()=> {
                if(account_completion === null){
                setAccountCompletionState(true);
                }
            }}
            className="flex gap-2 h-full items-center">
            <p className="text-black dark:text-white font-bold text-base leading-[25px]">
                Finish setting up your account
            </p>
    
        <div className="rounded-full  flex justify-center items-center
          w-10 h-10 bg-opacity-5 bg-[#7C7C7C]"  onClick={()=> {}}>
            <ArrowRight
         className="dark:text-white text-balck w-5 h-5"
             onClick={()=> {}}/>
             </div>
            </div>
            <div className="w-full rounded-lg bg-gray-200"> 
            <div className="w-[80%] h-2 bg-gold-400 rounded-lg"/>
            </div>
            </div>
    )
}