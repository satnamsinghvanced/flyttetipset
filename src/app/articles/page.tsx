import Breadcrumbs from "@/components/global/breadcrumbs";
import { ArticlePageProps } from "@/const/types";
import { getCachedArticlesPageData } from "@/services/page/article-page-service";
import { generatePageMetadata } from "@/utils/metadata";
import HomePage from "../page";
import ArticleContent from "./articleContent";

const getArticlePageData = async () => {
  const doc = await getCachedArticlesPageData();
  return await JSON.parse(JSON.stringify(doc));
}

export async function generateMetadata() {
  const articlesPage = await getArticlePageData()

  const { metaTitle, metaDescription, metaKeywords, metaImage, ogTitle, ogDescription, canonicalUrl, robots, jsonLd, publishedDate, lastUpdatedDate, subHeading, heading, ogImage, ogType, bannerImage } = articlesPage

  return generatePageMetadata({
    title: metaTitle || heading || "Home | Flyttetipset.no",
    description: metaDescription || subHeading || "Welcome to Flyttetipset.no — compare and find the best real estate agents in Norway.",
    path: "/",
    keywords: metaKeywords ? metaKeywords.split(",").map((k: string) => k.trim()).filter(Boolean) : ["flyttetipset", "real estate", "agents", "compare"],
    type: ogType || "website",
    image: metaImage || ogImage || bannerImage || null,
    ogTitle: ogTitle || metaTitle || "Home | Flyttetipset.noo",
    ogDescription: ogDescription || metaDescription || "Compare top real estate agents in Norway easily with Flyttetipset.no.",
    canonicalUrl: canonicalUrl,
    robots: robots || "index, follow",
    jsonLd: jsonLd || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Flyttetipset.no"
    },
    publishedDate: publishedDate,
    lastUpdatedDate: lastUpdatedDate,
  });
}

const ArticlePage = async ({ searchParams }: ArticlePageProps) => {
  const articlesPage = await getArticlePageData()
  return (
    <HomePage>
      <Breadcrumbs className="mt-8" />
      <ArticleContent searchParams={searchParams} title={articlesPage.title} categoriesHeading={articlesPage.categoriesHeading} />
    </HomePage>
  );
};

export default ArticlePage;