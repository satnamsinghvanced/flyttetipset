import { County } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedCountyData = unstable_cache(
    async (limit) => {
        try {
            await connectDB();
            let countyData
            if (limit) {
                countyData = await County.find().limit(limit);

            } else {
                countyData = await County.find();
            }

            if (!countyData || countyData.length === 0) {
                console.log('No county data found in database');
                return { message: 'No county data found' };
            }

            return { data: countyData };
        } catch (error) {
            console.log('County data fetch error:', error);
            return { error: 'Error fetching county data' };
        }
    },
    ['county-data'],
    { revalidate: 10 }
);
