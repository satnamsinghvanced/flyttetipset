import Breadcrumbs from "@/components/global/breadcrumbs";
import GetQuotes from "@/components/quotes/getQuotes";
import { getCachedTermsData } from "@/services/page/terms-service";
import { formatDate } from "@/utils/formatDate";
import { generatePageMetadata } from "@/utils/metadata";
import NotFoundPage from "../not-found";
const getPageData = async () => {
  const data = await getCachedTermsData();
  return JSON.parse(JSON.stringify(data));
};

export async function generateMetadata() {
  const termsData = await getPageData();
  if (!termsData) {
    return generatePageMetadata({
      title: "Terms of Service | Meglertipset.no",
      description: "Meglertipset.no terms of service page",
      path: "/tjenestevilkar",
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
    title,
  } = termsData;
  return generatePageMetadata({
    title: metaTitle || title || "Terms of Service | Meglertipset.no",
    description: metaDescription || "Meglertipset.no terms of service page",
    path: "/tjenestevilkar",
    keywords: metaKeywords
      ? metaKeywords
        .split(",")
        ?.map((k: string) => k.trim())
        .filter(Boolean)
      : [
        "terms of service",
        "meglertip",
        "legal",
        "user agreement",
        "terms and conditions",
      ],
    type: "website",
    image: metaImage || null,
    ogTitle: ogTitle || metaTitle || title || "Terms of Service | Meglertipset.no",
    ogDescription:
      ogDescription ||
      metaDescription ||
      "Learn the terms of service for Meglertipset.no",
    canonicalUrl: canonicalUrl || "/tjenestevilkar",
    robots: robots || "index, follow",
    jsonLd: jsonLd || {},
    publishedDate: publishedDate || "2025-11-28T00:00:00Z",
    lastUpdatedDate: lastUpdatedDate || "2025-11-28T00:00:00Z",
  });
}

const TermsPage = async () => {
  const termsData = await getPageData();
  if (!termsData) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className="w-full flex gap-8 max-w-7xl m-auto py-10 pt-5 flex-row max-md:flex-col px-4 md:px-6 lg:px-8">
        <div className="w-full">
          <Breadcrumbs className="!mt-8  !m-0 !p-0" />
          <div className="mt-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 leading-tight">
              {termsData?.title}
            </h1>
            <p className="text-primary text-base mb-8">
              Siste oppdatering: {" "}
              {formatDate(termsData.updatedAt || termsData.createdAt)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: termsData.description }}
              className="article-content prose prose-lg max-w-none text-secondary"
            />
          </div>
        </div>
        <div className="w-full max-w-[346px] h-fit sticky top-24 max-md:w-full max-md:static mt-2">
          <GetQuotes />
        </div>
      </div>
    </>
  );
};

export default TermsPage;
