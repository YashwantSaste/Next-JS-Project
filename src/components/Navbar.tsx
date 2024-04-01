    import React from 'react'
    import MaxWidthWrapper from './MaxWidthWrapper'
    import Link from 'next/link'
    import { buttonVariants } from './ui/button'
    import { LoginLink, RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
    import { ArrowRight } from 'lucide-react'
    import UserLoginNav from './UserLogInNav'

    const Navbar = async() => {
        const { getUser } = getKindeServerSession()
        const user = await getUser()
        console.log(user)
    return (
        <div className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                    <Link href='/' className='flex z-40 font-semibold'>
                        <span>QnAPDF</span>
                    </Link>

                    {/* Mobile Navigation Bar */}

                    <div className='hidden items-center space-x-4 sm:flex'>
                        {
                            !user ? (
                                <>
                            <Link href='/dashboard'
                            className={buttonVariants({
                                variant:'ghost',
                                size:'sm',
                            })}
                            >
                            Dashboard
                            </Link>
                            <LoginLink
                            className={buttonVariants({
                                variant:'ghost',
                                size:'sm'
                            })}
                            >
                                Sign In
                            </LoginLink>
                            <RegisterLink
                            className={buttonVariants({
                                size:'sm',
                                className:"hover:scale-105 transition-all duration-300"
                            })}
                            >
                                Get Started
                                <ArrowRight className='w-5 h-5 ml-1.5'/>
                            </RegisterLink>
                        </>
                            ) : (
                                <>
                            <Link href='/pricing'
                            className={buttonVariants({
                                variant:'ghost',
                                size:'sm',
                            })}
                            >
                            Pricing
                            </Link>
                            <UserLoginNav name={
                        !user.given_name || !user.family_name
                        ? 'Your Account'
                        : `${user.given_name} ${user.family_name}`
                    }
                    email={user.email ?? ''}
                    imageUrl={user.picture ?? ''}/>
                        </>
                            )
                        }
                        
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    )
    }

    export default Navbar