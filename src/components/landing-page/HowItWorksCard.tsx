import { HowItWorksCardProps } from "@/const/types";
import Image from "next/image";

const HowItWorksCard = ({
  icon,
  heading,
  description,
  flex = true,
}: HowItWorksCardProps) => {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

  return (
    <div className="bg-background p-6 pt-4 lg:pt-5.5 rounded-lg shadow-md w-full space-y-4">
      <div className={`flex items-center ${flex ? "gap-4" : "flex-col gap-1"}`}>
        <Image
          src={`${imageBaseUrl}${icon}`}
          alt={`${heading} image`}
          width={40}
          height={40}
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        <h3 className="text-primary font-semibold text-[20px] lg:text-2xl md:text-2xl text-start">
          {heading}
        </h3>
      </div>
      <p className="text-secondary text-[14px] lg:text-[16px] text-start">{description}</p>
    </div>
  );
};

export default HowItWorksCard;
