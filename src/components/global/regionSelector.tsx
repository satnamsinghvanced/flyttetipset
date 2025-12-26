import { City, County, RegionSelectorProps } from "@/const/types";
import Link from "next/link";

export default function RegionSelector({
  countyData,
  cityData,
  selectedCountySlug
}: RegionSelectorProps) {
  const counties = countyData || [];
  const cityList = cityData || [];

  const selectedCounty = counties.find(county => county.slug === selectedCountySlug);
  const selectedCountyName = selectedCounty?.name || counties[0]?.name || '';

  return (
    <div className="space-y-6 relative">
      <div className="z-[50] w-0 h-0 absolute -top-20" id="c" >
      </div>
      {/* County Buttons */}
      <div className="flex flex-wrap gap-3 justify-start border border-secondary/20 py-3 px-1 rounded-xl bg-background" >
        {counties?.map((county: County) => (
          <Link
            key={county._id}
            href={`/eiendomsmegler/${county.slug}#c`}
            className={`capitalize bg-transparent md:text-[24px] text-[20px] px-4 py-2 rounded-lg ${selectedCountySlug === county.slug // Compare with slug
              ? "text-dark font-medium bg-primary/10"
              : "text-secondary font-medium hover:bg-gray-100"
              } transition-all duration-300`}
          >
            {county.name}
          </Link>
        ))}
      </div>

      {/* Cities List */}
      <div className="bg-background rounded-xl p-5 border border-secondary/20 relative min-h-fit">
        <h2 className="text-[32px] font-semibold text-primary">
          {selectedCountyName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-x-12 gap-y-2 text-xl mt-2">
          {cityList.length === 0 ? (
            <div>No cities available for this region.</div>
          ) : (
            cityList?.map((city: City, index: number) => {
              const length = cityList.length;
              const isLast = index === length - 1;
              const isSecondLast = index === length - 2;
              const isBorderRemoved = length >= 2 ? isLast || isSecondLast : isLast;

              return (
                <Link
                  href={`/eiendomsmegler/${city.slug}`}
                  key={city.slug}
                  className={`bg-transparent rounded-none text-2xl px-0 font-medium flex justify-between items-center border-b transition-colors duration-300 ${isBorderRemoved
                    ? "border-transparent"
                    : "border-secondary/20"
                    }`}
                >
                  <span className="py-3">{city.name}</span>
                  <span className="text-primary font-medium">→</span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}