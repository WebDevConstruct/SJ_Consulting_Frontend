import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers"
export const createClient = async()=> {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""
    ,
 {cookies : {
            getAll(){
                return cookieStore.getAll()
            }, setAll(cookieToSet){
                try {
                    cookieToSet.forEach(({name, value, options})=>{
                        cookieStore.set(name, value, options)
                    } );
        
                }catch(error){
                      throw new Error("failed to save admin session cookies on client");
                }
            }
        }
        })
}