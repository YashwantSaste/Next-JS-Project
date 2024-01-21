
import UploadButton from "@/components/UploadButton";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

const page= async ()=>{
  const { getUser, isAuthenticated }=getKindeServerSession();
  const user= await getUser();
  if(!user?.email || !user?.id){
    return redirect('/auth-callback?origin=dashboard')
  }

  return(
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">
          My Files
        </h1>

        <UploadButton/>
      </div>
    </main>
  )
}

export default page