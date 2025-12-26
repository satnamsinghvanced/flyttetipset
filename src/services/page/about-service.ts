import { About } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedAboutData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const about = await About.findOne();

            if (!about) {
                console.warn('No about data found in database');
                return null;
            }

            return about;
        } catch (error) {
            console.error('About data fetch error:', error);
            return null;
        }
    },
    ['about-data'],
    { revalidate: 120 }
);