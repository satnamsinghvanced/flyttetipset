import { FaqPage } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedFaqPageData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const faqPage = await FaqPage.findOne();

            if (!faqPage) {
                console.warn('No faqPage data found in database');
                return null;
            }

            return faqPage;
        } catch (error) {
            console.error('faqPage data fetch error:', error);
            return null;
        }
    },
    ['faq-page-data'],
    { revalidate: 120 }
);