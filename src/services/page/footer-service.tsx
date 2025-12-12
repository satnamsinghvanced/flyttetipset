import { Footer } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedFooterData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const footerPage: any = await Footer.findOne();

            if (!footerPage) {
                console.warn('No footer data found in database');
                return null;
            }

            if (footerPage.steps && Array.isArray(footerPage.steps)) {
                footerPage.steps = footerPage.steps.filter(
                    (step: any) => step.visible !== false
                );
            }

            return footerPage;
        } catch (error) {
            console.error('footer data fetch error:', error);
            return null;
        }
    },
    ['footer-data'],
    { revalidate: 10 }
);