import Breadcrumbs from "@/components/global/breadcrumbs";
import { ArticlePageProps } from "@/const/types";
import { getCachedArticlesPageData } from "@/services/page/article-page-service";
import { generatePageMetadata } from "@/utils/metadata";
import ArticleContent from "./articleContent";

const getArticlePageData = async () => {
  const doc = await getCachedArticlesPageData();
  return await JSON.parse(JSON.stringify(doc));
};

export async function generateMetadata() {
  const articlesPage = await getArticlePageData();
  if (!articlesPage) {
    return generatePageMetadata({
      title: "Artikler | Meglertipset.no",
      description: "Read expert Artikler about real estate in Norway",
      path: "/artikler",
    });
  }
  const {
    metaTitle,
    metaDescription,
    metaKeywords,
    metaImage,
    ogTitle,
    ogDescription,
    canonicalUrl,
    robots,
    jsonLd,
    publishedDate,
    lastUpdatedDate,
    subHeading,
    heading,
    ogImage,
    ogType,
    bannerImage,
  } = articlesPage;
  return generatePageMetadata({
    title: metaTitle || heading || "Artikler | Meglertipset.no",
    description:
      metaDescription ||
      subHeading ||
      "Welcome to Meglertipset.no — compare and find the best real estate agents in Norway.",
    path: "/artikler",
    keywords: metaKeywords
      ? metaKeywords
        .split(",")
        ?.map((k: string) => k.trim())
        .filter(Boolean)
      : ["meglertip", "real estate", "agents", "compare"],
    type: ogType || "website",
    image: metaImage || ogImage || bannerImage || null,
    ogTitle: ogTitle || metaTitle || "Home | Meglertipset.no",
    ogDescription:
      ogDescription ||
      metaDescription ||
      "Compare top real estate agents in Norway easily with Meglertipset.no.",
    canonicalUrl: canonicalUrl || "/artikler",
    robots: robots || "index, follow",
    jsonLd: jsonLd || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Meglertipset.no",
    },
    publishedDate: publishedDate,
    lastUpdatedDate: lastUpdatedDate,
  });
}

const ArticlePage = async ({ searchParams }: ArticlePageProps) => {
  const articlesPage = await getArticlePageData();
  return (
    <>
      <Breadcrumbs className="mt-8" />
      <ArticleContent
        searchParams={searchParams}
        title={articlesPage?.title}
        categoriesHeading={articlesPage?.categoriesHeading}
      />
    </>
  );
};

export default ArticlePage;
