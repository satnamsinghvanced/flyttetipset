import Breadcrumbs from "@/components/global/breadcrumbs";
import { getCachedCityBySlugData } from "@/services/data/getPlaceBySlug-service";
import { capitalizeTitle } from "@/utils/capitalizeTitle";
import type { Metadata } from "next";
import SlugContent from "./content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugValue = slug;

  const titleFromSlug = capitalizeTitle(slugValue);

  const doc = await getCachedCityBySlugData(slugValue);
  const raw = doc?.data;
  const placeData = Array.isArray(raw) ? raw[0] : raw;

  if (!placeData) {
    return {
      title: "Flyttebra | Flyttetipset.no",
      description: "Finn eiendomsmeglere i ditt område",
      robots: "index, follow",
      alternates: {
        canonical: `https://flyttetipset.no/flyttebra/${slugValue}`,
      },
      openGraph: {
        title: "Flyttebra | Meglertipset.no",
        description: "Finn Flyttebra i ditt område",
        url: `https://flyttetipset.no/flyttebra/${slugValue}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Flyttebra | Flyttetipset.no",
        description: "Finn Flyttebra i ditt område",
      },
    };
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
    ogImage,
    ogType,
  } = placeData || {};
  const canonical = canonicalUrl?.startsWith("http")
    ? canonicalUrl
    : `https://flyttetipset.no/flyttebra/${canonicalUrl || slugValue}`;

  return {
    title:
      placeData?.data?.title ||
      placeData?.data?.companyName ||
      placeData?.companyName ||
      placeData?.title ||
      placeData?.name ||
      metaTitle ||
      ogTitle ||
      `${titleFromSlug} | Flyttetipset.no`,
    description: metaDescription || ogDescription || "",
    keywords: metaKeywords
      ? metaKeywords.split(",").map((k: any) => k.trim())
      : undefined,
    robots: robots || "index, follow",
    alternates: { canonical },
    openGraph: {
      title: ogTitle || metaTitle || titleFromSlug,
      description: ogDescription || metaDescription || "",
      url: canonical,
      type: ogType || "website",
      images:
        ogImage || metaImage ? [{ url: (ogImage || metaImage) as string }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || metaTitle || titleFromSlug,
      description: ogDescription || metaDescription || "",
      images: ogImage || metaImage,
    },
  };
}

const SlugPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<any>;
}) => {
  const { slug } = await params;
  const slugValue = slug;

  const resolvedSearchParams = await searchParams;
  const county = resolvedSearchParams?.county || "";

  return (
    <>
      <Breadcrumbs className="mt-8" />
      <div className="max-w-7xl m-auto py-10 px-4 md:px-6 lg:px-8">
        <SlugContent
          slug={slugValue}
          county={county as string}
          searchParams={resolvedSearchParams}
        />
      </div>
    </>
  );
};

export default SlugPage;
