import Description from '../global/description';
import Heading from '../global/heading';
import RedirectButton from '../global/redirectButton';
import GuidesCard from './guidesCard';

const Guides = ({ data }: any) => {
  const locations = Array.isArray(data?.locations) ? data.locations : [];

  return (
    <div className="py-16 bg-accent text-center px-4 md:px-6 lg:px-8">
      <Heading heading={data?.title} />

      <div className="flex justify-center">
        <Description description={data.description} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 max-w-7xl mx-auto">
        {locations?.map((loc: any, index: number) => {
          const location = loc.locationId; // populated object

          if (!location) return null;

          return (
            <GuidesCard
              key={loc._id || index}
              city={location.name}
              description={location.excerpt || ''}
              href={`/eiendomsmegler/${location.slug}`}
              icon={location.icon}
            />
          );
        })}
      </div>

      <div className="mt-8">
        <RedirectButton
          className="bg-primary text-background text-[16px] max-sm:w-full !py-[12px] !px-[90px]"
          text={data.buttonText}
          redirect={`${data.ctaLink || '/eiendomsmegler'}#region-selector`}
        />
      </div>
    </div>
  );
};

export default Guides;
