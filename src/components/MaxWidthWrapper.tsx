import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
interface Props {
    className?: string,
    children: ReactNode
}
const MaxWidthWrapper = ({className,children}:Props) => {
  return (
    <div className={cn('w-full mx-auto max-w-screen-xl px-2.5 md:px-20',className)}>
        {children}
    </div>
  )
}

export default MaxWidthWrapper