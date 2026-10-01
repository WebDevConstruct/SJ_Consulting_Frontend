import React from 'react'

export const Modal = ({children} : {children : React.ReactNode}) => {
  return (
    <div className="fixed lg:justify-center w-full h-screen flex  
   backdrop-blur-lg">
     {children}
    </div>
  )
}

