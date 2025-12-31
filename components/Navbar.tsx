import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav className='sticky top-0 w-full h-18 flex items-center justify-between backdrop-blur-xs border-b border-black/10 px-10 lg:px-30'>
            <h1 className='text-purple-500 text-xl font-semibold'>Welcome😊</h1>
            <div className='flex items-center justify-center text-black/70 gap-4 lg:gap-12'>
                <Link href={"/"}>Home</Link>
                <Link href={"/yourexpenses"}>Your Expenses</Link>
            </div>
        </nav>
    )
}

export default Navbar;
