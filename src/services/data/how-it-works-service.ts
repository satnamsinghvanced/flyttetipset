
import { Homepage } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedHowItWordsData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const howItWorks = await Homepage.findOne().select('howDoesItworksCards howDoesItworks');

            if (!howItWorks) {
                console.warn('No howItWorks data found in database');
                return null;
            }

            return howItWorks;
        } catch (error) {
            console.error('howItWorks data fetch error:', error);
            return null;
        }
    },
    ['howItWorks-data'],
    { revalidate: 10 }
);