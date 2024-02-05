"use client"
interface PDFRenderProps {
  url: string;
}

import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css'; 
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {useResizeDetector} from "react-resize-detector"
import { z } from "zod";
import { DropdownMenu } from "./ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import SimpleBar from "simplebar-react"
import PDF_FullScreen from "./PDF_FullScreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PDFRenderer = ({ url }: PDFRenderProps) => {
  const {toast} =useToast();

  const { width, ref }=useResizeDetector()
  //setting up the pages count of the pdf
  const [numOfPagesinPDF,setNumOfPagesinPDF]=useState<number>()
  const [currentPageinPDF,setcurrentPageinPDF]=useState<number>(1);

  //setting up the zoom feature

  const [scale,setScale]=useState<number>(1);

  //setting up the rotation feature

  const [rotation,setRotation]=useState<number>(0)

  //optimising the slow cpu throtlling devices user experience

  const [renderScale, setRenderScale]=useState<number | null>(null)

  const isLoading =renderScale !== scale

  const CustomPageValidator=z.object({
    page:z.string().refine((num)=>Number(num) > 0 && Number(num)<=numOfPagesinPDF!)
  })

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>

  //handling the input case 

  const {register,handleSubmit,formState:{errors} ,setValue} =useForm<TCustomPageValidator>({
    defaultValues:{
      page:"1"
    },
    resolver:zodResolver(CustomPageValidator)
  });

  const handlePageSumbit=({page}:TCustomPageValidator)=>{
      setcurrentPageinPDF(Number(page))
      setValue("page",String(page))
  }
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Button 
          disabled={currentPageinPDF<=1}
          onClick={()=>{
            setcurrentPageinPDF((prev)=>prev-1 > 1 ? prev-1 : 1)
            setValue("page",String(currentPageinPDF -1))
          }}
          aria-label="previous page" variant={"ghost"}>
            <ChevronDown/>
          </Button>
          <div className="flex items-center gap-1.5">
            <Input 
            {...register("page")}
            onKeyDown={(event)=>{
              if(event.key==="Enter"){
                handleSubmit(handlePageSumbit)()
              }
            }}
            className={cn('w-12 h-8',errors.page && "outline-red-500 focus-visible:ring-red-500")}/>
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numOfPagesinPDF ?? "Pages"}</span>
            </p>
          </div>

          <Button 
          disabled={numOfPagesinPDF===undefined || currentPageinPDF ===numOfPagesinPDF}
          onClick={()=>{setcurrentPageinPDF((prev) => prev + 1 > numOfPagesinPDF! ? numOfPagesinPDF! : prev + 1)
            setValue("page",String(currentPageinPDF -1))
          }}
          aria-label="previous page" variant={"ghost"}>
            <ChevronUp/>
          </Button>

        </div>

        <div >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant={"ghost"} className="gap-1.5">
                <Search />
                {scale * 100}%
                <ChevronDown className="h-3 w-3 opacity-50"/>
              </Button>
            </DropdownMenuTrigger>
            
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={()=>setScale(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={()=>setScale(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={()=>setScale(2)}>
                  200%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={()=>setScale(2.5)}>
                  250%
                </DropdownMenuItem>
              </DropdownMenuContent>
            
          </DropdownMenu>

          <Button aria-label="rotate-90-deg" variant="ghost"
          onClick={()=>setRotation((prev)=>prev + 90)}
          >
            <RotateCw className="h-4 w-4"/>
          </Button>

          <PDF_FullScreen url={url}/>
        </div>
      </div>


      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
                isLoading && renderScale ?
                <Page 
              width={width ? width :1}
              pageNumber={currentPageinPDF}
              scale={scale}
              rotate={rotation}
              key={"@" + renderScale}
              /> : null
              }
              <Page 
              className={cn(isLoading) ? 'hidden': ''}
              width={width ? width :1}
              pageNumber={currentPageinPDF}
              scale={scale}
              rotate={rotation}
              key={"@" + scale}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin"/>
                </div>
              }
              onRenderSuccess={()=>setRenderScale(scale)}
              /> 
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PDFRenderer;
