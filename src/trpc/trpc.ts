import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.create();
const middleware= t.middleware
const isAuth=  middleware(async (options)=>{
    const {getUser}=getKindeServerSession()
    const user= await getUser();
    //if not authenticated throw an error

    if(!user?.email || !user?.id){
        throw new TRPCError({code:"UNAUTHORIZED"});
    }

    return options.next({
        ctx:{
            userId:user.id,
            user,
        }
    })
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure= t.procedure.use(isAuth)