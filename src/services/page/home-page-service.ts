
import { Homepage } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedHomePageData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const homePage = await Homepage.findOne();

            if (!homePage) {
                console.warn('No homePage data found in database');
                return null;
            }

            return homePage;
        } catch (error) {
            console.error('homePage data fetch error:', error);
            return null;
        }
    },
    ['homePage-data'],
    { revalidate: 10 }
);