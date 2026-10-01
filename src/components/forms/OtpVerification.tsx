"use client"
import React from 'react';
import {AuthLayout} from "./auth-layout";
import {Modal} from "../Modal";
import OtpInput from "react-otp-input";
import {useGlobalContext} from "../../../Context";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {Button} from "@components/Button";
import {useRouter} from "next/navigation";
   export const OtpVerification = () => {

  const router = useRouter()

  const {OtpValues, setOtpValues} = useGlobalContext();
  const [isVisible, setIsVisible] = React.useState(false);
 // if(!email) return;
  const toggleVisibility = ()=> {};

  return (
    <Modal>
    
    <AuthLayout title ="OTP verification"
    subtitle ="Enter the 6-digit code sent to your email address to verify your account."
    footerText="You have an account already? Sign in here."
    footerLinkHref="/signin"
    footerLinkLabel ="Sign-In">
      <div className="flex flex-col gap-5">
        <p className=" text-[14px] leading-[18px] text-left">
          Request for another code in 10seconds
        </p>
               <div className="flex flex-col items-center lg:gap-[0px]
             gap-[5px] font-extrabold">
              <div className=" flex w-full justify-center items-center  gap-[10px]">
                  <OtpInput
                    value={OtpValues}
                    inputType={"tel"}
                    onChange={(value)=> setOtpValues(value)}
                    numInputs={6}
                    shouldAutoFocus={true}
                 
     containerStyle={{
      border : 1,
      borderColor : "#FFF",
      columnGap : "5px",
      display : "flex",
       width : "100%",
       height : "100px",
      justifyItems : "center",
      alignItems : "center",
        padding : "0px 5px",
     }}
     inputStyle={{
          fontWeight: 700,
          //borderWidth : 2,
        borderRadius: 4,
        height: "50px",
        width: "50px",
   
        outline : 1,
       // color :"white",
      
     }}
     renderInput={(props)=> (
        <input {...props} type ="tel" 
        className="dark:text-white text-black  rounded-lg
         dark:bg-ink  flex 
         dark:border-paper border-black bg-gray-100 
         bg-opacity-50  leading-6 "/>
     )}
                    />
                  
                    <div className="cursor-pointer" 
                    onClick={()=>  toggleVisibility()}>
                      {isVisible ? (
                        <AiFillEye className={isVisible ? "text-white" : "text-black"} />
                      ) : (
                        <AiFillEyeInvisible className={isVisible ? "text-white" : "text-black"} />
                      )}
                    </div>
              </div>
        </div>
        <Button text="Verify Otp" 
        type="submit" onClick={()=> {
          router.replace("/dashboard")
        }}/>
      </div>
    </AuthLayout>
     
    </Modal>
  )
}

export default OtpVerification