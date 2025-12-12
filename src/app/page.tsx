import Footer from "@/components/global/footer";
import HeroPage from "@/components/hero";
import Navbar from "@/components/navbar";
import { Static_THEME } from "@/const/theme";
import { getCachedHomePageData } from "@/services/page/home-page-service";
import { getCachedThemeData } from "@/services/page/theme-service";
import { generatePageMetadata } from "@/utils/metadata";
import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {

  const doc: any = await getCachedHomePageData();
  const homeData = await JSON.parse(JSON.stringify(doc));

  const { metaTitle, heading, metaDescription, subHeading, metaKeywords, ogType, metaImage, ogImage, bannerImage, ogTitle, ogDescription, canonicalUrl, robots, jsonLd, publishedDate, lastUpdatedDate } = homeData.seo

  return generatePageMetadata({
    title: metaTitle || heading || "Home | Flyttetipset.no",
    description: metaDescription || subHeading || "Welcome to Flyttetipset.no — compare and find the best real estate agents in Norway.",
    path: "/",
    keywords: metaKeywords ? metaKeywords.split(",").map((k: string) => k.trim()).filter(Boolean) : ["flyttetipset", "real estate", "agents", "compare"],
    type: ogType || "website",
    image: metaImage || ogImage || bannerImage || null,
    ogTitle: ogTitle || metaTitle || "Home | Flyttetipset.no",
    ogDescription: ogDescription || metaDescription || "Compare top real estate agents in Norway easily with Flyttetipset.no.",
    canonicalUrl: canonicalUrl,
    robots: robots || "index, follow",
    jsonLd: jsonLd || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Flyttetipset.no",
      url: API_URL,
    },
    publishedDate: publishedDate,
    lastUpdatedDate: lastUpdatedDate,
  });
}

export default async function HomePage({ children }: { children: React.ReactNode }) {

  const doc = await getCachedThemeData()
  const themeData = await JSON.parse(JSON.stringify(doc));
  const theme = themeData.theme || Static_THEME
  const logos = themeData.logos

  return (
    <div className=""
      style={{
        '--color-primary': theme.primary,
        '--color-primarylight': theme.primarylight,
        '--color-secondary': theme.secondary,
        '--color-dark': theme.dark,
        '--color-accent': theme.accent,
        '--color-background': theme.background,
        '--color-cardbg': theme.cardbg,
        '--color-navbarbg': theme.navbarbg,
        '--color-footerbg': theme.footerbg,
        '--color-formsteps': theme.formsteps,
      } as React.CSSProperties}
    >
      {
        children ? (
          <>
            <Navbar logo={logos.logo} logoText={logos.wordmark} />
            <main>
              <>
                {children}
              </>
            </main>
            <Footer logoText={logos.wordmark} />
          </>
        ) : (
          <HeroPage />
        )}
    </div >
  );
}
