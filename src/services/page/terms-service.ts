import { TermOfService } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedTermsData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const terms = await TermOfService.findOne();

            if (!terms) {
                console.warn('No terms data found in database');
                return null;
            }

            return terms;
        } catch (error) {
            console.error('terms data fetch error:', error);
            return null;
        }
    },
    ['terms-data'],
    { revalidate: 120 }
);