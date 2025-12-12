import { getCachedCountyData } from '@/services/data/county';
import RegionSelector from './regionSelector';
import { getCachedPlaceByCountySlug } from '@/services/data/getCachedPlaceByCountySlug';
import { notFound } from 'next/navigation';

const RegionSelectorContainer = async ({ county }: any) => {
    const countyDoc = await getCachedCountyData(0);
    const countyData = await JSON.parse(JSON.stringify(countyDoc));
    const counties = countyData?.data || [];
    if (!countyData?.data) {
        notFound();
    }

    const selectedCountySlug = county || (counties[0]?.slug ?? '');

    let cityList = [];

    if (selectedCountySlug) {
        const placesData = await getCachedPlaceByCountySlug(selectedCountySlug);
        cityList = placesData?.data || [];
        if (!placesData?.data) {
            notFound()
        }
    }

    return (
        <RegionSelector
            countyData={counties}
            cityData={cityList}
            selectedCountySlug={selectedCountySlug}
        />
    );
}

export default RegionSelectorContainer;
