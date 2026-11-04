"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/lib/auth/types";
import {createClient} from "@lib/supabase/client";
interface RequireAuthProps {
  profile: UserProfile;
  children: ReactNode;
}

export function RequireAuth({ profile, children }: RequireAuthProps) {
  const router = useRouter();

const supabase = createClient()

  const currentUser = async() => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      router?.replace("/signin")
      return;
    }
    if (data) {
      console.log("Current user:", data);
      
    }
  };

  useEffect(() => {
      async function checkAuth(){
        await currentUser()
      }
      checkAuth();
  }, []);




    // return (
    //   <div className="flex min-h-[60vh] items-center justify-center
    //   font-ui-sans-serif bg-paper dark:bg-ink">
    //     <span className="text-[13.5px] text-current/45">Loading…</span>
    //   </div>
    // );
  

  return <>{children}</>;
}
