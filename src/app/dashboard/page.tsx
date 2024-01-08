"use client"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

const page=()=>{
  const { getUser, isAuthenticated }=getKindeServerSession();
  const user=getUser();
  if(!isAuthenticated){
    return redirect('/auth-callback?origin=dashboard')
  }

  return(
    <div>
      Dashboard
    </div>
  )
}