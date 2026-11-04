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
import {X} from "lucide-react";
import {SubjectItem} from "./setUpData";
import {useStatusToast} from "@/components/ui/status-toast";
import {subjectChoiceState} from "@components/SettingUpModals/setUpData";
import {createClient} from "@lib/supabase/client"
       type InitialSetUpProps = {
    Header : string,
    text : string,
     
     buttonText : string,
     setInitialSetUpState :()=> void
}





const InitialSetUp = ({Header, 
    text, buttonText,
       setInitialSetUpState} : InitialSetUpProps) => {
     const {setAccountCompletionState, 
       setFacultyValue, facultyValue, departmentValue, collegeValue, setDepartmentValue, setCollegeValue} 
     = useGlobalContext()
     const {showToast} = useStatusToast();
     const [dropDownState, setDropDownState] = useState([
       {id : 0, dropDownType : "s_combination",  dropdown : false, },
      {id : 1, dropDownType: "college", dropdown : false, },
      {id : 2, dropDownType : "faculty", dropdown : false,  },
      {id : 3, dropDownType : "department", dropdown : false, },
      ]);
const [subjectCombinationValue, setSubjectCombinationValue] = useState<Array<string>>([""]);

const [departmentalArray, setDepartmentalArray] = useState<Array<string>>([])
   const [subjectCombinationState, setSubjectCombinationState]
    = useState<Array<SubjectItem>>([
      {id : 0, subject :"English Language", subjectChosen : false}, 
{id : 1, subject :"Mathematics", subjectChosen : false}, 
{id : 2, subject :"Further Mathematics", subjectChosen : false}, 
{id : 3, subject :"Physics", subjectChosen : false}, 
{id : 4, subject :"Chemistry", subjectChosen : false}, 
{id : 5, subject :"Biology", subjectChosen : false}, 
 {id : 6, subject :"Economics", subjectChosen : false},
 {id : 7, subject :"Government", subjectChosen : false},
 {id : 8, subject :"Geography", subjectChosen : false},
 {id : 9, subject :"History", subjectChosen : false},
{ id : 10, subject :"Literature-in-English", subjectChosen : false},
 {id : 11, subject :"CRS/IRS", subjectChosen : false},
{ id : 12, subject :"French", subjectChosen : false},
 {id : 13, subject :"Agricultural Science", subjectChosen : false},
 {id : 14, subject :"Commerce", subjectChosen : false},
{ id : 15, subject :"Financial Acounting", subjectChosen : false},
 {id : 16, subject :"Fine Arts", subjectChosen : false},
 {id : 17, subject :"Technical Drawing", subjectChosen : false},
 {id : 18, subject :"Igbo", subjectChosen : false},
 {id : 19, subject :"Yoruba", subjectChosen : false},
{ id : 20, subject :"Arabic", subjectChosen : false},
 {id : 21, subject :"Civic Education", subjectChosen : false},
 {id : 22, subject :"Data Processing/Computer Studies", subjectChosen : false},
 {id : 23, subject :"Music", subjectChosen : false},
{ id : 24, subject :"Business Management/Studies", subjectChosen : false},
 {id : 25, subject :"Nigerian Language", subjectChosen : false}
    ]);
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


  let subjectChosenValues = "";

  subjectChosenValues = subjectCombinationState?.filter((subitem, index)=> (
    subitem?.subjectChosen === true) 
  )?.map((subitem)=> subitem?.subject)?.join(",");

  //VARIABLE TO CHECK THE NUMBER OF SUBJECTS HISEN BEFORE ADDING
   const SubjectCombinationCheck = 
          subjectCombinationState?.filter((subitem)=> subitem?.subjectChosen === true)

    const updateUserProfile = async()=> {
    
      if(subjectCombinationValue?.length < 4 ) return showToast({kind : "error", 
        title : "Subject Combination error",
         message : "Ensure you select all your 4 subject combination before submission."})
         try {
     const supabase =  createClient();
   const {data, error} = await supabase?.auth?.getUser();
  if(error) return showToast({title : "Identification error", message : "Log in again to continue studying", kind : "error"})
   const {data : profile, error : profileError} = 
   await supabase.from("users")
   .update({account_verification : {
   subject_combination :   subjectCombinationValue,
   desired_college : collegeValue,
   desired_faculty : facultyValue,
   desired_department : departmentValue
   }
   })
    .eq("id", data?.user?.id)
    .select()
   

    if(profileError){
           showToast({
        title : "User Error",
        message: "An error blocked user retrieval info",
        kind : "error"
      })
      throw new Error(
         "Unexpected error has occured"
      )
    }

    if(!profile){
       showToast({
        title : "Profile fetch failed",
        message: "An error occured while retrieving your account info",
        kind : "error"
      })
      throw new Error(
         "Unexpected error has occured"
      )
      
 }

 const response = await supabase.auth.updateUser({
  data: {
    account_verification: {
      subject_combination: subjectCombinationValue,
      desired_college: collegeValue,
      desired_faculty: facultyValue,
      desired_department: departmentValue,
    },
  },
})


 if(response && data){
  setInitialSetUpState();
  showToast({
    kind : "success",
    title : "Account Verification Successful",
    message : `Services has been customized to your profile, navigate to the study page, to start reading,
    and start your first session.`
  })
 }
}catch(error){
  showToast({
    kind : "error",
    title : "Server error",
    message : "Try again later"
  })
}
  }
 
  return (
    <Modal>
        <div className="h-full w-full items-center
         flex md:justify-center lg:pr-10">
        
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
          departmentValue : item?.id === "s_combination" ? subjectChosenValues : ""}
         readOnly={item?.isDropdown}  onClick={()=> {
          
          facultySwitch("");
          if(item?.id === "faculty" && departmentValue?.length > 1){
          setDepartmentalArray([])
          setDepartmentValue("");
          
         }

         if(item?.id === "faculty" ){
           setSubjectCombinationValue(subjectChosenValues?.split(",") )
         }
         
         setDropDownState((prevState)=> (
          prevState?.map((dropitem, i)=> {
            if(i === index ){
              return {...dropitem,  dropdown : !dropitem?.dropdown}
            }
            return {...dropitem, dropdown : false}
          })
         ))
        }}
         key={index} 
        label={item.label} 
        type={item.inputType}/>
        {dropDownState[index]?.dropdown === true && (
        <div className={`absolute z-[2px] top-100 flex flex-col border border-gray overflow-y-scroll bg-white
        [scroll-width:none] [&::-webkit-scrollbar]:hidden
         w-full h-[300px] text-black dark:bg-black and dark:text-white`}>
{/* ADD AN ERROR MESSAGE TO ENSURE THE RIGHT SUBJECT COMBINATION IS CHOSEN BY THE USER */}
          {/* THE DEPARTMENT IS NOT DISPLAYED HERE */}
        {index !== 3 && item?.id !== "department" && item?.id !== "s_combination" && (
        item?.dropdown?.map((value, idx) => (
          <div onClick={()=> {
             setDropDownState((prevState)=> {
          
              return (
          prevState?.map((dropitem, i)=> {
           
            if(i === index){
              return {...dropitem,  dropdown : false}
            }
          return {...dropitem, dropdown : false}
             }))
          })
        if(item?.id === "faculty" ){
          if(SubjectCombinationCheck?.length > 0){
              setFacultyValue(value ?? "")
              facultySwitch(value ?? "");

          }else{
            showToast({
              kind : "error",
              title : "Subject Combination Error",
              message : "Your Subject Combination appears to be empty."
            })
          }
            
    
            }else if(item?.id === "college"){
              setCollegeValue(value ?? "")
            }
         }} key={idx} className="w-full flex justify-between 
         border-y-2 border-y-gray-200 py-5 px-2">
           <p onClick={()=> {
         
      
  
           }}
           className="text-current/60 dark:text-white 
           e font-semibold text-base text-start">
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
           
              return (
          prevState?.map((dropitem, i)=> {
           
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

        {/* THE SUBJECT COMBINATION DROPDown */}
           <div className="absolute top-10 flex flex-col w-full border-gray-50 border-1">
        {subjectChoiceState?.length > 0 
        && dropDownState[index]?.dropdown === true && index === 0 && 
        subjectCombinationState?.map((subComb, id)=> (
            <div key={id}  
// HNADLING OF THE DROPDOWN STATE FUNCTION
          
             // console.log("subjectCombinationState", subjectCombinationState);
          //    console.log("SubjectChoiceState", subjectChoiceState);

              //Joining and removing all the subject joined into a single string
              //  as it is chosen by the user and separated by a single comma in the string
              //But the setSubjectCombinationState Array remains the same with 4 subjects in the array
              // const joinedSubjects = subjectCombinationState?.filter((sbsItem, sbsIndex)=> {
              //   const joinedSubject
              // })
         //     console.log(joinedSubjects, "joinedSubjects");
           
            className="w-full flex justify-between px-2 border-y-2 border-y-gray-200 py-5">
           <p onClick={()=> {
               setDropDownState((prevState)=> {
             
              return (
          prevState?.map((dropitem, i)=> {
    
            if(i === index && subComb?.subjectChosen === false){
              return {...dropitem,  dropdown : true}
            }
          return {...dropitem, dropdown : false}
             }))
          })
          //Value state...
      
          if(SubjectCombinationCheck?.length  < 4){
              setSubjectCombinationState((prev)=> prev?.map((subitem, subIndex)=>{
              //  subjectChosenValues?.push(subitem?.subjectChosen === true ? subitem?.subject : "")
                
                return ({
                ...subitem, subjectChosen : subIndex === id ?
                 !subitem?.subjectChosen : subitem?.subjectChosen
              }
            )}))
          }else{
            showToast({
              kind : "error",
              title : "Subject Combination Error",
              message : "The Subject Combination required is 4 only, remove a subject to add another"
            })
          }
          
        

           }}
           className="text-current/60 w-[70%] dark:text-white font-semibold text-base text-start">
             {subComb?.subject}
           </p>

            <div className="h-full w-[30%] flex justify-center items-center"
             onClick={()=> {
              setSubjectCombinationState((prev)=> prev?.map((subitem, subIndex)=>{
              //  subjectChosenValues?.push(subitem?.subjectChosen === true ? subitem?.subject : "")
                
                return ({
                ...subitem, subjectChosen : subIndex === id ?
                 false : subitem?.subjectChosen
              }
            )}))

            setSubjectCombinationValue(subjectChosenValues?.split(","))
           }} >   
           <X width={30} height={30}/>
        </div>
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
       onClick={()=> {
        updateUserProfile()
     //  buttonClick()
       
       }}/>
      </div>
        </div>
        </Modal>
  )
}

export default InitialSetUp