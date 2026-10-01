"use client"
import { Hero } from "@/components/home/hero";
import { Information } from "@/components/home/information";
import { Metrics } from "@/components/home/metrics";
import { Testimonials } from "@/components/home/testimonials";
import {CookiesDisplay} from "@components/Cookies/cookiesDisplay"
import { useGlobalContext } from "../../Context";
import {useEffect} from "react";

export default function Home() {



   const {showCookie, setShowCookie} = useGlobalContext()
     const cookieStore   = (): {cookieSet : ()=> void, value : boolean  }=> {
      // SETTING THE COOKIE IN LOCAL STORAGE
      const cookieSet = () =>{

    window.localStorage.setItem("cookies", "true");
    setShowCookie(false);
      } 
      ///\\\========\\==========//\\
      const getCookie = ()=> {
        if(typeof window !== "undefined"){
 const value = localStorage.getItem("cookies") === "true";
 return {
  value
 }
}else{
  return {value : false}
}
      } 

      const {value} = getCookie()
    //  console.log(getCookie);
      //  if(getCookie){
      //    setCookieState(false);
      //  }
     
      return {cookieSet, value};
   }
   const { value} = cookieStore()
   useEffect(()=> {
      const runCookie = ()=> {
       if(value){
           setShowCookie(false)
       } else{
         setShowCookie(true)
       }
       }
      runCookie()
   }, [])



 

   
const {cookieSet} = cookieStore()

  return (
    <div className="flex flex-col h-auto relative">
      <Hero />
      <Information />
      <Metrics />
      <Testimonials />
    {showCookie && <CookiesDisplay cookieSet={cookieSet} />}
    </div>
  );
}
