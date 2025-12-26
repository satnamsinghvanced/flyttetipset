
import { ArticlePage } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedArticlesPageData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const articlesPage = await ArticlePage.findOne();

            if (!articlesPage) {
                console.warn('No articlesPage data found in database');
                return null;
            }

            return articlesPage;
        } catch (error) {
            console.error('articlesPage data fetch error:', error);
            return null;
        }
    },
    ['faq-page-data'],
    { revalidate: 120 }
);