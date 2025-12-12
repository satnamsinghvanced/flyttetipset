import { ArticlesCardProps } from "@/const/types";
import { formatDate } from "@/utils/formatDate";
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';


const ArticlesCard = ({
    image,
    date,
    title,
    href = '#'
}: ArticlesCardProps) => {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? '';

    return (
        <Link href={href} className="block h-full group" role="listitem">
            <article
                className="text-left bg-background rounded-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col cursor-pointer">
                <div className="relative w-full h-[150px] flex-shrink-0">
                    <Image
                        src={`${imageBaseUrl}${image}`}
                        alt={`${title} image`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                    />
                </div>
                <div className="p-2 flex flex-col flex-grow">
                    {date && (
                        <span className="text-secondary text-sm mb-3 block">
                            {formatDate(date)}
                        </span>
                    )}
                    <h2 className="lg:text-[18px] text-[20px] font-semibold text-primary mb-1 leading-tight line-clamp-3">
                        {title}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 font-semibold text-base text-primary">
                        <span className='text-dark'> Read More </span>  <FaArrowRightLong width="28" className='text-dark' />
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default ArticlesCard;
