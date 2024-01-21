"use client"

import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { useState } from "react"
import { Button } from "./ui/button"
const UploadButton = () => {
    const [isOpen, setIsOpen]=useState<boolean>(false)
  return (
    <Dialog open={isOpen} onOpenChange={(visible)=>{
        if(!visible){
            setIsOpen(visible)
        }
    }}>
        <DialogTrigger asChild>
             <Button>Upload PDF</Button>
        </DialogTrigger>
    </Dialog>
  )
}

export default UploadButton