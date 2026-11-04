"use client"
import React, {useEffect} from "react";
import {Button} from "../Button";
import {XCircle} from "lucide-react";
import Image from "next/image";
import {useGlobalContext} from "../../../Context";
import {Modal} from "@components/Modal";
export const CookiesDisplay = ({cookieSet}: {cookieSet: ()=> void}) => {
 const {setShowCookie} = useGlobalContext();
//cookieStore()
return (
 
   
    <Modal>
    <div className="fixed w-full lg:px-[70px] px-[10px]  py-20 h-full bottom-5
    flex justify-center items-end md:items-center">

       <div className={`w-full h-auto md:h-[55%] lg:mb-0 mb-10 lg:h-[320px] border border-gray-200 items-center justify-end 
         flex flex-col gap-3 py-6 lg:py-2
       lg:gap-4 md:gap-10   overflow-y-scroll
        md:px-4 px-2 dark:bg-ink-surface bg-paper-surface rounded-lg 
         animate-floaty [scrollbar-width:none]
         [&::-webkit-scrollbar] `}>
            <div className="flex justify-end w-full items-center pr-5">
                <XCircle className="w-5 h-5  "/>
            </div>
         <h1 className="text-[50px] font-[700] text-center ">
            Cookies
            </h1>
          <p className="text-center text-base font-semibold">
            Cookies are used to improve your browsing experience,
               analyze site traffic, and personalize content.
                By clicking Accept All Cookies,
                 you consent to the use of cookies for these purposes.
                  You can manage your cookie preferences  
                  by clicking  on Decline non-essential cookies.
      
           <br/> 
         
           
          
        
          </p>
{/* ACCEPT ALL COOKIES */}
   <div className="md:w-3/4 w-full md:py-4 py-3 my-3 dark:bg-ink-soft gap-5 
    bg-paper-soft rounded-md flex justify-center items-center">


    <Button text="Accept All Cookies" 
    className={"w-1/2 lg:w-[300px] "} 
    type="button" onClick={()=> cookieSet()}/>

    {/* OPTIONAL COOKIES */}

 <Button text="decline non-essential cookies" className={"w-1/2 lg:w-[300px] "}
      type="button" onClick={()=> cookieSet()}/>
     

   {/* REJECT ALL*/}
</div>
    </div>

  
        </div>
        </Modal>
      
                  
)
}
