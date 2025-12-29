import Breadcrumbs from "@/components/global/breadcrumbs";
import { getCachedSiteMapData } from "@/services/page/sitemap-service";
import { generatePageMetadata } from "@/utils/metadata";
import NotFoundPage from "../not-found";
import SiteMapContent from "./content";
export const dynamic = "force-static";

async function getSiteMapData() {
  const doc: any = await getCachedSiteMapData();
  return await JSON.parse(JSON.stringify(doc));
}

export async function generateMetadata() {
  const sitemapData = await getSiteMapData();
  if (!sitemapData) {
    return generatePageMetadata({
      title: "Sitemap | Meglertipset.no",
      description: "Overview of all pages on Meglertipset.no",
      path: "/sitemap",
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
  } = sitemapData;

  return generatePageMetadata({
    title: metaTitle || "Sitemap | Meglertipset.no",
    description: metaDescription || "Overview of all pages on Meglertipset.no",
    path: "/sitemap",
    keywords: metaKeywords
      ? metaKeywords
        .split(",")
        ?.map((k: string) => k.trim())
        .filter(Boolean)
      : ["sitemap", "meglertip", "website overview", "site structure", "pages"],
    type: "website",
    image: metaImage || null,
    ogTitle: ogTitle || metaTitle || "Sitemap | Meglertipset.no",
    ogDescription:
      ogDescription ||
      metaDescription ||
      "Explore all the pages on Meglertipset.no",
    canonicalUrl: canonicalUrl || "/sitemap",
    robots: robots || "index, follow",
    jsonLd: jsonLd || {},
    publishedDate: publishedDate || "2025-11-28T00:00:00Z",
    lastUpdatedDate: lastUpdatedDate || "2025-11-28T00:00:00Z",
  });
}

const SiteMapPage = async () => {
  const sitemapData = await getSiteMapData();

  if (!sitemapData) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Breadcrumbs className="mt-8" />
      <div className="max-w-7xl mx-auto py-10 pt-5 w-full flex gap-8 flex-row max-md:flex-col px-4 md:px-6 lg:px-8">
        <SiteMapContent sitemapData={sitemapData} />
      </div>
    </>
  );
};

export default SiteMapPage;
