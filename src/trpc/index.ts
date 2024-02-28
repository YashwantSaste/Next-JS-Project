import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server'
import { dbConfig } from '@/config';
import { z } from "zod"
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { PLANS } from '@/config/stripe';
import { INFINITE_QUERY_LIMIT } from '@/config/infiniteQuery';
export const appRouter = router({
  authCallBack: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id || !user?.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check if the user is in the database
    const dbUser = await dbConfig.user.findFirst({
      where: {
        id: user.id,
      },
    })

    if (!dbUser) {
      // create user in db
      await dbConfig.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      })
    }

    return { success: true }
  }),
  //the getUserFiles is not a publicProcedure but a authenticated procedure
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    try {
        const { userId, user } = ctx;

        if (!userId) {
            throw new Error("userId is undefined");
        }

        const files = await dbConfig.file.findMany({
            where: {
                userId
            }
        });

        return files;
    } catch (error) {
        console.error("Error in getUserFiles:", error);
        throw new Error("Failed to retrieve user files");
    }
}),

  //the polling approach of constantly getting the file

  getFile : privateProcedure.input(z.object({key: z.string()})).mutation(async({ctx,input})=>{
    const {userId}=ctx;

    const file= await dbConfig.file.findFirst({
      where:{
        key:input.key,
        userId,
      },
    })

    if(!file){
      throw new TRPCError({code:"NOT_FOUND"})
    }

    return file
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
  getFileMessages : privateProcedure.input(
    z.object({
      limit:z.number().min(1).max(100).nullish(),
      cursor:z.string().nullish(),
      fileId:z.string()
    })
  ).query(async({ctx,input})=>{
    const { userId } = ctx;
    const { fileId, cursor } = input;
    const limit= input?.limit ?? INFINITE_QUERY_LIMIT;

    const file= await dbConfig.file.findFirst({
      where:{
        id:fileId,
        userId
      }
    })

    if(!file){
      throw new TRPCError({code:"NOT_FOUND"});
    }

    const messages = await dbConfig.message.findMany({
      take: limit + 1,
      where:{
        fileId
      },
      orderBy:{
        createdAt:"desc"
      },
      cursor: cursor ? { id : cursor} : undefined,
      select:{
        id:true,
        isUserMessage:true,
        createdAt:true,
        text:true
      }
    })

    let newCursor : typeof cursor | undefined = undefined

    if(messages.length > limit ){
      const nextItem = messages.pop();
      newCursor = nextItem?.id;
    }

    return{
       messages,
       newCursor
    }
  }),

  getFileUploadStatus: privateProcedure.input(z.object({fileId:z.string()}))
  .query(async({input,ctx})=>{
    const file= await dbConfig.file.findFirst({
      where:{
        id:input.fileId,
        userId:ctx.userId
      }
    })

    if(!file){
      return {status:"PENDING" as const}
    }

    return { status:file.uploadStatus }
  }),

  createStripeSession: privateProcedure.mutation(
    async ({ ctx }) => {
      const { userId } = ctx

      const billingUrl = absoluteUrl('/dashboard/billing')

      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      const dbUser = await dbConfig.user.findFirst({
        where: {
          id: userId,
        },
      })

      if (!dbUser)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      const subscriptionPlan =
        await getUserSubscriptionPlan()

      if (
        subscriptionPlan.isSubscribed &&
        dbUser.stripeCustomerId
      ) {
        const stripeSession =
          await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: billingUrl,
            
          })

        return { url: stripeSession.url }
      }

      const stripeSession =
        await stripe.checkout.sessions.create({
          success_url: billingUrl,
          cancel_url: billingUrl,
          payment_method_types: ['card'],
          mode: 'subscription',
          billing_address_collection: 'auto',
          line_items: [
            {
              price: PLANS.find(
                (plan) => plan.name === 'Pro'
              )?.price.priceIds.test,
              quantity: 1,
            },
          ],
          metadata: {
            userId: userId,
          },
        })

      return { url: stripeSession.url }
    }
  ),

  
  
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
