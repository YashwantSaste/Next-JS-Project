"use client"

import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import { DialogContent } from "./ui/dialog"
const UploadButton = () => {
    const [isOpen, setIsOpen]=useState<boolean>(false)
  return (
    <Dialog open={isOpen} onOpenChange={(visible)=>{
        if(!visible){
            setIsOpen(visible)
        }
    }}>
        <DialogTrigger asChild onClick={()=>setIsOpen(true)}>
             <Button>Upload PDF</Button>
        </DialogTrigger>

        <DialogContent>
            Example Content
        </DialogContent>
    </Dialog>
  )
}

export default UploadButton