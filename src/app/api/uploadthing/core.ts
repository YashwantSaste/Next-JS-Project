import { dbConfig } from "@/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
const f = createUploadthing();

export const ourFileRouter: FileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) {
        throw new Error("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newCreatedFile = await dbConfig.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response =await fetch(`https://utfs.io/f/${file.key}`)
        const blob=await response.blob()
        const loader=new PDFLoader(blob);
        const pageLevelDocs= await loader.load();
        const pageList=pageLevelDocs.length

        //vectorize and indexing the document

        const pineconeIndex=pinecone.Index("qnapdf");

        const embeddings=new OpenAIEmbeddings({
          openAIApiKey:process.env.OPENAI_API_KEY,
        })

        await PineconeStore.fromDocuments(pageLevelDocs,embeddings,{
          //@ts-ignore
          pineconeIndex,
          namespace:newCreatedFile.id
        })

        await dbConfig.file.update({
          data:{
            uploadStatus:"SUCCESS",
          },
          where:{
            id:newCreatedFile.id
          }
        })
      } catch (error) {
        dbConfig.file.update({
          data:{
            uploadStatus:"FAILED",
          },
          where:{
            id:newCreatedFile.id
          }
        })
        console.log("Error in updating the status of the file",error)
      }
    }),

  

} as FileRouter;

export type OurFileRouter = typeof ourFileRouter;
