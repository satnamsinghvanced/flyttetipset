import Heading from '@/components/global/heading';
import Image from 'next/image';

const PartnerDescriptions = ({ data }: any) => {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

    return (
        <div className="w-full bg-background">
            <div className='max-w-7xl m-auto flex gap-10  py-12 px-4 md:px-6 lg:px-8 md:flex-row flex-col-reverse'>
                <div className='w-full'>
                    <Heading heading={data.title} className='mb-6 lg:mb-16 mt-0 !text-[64px] max-lg:!text-[36px] !font-bold w-full  leading-10 lg:leading-18' />
                    <div className='w-fit'>
                        <div
                            dangerouslySetInnerHTML={{ __html: data?.description || "" }}
                            className="article-content text-secondary"
                        ></div>
                    </div>
                </div>
                <div className='w-full max-w-lg'>
                    <div className='w-full max-w-lg'>
                        <Image
                            src={`${imageBaseUrl}${data.image}`}
                            objectFit="cover" width={100} height={100}
                            alt='partner-card image'
                            className='h-full max-md:max-h-[265px] w-full rounded-2xl'
                            loading="lazy" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PartnerDescriptions
