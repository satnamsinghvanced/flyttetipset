import { ArticleCategory } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedTopArticleCategory = unstable_cache(
    async () => {
        try {
            await connectDB();

            const articleCategory = await ArticleCategory.find().sort({ categoryPosition: 1 }).limit(3);;

            if (!articleCategory) {
                console.warn('No articleCategory data found in database');
                return null;
            }

            return articleCategory;
        } catch (error) {
            console.error('articleCategory data fetch error:', error);
            return null;
        }
    },
    ['articleCategory-data'],
    { revalidate: 120 }
);