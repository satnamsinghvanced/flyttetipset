import { Metadata } from "next";
import { headers } from "next/headers";

interface MetadataOptions {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    type?: "website" | "article";
    robots?: any;
    jsonLd?: any;
    locales?: {
        en?: string;
        no?: string;
    };
}


export async function generatePageMetadata({
    title,
    description,
    path = "/",
    keywords = [],
    type = "website",
    locales,
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
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const cleanBase = siteUrl.replace("www.", "");
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || path;

    const getImageUrl = (imgPath: string): string => {
        if (!imgPath) return `${cleanBase}/images/og-default.jpg`;

        if (imgPath.startsWith('http')) {
            return imgPath;
        }

        return `${cleanBase}/${imgPath.replace(/^\//, '')}`;
    };

    const ogImageUrl = image ? getImageUrl(image) : `${cleanBase}/images/og-default.jpg`;
    const pageTitle = title ? (title == 'Flyttetipset.no' ? `Flyttetipset.no` : `${title} |  Flyttetipset.no`) : ' Flyttetipset.no';
    const ogFinalTitle = ogTitle ? `${ogTitle} | Flyttetipset.no` : pageTitle;
    const ogFinalDescription = ogDescription || description;

    const openGraphImages = [
        {
            url: ogImageUrl,
            width: imageWidth,
            height: imageHeight,
            alt: ogFinalTitle,
        }
    ];

    const twitterImages = [ogImageUrl];

    // Handle robots meta
    const robotsMeta = robots ? {
        index: !robots.noindex,
        follow: !robots.nofollow,
        noarchive: robots.noarchive,
        nosnippet: robots.nosnippet,
        noimageindex: robots.noimageindex,
        notranslate: robots.notranslate,
    } : {
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

    return {
        title: pageTitle,
        description,
        keywords,
        alternates: {
            canonical: `${siteUrl}${canonicalUrl ? canonicalUrl : ''}` || `${cleanBase}${pathname}`,
            languages:
                locales ?? {
                    en: `${cleanBase}/en${canonicalUrl}`,
                    no: `${cleanBase}/no${canonicalUrl}`,
                },
        },
        openGraph: {
            title: ogFinalTitle,
            description: ogFinalDescription,
            url: canonicalUrl || `${cleanBase}${pathname}`,
            siteName: "Flyttetipset.no",
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