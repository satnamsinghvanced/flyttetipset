import { Article } from "@/lib/models/models";
import { connectDB } from "@/lib/mongoose";
import { unstable_cache } from "next/cache";

export const getCachedArticlesByTags = unstable_cache(
    async (tags, slug) => {
        try {
            await connectDB();
            console.log("tags at server action: ", tags); // e.g., ['home', 'faster']

            const articlesByTags = await Article.find({
                articleTags: { $in: tags },
            })
                .select("title image showDate slug categoryId articlePosition")
                .sort({ createdAt: -1 })
                .limit(4)
                .populate({
                    path: "categoryId",
                    select: "slug",
                    model: "ArticleCategory",
                })
                .lean();

            const filteredArticles = articlesByTags.filter(article => article.slug !== slug);

            // console.log("filteredArticles: ", filteredArticles)

            if (filteredArticles.length < 4) {
                const remainingCount = 4 - filteredArticles.length;

                const topRankedArticles = await Article.find({
                    articleTags: { $nin: tags },
                })
                    .select("title image showDate slug categoryId articlePosition")
                    .sort({ articlePosition: 1 })
                    .limit(remainingCount)
                    .populate({
                        path: "categoryId",
                        select: "slug",
                        model: "ArticleCategory",
                    })
                    .lean();
                filteredArticles.push(...topRankedArticles);
            }
            // console.log("filteredArticles: ", filteredArticles)

            return {
                success: true,
                count: filteredArticles.length,
                data: filteredArticles,
            };
        } catch (error) {
            console.error("Top articles fetch error:", error);
            return null;
        }
    },
    ["articles-by-tags"],
    { revalidate: 10 }
);
