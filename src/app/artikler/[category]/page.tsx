import Breadcrumbs from "@/components/global/breadcrumbs";
import Heading from "@/components/global/heading";
import { ArticleCategoryPageProps } from "@/const/types";
import {
  getCachedArticleCategories,
  getCachedArticlesByCategory,
} from "@/services/page/article-service";
import { capitalizeTitle } from "@/utils/capitalizeTitle";
import { generatePageMetadata } from "@/utils/metadata";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticlesList from "./articlesList";

export async function generateMetadata({
  params,
  searchParams,
}: ArticleCategoryPageProps): Promise<Metadata> {
  const param = await params;
  const { category } = await param;
  const paramsObj = await searchParams;
  const page = parseInt(paramsObj?.page as string) || 1;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || `/artikler/${category}`;
  const articlesData = await getCachedArticlesByCategory({
    categorySlug: category,
    page: 1,
    limit: 1,
  });

  if (!articlesData?.data) {
    return generatePageMetadata({
      title: `${category} Artikler | Meglertipset.no`,
      description: `Read expert articles about ${category} on Meglertipset.no.`,
      path: `/artikler/${category}`,
    });
  }

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
  } = articlesData.data ?? {};

  const finalCanonical = canonicalUrl
    ? canonicalUrl.startsWith("/") || canonicalUrl.startsWith("http")
      ? canonicalUrl
      : `/artikler/${canonicalUrl}`
    : page > 1
      ? `${pathname}?page=${page}`
      : pathname;

  return generatePageMetadata({
    title: metaTitle || `${category} Artikler | Meglertipset.no`,
    description:
      metaDescription ||
      `Read expert Artikler om ${category} on Meglertipset.no.`,
    path: pathname,
    keywords: metaKeywords
      ? metaKeywords
        .split(",")
        ?.map((k: string) => k.trim())
        .filter(Boolean)
      : ["meglertip", category, "real estate", "artikler"],
    type: ogType || "website",
    image: ogImage || null,
    ogTitle: ogTitle || metaTitle || `${category} Artikler | Meglertipset.no`,
    ogDescription:
      ogDescription ||
      metaDescription ||
      `Explore helpful ${category} artikler from Meglertipset.no.`,
    canonicalUrl: finalCanonical,
    robots: robots || "index, follow",
    jsonLd: jsonLd || {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category} Artikler`,
    },
    publishedDate,
    lastUpdatedDate,
  });
}

const ArticleCategoryPage = async ({
  params,
  searchParams,
}: ArticleCategoryPageProps) => {
  const param = await params;
  const category = param?.category ?? "";
  const categorySlug = category; // <--- add this
  const heading = capitalizeTitle(category);
  const paramsObj = await searchParams;
  const page = parseInt(paramsObj?.page as string) || 1;
  const articlesPerPage = 8;
  const articlesData = await getCachedArticlesByCategory({
    categorySlug: category,
    page,
    limit: articlesPerPage,
  });
  if (!articlesData?.data) {
    notFound();
  }

  const categoriesData = await getCachedArticleCategories();
  const tabs = (categoriesData as any).data || [];
  const activeTab = tabs?.find((tab: any) => tab?.slug === categorySlug);
  const categoriesHeading = activeTab?.description ?? "ALL KATEGORIER";

  return (
    <>
      <Breadcrumbs className="mt-8" />
      <div className="max-w-7xl m-auto py-10 px-8">
        <Heading heading={heading} className="mb-12 mt-0" />
        <p className="text-[16px] mb-4 font-medium text-primary">
          {categoriesHeading}
        </p>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}

          <div className="flex flex-row flex-wrap gap-2 md:gap-4 lg:flex-col min-w-[340px] lg:!w-[340px] ">
            {tabs?.map((tab: any) => (
              <Link
                key={tab?.slug}
                href={`/artikler/${tab?.slug}`}
                className={`border border-dark/50 rounded-lg h-[46px] lg:h-16 px-4 flex items-center text-start justify-start min-w-fit lg:w-full transition-all duration-300 ${categorySlug === tab?.slug
                  ? "bg-primary/10 text-dark font-semibold"
                  : "bg-transparent text-dark hover:bg-gray-100"
                  }`}
              >
                <span className="text-[14px] lg:text-xl font-semibold">
                  {tab?.title}
                </span>
              </Link>
            ))}
          </div>

          {/* Main content */}
          {/* <div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[792px] mx-auto"
            role="list"
            aria-label={`${categoriesHeading ? `Article about ${categoriesHeading}` : 'Articles'}`}
          > */}

          <div className=" max-w-[792px] mx-auto w-full">
            <ArticlesList
              initialData={articlesData}
              category={category}
              currentPage={page}
              articlesPerPage={articlesPerPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleCategoryPage;
