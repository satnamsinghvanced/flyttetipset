import { SlugPageProps } from "@/const/types";
import { getCachedArticleBySlug } from "@/services/page/getCachedArticleBySlug-service";
import { capitalizeTitle } from "@/utils/capitalizeTitle";
import { generatePageMetadata } from "@/utils/metadata";
import ArticleSlug from "./articleSlug";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: SlugPageProps) {
  const param = await params;
  const slug = param.articleSlug ?? "article";
  const articleCategory = param.category ?? "article";
  const title = capitalizeTitle(slug);
  const articleDoc = await getCachedArticleBySlug(slug ?? "");
  if (!articleDoc) {
    return generatePageMetadata({
      title: `${title} | Meglertipset.no`,
      description: `Read expert artikler about ${title} on Meglertipset.no.`,
      path: `/artikler/${articleCategory}/${slug}`,
    });
  }
  const article = await JSON.parse(JSON.stringify(articleDoc));
  const {
    metaTitle,
    metaDescription,
    ogType,
    metaKeywords,
    ogImage,
    ogTitle,
    ogDescription,
    canonicalUrl,
    robots,
    jsonLd,
    publishedDate,
    lastUpdatedDate,
  } = article ?? {};

  return generatePageMetadata({
    title: metaTitle || `${title} | Meglertipset.no`,
    description:
      metaDescription || `Read expert artikler about ${title} on Meglertipset.no.`,
    path: `/artikler/${articleCategory}/${slug}`,
    keywords: metaKeywords
      ? metaKeywords
        ?.split(",")
        ?.map((k: string) => k.trim())
        ?.filter(Boolean)
      : ["meglertip", "real estate", "artikler"],
    type: ogType || "website",
    image: ogImage || null,
    ogTitle: ogTitle || metaTitle || `${title} | Meglertipset.no`,
    ogDescription:
      ogDescription ||
      metaDescription ||
      `Explore helpful ${title} artikler from Meglertipset.no.`,
    canonicalUrl: canonicalUrl
      ? canonicalUrl.startsWith("/") || canonicalUrl.startsWith("http")
        ? canonicalUrl
        : `/artikler/${articleCategory}/${canonicalUrl}`
      : `/artikler/${articleCategory}/${slug}`,
    robots: robots || "index, follow",
    jsonLd: jsonLd || {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${title} Artikler`,
    },
    publishedDate,
    lastUpdatedDate,
  });
}

const ArticleSlugPage = async ({ params }: SlugPageProps) => {
  const param = await params;
  const title = await param?.articleSlug;
  if (!title) {
    notFound()
  }
  return (
    <div className="max-w-7xl m-auto py-10 px-4 md:px-6 lg:px-8">
      <ArticleSlug slugValue={title} />
    </div>
  );
};

export default ArticleSlugPage;
