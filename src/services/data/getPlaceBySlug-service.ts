import { Company, County, Places } from "@/lib/models/models";
import { connectDB } from "@/lib/mongoose";
import { unstable_cache } from "next/cache";

async function fetchCityBySlug(slug: string) {
  await connectDB();

  let data =
    await Places.findOne({ slug })
      .populate("companies.companyId")
      .populate({
        path: "countyId",
        select: "slug"
      })
      .lean();

  if (!data) {
    data =
      await County.findOne({ slug })
        .populate("companies.companyId")
        .lean();
  }

  if (!data) {
    data = await Company.findOne({ slug }).lean();
  }

  if (!data) return null;

  // sort companies safely
  if ("companies" in data && Array.isArray((data as any).companies)) {
    (data as any).companies.sort(
      (a: any, b: any) => a.rank - b.rank
    );
  }

  return data;
}

// ✅ cached wrapper
// getPlaceBySlug-service.ts
export const getCachedCityBySlugData = (slug: string) =>
  unstable_cache(
    async () => {
      const data = await fetchCityBySlug(slug);
      return { data }; // ✅ IMPORTANT
    },
    [`place-data-${slug}`],
    { revalidate: 120 }
  )();
