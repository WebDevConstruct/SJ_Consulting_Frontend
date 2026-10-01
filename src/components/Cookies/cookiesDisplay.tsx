"use client"
import React, {useEffect} from "react";
import {Button} from "../Button";
import {XCircle} from "lucide-react";
import Image from "next/image";
import {useGlobalContext} from "../../../Context";
export const CookiesDisplay = ({cookieSet}: {cookieSet: ()=> void}) => {
 const {setShowCookie} = useGlobalContext();
//cookieStore()
return (
 
   
    <div className="fixed w-full lg:px-[70px] px-[30px] h-full bottom-5
    flex justify-center items-end">

       <div className={`w-full h-3/4 md-w-[60%] md:h-[55%] lg:h-[300px] py-5 items-center justify-end 
         flex flex-col 
       lg:gap-4 md:gap-10 gap-5 border-gold-500 overflow-y-scroll
        md:px-4 px-2 dark:bg-ink-surface bg-paper-surface rounded-lg 
         animate-floaty [scrollbar-width:none]
         [&::-webkit-scrollbar] `}>
            <div className="flex justify-end w-full items-center">
                <img onClick={()=> {
                  setShowCookie(false);
                   }}
                 src={XCircle} alt="" className="w-5 h-5 py-2"/>
            </div>
         <h1 className="text-[50px] font-[700] text-center ">
            Cookies
            </h1>
          <p className="text-center text-base font-semibold">
            Cookies are used to improve your browsing experience,
       
         You can also choose which cookies you would like to accept or
           <br/> 
         reject by clicking on the Cookie Settings button below.
           
          
        
          </p>
{/* ACCEPT ALL COOKIES */}
   <div className="md:w-3/4 w-full md:py-4 py-3 dark:bg-ink-soft gap-5 px-2
    bg-paper-soft rounded-md flex justify-center items-center">


    <Button text="Accept All Cookies" 
    className={"w-1/2 lg:w-[300px] py-4!"} 
    type="button" onClick={()=> cookieSet()}/>

    {/* OPTIONAL COOKIES */}

 <Button text="Decline non-essential cookies" className={"w-1/2 lg:w-[300px] py-4!"}
      type="button" onClick={()=> cookieSet()}/>
     

   {/* REJECT ALL*/}
</div>
    </div>

  
        </div>
                  
)
}
