"use client";
import {useState, useRef} from "react"
import { motion } from "framer-motion";
import {
  Calculator,
  FileCheck,
  GraduationCap,
  Landmark,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { informationSections } from "@/lib/mock-data";
import { ScrollCue } from "@/components/ui/scroll-cue";
import {informationData} from "../assets/information";
import Image from "next/image";
import Link from "next/link"
const ICONS = {
  sparkles: Sparkles,
  landmark: Landmark,
  "file-check": FileCheck,
  calculator: Calculator,
  "graduation-cap": GraduationCap,
};


 

export function Information() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
const [syncDotsWithCarousel, setSyncDotsWithCarousel] = useState<number>(0);
  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };
 
  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
  //  console.log(el)
    if (!el) return;


    // CLEARLY DEFINE THE CLIENTWIDTH MOVEMENT

   //const card = el.getElementsByClassName("[data-card]") as HTMLElements || null;
    const distance = el.clientWidth < 400  ?  el.clientWidth + 25
     :  el.clientWidth + 25 ;
setSyncDotsWithCarousel((prev: number) =>
direction === 1     ? prev + 1 : prev-1)

  //   console.log("width", card?.offsetWidth)
   //For the large screen, the offsetWidth of the card
    //seems to be returning undefined and not an even an integer which makes the value 900 (The fallback width for the card) = 100
    //For screens less than 400px horizontally, the fallback width is 200 
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  };
  
  // setInterval(()=> {
  //    const el = trackRef.current;
  //    if(!el) return;
  //    settSyncDotsWithCarousel(Math.round(el.scrollLeft /el.clientWidth))
  // }, 2000)
  return (
    <section
      id="information"
      className="relative border-t  border-paper-line bg-paper-surface dark:border-ink-line dark:bg-ink"
    >
      <div className=" container-content flex flex-col items-center py-10 lg:py-24 md:py-32">
      
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
       
          <h1 className="font-display text-center text-[40px] md:text-[50px] leading-tight ">
            Information and Scholarship Opportunities, 
        
            All in one place.
          </h1>
          <p className="mt-4 text-base text-center leading-relaxed text-current/65">
           Grouped in five categories, 
           to provide a comprehensive view of all available updates.
          </p>
   
        </motion.div>
        {/* ALIGNING THE COUNTS OF THE DOTS WITH THE CAROUSEL */}
        <div className="flex flex-col gap-7 w-full ">
        <div  ref={trackRef} onScroll={updateEdges}
        className=" relative mt-16 flex gap-5 overflow-x-hidden 
        lg:h-screen h-[700px] item-card   w-full overflow-y-hidden no-scrollbar
         rounded-sm border border-paper-line  dark:border-ink-line ">
          {informationData.map((item, index) => {
            //const Icon = ICONS[item.icon];
            return (
             
           
               
              
            
                <motion.div  key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                data-item-id={item.type}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`w-full  rounded-md border-1 border-gray-100 overflow-y-hidden item-card
                   ${index == 0 || index === 2 ? "bg-paper-soft" : index === 1 || index === 3 ? "bg-paper-line" : ""}  
                    flex-shrink-0 basis-full bg-paper p-8
                 dark:bg-ink lg:h-screen md:h-[400px] h-full flex flex-col gap-5 py-15`}>

                    <h2 className="text-[30px] leading-tight text-current/80 text-center font-bold">

                 {item?.title}
                 </h2>
                 <div className="flex flex-col lg:flex-row gap-5 h-full w-full">

                      {item?.data?.map((news, i)=> (
                        i < 4  && (
                    <div className={`   ${i !== 0 ? "hidden lg:block" : ""} border-3 
                     border-gray-100 rounded-xl py-10 h-full w-full`} 
                    key={i}>

                 {/* <Image width={400} height={400} className={"object-cover w-full"} 
                 src={news?.image} alt={item?.description}/> */}
                 <div className="w-full h-1/3 bg-gray-200 "/>
                   <div className="h-[67.333%] p-4 flex flex-col justify-between overflow-y-hidden">
                    <div className="h-full">
                    <h2 className="lg:text-[16px] lg:leading-[20px] text-[13px] leading-[18x] font-semibold text-current/80">
  {news?.topic}
                    </h2> 
                  <i className="text-sm text-current/70">
                 {news?.short_message}
                  </i>
                  <p> {news?.long_message}</p>
                  </div>
                  <p className="text-[10px]  font-semibold">{news?.date}</p>
                   </div>
             
                     </div>
                       ) ))}
                       </div>
                  <div className="flex justify-end w-full flex-col gap-1">
                   <Link href={item?.link}
                    className="text-sm text-color-gold-metal text-end 
                     hover:text-gold-metal-soft transition-colors font-semibold ">
                      {`See all ${item?.link?.slice(1)} updates`}
     </Link>
                      <div className="w-30 h-2 self-end bg-gold-metal-soft"/>
               
                    </div>
                </motion.div>

               
          
           
            );
          })}
          
   {/* DIV TO FLEX THE FOUR CARD ELEMENTS OF THE INFORMTAION TYPES */}
                </div>
                 <div className="p-2 flex justify-center w-full gap-2">
                  {informationData?.map((items, i)=> (
                  <div className={`w-3 h-3 rounded-full ${syncDotsWithCarousel === i ?  "bg-gold-metal-soft" : "bg-gray-300"}`} key={i}/>
                  ))}
                </div>
               
        </div>
            
      </div>
     <div className="absolute top-1/2 right-1 flex items-center gap-3">
          
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Scroll departments right"
              className="focus-gold flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-gold-400 hover:text-gold-500 disabled:opacity-30 disabled:hover:border-current/20 disabled:hover:text-current"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {/* THE LEFT CAROUSEL BUTTON */}
          <div className="absolute top-1/2 left-1 ">
      <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Scroll departments left"
              className="focus-gold flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-gold-400 hover:text-gold-500 disabled:opacity-30 disabled:hover:border-current/20 disabled:hover:text-current"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
      <ScrollCue label="See the difference we've made" targetId="metrics" />
       
    </section>
  );
}
