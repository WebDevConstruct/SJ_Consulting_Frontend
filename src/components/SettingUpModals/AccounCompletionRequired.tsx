import React from "react";

export const AccountCompletionRequired = ()=> {
    return (
        <div className="flex flex-col gap-2 w-full my-3 bg-white dark:bg-ink 
         rounded-md border animate-none p-5">
            <div className="flex gap-2 h-full items-center">
                <div className="flex-shrink-0">
                    <div className="bg-red-100 text-red-500 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-grow">
                    <p className="text-sm font-medium text-current/75">
                        Account completion is required to access all features.
                    </p>
                </div>
            </div>
        </div>
    )
}