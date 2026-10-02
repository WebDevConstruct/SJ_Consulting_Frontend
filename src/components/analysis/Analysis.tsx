"use client"
import React from "react"
import {useSession, session} from "@lib/auth"

/**
 * The analysis component is a graph displaying the relationship between the number of days and the practiced sessions.
 * Months can also be selected to view the performance metric. 
 */



  
   type trackStudiedType = {
        questionsAnswered : number,
        track : "subject" | "topic" | "s_combination",
        num_times : number,
        perf_Agg : string
    }




type analysisDataType = {
    id : number,
    userId : string,
    date : string,
    sessions_opened_total : number,
    trackStudied : trackStudiedType[],
 }

export const Analysis = () => {
const { user }  = useSession();
const userId = user?.id || ""

//A mock Analysis data 
    const analysisData : analysisDataType[] = [
        {id : 0, userId : userId, date : "2023-01-01",
             sessions_opened_total : 5, 
             trackStudied : [
                     {
        questionsAnswered : 60,
        track :  "s_combination",
        num_times : 2,
        perf_Agg : "70%"
    }
             ] }
    ]
    return (
        <div className="w-full font-ui-sans-serif  h-[300px] flex flex-col items-start my-[20px]">
        <p className="text-base text-left font-semibold ">
            Analysis Summary
            </p>
            <div className="h-[250px] md:w-1/2 
             pl-7 pb-7 w-full border border-black
             border-b">
                {analysisData?.length > 0 ? (
                analysisData?.map((item, index)=> {
                    return(
              <div className="h-full w-full border flex justify-center border-l
 border-b  border-gold-500" key={index}>
                     <select className="w-[300px] h-[30px] dark:text-white text-black">
                        <option className="dark:text-white text-black"
                         value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                       
                     </select>
                </div>
                    )
                })) : (
        <div>
            <p>
                No analysis data available. Please complete some 
                sessions to view your performance metrics.
            </p>
        </div>
                )}
                </div>
            </div>
    )
}