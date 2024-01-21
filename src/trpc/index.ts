import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server'
import { dbConfig } from '@/config';

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
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
