import { getCachedQuoteData } from '@/services/page/quote-service';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';

const GetQuotes = async () => {
    const quoteDoc = await getCachedQuoteData();
    const quotes = await JSON.parse(JSON.stringify(quoteDoc));

    return (
        <>
            <div className="bg-cardbg text-background rounded-[14px] p-4 hidden md:flex flex-col gap-3">
                <h4 className="font-semibold text-[32px] text-base/9">
                    {quotes.heading || 'Få gratis og uforpliktende salgsvurdering'}
                </h4>
                <p className="text-base font-normal text-background/90">
                    {quotes.description || 'Finn din by for å se konkret salgsguide for akkurat der du bor. Vi gir deg prisstatistikk, oversikt over meglere og generelle råd for akkurat ditt område.'}
                </p>
                <div className="flex flex-col gap-3 my-2">
                    {quotes.points && Array.isArray(quotes.points) && quotes.points?.map((point: any, index: number) => (
                        <div key={index} className="flex gap-3 items-center">
                            <FaCheck className='mt-1' />
                            <p>{point}</p>
                        </div>
                    ))}
                </div>
                <Link href={quotes.ctaLink || '/form'} className="bg-background w-full flex justify-center items-center h-12 rounded-lg" >
                    <p className='text-base font-bold text-primary'>  {quotes.buttonText || 'Laste mer'}</p>
                </Link>
            </div>
            <div className="bg-cardbg text-background px-4 md:hidden flex flex-col w-full fixed bottom-0 left-0 z-50 h-[100px] justify-center" >
                <div className="flex justify-evenly gap-3 my-2 mt-0 text-sm">
                    {quotes.points && Array.isArray(quotes.points) && quotes.points?.map((point: any, index: number) => (
                        <div key={index} className="flex gap-3 items-center">
                            <FaCheck className='mt-1 ' />
                            <p className='text-sm'>{point}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <Link href={quotes.ctaLink || '/form'} className="bg-background w-full flex justify-center items-center h-12 rounded-lg" >
                        <p className='text-base font-bold text-primary'>  {quotes.buttonText || 'Laste mer'}</p>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default GetQuotes;