import Dashboard from "@/components/Dashboard";
import { dbConfig } from "@/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation";

const Page = async() => {
    const { getUser }=getKindeServerSession();
    const user=await getUser()

    if(!user || !user.id){
        redirect('/auth-callback?origin=dashboard')
    }

    const existingUser=await dbConfig.user.findFirst({
        where:{
            id:user?.id
        }
    })

    if(!existingUser){
        redirect('/auth-callback?origin=dashboard')
    }
  return (
    <Dashboard/>
  )
}

export default Page