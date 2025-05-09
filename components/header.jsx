import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { LayoutDashboard, PenBox } from 'lucide-react';
import { checkUser } from '@/lib/CheckUser';
<style>
@import url('https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300..700&display=swap');
</style>
const Header = async () => {
    await checkUser();

    return (
        
        <div className='fixed top-0  w-full bg-white/80 backdrop-blur-md z-50 border-b'>
            <nav className='container mx-auto px-3 flex items-center justify-between'>
                <Link href="/">
                    <Image src={"/Favicon.png"} alt="Logo" height={100} width={200}
                        className="h-14 w-auto object-contain"
                    ></Image>
                </Link>
                <div className='flex  items-center space-x-4'>
                    <SignedIn>
                        <Link href={"/dashboard"}>
                            <Button variant="outline">
                                <LayoutDashboard size={24} className="text-gray-600 hover:text-blue-400  flex items-center gap-2" />
                                <span className="hidden md:inline">Dashboard</span>
                            </Button>
                        </Link>
                        <Link href={"/transaction/create"} >
                            <Button className="flex items-center gap-2">
                                <PenBox size={24} />
                                <span className="hidden md:inline">Add Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/dashboard">
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10",
                            }
                        }} />
                    </SignedIn>
                </div>

            </nav>

        </div>
    )
}

export default Header;
