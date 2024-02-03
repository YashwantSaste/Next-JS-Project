"use client"

import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css'; 
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
interface PDFRenderProps {
  url: string;
}

import {useResizeDetector} from "react-resize-detector"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PDFRenderer = ({ url }: PDFRenderProps) => {
  const {toast} =useToast();

  const { width, ref }=useResizeDetector()
  //setting up the pages count of the pdf
  const [numOfPagesinPDF,setNumOfPagesinPDF]=useState<number>()
  const [currentPageinPDF,setcurrentPageinPDF]=useState<number>(1)
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Button aria-label="previous page" variant={"ghost"}>
            <ChevronDown/>
          </Button>
          <div className="flex items-center gap-1.5">
            <Input className="w-12 h-8"/>
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numOfPagesinPDF ?? "Pages"}</span>
            </p>
          </div>

          <Button aria-label="previous page" variant={"ghost"}>
            <ChevronUp/>
          </Button>

        </div>
      </div>


      <div className="flex-1 w-full max-h-screen">
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
            <Page 
            width={width ? width :1}
            pageNumber={currentPageinPDF} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFRenderer;
