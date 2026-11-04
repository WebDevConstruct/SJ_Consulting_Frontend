"use client"
import {Metadata} from "next";
import {useState, useEffect} from "react";
import {getAnnouncements} from "@lib/api";
import Image from "next/image";
import Link from "next/link";
import type { AnnouncementRecord } from "@/types/announcementTypes";
import type {InformationCategory} from "@/components/assets/information";


export default function Accomodation() {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[] | null>(null);

  useEffect(()=> {
    async function fetchAnnouncements(){
      const data = await getAnnouncements()
      setAnnouncements(data)
      console.log(data);
    }
    fetchAnnouncements()
  },[])

  const filterByCatAccomodation : AnnouncementRecord[] =  announcements?.filter((item)=> item.category === "accommodation") || []


  console.log("filterByCatAccomodation", filterByCatAccomodation)
 
  
  const informationData: InformationCategory[] = [
    {
      type: "accommodation",
      title: "Accommodation",
      description: "Examination updates, guidelines, syllabus changes, and official gazette bulletins directly from JAMB and national examination bodies.",
  
      link : "/accommodation",
    data: filterByCatAccomodation
    },

  ];
  return (
<div className="bg-paper-line w-full flex flex-col h-auto">
    {informationData?.map((item, index)=> (
        item?.type === "accommodation" && (
   <div key={index}
              
                className={`w-full  rounded-md border-1 border-gray-100 
                    overflow-y-hidden item-card px-10 
                   ${index == 0 || index === 2 ? "bg-paper-soft" : index === 1 || index === 3 ? "bg-paper-line" : ""}
                      flex-shrink-0 basis-full bg-paper p-8
                 dark:bg-ink h-full flex flex-col gap-10 py-15 `}
              >
                <h2 className="text-[30px] leading-tight text-current/80 text-center font-bold">

                 {item?.title}
                 </h2>
              <div className="flex flex-col lg:flex-row gap-5 lg:h-[450px] w-full">
                                 {item?.data?.length > 0 ? (
                                   item?.data?.map((news, i)=> (
                                     i < 4  && (
                 <div  className={`   ${i !== 0 ? "hidden lg:block" : ""} border-[3px] shadow-md 
                     border-gray-100 rounded-xl  lg:w-1/4 `} 
                                 key={i}>
             
                              <div className=" w-full h-1/3  ">
                                {news?.image_url?.length ? (
                              <Image width={400} height={400} className={"object-cover w-full h-full"} 
                              src={news.image_url} alt={item?.description}/>
                                ) : (
                                 <div className="w-full h-full bg-gray-200"/>
                                )}
                              </div>
                                <div className="h-[67.333%] w-full  p-4 flex flex-col justify-between overflow-y-hidden">
                                 <div className="h-full">
                                 <h2 className="lg:text-[16px] lg:leading-[20px] text-[13px] leading-[18x] font-semibold text-current/80">
               {news?.title}
                                 </h2> 
                               <i className="text-sm text-current/70">
                                 {news?.summary ? `${news?.summary?.slice(0, 100)}...` : ""}
                               </i>
                               <p> 
                                 { `${news?.content?.slice(0, 100)}...` || ""}

                               </p>
                               </div>
                               <p className="text-[10px]  font-semibold">
                              {news?.created_at ? new Date(news?.created_at).toString()?.slice(4, news?.created_at?.length -16) : ""}
                                </p>
                                 <Link href={`/jamb/${news?.slug}`} 
                                            className="text-sm text-color-gold-metal
                                             text-end">
                                            Read more
                                            </Link>
                                </div>
                          
   
                                  </div>
                                    ) ))): (
                                     <div className="">
                                       </div>
                                    )}
                                    </div>

               
              </div>
                    )
))}
           </div>
  );
}