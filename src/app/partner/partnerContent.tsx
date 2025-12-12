import HowItWorks from '@/components/landing-page/howItWorks';
import PartnerDescriptions from './descriptions';
import FormContent from './formContent';

export default async function PartnerContent({ partnerData, howItWorks }: any) {
    return (
        <>
            <FormContent data={partnerData} />
            <PartnerDescriptions data={partnerData} />
            <HowItWorks cards={howItWorks.howDoesItworksCards} flex={true} title={howItWorks.howDoesItworks.heading} titleClass={`text-[36px] lg:text-[56px]`} />
        </>
    )
}