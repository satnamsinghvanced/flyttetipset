import { Metadata } from "next";

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  robots?: any;
  jsonLd?: any;
}

export async function generatePageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",

  image,
  imageWidth = 1200,
  imageHeight = 630,
  // New enhanced fields
  ogTitle,
  ogDescription,
  canonicalUrl,
  robots,
  jsonLd,
  publishedDate,
  lastUpdatedDate,
}: MetadataOptions & {
  image?: string | null;
  imageWidth?: number;
  imageHeight?: number;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  robots?: {
    noindex?: boolean;
    nofollow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    notranslate?: boolean;
  };
  jsonLd?: string;
  publishedDate?: string;
  lastUpdatedDate?: string;
}): Promise<Metadata> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://meglertipset.no"
  ).replace(/\/$/, "");

  // Consistently use the siteUrl for canonicals.
  // We strip www. for canonical consistency if present in siteUrl.
  const cleanBase = siteUrl.replace("www.", "");

  // Use the passed path as the definitive pathname.
  // If it's an absolute URL, try to use its pathname to avoid double-basing.
  let pathname = path;
  if (path.startsWith("http")) {
    try {
      const url = new URL(path);
      pathname = url.pathname + url.search;
    } catch (e) {
      // Fallback if not a valid URL
    }
  }

  const getImageUrl = (imgPath: string): string => {
    if (!imgPath) return `${cleanBase}/images/og-default.jpg`;

    if (imgPath.startsWith("http")) {
      return imgPath;
    }

    const cleanPath = imgPath.replace(/^\//, "");
    return `${cleanBase}/${cleanPath}`;
  };

  const ogImageUrl = image
    ? getImageUrl(image)
    : `${cleanBase}/images/og-default.jpg`;

  const pageTitle = title
    ? title === "Meglertipset.no"
      ? `Meglertipset.no`
      : `${title} | Meglertipset.no`
    : "Meglertipset.no";

  const ogFinalTitle = ogTitle ? `${ogTitle} | Meglertipset.no` : pageTitle;
  const ogFinalDescription = ogDescription || description;

  const openGraphImages = [
    {
      url: ogImageUrl,
      width: imageWidth,
      height: imageHeight,
      alt: ogFinalTitle,
    },
  ];

  const twitterImages = [ogImageUrl];

  // Handle robots meta
  const robotsMeta = robots
    ? {
      index: !robots.noindex,
      follow: !robots.nofollow,
      noarchive: robots.noarchive,
      nosnippet: robots.nosnippet,
      noimageindex: robots.noimageindex,
      notranslate: robots.notranslate,
    }
    : {
      index: true,
      follow: true,
    };

  // Handle dates for article meta
  const dates: any = {};
  if (publishedDate) {
    dates.publishedTime = new Date(publishedDate).toISOString();
  }
  if (lastUpdatedDate) {
    dates.modifiedTime = new Date(lastUpdatedDate).toISOString();
  }

  // Ensure canonical starts with /
  const cleanPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const cleanCanonicalUrl = canonicalUrl
    ? canonicalUrl.startsWith("http")
      ? canonicalUrl
      : canonicalUrl.startsWith("/")
        ? canonicalUrl
        : `/${canonicalUrl}`
    : null;

  const finalCanonical = cleanCanonicalUrl
    ? cleanCanonicalUrl.startsWith("http")
      ? cleanCanonicalUrl
      : `${cleanBase}${cleanCanonicalUrl}`
    : `${cleanBase}${cleanPathname}`;

  return {
    title: pageTitle,
    description,
    keywords,
    alternates: {
      canonical: finalCanonical,
    },
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: ogFinalTitle,
      description: ogFinalDescription,
      url: finalCanonical,
      siteName: "Meglertipset.no",
      type,
      images: openGraphImages,
      ...dates,
    },
    twitter: {
      card: "summary_large_image",
      title: ogFinalTitle,
      description: ogFinalDescription,
      images: twitterImages,
    },
    robots: robotsMeta,
    ...(publishedDate && {
      publishedTime: new Date(publishedDate).toISOString(),
    }),
    ...(lastUpdatedDate && {
      modifiedTime: new Date(lastUpdatedDate).toISOString(),
    }),
  };
}
