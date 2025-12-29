'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { FaCheck } from 'react-icons/fa'

const GetQuotesMobile = ({ quotes }: any) => {
    const [isVisible, setIsVisible] = useState(false)
    const lastScrollY = useRef(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            const isScrollingDown = currentScrollY > lastScrollY.current
            const isAtBottom = windowHeight + currentScrollY >= documentHeight - 5

            if (isScrollingDown && !isAtBottom) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }

            lastScrollY.current = currentScrollY
        }

        let ticking = false
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll()
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', throttledScroll, { passive: true })

        // Initial check
        handleScroll()

        return () => {
            window.removeEventListener('scroll', throttledScroll)
        }
    }, [])

    return (
        <div
            className="bg-cardbg text-background px-4 md:hidden flex flex-col w-full fixed bottom-0 left-0 z-50 h-[100px] justify-center"
            style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform'
            }}
        >
            <div className="flex justify-evenly gap-3 my-2 mt-0 text-sm">
                {quotes.points?.map((point: any, index: number) => (
                    <div key={index} className="flex gap-3 items-center">
                        <FaCheck className="mt-1" />
                        <p className="text-sm">{point}</p>
                    </div>
                ))}
            </div>

            <Link
                href={quotes.ctaLink || '/form'}
                className="bg-background w-full flex justify-center items-center h-12 rounded-lg active:scale-95 transition-transform duration-150"
            >
                <p className="text-base font-bold text-primary">
                    {quotes.buttonText?.trim().split(' ').slice(0, -1).join(' ') || 'Laste mer'}!
                </p>
            </Link>
        </div>
    )
}

export default GetQuotesMobile