import Heading from "@/components/global/heading";
import GetQuotes from "@/components/quotes/getQuotes";
import AllFaqs from "./faqs";

export default async function FaqContent({ displayCategories, title, description }: any) {
  return (
    <div className="w-full flex gap-8 max-w-7xl m-auto py-10 pt-5 flex-row max-md:flex-col px-4 md:px-6 lg:px-8">
      <div className="w-full">
        <Heading
          heading={title}
          className="md:mb-12 mb-[24px] md:mt-12 mt-[16px] lg:!text-[64px] text-[36px] font-bold  leading-10 lg:leading-18"
        />
        <p className="block md:hidden text-secondary text-sm mb-10">{description}</p>
        <AllFaqs
          faqData={displayCategories?.map((cat: any) => ({
            title: cat?.categoryName,
            faqData: cat?.faqs || [],
          }))}
        />
      </div>
      <div className="w-1/2 max-w-[346px] h-fit sticky top-24 max-md:w-full max-md:static">
        <GetQuotes />
      </div>
    </div>
  );
}