
import Link from 'next/link';
import { FaArrowRightLong } from "react-icons/fa6";
import ChartIcon from '../icons/chart';
import { GuidesCardProps } from '@/const/types';
import Image from 'next/image';

const GuidesCard = ({ city, description, href = "#", icon }: GuidesCardProps) => {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
    return (
        <div id={href} className="block group" >
           <Link href={href}>
                <div className="bg-background p-4 rounded-xl shadow-sm hover:shadow-md h-full transition-all duration-300 border border-secondary/10 group-hover:border-primary/20 min-h-[120px] flex flex-col justify-between">
                    <div>
                        <div className=' flex justify-start items-center gap-3'>
                            {icon ?
                                <Image src={`${imageBaseUrl}${icon}`} height={50} width={50} alt={`${city}-icon`} className='h-[50px] w-[50px] bg-primary/20 rounded-sm aspect-square flex justify-center items-center' />
                                :
                                <div className='h-[50px] w-[50px] bg-primary/20 rounded-sm aspect-square flex justify-center items-center'>
                                    <ChartIcon height='24' />
                                </div>
                            }
                            <h3 className="text-[20px] md:text-2xl font-semibold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                                {city}
                            </h3>
                        </div>
                        <p className="text-secondary text-sm lg:text-base leading-6 text-start mt-4 line-clamp-4">
                            {description}
                        </p>
                    </div>
                    <div className='text-start mt-4'>
                        <FaArrowRightLong className='text-primary' />
                    </div>

                </div>
            </Link>
        </div>
    );
};

export default GuidesCard;   