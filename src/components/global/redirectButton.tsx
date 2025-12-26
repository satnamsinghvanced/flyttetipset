import { RedirectButtonProps } from '@/const/types'
import Link from 'next/link'

const RedirectButton = ({
    text = ' Se alle byer',
    redirect = '/form',
    className = 'bg-primary text-background text-[16px] ',
}: RedirectButtonProps) => {
    return (
        <Link href={redirect} className={`${className} py-4 px-8 w-full lg:w-fit font-semibold bg-primary hover:bg-primary/90 transition-all ease-in-out text-background text-[16px] rounded-lg`} >
            {text}
        </Link>
    )
}

export default RedirectButton