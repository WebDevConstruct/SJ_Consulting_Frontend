
import {informationData} from "@components/assets/information"
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Exam",
  description: "Exam page",
};

export default function ExamPage() {
  return (
<div className="bg-paper-line w-full flex flex-col h-auto">
    {informationData?.map((item, index)=> (
        item?.type === "exam" && (
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
                <div
                style={{display : "flex", flexWrap : "wrap"}}
                 className="flex flex-wrap  gap-4 w-full rounded-xl ">
                  
                      {item?.data?.map((news, i)=> (
                      
                    <div className={` md:w-1/4 w-full   border-[2px] h-[400px]
                     border-gray-300 rounded-xl`} 
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
                       ))}
        
                  
                </div>

               
              </div>
                    )
))}
           </div>
  );
}
