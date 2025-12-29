import HeroPage from "@/components/hero";
import { getCachedHomePageData } from "@/services/page/home-page-service";
import { generatePageMetadata } from "@/utils/metadata";
import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const doc: any = await getCachedHomePageData();
  if (!doc) {
    return generatePageMetadata({
      title: "Home | Meglertipset.no",
      description: "Compare and find the best real estate agents in Norway",
      path: "/",
    });
  }
  const homeData = await JSON.parse(JSON.stringify(doc));
  const {
    metaTitle,
    heading,
    metaDescription,
    subHeading,
    metaKeywords,
    ogType,
    metaImage,
    ogImage,
    bannerImage,
    ogTitle,
    ogDescription,
    canonicalUrl,
    robots,
    jsonLd,
    publishedDate,
    lastUpdatedDate,
  } = homeData.seo || {};

  return generatePageMetadata({
    title: metaTitle || heading || "Home | Meglertipset.no",
    description:
      metaDescription ||
      subHeading ||
      "Welcome to Meglertipset.no — compare and find the best real estate agents in Norway.",
    path: "/",
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
    canonicalUrl: canonicalUrl,
    robots: robots || "index, follow",
    jsonLd: jsonLd || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Meglertipset.no",
      url: API_URL,
    },
    publishedDate: publishedDate,
    lastUpdatedDate: lastUpdatedDate,
  });
}

export default async function HomePage() {
  return <HeroPage />;
}
