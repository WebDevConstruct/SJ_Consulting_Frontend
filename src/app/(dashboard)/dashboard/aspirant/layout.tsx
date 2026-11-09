"use client";
import { useEffect} from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/dashboard/require-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { aspirantNavItems } from "@/lib/dashboard-nav";
import {useInactivityLogout} from "../../../../hooks/use-inactivity-logout";
import {createClient} from "@lib/supabase/client";
import {usePathname} from "next/navigation";
import {useStatusToast} from "@components/ui/status-toast";
import { useGlobalContext } from "../../../../../Context";
import type {usermetadata} from "@/types/UserTypes";

export default function AspirantDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const {showToast} = useStatusToast();
  const {  setUserAuthInfo} = useGlobalContext();
  const pathname = usePathname()
  const supabase = createClient();
  const currentUser = async()=> {
const {data, error} = await supabase.auth.getUser()
if(error){
  showToast({
    kind : "error",
    title : "Error Fetching User",
    message : error?.message || "An Unexpected error has occured.",
  })
}
if(data?.user){
  setUserAuthInfo(data?.user?.user_metadata as unknown as usermetadata)
}
if(data?.user && pathname?.length
   && pathname?.includes("undergraduate")){
    showToast({
      kind : "warning",
      title : "Access Denied",
      message : "You are not authorized to access this page.",
    })
  setTimeout(()=> {})
    router?.replace("/signin")
   }
  }
  useEffect(()=> {
    currentUser();
   
  }, [])
//const pathname = usePathname()
 useInactivityLogout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    redirectTo: "/signin",
  });


 


  return (
    <RequireAuth profile="aspirant">
      <DashboardShell navItems={aspirantNavItems}>{children}</DashboardShell>
    </RequireAuth>
  );
}
