import { WebsiteSettings } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedThemeData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const themeData = await WebsiteSettings.findOne();

            if (!themeData) {
                console.warn('No theme data found in database');
                return null;
            }

            return themeData;
        } catch (error) {
            console.error('theme data fetch error:', error);
            return null;
        }
    },
    ['theme-data'],
    { revalidate: 120 }
);

