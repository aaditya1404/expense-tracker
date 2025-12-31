import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav className='w-full h-18 flex items-center justify-between px-10 lg:px-30'>
            <h1>Welcome</h1>
            <div className='flex items-center justify-center gap-4 lg:gap-12'>
                <Link href={"/"}>Home</Link>
                <Link href={"/yourexpenses"}>Your Expenses</Link>
            </div>
        </nav>
    )
}

export default Navbar;
