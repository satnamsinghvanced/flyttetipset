
import { County, Places } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedPlaceByCountySlug = (county: string) => {
    const fetchPlaces = async () => {
        if (!county) {
            console.error('Missing county:', county);
            return { error: 'Invalid slug provided' };
        }

        try {
            await connectDB();

            const countyData = await County.findOne({ slug: county }).select('_id');

            if (!countyData) {
                console.log(`No countyData found with slug: ${county}`);
                return { message: 'County not found' };
            }

            const placesData = await Places.find({ countyId: countyData._id }).select('name slug');

            if (!placesData || placesData.length === 0) {
                console.log(`No places found for county: ${county}`);
                return { message: 'No places found' };
            }

            return { data: placesData };
        } catch (error) {
            console.error(`Error fetching places for county ${county}:`, error);
            return { error: 'Error fetching place data' };
        }
    };

    const cachedFetch = unstable_cache(
        fetchPlaces,
        [`place-by-county-slug-${county}`],
        { revalidate: 10 }
    );

    return cachedFetch();
};