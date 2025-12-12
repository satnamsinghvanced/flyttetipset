import Breadcrumbs from "@/components/global/breadcrumbs";
import { getCachedAboutData } from "@/services/page/about-service";
import { generatePageMetadata } from "@/utils/metadata";
import NotFoundPage from "../not-found";
import HomePage from "../page";
import AboutContent from "./aboutContent";

async function getAboutData() {
  const doc: any = await getCachedAboutData();
  return await JSON.parse(JSON.stringify(doc));
}

export async function generateMetadata() {
  const aboutData = await getAboutData();
  if (!aboutData) {
    return;
  }
  const { metaTitle, metaDescription, metaKeywords, metaImage, ogTitle, ogDescription, canonicalUrl, robots, jsonLd, publishedDate, lastUpdatedDate, slug, heading, subHeading, ogImage, ogType, image } = aboutData
  return generatePageMetadata({
    title: metaTitle || heading || "About Flyttetipset.no",
    description: metaDescription || subHeading || "Learn more about Flyttetipset.no",
    path: slug || "/about",
    keywords: metaKeywords ? metaKeywords.split(',').map((k: string) => k.trim()).filter(Boolean) : ["about", "flyttetipset", "real estate"],
    type: ogType || "website",
    image: metaImage || ogImage || image || null,
    ogTitle: ogTitle || metaTitle || heading || "About Flyttetipset.no",
    ogDescription: ogDescription || metaDescription || subHeading || "Learn more about Flyttetipset.no",
    canonicalUrl: canonicalUrl || "/about",
    robots: robots || "index, follow",
    jsonLd: jsonLd || {},
    publishedDate: publishedDate || "2025-11-28T00:00:00Z",
    lastUpdatedDate: lastUpdatedDate || "2025-11-28T00:00:00Z",
  });
}

export default async function AboutPage() {
  const aboutData = await getAboutData();
  if (!aboutData) {
    return <NotFoundPage />;
  }

  return (
    <HomePage>
      <Breadcrumbs className="mt-8" />
      <AboutContent
        content={{
          image: aboutData.image,
          content: [
            { title: aboutData.heading, descriptions: aboutData.subHeading },
            { title: aboutData.heading1, descriptions: aboutData.subHeading1 },
          ],
        }}
      />
    </HomePage>
  );
}