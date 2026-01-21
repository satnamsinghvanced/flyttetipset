import Breadcrumbs from "@/components/global/breadcrumbs";
import { getCachedCityBySlugData } from "@/services/data/getPlaceBySlug-service";
import { capitalizeTitle } from "@/utils/capitalizeTitle";
import { generatePageMetadata } from "@/utils/metadata";
import type { Metadata } from "next";
import SlugContent from "./content";

interface SlugPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: SlugPageProps): Promise<Metadata> {
  const param: any = await searchParams;
  const rawSlug = await params;
  const slugValue = await rawSlug.slug;
  const title = capitalizeTitle(param.slug);
  const doc = await getCachedCityBySlugData(slugValue);
  const placeData = await JSON.parse(JSON.stringify(doc));

  if (!placeData?.data) {
    return generatePageMetadata({
      title: "flyttebyra | Flyttetipset.no",
      description: "Finn flyttebyra i ditt område",
      path: `/flyttebyra/${slugValue}`,
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
    slug,
  } = placeData.data;


  // return {
  //   title: metaTitle,
  //   description: metaDescription,
  //   keywords: metaKeywords,

  //   alternates: {
  //     canonical:
  //       canonicalUrl || `https://flyttetipset.no/eiendomsmegler/${slugValue}`,
  //   },

  //   robots: robots || "index, follow",

  //   openGraph: {
  //     title: ogTitle || metaTitle,
  //     description: ogDescription || metaDescription,
  //     type: ogType || "website",
  //     images: ogImage
  //       ? [{ url: ogImage }]
  //       : metaImage
  //         ? [{ url: metaImage }]
  //         : [],
  //   },

  //   twitter: {
  //     card: "summary_large_image",
  //     title: ogTitle || metaTitle,
  //     description: ogDescription || metaDescription,
  //     images: ogImage || metaImage,
  //   },

  //   other: {
  //     published_time: publishedDate,
  //     modified_time: lastUpdatedDate,
  //     jsonLd,
  //     subHeading,
  //     heading,
  //     bannerImage,
  //     slug,
  //   },
  // };

  return generatePageMetadata({
    title: metaTitle || slug || heading || `${title} | Flyttetipset.no`,
    description:
      metaDescription ||
      subHeading ||
      "Welcome to Flyttetipset.no — compare and find the best real estate agents in Norway.",
    path: `/flyttebyra/${slugValue}`,
    keywords: metaKeywords
      ? metaKeywords
        .split(",")
        ?.map((k: string) => k.trim())
        .filter(Boolean)
      : ["flytip", "real estate", "agents", "compare"],
    type: ogType || "website",
    image: metaImage || ogImage || bannerImage || null,
    ogTitle: ogTitle || metaTitle || `${title} | Flyttetipset.no`,
    ogDescription:
      ogDescription ||
      metaDescription ||
      "Compare top real estate agents in Norway easily with Flyttetipset.no.",
    canonicalUrl: canonicalUrl
      ? canonicalUrl.startsWith("/") || canonicalUrl.startsWith("http")
        ? canonicalUrl
        : `/flyttebyra/${canonicalUrl}`
      : `/flyttebyra/${slugValue}`,
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

const SlugPage = async ({ params, searchParams }: SlugPageProps) => {
  const searchParam = await searchParams;
  const param = await params;
  const slugValue = (await param.slug) || "";
  const county = (await searchParam?.county) || "";

  return (
    <>
      <Breadcrumbs className="mt-8" />
      <div className="max-w-7xl m-auto py-10 px-4 md:px-6 lg:px-8">
        <SlugContent
          slug={slugValue}
          county={county || ""}
          searchParams={searchParam}
        />
      </div>
    </>
  );
};

export default SlugPage;
