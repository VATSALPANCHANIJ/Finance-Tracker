import { Button } from '@/components/ui/button';
import Link from "next/link";
import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="text-center relative">
                {/* Image Section */}
                <div className="w-full max-w-lg mx-auto">
                    <div>
                        <img
                            src="/404-error.gif"
                            alt="404 Illustration"
                        />
                    </div>
                </div>

                <div className="mt-8 absolute top-64 left-16">

                    <p className="text-gray-500 mt-5 text-center">The page you are looking for is not available!</p>
                
                    <Link href='/' ><Button className='px-6 py-3 mt-6 text-white bg-green-500 rounded-lg hover:bg-green-600'>Go Back Home</Button></Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
