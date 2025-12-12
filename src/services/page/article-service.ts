import { ArticleCategory, Article } from "@/lib/models/models";
import { connectDB } from "@/lib/mongoose";
import { unstable_cache } from 'next/cache';

// Cached Article Categories + FAQs (NO API)
export const getCachedArticleCategories = unstable_cache(
    async () => {
        try {
            await connectDB();

            const categories = await ArticleCategory.find()
                .sort({ categoryPosition: 1 })
                .lean();

            if (!categories || categories.length === 0) {
                console.warn("No article categories found");
                return [];
            }

            // Fetch FAQs for each category
            const data = await Promise.all(
                categories.map(async (category) => {
                    const faqs = await Article.find({
                        categoryId: category._id,
                    })
                        .select("question answer")
                        .lean();

                    return {
                        ...category,
                        faqs,
                    };
                })
            );

            // Only categories that have FAQs
            const filteredData = data.filter(
                (cat) => cat.faqs && cat.faqs.length > 0
            );

            return {
                success: true,
                count: filteredData.length,
                data: filteredData,
            };
        } catch (error) {
            console.error("Article categories fetch error:", error);
            return {
                success: false,
                message: "Failed to fetch article categories",
            };
        }
    },
    ["article-categories"],
    { revalidate: 10 } // cache for 1 minute
);







// Define the shape of the function parameters
interface GetArticlesParams {
    categoryId?: string;
    categorySlug?: string;
    page?: number;
    limit?: number;
}

// Define the return type for better type safety
interface ArticleResponse {
    success: boolean;
    message?: string;
    count?: number;
    total?: number;
    page?: number;
    totalPages?: number;
    data?: any;
    metaTitle?: string;
    heading?: string;
    metaDescription?: string;
    metaKeywords?: string;
    subHeading?: string;
    ogType?: string;
    metaImage?: string;
    ogImage?: string;
    bannerImage?: string;
    ogDescription?: string;
    canonicalUrl?: string;
    robots?: string;
    jsonLd?: string;
    publishedDate?: string;
    lastUpdatedDate?: string;
    ogTitle?: string;
}


export const getCachedArticlesByCategory = unstable_cache(
    async ({
        categoryId,
        categorySlug,
        page = 1,
        limit = 10,
    }: GetArticlesParams): Promise<ArticleResponse> => {
        try {
            await connectDB();
            let finalCategoryId: any | null;
            const skip = (page - 1) * limit;

            if (categorySlug) {
                const category: any = await ArticleCategory.findOne({ slug: categorySlug })
                    .select("_id")
                    .lean();

                if (!category) {
                    return {
                        success: false,
                        message: `Category not found for slug: ${categorySlug}`,
                    };
                }
                finalCategoryId = category?._id || '';
            } else if (categoryId) {
                // Use provided categoryId
                finalCategoryId = categoryId;
            } else {
                return {
                    success: false,
                    message: "Please provide either categorySlug or categoryId.",
                };
            }

            // 2. Fetch articles and total count
            const filter = { categoryId: finalCategoryId };

            // Get total count of documents matching the filter
            const total = await Article.countDocuments(filter);

            // Fetch the paginated articles
            const articles = await Article.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                count: articles.length,
                total,
                page,
                totalPages,
                data: articles,
            };

        } catch (error) {
            console.error("Error fetching cached articles:", error);
            return {
                success: false,
                message: "Failed to fetch articles",
            };
        }
    },
    ["articles-by-category"],
    { revalidate: 60, }

);