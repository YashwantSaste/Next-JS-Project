import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router'
import React from 'react'
import { trpc } from '../_trpc/client';

const page = async () => {
    const router=useRouter();
    const searchParams=useSearchParams();
    const origin=searchParams.get('origin');

    const { data, isLoading }= trpc.authCallBack.useQuery(undefined,{
      onSuccess: ({success})=>{
        if(success){
          //syncing the user to the database
          router.push(origin ? `/${origin}` : '/dashboard')
        }
      }
    })
  return (
    <div>page</div>
  )
}

export default page