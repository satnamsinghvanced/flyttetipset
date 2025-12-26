
import { Sitemap } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedSiteMapData = unstable_cache(
    async () => {
        try {
            await connectDB();

            const siteMapPage: any = await Sitemap.findOne();

            if (!siteMapPage) {
                console.warn('No siteMap data found in database');
                return null;
            }

            if (siteMapPage.steps && Array.isArray(siteMapPage.steps)) {
                siteMapPage.steps = siteMapPage.steps.filter(
                    (step: any) => step.visible !== false
                );
            }

            return siteMapPage;
        } catch (error) {
            console.error('siteMap data fetch error:', error);
            return null;
        }
    },
    ['siteMap-data'],
    { revalidate: 120 }
);