import ArticlesCard from "@/components/cards/articleCard";
import Pagination from "@/components/global/pagination";
import { ArticlesListProps } from "@/const/types";

const ArticlesList = async ({
  initialData,
  category,
  currentPage,
  articlesPerPage
}: ArticlesListProps) => {

  const articles = initialData?.data || [];
  const totalPages = initialData?.totalPages || 1;
  const totalArticles = initialData?.total || 0;

  return (
    < >
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto`}
        role="list"
        aria-label={`Articles about ${category}`}
      >
        {articles.length > 0 ? (
          articles.map((article: any) => (
            <ArticlesCard
              key={article._id}
              image={article.image}
              date={article.showDate || article.date}
              title={article.title}
              href={`/articles/${category}/${article.slug}`}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-secondary/50">
              No articles found for this category.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-[40px] mb-[56px] lg:mb-[84px] lg:mx-20">
          <Pagination
            currentPage={Number(currentPage)}
            totalPages={totalPages}
            totalItems={totalArticles}
            itemsPerPage={articlesPerPage}
            selectedCategorySlug={`${category}`}
          />
        </div>
      )}
    </>
  );
};

export default ArticlesList;