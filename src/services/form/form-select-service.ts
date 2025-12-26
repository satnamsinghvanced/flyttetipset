import { FormSelect } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedFormSelect = unstable_cache(
    async () => {
        try {
            await connectDB();

            const formSelect: any = await FormSelect.find();

            if (!formSelect) {
                console.warn('No form data found in database');
                return null;
            }

            return formSelect;
        } catch (error) {
            console.error('form data fetch error:', error);
            return null;
        }
    },
    ['partner-data'],
    { revalidate: 120 }
);