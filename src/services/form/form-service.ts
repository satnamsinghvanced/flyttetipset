import { FormPage } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedFormData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const partnerPage: any = await FormPage.findOne().lean();

            if (!partnerPage) {
                console.warn('No form data found in database');
                return null;
            }

            if (partnerPage.steps && Array.isArray(partnerPage.steps)) {
                partnerPage.steps = partnerPage.steps.filter(
                    (step: any) => step.visible !== false
                );
            }

            return partnerPage;
        } catch (error) {
            console.error('form data fetch error:', error);
            return null;
        }
    },
    ['partner-data'],
    { revalidate: 10 }
);