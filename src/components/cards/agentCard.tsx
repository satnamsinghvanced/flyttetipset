import Image from "next/image"
import Link from "next/link"
import FeatureChip from "../chips/featureChip"
import Star from "../star"

interface AgentCardProps {
    name: string;
    averageRating: number;
    totalRating: number;
    description: string;
    features: string[];
    image: string;
    city: string;
    companyName: string;
    isRecommended: string;
    slug: string;
}

const AgentCard = ({
    name,
    companyName,
    averageRating,
    totalRating,
    isRecommended,
    description,
    features,
    slug
}: AgentCardProps) => {

    return (
        <div className="p-5 border border-dark/40 w-full relative bg-background rounded-lg overflow-hidden">
            {isRecommended && <div className="p-0.5 font-semibold text-base bg-primary uppercase w-fit absolute text-background px-9 top-5 -left-[42px] rotate-315 z-2">
                Anbefalt
            </div>}
            <div className="overflow-visible p-0">
                <div className="flex gap-6 w-full">

                    <div className="flex justify-center items-center">

                        <div className="flex justify-center items-center pt-8 ">
                            <Image
                                src={'/images/realEstate.webp'}
                                width={120}
                                height={45}
                                alt={`${name} image`}
                                className="mb-6"
                                loading="lazy" />
                        </div>

                    </div>

                    <div className="w-full">
                        <h6 className="font-semibold text-[32px] max-lg:!text-[20px] text-primary pb-0.5 leading-7">
                            {companyName}
                        </h6>
                        {averageRating &&
                            <Star averageRating={averageRating} totalRating={totalRating} />
                        }

                        <div className="pt-3 flex gap-2 flex-wrap">
                            {features && features.slice(0, 4).map((features, index) => (
                                <FeatureChip key={index} label={features} />
                            ))}
                        </div>
                    </div>

                    <Link
                        className="flex justify-center items-center w-36 h-10 max-sm:hidden bg-transparent border border-primary text-primary rounded-xl hover:bg-primary hover:text-background transition-all ease-in-out duration-300"
                        href={`/eiendomsmegler/${slug ? slug.replace(/\s+/g, '') : 'default_slug'}`}
                    >
                        <span>Se profil</span>
                    </Link>
                </div>
                <div className="mt-2">


                    <div
                        dangerouslySetInnerHTML={{
                            __html: description || "",
                        }}
                        className="text-secondary line-clamp-2"
                    ></div>
                    <Link
                        className="px-8 !w-[185px] !h-[48px] mt-[24px] flex justify-center items-center sm:hidden bg-transparent border border-primary text-primary rounded-xl hover:bg-primary hover:text-background transition-all ease-in-out duration-300"
                        href={`/eiendomsmegler/${slug ? slug.replace(/\s+/g, '') : 'default_slug'}`}
                    >
                        <span>
                            Se profil ddd
                        </span>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default AgentCard;
