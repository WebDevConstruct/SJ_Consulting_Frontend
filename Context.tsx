"use client"
import {createContext, useState, useContext} from "react";

export interface signUpStateType{
         codeSent : boolean,
        otpSent : boolean,
        otpVerified: boolean,
        emailVerified : boolean
}

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
    setAccountCompleteSuccess : React.Dispatch<React.SetStateAction<boolean>>
}
const contextTree : React.Context<contextTypes> = createContext({} as contextTypes);
export const useGlobalContext =()=> useContext(contextTree);

export const ContextProvider = ({children}: {children ?: React.ReactNode})=> {
   const [showCookie, setShowCookie] = useState<boolean>(false);
      const [accountCompletionState,  setAccountCompletionState] = useState<boolean>(false)
    const [signUpState, setSignUpState] = useState({
        codeSent : false,
        otpSent : false,
        otpVerified : false,
        emailVerified : false
    });
    const [OtpValues, setOtpValues] = useState("");
    const [accountCompleteSuccess, setAccountCompleteSuccess] = useState(false)
    const hold ={
        signUpState,
        setSignUpState,
        OtpValues,
        setOtpValues,
        accountCompletionState,
        setAccountCompletionState,
        showCookie, setShowCookie,
        accountCompleteSuccess, setAccountCompleteSuccess
    }
    return (
        <contextTree.Provider value={hold}>
            {children}
        </contextTree.Provider>
    )
}
