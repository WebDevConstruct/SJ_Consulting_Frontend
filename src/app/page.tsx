"use client"
import { Hero } from "@/components/home/hero";
import { Information } from "@/components/home/information";
import { Metrics } from "@/components/home/metrics";
import { Testimonials } from "@/components/home/testimonials";
import {CookiesDisplay} from "@components/Cookies/cookiesDisplay"
import { useGlobalContext } from "../../Context";
import {useEffect} from "react";

export default function Home() {
  console.log("Check COokies", localStorage.getItem("cookies"))


   const {showCookie, setShowCookie} = useGlobalContext()
     const cookieStore   = (): {cookieSet : ()=> void, getCookie : boolean }=> {
      // SETTING THE COOKIE IN LOCAL STORAGE
      const cookieSet = () =>{
    localStorage.setItem("cookies", "true");
    setShowCookie(false);
      } 
      ///\\\========\\==========//\\
      const getCookie = localStorage.getItem("cookies") === "true";
      console.log(getCookie);
      //  if(getCookie){
      //    setCookieState(false);
      //  }
     
      return {cookieSet, getCookie};
   }
   const { getCookie} = cookieStore()
   useEffect(()=> {
      const runCookie = ()=> {
       if(getCookie ){
           setShowCookie(false)
       } else{
         setShowCookie(true)
       }
       }
      runCookie()
   }, [])

console.log(showCookie);
//console.log(localStorage.getItem("cookies"))
//const [cookieState, setCookieState] = React.useState<boolean>(false);
 

   
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
