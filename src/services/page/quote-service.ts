import { Quote } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedQuoteData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const quoteData: any = await Quote.findOne();

            if (!quoteData) {
                console.warn('No quote data found in database');
                return null;
            }

            if (quoteData.steps && Array.isArray(quoteData.steps)) {
                quoteData.steps = quoteData.steps.filter(
                    (step: any) => step.visible !== false
                );
            }

            return quoteData;
        } catch (error) {
            console.error('quote data fetch error:', error);
            return null;
        }
    },
    ['quote-data'],
    { revalidate: 10 }
);