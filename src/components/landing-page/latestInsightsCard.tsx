import { LatestInsightsCardProps } from "@/const/types";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const LatestInsightsCard = ({
  image,
  date,
  title,
  href = "#",
  role = ""
}: LatestInsightsCardProps) => {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  return (
    <Link href={href} role={role}>
      <article className="group text-left bg-background overflow-hidden transition-all duration-300 h-full flex flex-col">
        <div className="relative w-full h-[260px] flex-shrink-0 rounded-2xl overflow-hidden">
          <Image
            src={`${imageBaseUrl}${image}`}
            alt={`${title} image`}
            fill
            className="object-cover transition-transform duration-300 ease-out rounded-2xl group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy" 
          />
        </div>

        <div className="py-4 flex flex-col flex-grow">
         <p className="text-[#16192580] mb-[10px] text-[14px]"> {date}</p>
          <h3 className="text-[20px] font-semibold text-dark/90 mb-4 leading-tight line-clamp-3">
            {title}
          </h3>
          <div className="mt-auto flex justify-start items-start">
            <div className="max-w-[130px] w-full">
              <div className={`!bg-transparent !pl-0`}>
                <p
                  className="text-base font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-200"
                  aria-label={`les mer om ${title}`}
                >
                  <span className='text-dark'> Les mer </span>
                  <span
                    className="text-lg transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <FiArrowRight className="text-dark" />{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default LatestInsightsCard;
