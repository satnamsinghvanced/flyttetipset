import { DescriptionProps } from "@/const/types"

const Description = ({ description }: DescriptionProps) => {
    return (
        <p className="text-dark/70 font-normal text-[14px] lg:text-[16px] mb-8 max-w-[642px] ">{description}</p>
    )
}

export default Description