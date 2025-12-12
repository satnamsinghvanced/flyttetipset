import { Articles } from '@/const/types'
import RedirectButton from '../global/redirectButton'
import LatestInsightsCard from './latestInsightsCard'

const LatestInsights = ({ articlesHeading, data }: any) => {
    return (
        <div className="py-16 bg-background text-center px-4 md:px-6 lg:px-8">
            <h2 className="text-primary font-semibold leading-tight lg:text-5xl text-[36px] mb-8">
                {articlesHeading.heading}
            </h2>
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 max-w-6xl mx-auto "
                role="list"
                aria-label="Latest insights articles"
            >
                {data && data.slice(0, 4).map(({ title, slug, image, date, categoryId }: Articles) => (
                    <LatestInsightsCard
                        key={slug}
                        image={image ?? ''}
                        date={date ?? ''}
                        title={title}
                        href={`articles/${categoryId.slug}/${slug}`}
                        role="listitem"
                    />
                ))}
            </div>
            <div className="mt-10 max-sm:px-4">
                <RedirectButton text={articlesHeading.buttonText} redirect={articlesHeading.ctaLink} />
            </div>
        </div>
    )
}

export default LatestInsights