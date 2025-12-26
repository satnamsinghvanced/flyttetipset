import { RealEstateAgent } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedRealEstateData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const realEstateAgentPage = await RealEstateAgent.findOne().lean();

            if (!realEstateAgentPage) {
                console.warn('No real estate agent data found in database');
                return null;
            }

            return realEstateAgentPage;
        } catch (error) {
            console.error('Real estate agent data fetch error:', error);
            return null;
        }
    },
    ['real-estate-agent-data'],
    { revalidate: 120 }
);

