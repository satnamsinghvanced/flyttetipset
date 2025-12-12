
import { getCachedTopArticleCategory } from "@/services/page/article-categroy-service";
import Heading from "../global/heading";
import ArticleCard from "./articleCard";

const Article = async (heading: any) => {
  const doc = await getCachedTopArticleCategory()
  const articleCaegoryData = await JSON.parse(JSON.stringify(doc));

  return (
    <>
      <div className="py-8 max-sm:pb-[42px] sm:py-12 lg:py-20 bg-background text-center px-4">
        <Heading heading={heading.heading} />
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-10 max-w-7xl mx-auto">
          {articleCaegoryData && articleCaegoryData?.slice(0, 3).map(({ title, description, slug }: any, index: number) => (
            <ArticleCard
              key={slug}
              icon={index}
              heading={title}
              description={description}
              href={`articles/${slug}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Article;
