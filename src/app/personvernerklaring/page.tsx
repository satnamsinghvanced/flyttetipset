import Breadcrumbs from "@/components/global/breadcrumbs";
import GetQuotes from "@/components/quotes/getQuotes";
import { getCachedPrivacyData } from "@/services/page/privacy-service";
import { formatDate } from "@/utils/formatDate";
import { generatePageMetadata } from "@/utils/metadata";
import NotFoundPage from "../not-found";
export const dynamic = "force-static";

const getPageData = async () => {
  const data = await getCachedPrivacyData();
  return JSON.parse(JSON.stringify(data));
};

export async function generateMetadata() {
  const privacyPolicyData = await getPageData();
  if (!privacyPolicyData) {
    return generatePageMetadata({
      title: "Privacy Policy | Meglertipset.no",
      description: "Meglertipset.no privacy policy page",
      path: "/personvernerklaring",
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
  } = privacyPolicyData;

  return generatePageMetadata({
    title: metaTitle || title || "Privacy Policy | Meglertipset.no",
    description: metaDescription || "Meglertipset.no privacy policy page",
    path: "/personvernerklaring",
    keywords: metaKeywords
      ? metaKeywords
        .split(",")
        ?.map((k: string) => k.trim())
        .filter(Boolean)
      : [
        "privacy policy",
        "meglertip",
        "terms and conditions",
        "data privacy",
        "user data",
      ],
    type: "website",
    image: metaImage || null,
    ogTitle: ogTitle || metaTitle || title || "Privacy Policy | Meglertipset.no",
    ogDescription:
      ogDescription ||
      metaDescription ||
      "Learn how Meglertipset.no protects your privacy and handles your personal information.",
    canonicalUrl: canonicalUrl || "/personvernerklaring",
    robots: robots || "index, follow",
    jsonLd: jsonLd || {},
    publishedDate: publishedDate || "2025-11-28T00:00:00Z",
    lastUpdatedDate: lastUpdatedDate || "2025-11-28T00:00:00Z",
  });
}

const PrivacyPolicyPage = async () => {
  const privacyPolicyData = await getPageData();

  if (!privacyPolicyData) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 pt-5 w-full flex gap-8 flex-row max-md:flex-col px-4 md:px-6 lg:px-8">
        <div className="w-full">
          <Breadcrumbs className="!mt-8 !m-0 !p-0" />
          <div className="mt-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 leading-tight">
              {privacyPolicyData?.title}
            </h1>
            <p className="text-secondary text-base mb-8">
              Siste oppdatering: {" "}
              {formatDate(
                privacyPolicyData.updatedAt || privacyPolicyData.createdAt
              )}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: privacyPolicyData.description,
              }}
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

export default PrivacyPolicyPage;
