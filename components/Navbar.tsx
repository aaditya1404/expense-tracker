import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav className='w-full h-18 flex items-center justify-center'>
            <h1>Welcome</h1>
            <Link href={"/"}>Home</Link>
            <Link href={"/yourexpenses"}>Your Expenses</Link>
        </nav>
    )
}

export default Navbar
