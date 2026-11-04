"use client"

import {createClient} from "@lib/supabase/client";
import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import type {UserInfo} from "@/types/UserTypes";
import {useRouter} from "next/navigation"
export default  function DashboardIndexPage() {
// const [authUserState, setAuthUserState] = useState<UserInfo>({} as UserInfo)
const supabase = createClient()
const router = useRouter();
const currentUser = async()=> {
  const authUser = await supabase.auth.getUser();
  if(authUser?.data){
   router?.replace(`/dashboard/${authUser?.data?.user?.user_metadata?.user_type}`);
  }
   
}

useEffect(()=> {
  async function fetchUser() {
  await currentUser()
  }
  fetchUser()

},[])



    
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-ink">
      <span className="text-[13.5px] text-current/45">
      Loading your dashboard…
      </span>
    </div>
  );
}
