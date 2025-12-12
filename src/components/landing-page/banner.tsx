import Image from "next/image";
import RedirectButton from "../global/redirectButton";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

const Banner = async ({ BannerData }: any) => {
  const backgroundUrl = `${IMAGE_URL}${
    BannerData?.backgroundImage || "uploads/bg-1.webp"
  }`;

  return (
    <div className="relative h-screen bg-cover bg-center">
      <div className="absolute inset-0">
        <Image
          src={backgroundUrl}
          alt="flyttetipset banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-black/[32%]"></div>
      <div className="relative z-8 flex flex-col justify-center items-center h-full text-center text-background px-4">
        <div className="bg-[#111E3399] py-[24px] px-[32px] rounded-[16px] flex flex-col justify-center items-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold max-w-xl leading-tight mb-4 !text-background">
            {BannerData?.title || "Gjør det enkelt å finne riktig megler!"}
          </h1>
          <p className=" text-sm sm:text-base mb-8 max-w-[400px]">
            {BannerData?.subtitle ||
              "Sammenlign de beste eiendomsmeglerne nær deg, helt gratis og uforpliktende. default"}
          </p>
          <RedirectButton
            className="bg-primary text-base text-background h-12 rounded-lg transition text-[14px]  !py-[12px] !px-[20px] md:!px-[90px]"
            text={BannerData?.buttonText || "Få 5 tilbud nådefault"}
            redirect={BannerData?.ctaLink || "/about_defaul"}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
