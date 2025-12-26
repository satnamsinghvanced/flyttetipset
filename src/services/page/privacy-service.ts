import { PrivacyPolicy } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedPrivacyData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const privacyPolicy = await PrivacyPolicy.findOne();

            if (!privacyPolicy) {
                console.warn('No privacy policy data found in database');
                return null;
            }

            return privacyPolicy;
        } catch (error) {
            console.error('Privacy Policy data fetch error:', error);
            return null;
        }
    },
    ['privacy- policy-data'],
    { revalidate: 120 }
);