import Image from "next/image";
import { GoCheckCircleFill } from "react-icons/go";
import RedirectButton from "../global/redirectButton";

const ImageWithTextWithPoints = ({ data }: any) => {
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL ?? '';

  return (
    <div className={`py-8 sm:py-12 lg:py-20 px-4 md:px-6 lg:px-8 ${data?.imagePosition === "right" ? "bg-background" : "bg-accent"}`}>
      <div className="mx-auto max-w-7xl">
        <div
          className={`flex ${data?.imagePosition === "right" ? " flex-col-reverse lg:flex-row" : "flex-col-reverse lg:flex-row-reverse"}  gap-8 lg:gap-x-12 xl:gap-x-24 lg:items-center`}
        >
          {/* Content Column */}
          <div
            key="content"
            className={`w-full lg:py-16 ${data?.imagePosition === "text-center" ? "text-center lg:text-left" : ""}`}
          >
            <h2 className="text-primary font-semibold leading-tight lg:text-5xl text-[36px] mb-8">
              {data?.title}
            </h2>
            {/* Render abovePointsDescription if it exists */}
            {data?.subHeading && (
              <p className="mb-6 text-lg text-secondary">{data?.subHeading}</p>
            )}
            {/* Render points if they exist */}
            {data?.description && data?.description.length > 0 && (
              <div className="space-y-3">
                {data?.description?.map((point: any) => (
                  <div key={point} className="relative flex items-start">
                    <div
                      className={`mt-1 flex-shrink-0 text-lg flex items-center justify-center text-formsteps`}
                    >
                      <GoCheckCircleFill aria-hidden="true" />
                    </div>
                    <p className="ml-3 font-medium leading-relaxed text-dark">{point}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Render belowPointsDescription if it exists */}
            {data?.belowPointsDescription && (
              <p className="mt-6 text-lg text-secondary">{data?.belowPointsDescription}</p>
            )}

            <div className="mt-10">
              <RedirectButton
                text={data?.buttonText}
                className="bg-primary text-background px-10 text-[16px] max-sm:w-full !py-[12px]"
              />
            </div>
          </div>
          {/* Image Column */}
          <div key="image" className="mt-10 lg:mt-0 relative w-full">
            <div className="relative overflow-hidden rounded-xl h-[450px] lg:h-[600px] w-full">
              <Image
                src={`${IMAGE_URL}${data?.image}`}
                alt={`${data?.title} image`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageWithTextWithPoints;
