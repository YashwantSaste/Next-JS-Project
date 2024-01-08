import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server'
export const appRouter = router({
  authCallBack:publicProcedure.query(()=>{
    const { getUser, isAuthenticated } =getKindeServerSession();
        const user= getUser();

        if(!isAuthenticated){
            throw new TRPCError({code:'UNAUTHORIZED'});
        }

        //checking the user already present in the database or not

        return {success:true}
  })

});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;