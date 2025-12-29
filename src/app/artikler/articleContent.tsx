import { ArticleContentProps } from "@/const/types";
import { getCachedArticleCategories, getCachedArticlesByCategory } from "@/services/page/article-service";
import Articles from "./articles";
import { notFound } from "next/navigation";

export default async function ArticleContent({ searchParams, title, categoriesHeading }: ArticleContentProps) {
    const params = await searchParams;
    const categorySlug = params?.category as string || '';
    const page = parseInt(params?.page as string) || 1;

    const categoriesDoc = await getCachedArticleCategories();
    const categories = await JSON.parse(JSON.stringify(categoriesDoc));

    const selectedCategory = categorySlug
        ? categories?.data.find((cat: any) => cat?.slug === categorySlug)
        : categories?.data[0];
    const category = categorySlug || selectedCategory?.slug

    const articleDoc = await getCachedArticlesByCategory({
        categorySlug: '',
        page: page,
        limit: 6
    });
    const articles = await JSON.parse(JSON.stringify(articleDoc));

    if (!articles?.data) {
        notFound()
    }

    return (
        <Articles
            categoriesHeading={categoriesHeading}
            heading={title}
            tabs={categories?.data}
            data={articles?.data}
            currentPage={page}
            totalPages={articles?.totalPages}
            totalArticles={articles?.total}
            selectedCategorySlug={selectedCategory?.slug || categories?.data[0]?.slug}
        />
    );
}