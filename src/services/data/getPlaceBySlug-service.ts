
import { Company, Places } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedCityBySlugData = unstable_cache(
    async (slug: string) => {
        try {
            await connectDB();
            let data = ''
            const placeData = await Places.findOne({ slug });
            data = placeData


            if (!placeData || placeData.length === 0) {

                const companyData = await Company.findOne({ slug });
                data = companyData

                if (!companyData || companyData.length === 0) {
                    console.log('No place or company data found in database');
                    return {}
                }
            }

            return { data: data };
        } catch (error) {
            console.log('Place data fetch error:', error);
            return { error: 'Error fetching place data' };
        }
    },
    ['place-data'],
    { revalidate: 10 }
);
