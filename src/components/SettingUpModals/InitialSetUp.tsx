import React from 'react'
import { Modal } from "@components/Modal";
import {Book} from "lucide-react"
import {facultyDepartments, InputArray} from "./setUpData";
import { TextField } from '../forms/text-field';
import {useState} from "react";
import { ImCancelCircle } from 'react-icons/im';
import { BookAudio } from 'lucide-react';
import {useGlobalContext} from "../../../Context";
import {Button} from "@components/Button";
    type InitialSetUpProps = {
    Header : string,
    text : string,
     userProfile : "aspirant" | "undergraduate",
     buttonText : string,
     buttonClick : ()=> void
}



const InitialSetUp = ({Header, 
    text, buttonText,
      userProfile, buttonClick} : InitialSetUpProps) => {
     const {setAccountCompletionState} = useGlobalContext()
  return (
    <Modal>
        <div className="h-full w-full items-center flex md:justify-center lg:pr-10">
        
      <div className="h-screen w-full  px-5 md:w-1/2 py-4  md:h-3/4 rounded-lg
       bg-paper-line overflow-y-scroll [&::-webkit-scrollbar]:hidden 
        [scrollbar-width:none]
       dark:bg-ink-surface flex flex-col gap-10">
        <div className="w-full flex justify-end">
                <ImCancelCircle className="text-[20px] 
                text-current/60 hover:text-current/80 cursor-pointer" onClick={()=> {
                    setAccountCompletionState(false)
                }}/>
            </div>
    
        <div className="flex gap-2 items-center">
      <h1 className="text-black dark:text-white 
      text-[25px] lg:text-[30px] leading-[30px] lg:leading-[35px]
       font-bold ">
       {Header}
       
      </h1>
      <BookAudio className="w-10 h-10 bg-gold-metal-soft rounded-lg"/>
      </div>
      {/* Explanation of this page */}
      <div>
      <p className="text-current/60 dark:text-white font-semibold text-base text-start">
     {text}
      </p>
      </div>
    
      {InputArray?.map((item, index)=> (
        <TextField key={index} 
        label={item.label} 
        type={item.inputType} />
      ))}
      <Button 
       className="lg:w-[200px] w-full text-center rounded-md 
      flex justify-center mx-auto mb-20"
      text={buttonText}
       type ="submit" 
       onClick={buttonClick}/>
      </div>
        </div>
        </Modal>
  )
}

export default InitialSetUp