import { Homepage } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedHomepageData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const homepage = await Homepage.findOne().select('howDoesItworks howDoesItworksCards').lean();

            if (!homepage) {
                console.warn('No homepage data found in database');
                return null;
            }

            return homepage;
        } catch (error) {
            console.error('Homepage data fetch error:', error);
            return null;
        }
    },
    ['homepage-data'],
    { revalidate: 10 }
);
