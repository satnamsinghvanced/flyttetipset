import { getCachedCountyData } from '@/services/data/county';
import Description from '../global/description';
import Heading from '../global/heading';
import RedirectButton from '../global/redirectButton';
import GuidesCard from './guidesCard';

const Guides = async ({ data }: any) => {
  const doc = await getCachedCountyData(8)
  const cities = await JSON.parse(JSON.stringify(doc));
  const cityData = cities.data

  return (
    <div className="py-16 bg-accent text-center px-4 md:px-6 lg:px-8">
      <Heading heading={data.title} />
      <div className='flex justify-center'>
        <Description
          description={data.description}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10  max-w-7xl mx-auto">
        {cityData.map((city: any, index: number) => (
          <GuidesCard
            key={index}
            city={city.name}
            description={city.excerpt}
            href={city.slug}
            icon={city.icon}
          />
        ))}
      </div>
      <div className="mt-8">
        <RedirectButton className='bg-primary text-background  text-[16px] max-sm:w-full  !py-[12px] !px-[90px]' text={data.buttonText} redirect={data.ctaLink} />
      </div>
    </div>
  );
}

export default Guides;