
import { Category, Faq } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';


export const getCachedLatestFAQs = unstable_cache(
    async () => {
        try {
            await connectDB();

            const faqs = await Faq.find()
                .sort({ createdAt: -1 })
                .limit(6)
                .populate("categoryId", "categoryName")
                .lean();

            return faqs.map((faq: any) => ({
                id: faq?._id.toString(),
                question: faq.question,
                answer: faq.answer,
                categoryName: faq.categoryId?.categoryName || "General",
                createdAt: faq.createdAt,
            }));
        } catch (error) {
            console.error('Latest FAQs fetch error:', error);
            return [];
        }
    },
    ['latest-faqs'],
    { revalidate: 10 }
);


export const getCachedFAQs = unstable_cache(
    async () => {
        try {
            await connectDB();

            const categoriesWithFAQs = await Category.aggregate([
                {
                    $lookup: {
                        from: 'faqs', // Collection name for FAQs
                        localField: '_id',
                        foreignField: 'categoryId',
                        as: 'faqs'
                    }
                },
                {
                    $match: {
                        'faqs.0': { $exists: true } // Only categories with FAQs
                    }
                },
                {
                    $project: {
                        categoryName: 1,
                        faqs: {
                            $map: {
                                input: '$faqs',
                                as: 'faq',
                                in: {
                                    question: '$$faq.question',
                                    answer: '$$faq.answer',
                                    _id: '$$faq._id'
                                }
                            }
                        }
                    }
                },
                {
                    $sort: { categoryName: -1 } // ordering
                }
            ]);

            return categoriesWithFAQs;
        } catch (error) {
            console.error('FAQ data fetch error:', error);
            return [];
        }
    },
    ['faqs-aggregated'],
    { revalidate: 10 }
);