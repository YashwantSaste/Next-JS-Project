"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { trpc } from "@/app/_trpc/client"

const UpgradeButton = () => {
  const { mutate : createStripeSession}= trpc.createStripeSession.useMutation({
    onSuccess({url}) {
        window.location.href = url ?? "/dashboard/billing"
    },
  })

  const sampleFunction=()=>{
    console.log("The Button is clicked")
  }
  return (
    <Button className="w-full"
    onClick={()=>createStripeSession()}
    >
      Upgrade Button <ArrowRight className="h-5 w-5"/>
    </Button>
  )
}

export default UpgradeButton