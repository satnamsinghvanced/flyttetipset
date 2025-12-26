import Breadcrumbs from "@/components/global/breadcrumbs";
import { getCachedRealEstateData } from "@/services/page/real-estate-service";
import { generatePageMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import EiendomsmeglerContent from "./content";
import { EiendomsmeglerPageProps } from "@/const/types";
export const dynamic = "force-static";

const getRealestateAgentsData: any = async () => {
  const doc = await getCachedRealEstateData();
  return await JSON.parse(JSON.stringify(doc));
};

export async function generateMetadata(): Promise<Metadata> {
  const realestateAgents = await getRealestateAgentsData();
  if (!realestateAgents) {
    return generatePageMetadata({
      title: "Real Estate Agents | Flyttetipset.no",
      description: "Compare and find the best real estate agents in Norway",
      path: "/eiendomsmegler",
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
  } = realestateAgents;
  return generatePageMetadata({
    title: metaTitle || heading || "Real Estate Agents | Flyttetipset.no",
    description:
      metaDescription ||
      subHeading ||
      "Welcome to Flyttetipset.no — compare and find the best real estate agents in Norway.",
    path: "/eiendomsmegler",
    keywords: metaKeywords
      ? metaKeywords
          .split(",")
          ?.map((k: string) => k.trim())
          .filter(Boolean)
      : ["flyttetipset", "real estate", "agents", "compare"],
    type: ogType || "website",
    image: metaImage || ogImage || bannerImage || null,
    ogTitle: ogTitle || metaTitle || "Real Estate Agents | Flyttetipset.no",
    ogDescription:
      ogDescription ||
      metaDescription ||
      "Compare top real estate agents in Norway easily with Flyttetipset.no.",
    canonicalUrl: canonicalUrl || "/eiendomsmegler",
    robots: robots || "index, follow",
    jsonLd: jsonLd || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Flyttetipset.no",
    },
    publishedDate: publishedDate,
    lastUpdatedDate: lastUpdatedDate,
  });
}

const EiendomsmeglerPage = async ({
  searchParams,
}: EiendomsmeglerPageProps) => {
  const params = await searchParams;
  const county = params?.county || "oslo";
  const cp = params?.cp;
  const realestateAgents = await getRealestateAgentsData();

  return (
    <>
      <Breadcrumbs className="mt-8" />
      <EiendomsmeglerContent
        county={county}
        cp={cp}
        realestateAgents={realestateAgents}
      />
    </>
  );
};

export default EiendomsmeglerPage;
