import { Homepage } from '@/lib/models/models';
import { County } from '@/lib/models/models';
import { Places as Place } from '@/lib/models/models';
import { connectDB } from '@/lib/mongoose';
import { unstable_cache } from 'next/cache';

export const getCachedHomePageData = unstable_cache(
  async () => {
    try {
      await connectDB();

      // Get homepage as plain JS object
      const homePageDoc = await Homepage.findOne().lean();
      if (!homePageDoc) return null;

      // Make a deep copy to avoid mutating original doc
      const homePage = JSON.parse(JSON.stringify(homePageDoc));

      if (homePage.citySectionHeading?.locations?.length) {
        for (let i = 0; i < homePage.citySectionHeading.locations.length; i++) {
          const loc = homePage.citySectionHeading.locations[i];
          if (!loc.locationId) continue;

          if (loc.locationType === 'County') {
            const county = await County.findById(loc.locationId)
              .select('name slug excerpt icon')
              .lean();
            loc.locationId = county || null;
          } else if (loc.locationType === 'Place') {
            const place = await Place.findById(loc.locationId)
              .select('name slug excerpt icon')
              .lean();
            loc.locationId = place || null;
          }
        }
      }

      return homePage;
    } catch (error) {
      console.error('homePage data fetch error:', error);
      return null;
    }
  },
  ['homePage-data'],
  { revalidate: 120 }
);
