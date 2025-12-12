import { Article } from "@/lib/models/models";
import { connectDB } from "@/lib/mongoose";
import { unstable_cache } from "next/cache";

export const getCachedTopArticles = unstable_cache(
    async () => {
        try {
            await connectDB();

            const articles = await Article.find({ articlePosition: { $gt: 0 } })
                .select("title image showDate slug categoryId articlePosition")
                .sort({ articlePosition: 1 })
                .populate({
                    path: "categoryId",
                    select: "slug",
                    model: "ArticleCategory",
                })
                .lean();

            return {
                success: true,
                count: articles.length,
                data: articles,
            };
        } catch (error) {
            console.error("Top articles fetch error:", error);
            return null;
        }
    },
    ["top-articles"],
    { revalidate: 10 }
);
