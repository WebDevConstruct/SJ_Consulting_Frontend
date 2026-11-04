"use client"
import {createContext, useState, useContext, useEffect} from "react";
import {StartedSession} from "@lib/study/cbt-api";
import { SessionNotification } from "@/components/SessionResultPopUp";
import {usermetadata} from "@/types/UserTypes";
import {createClient} from "@lib/supabase/client";
import { useRouter} from "next/navigation";
export interface signUpStateType{
         codeSent : boolean,
        otpSent : boolean,
        otpVerified: boolean,
        emailVerified : boolean
}
 
type CourseResponse = {
  course?: {
    id: string;
    course_code: string;
    course_title: string;
    access_status: "locked" | "unlocked";
  };
  multiplayer_available?: boolean;
  error?: string;
};
const supabase = createClient()
type contextTypes = {
    signUpState : signUpStateType,
    setSignUpState : React.Dispatch<React.SetStateAction<signUpStateType>>,
    OtpValues : string,
    setOtpValues : React.Dispatch<React.SetStateAction<string>>,
    showCookie : boolean,
    setShowCookie : React.Dispatch<React.SetStateAction<boolean>>,
    accountCompletionState : boolean,
    setAccountCompletionState : React.Dispatch<React.SetStateAction<boolean>>
    accountCompleteSuccess : boolean,
    setAccountCompleteSuccess : React.Dispatch<React.SetStateAction<boolean>>,
    facultyValue : string,
    setFacultyValue : React.Dispatch<React.SetStateAction<string>>,
    collegeValue : string,
    courseId : string,
    setCourseId : React.Dispatch<React.SetStateAction<string>>,
    setCollegeValue : React.Dispatch<React.SetStateAction<string>>,
    departmentValue : string,
    setDepartmentValue : React.Dispatch<React.SetStateAction<string>>,
    acceptedSession ?: StartedSession & {status : string},
    setAcceptedSession : React.Dispatch<React.SetStateAction<StartedSession & {status : string}> >,
    recipientSession : StartedSession & {status : string} | null,
    setRecipientSession : React.Dispatch<React.SetStateAction<StartedSession & {status : string} > >,
    notification : SessionNotification | null,
    setNotification : React.Dispatch<React.SetStateAction<SessionNotification | null>>,
    userAuthInfo : usermetadata | null,
    setUserAuthInfo : React.Dispatch<React.SetStateAction<usermetadata | null>>,
    course : CourseResponse["course"] | null,
    setCourse : React.Dispatch<React.SetStateAction<CourseResponse["course"] | null>>
}
const contextTree : React.Context<contextTypes> = createContext({} as contextTypes);
export const useGlobalContext =()=> useContext(contextTree);

export const ContextProvider = ({children}: {children ?: React.ReactNode})=> {
   const [showCookie, setShowCookie] = useState<boolean>(false);
      const [accountCompletionState,  setAccountCompletionState] = useState<boolean>(false);
      const [facultyValue, setFacultyValue] = useState<string>("")
       const [collegeValue, setCollegeValue] = useState<string>("");
        const [departmentValue, setDepartmentValue] = useState<string>("");
    const [signUpState, setSignUpState] = useState({
        codeSent : false,
        otpSent : false,
        otpVerified : false,
        emailVerified : false
    });
    const [OtpValues, setOtpValues] = useState("");
    const [accountCompleteSuccess, setAccountCompleteSuccess] = useState(false);
    const [userAuthInfo, setUserAuthInfo] = useState<usermetadata | null>({} as usermetadata)
    const [acceptedSession, setAcceptedSession] = useState<StartedSession & {status : string}>( { 
        session_id: "",
      kind: "peer",
      mode: "exam",
      track_type: "subject",
      submit_deadline : "",
      subjectId : "",
      question_count: 0,
      duration_seconds: 0,
      questions: [],
      status : "pending"
    } 
    );
    const [course, setCourse] = useState<CourseResponse["course"] | null>(null);
    const [recipientSession, setRecipientSession] = useState<StartedSession & {status : string}>({ 
        session_id: "",
      kind: "peer",
      mode: "exam",
      track_type: "subject",
      submit_deadline : "",
      subjectId : "",
      question_count: 0,
      duration_seconds: 0,
      questions: [],
      status : "pending"
    })
    const [notification, setNotification] = useState<SessionNotification | null>(null);
    const [courseId, setCourseId] = useState<string>("");
    const router = useRouter();
    const UpdateUserInfo = async()=> {
    await supabase.auth.getUser()
    .then((response)=> {
      if(response?.data?.user){
        setUserAuthInfo(response?.data?.user?.user_metadata as unknown as usermetadata)
      }
    }).catch((error)=> {
   alert("User Error")
    router?.replace("/signin")
    })
        
    
}
useEffect(()=> {
   UpdateUserInfo()
},[])
    const hold ={
        signUpState, course, setCourse,
        setSignUpState,
        OtpValues,
        setOtpValues,
        accountCompletionState,
        setAccountCompletionState,
        showCookie, setShowCookie,
        facultyValue, setFacultyValue,
        collegeValue, setCollegeValue,
        departmentValue, setDepartmentValue,
        accountCompleteSuccess, setAccountCompleteSuccess,
        acceptedSession, setAcceptedSession,
        recipientSession, setRecipientSession,
        notification, setNotification,
        courseId, setCourseId,
        userAuthInfo, setUserAuthInfo
    }
    return (
        <contextTree.Provider value={hold}>
            {children}
        </contextTree.Provider>
    )
}
