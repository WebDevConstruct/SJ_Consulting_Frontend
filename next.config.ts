import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
 images : {
  remotePatterns : [
   new URL("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"), 
   
  ]
 }
};

export default nextConfig;
