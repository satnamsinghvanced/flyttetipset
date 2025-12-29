import Breadcrumbs from "@/components/global/breadcrumbs";
import { getCachedHowItWordsData } from "@/services/data/how-it-works-service";
import { getCachedPartnerData } from "@/services/page/partner-service";
import { generatePageMetadata } from "@/utils/metadata";
import NotFoundPage from "../not-found";
import PartnerContent from "./partnerContent";
export const dynamic = "force-static";

async function getPartnerData() {
  const doc: any = await getCachedPartnerData();
  return await JSON.parse(JSON.stringify(doc));
}

export async function generateMetadata() {
  const partnerData = await getPartnerData();
  if (!partnerData) {
    return generatePageMetadata({
      title: "Partner | Meglertipset.no",
      description: "Join the Meglertip network and collaborate with us",
      path: "/partner",
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
    image,
    slug,
  } = partnerData;
  return generatePageMetadata({
    title: metaTitle || heading || "Partner",
    description:
      metaDescription ||
      subHeading ||
      "Learn more about becoming a Meglertip partner",
    path: slug || "/partner",
    keywords: metaKeywords
      ? metaKeywords
        .split(",")
        ?.map((k: string) => k.trim())
        .filter(Boolean)
      : ["partner", "meglertip", "business", "collaboration"],
    type: ogType || "website",
    image: metaImage || ogImage || image || null,
    ogTitle: ogTitle || metaTitle || heading || "Partner",
    ogDescription:
      ogDescription ||
      metaDescription ||
      subHeading ||
      "Join the Meglertip network and collaborate with us",
    canonicalUrl: canonicalUrl || "/partner",
    robots: robots || "index, follow",
    jsonLd: jsonLd || {},
    publishedDate: publishedDate || "2025-11-28T00:00:00Z",
    lastUpdatedDate: lastUpdatedDate || "2025-11-28T00:00:00Z",
  });
}

const PartnerPage = async () => {
  const partnerData = await getPartnerData();
  if (!partnerData) {
    return <NotFoundPage hideNavFooter={true} />;
  }
  const data = await getCachedHowItWordsData();
  const howItWorks = await JSON.parse(JSON.stringify(data));

  return (
    <>
      <Breadcrumbs className="mt-8" showBackground={true} />
      <PartnerContent partnerData={partnerData} howItWorks={howItWorks} />
    </>
  );
};

export default PartnerPage;
