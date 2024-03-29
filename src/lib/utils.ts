import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path:string){
  //if url of window is undefined that means we are on client side

  if(typeof window !== "undefined"){
    return path
  }
  if(process.env.VERCEL_URL){
    return `https://${process.env.VERCEL_URL}${path}`
  }
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}