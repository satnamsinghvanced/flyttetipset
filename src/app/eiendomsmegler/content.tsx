import Heading from "@/components/global/heading";
import RegionSelectorContener from "@/components/global/regionSelectorContener";
import FAQSection from "@/components/landing-page/FaqSection";
import GetQuotes from "@/components/quotes/getQuotes";
import { FAQSectionProps } from "@/const/types";
import { getCachedLatestFAQs } from "@/services/page/faq-service";
import CompanyContent from "../../components/company/companyContent";

const EiendomsmeglerContent = async ({ searchParams, cp, county, realestateAgents }: any) => {
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

  return (
    <>
      <div className="flex justify-center relative  ">
        <div className="flex max-w-7xl py-10 gap-5 flex-row max-md:flex-col px-4 md:px-6 lg:px-8">
          <div className="w-full">
            <div className="w-full flex gap-8 bg">
              <div className="w-full">
                <Heading
                  className="!text-[64px] max-md:!text-[36px] font-bold text-primary leading-10 lg:leading-18 pr-3"
                  heading={` ${realestateAgents.title}`}
                ></Heading>
                <div
                  dangerouslySetInnerHTML={{
                    __html: realestateAgents?.description || "",
                  }}
                  className="real-estate-content"
                ></div>
                <CompanyContent searchParams={searchParams} cp={cp} />
                <div
                  dangerouslySetInnerHTML={{
                    __html: realestateAgents?.descriptionBottom || "",
                  }}
                  className="real-estate-content"
                ></div>
              </div>
            </div>
            <div className="relative">
              <div className="max-w-7xl m-auto py-10  flex gap-8">
                <div className="w-full z-1" >
                  <RegionSelectorContener county={county} />
                </div>
              </div>
            </div>
            <div className="max-w-7xl m-auto py-10 w-full flex gap-8">
              <div className=" w-full">
                <FAQSection {...faqSectionProps} className="w-full" />
              </div>
            </div>
          </div>
          <div className="w-1/2 max-w-[346px] h-fit sticky top-24 max-md:w-full max-md:static mt-2">
            <GetQuotes />
          </div>
        </div>
      </div>
    </>
  );
};

export default EiendomsmeglerContent;
