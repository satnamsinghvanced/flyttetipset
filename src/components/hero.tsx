/* eslint-disable @typescript-eslint/no-unused-vars */

import { FAQSectionProps, HowItWorksCardType } from "@/const/types";
import { getCachedLatestFAQs } from "@/services/page/faq-service";
import { getCachedHomePageData } from "@/services/page/home-page-service";
import { getCachedTopArticles } from "@/services/page/topArticles-service";
import Article from "./landing-page/article";
import Banner from "./landing-page/banner";
import FAQSection from "./landing-page/FaqSection";
import Guides from "./landing-page/guides";
import HowItWorks from "./landing-page/howItWorks";
import ImageWithTextWithPoints from "./landing-page/ImageWithTextWithPoints";
import LatestInsights from "./landing-page/latestInsights";

export default async function HeroPage() {
  const homeDoc: any = await getCachedHomePageData();
  const homepageRes = await JSON.parse(JSON.stringify(homeDoc));
  const {
    heroSection,
    whyChooseMeglertipCards,
    howDoesItworksCards,
    ourArticlesHeading,
    whyChooseMeglertipHeading,
    howDoesItworks,
    prosSection,
    citySectionHeading,
    articlesHeading,
    faq,
  } = homepageRes;

  // Sort citySectionHeading.locations by order (rank)
  const sortedLocations = citySectionHeading?.locations
    ? [...citySectionHeading.locations].sort((a, b) => a.order - b.order)
    : [];

  // Replace locations with sortedLocations
  const citySectionWithSortedLocations = {
    ...citySectionHeading,
    locations: sortedLocations,
  };
  // console.log(
  //   JSON.stringify(citySectionWithSortedLocations.locations, null, 2)
  // );
  const cards: HowItWorksCardType[] = Array.isArray(howDoesItworksCards)
    ? howDoesItworksCards?.map((item: any) => ({
      title: item?.title,
      description: item.description,
      icon: item.icon,
    }))
    : [];

  const doc = await getCachedLatestFAQs();
  const latestFAQs = await JSON.parse(JSON.stringify(doc));
  const faqSectionProps: FAQSectionProps = {
    title: "Svaret på spørsmålene dine",
    faqs: latestFAQs,
    backgroundColor: "bg-background",
    titleColor: "text-primary",
    questionBgColor: "bg-accent",
    answerBgColor: "bg-primarylight",
    questionTextColor: "text-primary",
    answerTextColor: "text-dark/70",
    chevronColor: "text-primary",
  };

  const topArticlesDoc = await getCachedTopArticles();
  const topArticles = await JSON.parse(JSON.stringify(topArticlesDoc));

  return (
      <>
        <Banner BannerData={heroSection} />
        <HowItWorks
          cards={howDoesItworksCards}
          flex={true}
          title={howDoesItworks.heading}
        />
        <Article heading={ourArticlesHeading.heading || ""} />
        <HowItWorks
          cards={whyChooseMeglertipCards}
          title={whyChooseMeglertipHeading.heading}
          howItWorks={false}
        />
        <ImageWithTextWithPoints data={prosSection[0]} />
        <Guides data={citySectionWithSortedLocations} />
        {prosSection && prosSection.length > 1 && (
          <>
            {prosSection.slice(1)?.map((section: any, index: number) => (
              <ImageWithTextWithPoints key={index} data={section} />
            ))}
          </>
        )}
        <LatestInsights
          articlesHeading={articlesHeading || ""}
          data={topArticles.data}
        />
        <div className="mb-20 lg:mb-0 ">
          <FAQSection {...faqSectionProps} title={faq?.title} />
        </div>
      </>
  );
}
