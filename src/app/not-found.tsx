import Link from 'next/link'
import HomePage from './page'
import { NotFoundPageProps } from '@/const/types'

const NotFoundPage = ({ hideNavFooter = false }: NotFoundPageProps) => {

    return (
        <>
            {
                hideNavFooter ?

                    <div className="flex flex-col items-center justify-center my-36 ">
                        <p className='text-[90px] font-extrabold text-primary'>
                            404
                        </p>

                        <h2 className="text-3xl font-semibold text-dark mb-4">
                            Something&apos;s missing..
                        </h2>
                        <p className="text-secondary mb-6">
                            Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
                        </p>
                        <Link
                            href="/"
                            className=" text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-200  bg-primary text-background hover:bg-primary/90 py-2 px-8 rounded-xl mt-4"
                            aria-label="Go back to Home"
                        >
                            Go back to Home
                            <span
                                className="text-lg transition-transform duration-200 group-hover:translate-x-1"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </Link>
                    </div>
                    :
                    <HomePage>

                        <div className="flex flex-col items-center justify-center my-36 ">
                            <p className='text-[90px] font-extrabold text-primary'>
                                404
                            </p>

                            <h2 className="text-3xl font-semibold text-dark mb-4">
                                Something&apos;s missing..
                            </h2>
                            <p className="text-secondary mb-6">
                                Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
                            </p>
                            <Link
                                href="/"
                                className=" text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-200  bg-primary text-background hover:bg-primary/90 py-2 px-8 rounded-xl mt-4"
                                aria-label="Go back to Home"
                            >
                                Go back to Home
                                <span
                                    className="text-lg transition-transform duration-200 group-hover:translate-x-1"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                            </Link>
                        </div>
                    </HomePage>

            }
        </>
    )
}

export default NotFoundPage
