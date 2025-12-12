import CompanyContent from "@/components/company/companyContent";
import Heading from "@/components/global/heading";
import RegionSelectorContener from "@/components/global/regionSelectorContener";
import FAQSection from "@/components/landing-page/FaqSection";
import GetQuotes from "@/components/quotes/getQuotes";
import { FAQSectionProps, SlugContentProps } from "@/const/types";
import { getCachedCityBySlugData } from "@/services/data/getPlaceBySlug-service";
import { getCachedLatestFAQs } from "@/services/page/faq-service";
import { formatData } from "@/utils/formatData";
import Image from "next/image";
import { notFound } from 'next/navigation';

const SlugContent = async ({ slug, county, searchParams }: SlugContentProps) => {
  const latestFAQsDoc = await getCachedLatestFAQs();
  const latestFAQs = await JSON.parse(JSON.stringify(latestFAQsDoc));
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

  const doc = await getCachedCityBySlugData(slug || '')
  const placeData = await JSON.parse(JSON.stringify(doc));

  if (!placeData.data) {
    notFound();
  }

  //NOTE: dom't remove this variable, company images will be shown here from googlr drive 
  const companyImageUrl = `${placeData?.data?.companyImage}` || '/images/realEstate.webp';

  return (
    <>
      <div className="w-full flex gap-8 flex-row max-md:flex-col">
        <div className="w-full">
          {placeData?.data?.companyImage && (
            <Image
              src={"/images/realEstate.webp"}
              width={200}
              height={82}
              alt={"real estate image"}
              className="mb-6"
              loading="lazy"
            />
          )}
          <Heading
            className="!text-[64px] max-lg:!text-[36px] font-bold text-primary leading-10 lg:leading-18 pr-3"
            heading={`${(placeData?.data?.title || placeData?.data?.companyName) || ''}`}
          ></Heading>
          <div
            dangerouslySetInnerHTML={{ __html: formatData(placeData.data?.description) || "" }}
            className="eiendomsmegler-content"
          ></div>
          <div className="mb-8">
            <CompanyContent searchParams={searchParams} cp={searchParams.cp} />
          </div>
          <RegionSelectorContener county={county} />
          <FAQSection {...faqSectionProps} className="w-full" />
        </div>
        <div className="w-1/2 max-md:w-full max-w-[346px] h-fit sticky top-24 max-md:top-0 max-md:relative">
          <GetQuotes />
        </div>
      </div>
    </>
  );
};

export default SlugContent;
