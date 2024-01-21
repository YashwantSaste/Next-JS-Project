"use client"

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'; 
import React from 'react';
import { trpc } from '../_trpc/client';
import { Loader2 } from 'lucide-react';

const page =  () => {
    const router = useRouter(); 
    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');

    trpc.authCallBack.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) {
                // Syncing the user to the database
                router.push(origin ? `/${origin}` : '/dashboard');
            }
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                router.push("/sign-in");
            }
        },
        retry: true,
        retryDelay: 500,
    });

    return (
        <div className='w-full mt-24 flex justify-center'>
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className='h-8 w-8 animate-spin text-zinc-800' /> {/* Fix the typo in class name */}
                <h3 className='font-semibold text-xl'>
                    Welcome Aboard: Sign Up and Discover the Difference!
                </h3>
                <p>
                    You will be redirected automatically
                </p>
            </div>
        </div>
    );
};

export default page;
