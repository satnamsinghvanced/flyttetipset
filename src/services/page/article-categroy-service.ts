import { ArticleCategory } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedTopArticleCategory = unstable_cache(
    async () => {
        try {
            await connectDB();

            const articleCategory = await ArticleCategory.aggregate([
                {
                    $lookup: {
                        from: 'articles',
                        localField: '_id',
                        foreignField: 'categoryId',
                        as: 'articles'
                    }
                },
                {
                    $match: {
                        'articles.0': { $exists: true }
                    }
                },
                {
                    $sort: { categoryPosition: 1 }
                },
                {
                    $limit: 6
                }
            ]);

            if (!articleCategory || articleCategory.length === 0) {
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