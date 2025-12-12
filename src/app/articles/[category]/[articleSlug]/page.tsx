import HomePage from '@/app/page';
import { SlugPageProps } from '@/const/types';
import { capitalizeTitle } from '@/utils/capitalizeTitle';
import { generatePageMetadata } from '@/utils/metadata';
import ArticleSlug from './articleSlug';
import { getCachedArticleBySlug } from '@/services/page/getCachedArticleBySlug-service';

export async function generateMetadata({ params }: SlugPageProps) {
  const param = await params
  const slug = param.articleSlug ?? 'article';

  const articleCategory = param.category ?? 'article';
  const title = capitalizeTitle(slug)

  const articleDoc = await getCachedArticleBySlug(slug ?? "");
  const article = await JSON.parse(JSON.stringify(articleDoc));

  const { metaTitle, metaDescription, ogType, metaKeywords, ogImage, ogTitle, ogDescription, canonicalUrl, robots, jsonLd, publishedDate, lastUpdatedDate, } = article ?? {};

  return generatePageMetadata({
    title: metaTitle || ` | Flyttetipset.no`,
    description: metaDescription || `Read expert articles about ${title} on Flyttetipset.no.`,
    path: `articles/${articleCategory}/${canonicalUrl}`,
    keywords: metaKeywords ? metaKeywords.split(",").map((k: string) => k.trim()).filter(Boolean) : ["flyttetipset", "real estate", "articles"],
    type: ogType || "website",
    image: ogImage || null,
    ogTitle: ogTitle || metaTitle || `${title} | Flyttetipset.no`,
    ogDescription: ogDescription || metaDescription || `Explore helpful ${title} articles from Flyttetipset.no.`,
    canonicalUrl: `articles/${articleCategory}/${canonicalUrl}`,
    robots: robots || "index, follow",
    jsonLd: jsonLd || {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${title} Articles`,
    },
    publishedDate,
    lastUpdatedDate,
  });
}

const ArticleSlugPage = async ({ params }: SlugPageProps) => {

  const param = await params
  const title = await param?.articleSlug

  console.log('params:-- ', param)
  console.log('title articleSlug:-- ', param.articleSlug)

  return (
    <HomePage>
      <div className='max-w-7xl m-auto py-10 px-4 md:px-6 lg:px-8'>
        <ArticleSlug slugValue={title} />
      </div>
    </HomePage>
  )
}

export default ArticleSlugPage