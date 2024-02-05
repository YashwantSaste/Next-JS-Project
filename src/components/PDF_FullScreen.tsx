interface PDF_FullScreenProps {
    url: string;
}

import { useState } from "react"
import { Dialog } from "./ui/dialog"
import { DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Expand, Loader2 } from "lucide-react"
import SimpleBar from "simplebar-react"
import { useResizeDetector } from "react-resize-detector"
import { Document, Page } from "react-pdf"
import { useToast } from "./ui/use-toast"
const PDF_FullScreen = ({url}:PDF_FullScreenProps) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen]=useState(false)
    const { width, ref }=useResizeDetector();
    const [numOfPagesinPDF,setNumOfPagesinPDF]=useState<number>()
    
  return (
    <Dialog open={isOpen} onOpenChange={(visiblity)=>{
        if(!visiblity){
            setIsOpen(visiblity)
        }
    }}>
        <DialogTrigger asChild onClick={()=>setIsOpen(true)}>
            <Button aria-label="fullScreen" variant='ghost' className="gap-1.5">
                <Expand className="h-4 w-4"/>
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl w-full">
            <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
                <div ref={ref}>
                <Document
                loading={
                    <div className="flex justify-center">
                        <Loader2 className="my-24 h-6 w-6 animate-spin"/>
                    </div>
                }
                onLoadError={()=>{
                    toast({
                    title:"Error loading the PDF",
                    description:"Please try again later",
                    variant:"destructive"
                    })
                }}
                onLoadSuccess={({numPages})=>{setNumOfPagesinPDF(numPages)}}
                file={url} // Provide the PDF file URL here
                className="max-h-full"
                >
                {
                    new Array(numOfPagesinPDF).fill(0).map((_,i)=>(
                        <Page
                        key={i}
                        width={width ? width : 1}
                        pageNumber={i + 1}
                        />
                    ))
                }
                </Document>
            </div>
            </SimpleBar>
        </DialogContent>
    </Dialog>
  )
}

export default PDF_FullScreen