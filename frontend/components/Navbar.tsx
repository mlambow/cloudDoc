'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import {Cloud, Moon, Sun} from "lucide-react";

const links = [
    {label: "Dashboard", href: "/", id: "dashboard"},
    {label: "Upload", href: "/upload", id: "upload"},
    {label: "All Documents", href: "/documents", id: "documents"},
]

export default function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <header className='border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-50'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
                <Link href='/' className='flex items-center gap-2.5'>
                    <div className='flex items-center justify-center h-9 w-9 rounded-lg bg-slate-800 text-white shadow-sm dark:bg-slate-700'>
                        <Cloud className='h-5 w-5'/>
                    </div>
                    <span className='text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50'>
                        CloudDoc <span className='font-normal text-slate-500 dark:text-slate-400'>Insights</span>
                    </span>
                </Link>

                <div className='flex items-center gap-5'>
                    <nav className='flex items-center gap-6'>
                        {links.map(({label, href, id}) => (
                            <Link
                                href={href}
                                key={id}
                                className={`text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <div className='hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-950'>
                        <span className='relative flex h-2 w-2'>
                            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
                            <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500'></span>
                        </span>
                        <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                            Azure Connected
                        </span>
                    </div>

                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className='rounded-lg border border-slate-200 p-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors'
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? <Sun className='h-5 w-5'/> : <Moon className='h-5 w-5'/>}
                    </button>
                </div>
            </div>
        </header>
    )
}