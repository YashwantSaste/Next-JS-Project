import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Link } from 'lucide-react'
import Image from 'next/image'

const Navbar = () => {
  return (
    <div className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 backdrop-blur-lg transition-all'>
        <MaxWidthWrapper>
            <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                <Link href='/' className='flex z-400 font-semibold'>
                    <span>quill.</span>
                    <Image src="" alt=''/>                
                </Link>
            </div>
        </MaxWidthWrapper>
    </div>
  )
}

export default Navbar