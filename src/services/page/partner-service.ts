import { Partner } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedPartnerData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const partnerPage = await Partner.findOne().lean();

            if (!partnerPage) {
                console.warn('No partner data found in database');
                return null;
            }

            return partnerPage;
        } catch (error) {
            console.error('Partner data fetch error:', error);
            return null;
        }
    },
    ['partner-data'],
    { revalidate: 120 }
);

