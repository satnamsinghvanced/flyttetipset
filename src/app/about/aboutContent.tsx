import Heading from "@/components/global/heading";
import HowItWorks from "@/components/landing-page/howItWorks";
import GetQuotes from "@/components/quotes/getQuotes";
import { AboutContentProps } from "@/const/types";
import { getCachedHowItWordsData } from "@/services/data/how-it-works-service";
import Image from "next/image";
import NotFoundPage from "../not-found";

export default async function AboutContent({ content }: AboutContentProps) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  const data = await getCachedHowItWordsData()
  const howItWorks = await JSON.parse(JSON.stringify(data));

  if (!content) {
    return <NotFoundPage hideNavFooter={true} />;
  }

  return (
    <>
      <div className="w-full flex gap-8 max-w-7xl m-auto py-10 pt-5 flex-row max-md:flex-col px-4 md:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex flex-col gap-10">
            {content.content.map((item, index) => (
              <div key={index} className="flex flex-col gap-5">
                <Heading heading={item.title} className={` text-primary leading-10 lg:leading-18  ${index === 0
                  ? "!text-[64px] max-lg:!text-[36px] !font-bold !mb-[10px]"
                  : "!text-5xl max-lg:!text-[36px] !font-semibold !mb-[2px]"
                  }  `} />
                {index === 0 && (
                  <Image
                    src={`${imageBaseUrl}${content.image}`}
                    alt="about banner"
                    className="w-full rounded-lg h-[202px] mt-0 object-cover md:hidden"
                    width={1000}
                    height={400}
                    loading="lazy"
                  />
                )}
                <p className="text-base font-normal text-secondary">{item.descriptions}</p>
                {index === 0 && (
                  <Image
                    src={`${imageBaseUrl}${content.image}`}
                    alt="about banner"
                    className="w-full rounded-lg h-[312px] mt-6 object-cover hidden md:block"
                    width={1000}
                    height={400}
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 max-w-[346px] max-md:w-full h-fit sticky top-24 max-md:top-0 max-md:relative">
          <GetQuotes />
        </div>
      </div>
      {
        howItWorks &&
        <HowItWorks cards={howItWorks.howDoesItworksCards} flex={true} title={howItWorks.howDoesItworks.heading} titleClass={`text-[36px] lg:text-[56px]`} />
      }
    </>
  );
}
