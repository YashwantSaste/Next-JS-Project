import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server'
import { dbConfig } from '@/config';
import { z } from "zod"
export const appRouter = router({
  authCallBack: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser(); // Await the promise returned by getUser()
    
    console.log(user);

    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Checking if the user already exists in the database or not
    const existingUser = await dbConfig.user.findFirst({
      where: {
        id: user.id
      },
    });

    //if not then

    if(!existingUser){
      //creating a new entry in the database
      await dbConfig.user.create({
        data:{
          id:user.id,
          email:user.email
        }
      })
    }

    return { success: true };
  }),
  //the getUserFiles is not a publicProcedure but a authenticated procedure
  getUserFiles: privateProcedure.query(async({ctx})=>{
     const { userId, user}=  ctx;

     return await dbConfig.file.findMany({
      where:{
        userId
      }
     })
  }),
  //delete the files
  deleteFiles : privateProcedure.input(
    z.object({id:z.string()})
  ).mutation(async({ctx,input})=>{
    const {userId} = ctx

    const file=await dbConfig.file.findFirst({
      where:{
        id:input.id,
        userId
      }
    })

    if(!file){
      throw new TRPCError({code:"NOT_FOUND"})
    }

    await dbConfig.file.delete({
      where:{
        id:input.id,
      }
    })

    return file
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
