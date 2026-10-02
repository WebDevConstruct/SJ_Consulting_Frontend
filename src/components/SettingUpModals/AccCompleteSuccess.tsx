import React from "react";
import {Button} from "@components/Button"
import Image from "next/image"
import {Modal} from "@components/Modal"
type successProps = {
    Header : string,
    text : string,
    subtext : string,
    buttonTextOne : string,
    buttonTextTwo : string,

    onClickOne : ()=> void,
    onClickTwo : ()=> void,

}
export const AccCompleteSuccess = ({Header, text, subtext, buttonTextOne,
      buttonTextTwo,
    onClickOne, onClickTwo, } : successProps) => {
  return (
    <Modal>
    <div className="flex flex-col items-center  justify-center h-full w-full">
      <div className="lg:relative right-[120px] h-screen w-full  px-5 md:w-1/2 py-20 md:pr-10  md:h-[90%] rounded-lg
       bg-paper-soft overflow-y-scroll [&::-webkit-scrollbar]:hidden 
        [scrollbar-width:none] justify-center items-center lg:border lg:border-gray-300
       dark:bg-ink-surface flex flex-col gap-10">

      <h1 className="text-2xl font-bold text-center">
        {Header}
        </h1>
        <div className="flex flex-col gap-2 items-center">
      <p className="text-[30px] text-center leading-[36px] font-medium">
        {text}
        </p>
<Image src={"/images/SuccessSJ.svg"} className="" width={100} height={100}
 alt=""/>

      <p className="text-base text-center text-green-700 font-bold">
        {subtext}
        </p>
        </div>
      <div className="flex flex-col gap-5 px-2 w-full md:w-1/2 justify-center 
      items-center">
 <Button type={"submit"} text={buttonTextOne} 
 className={"w-1/2 bg-gold-metal-soft text-white"} onClick={onClickOne} />
 <Button type={"submit"} text={buttonTextTwo}
  className={"w-1/2 bg-paper-soft text-[#C9A227] border border-[#C9A227]"} onClick={onClickTwo} />

      
      </div>
    
    </div>
    </div>
    </Modal>
  );
};

