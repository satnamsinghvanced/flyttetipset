import { Articles } from "@/const/types";
import { getCachedTopArticles } from "@/services/page/topArticles-service";
import Link from "next/link";
import ArticlesCard from "../cards/articleCard";
import Button from "./button";
import Heading from "./heading";

interface ArticleSecondProps {
  title?: string;
  articles?: Articles[];
}


const ArticleSecond = async ({
  title = "Siste innsikt og guider",
}: ArticleSecondProps) => {
  const topArticlesDoc = await getCachedTopArticles()
  const articlest: any = await JSON.parse(JSON.stringify(topArticlesDoc));
  const articlesData = articlest.data
  return (
    <div className="py-8">
      <Heading heading={title} className="text-center" />

      {!articlesData || articlesData.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">Ingen artikler tilgjengelig</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-7xl mx-auto mb-6" role="list">
            {articlesData.slice(0, 4)?.map((item: any) => (
              <ArticlesCard
                key={item.slug}
                image={item.image ?? ""}
                date={item.date ?? ""}
                title={item?.title}
                href={
                  item.href || `/artikler/${item.categoryId.slug}/${item.slug}`
                }
                readMoreText="Les mer"
              />
            ))}
          </div>
          <div className="flex justify-center items-center">
            <Link href="/artikler">
              <Button className="bg-primary text-background">
                Se flere artikler
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleSecond;
