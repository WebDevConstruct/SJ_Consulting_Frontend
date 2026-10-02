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
     const {setAccountCompletionState, 
       setFacultyValue, facultyValue, departmentValue, collegeValue, setDepartmentValue, setCollegeValue} 
     = useGlobalContext()
     const [dropDownState, setDropDownState] = useState([
       {id : 0, dropDownType : "s_combination",  dropdown : false, },
      {id : 1, dropDownType: "college", dropdown : false, },
      {id : 2, dropDownType : "faculty", dropdown : false,  },
      {id : 3, dropDownType : "department", dropdown : false, },
      ]);

const [departmentalArray, setDepartmentalArray] = useState<Array<string>>([])
   
const facultySwitch = (f_value : string)=> {

      switch(InputArray[3]?.id === "department"){
        case  f_value === "Faculty of Arts":
        return   setDepartmentalArray(facultyDepartments?.facultyOfArts)
          break;
        case f_value === "Faculty of Environmental Sciences":
          return  setDepartmentalArray(facultyDepartments?.facultyOfEnvironmentalSciences)
          break;
              case f_value === "Faculty of Sciences":
          return  setDepartmentalArray(facultyDepartments?.facultyOfScience)
          break;
            case f_value === "Faculty of Management Sciences":
          return  setDepartmentalArray(facultyDepartments?.facultyOfManagementSciences)
          break;
             case f_value === "Faculty of Engineering":
          return  setDepartmentalArray(facultyDepartments?.facultyOfEngineering)
          break;
            case f_value === "Faculty of Pharmacy":
          return  setDepartmentalArray(facultyDepartments?.facultyOfPharmacy)
          break;
           case f_value === "Faculty of Dental Sciences":
          return  setDepartmentalArray(facultyDepartments?.facultyOfDentalSciences)
          break;
             case f_value === "Faculty of Basic Medical Sciences":
          return  setDepartmentalArray(facultyDepartments?.facultyOfBasicMedicalSciences)
          break;
             case f_value === "Faculty of Education":
          return  setDepartmentalArray(facultyDepartments?.facultyOfEducation)
          break;

          case f_value === "Faculty of Arts":
          return  setDepartmentalArray(facultyDepartments?.facultyOfArts)
          break;
            case f_value === "Faculty of Law":
          return  setDepartmentalArray(facultyDepartments?.facultyOfLaw)
          break;
     
        
      }
    }
    //  if() InputArray[3]?.push()
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
      <div className="relative z-0 flex flex-col gap-5  w-full h-full">
      {InputArray?.map((item, index)=> (
        <div 
        key={index} className="w-full ">
        <TextField value={item?.id === "faculty" ?
         facultyValue : item?.id === "college" ? 
         collegeValue : item?.id === "department" ?
          departmentValue : ""}
         readOnly={item?.isDropdown}  onClick={()=> {
          // alert("I understand you broooo");
          // console.log(dropDownState);
          facultySwitch("");
          if(item?.id === "faculty" && departmentValue?.length > 1){
          setDepartmentalArray([])
          setDepartmentValue("")
         }
         setDropDownState((prevState)=> (
          prevState?.map((dropitem, i)=> {
            if(i === index){
              return {...dropitem,  dropdown : !dropitem?.dropdown}
            }
            return {...dropitem, dropdown : false}
          })
         ))
        }}
         key={index} 
        label={item.label} 
        type={item.inputType} />
        {dropDownState[index]?.dropdown === true && (
        <div className={`absolute z-[2px] top-100 flex flex-col border border-gray overflow-y-scroll bg-white
        [scroll-width:none] [&::-webkit-scrollbar]:hidden
         w-full h-[300px]`}>

          {/* THE DEPARTMENT IS NOT DISPLAYED HERE */}
        {index !== 3 && item?.id !== "department" && (
        item?.dropdown?.map((value, idx) => (
          <div onClick={()=> {
             setDropDownState((prevState)=> {
              console.log(prevState)
              return (
          prevState?.map((dropitem, i)=> {
            console.log(i === index)
            if(i === index){
              return {...dropitem,  dropdown : false}
            }
          return {...dropitem, dropdown : false}
             }))
          })

                 
            if(item?.id === "faculty"){
              setFacultyValue(value ?? "")
              facultySwitch(value ?? "")
            
    
            }else if(item?.id === "college"){
              setCollegeValue(value ?? "")
            }
         }} key={idx} className="w-full border-y-2 border-y-gray-200 py-5">
           <p onClick={()=> {
          //    setDropDownState((prevState)=> {
          //     console.log(prevState)
          //     return (
          // prevState?.map((dropitem, i)=> {
          //   console.log(i === index)
          //   if(i === index){
          //     return {...dropitem,  dropdown : false}
          //   }
          // return {...dropitem, dropdown : true}
          //    }))
          // })
          
      
  
           }}
           className="text-current/60 dark:text-white font-semibold text-base text-start">
             {value}
           </p>
            </div>
        
        ) ))}
        {/* DROPDOWN */}
        <div className="absolute top-10 flex flex-col border-gray-50 border-1">
        {departmentalArray?.length > 0 
        && dropDownState[index]?.dropdown === true && index === 3 && 
        departmentalArray?.map((depArray, id)=> (
            <div key={id} onClick={()=> {
// HNADLING OF THE DROPDOWN STATE FUNCTION
                 setDropDownState((prevState)=> {
              console.log(prevState)
              return (
          prevState?.map((dropitem, i)=> {
            console.log(i === index)
            if(i === index){
              return {...dropitem,  dropdown : false}
            }
          return {...dropitem, dropdown : false}
             }))
          })
          //Value state...
              setDepartmentValue(depArray)
            }}
            className="w-full border-y-2 border-y-gray-200 py-5">
           <p 
           className="text-current/60 dark:text-white font-semibold text-base text-start">
             {depArray}
           </p>
            </div>
        ))}
        </div>
        </div>
        )}

        <h2>

        </h2>
        </div>
      ))}
      </div>
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