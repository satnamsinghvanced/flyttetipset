import { Article, ArticleCategory } from "@/lib/models/models";
import { connectDB } from "@/lib/mongoose";
import { Types } from "mongoose";

export const getCachedArticleBySlug= async (
  categorySlug: string,
  slugValue: string
) => {
  try {
    await connectDB();
    const category = await ArticleCategory.findOne({ slug: categorySlug })
      .select("_id")
      .lean<{ _id: Types.ObjectId }>();

    if (!category) {
      return null;
    }

    const article = await Article.findOne({
      slug:slugValue,
      categoryId: category._id,
    })
      .populate({
        path: "categoryId",
        select: "slug title",
      })
      .lean();

    return article ?? null;
  } catch (error) {
    console.error("Article fetch error:", error);
    return null;
  }
};
