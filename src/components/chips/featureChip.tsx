import { FeatureChipProps } from "@/const/types"

const FeatureChip = ({ label = 'Featured' }: FeatureChipProps) => {
    return (
        <div className='bg-dark/10 p-1.5 px-4 !text-xs font-medium  rounded-lg flex justify-center items-center w-fit text-dark'>
            <span>
                {label}
            </span>
        </div>
    )
}

export default FeatureChip