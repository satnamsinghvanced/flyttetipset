import ArticlesCard from "@/components/cards/articleCard";
import Heading from "@/components/global/heading";
import Pagination from "@/components/global/pagination";
import { ArticlesProps } from "@/const/types";
import Link from "next/link";

const Articles = ({
  heading = "Alle Artikler",
  categoriesHeading = 'ALL KATEGORIER',
  tabs = [],
  data = [],
  currentPage = 1,
  totalPages = 1,
  totalArticles = 0,
  selectedCategorySlug = "",
}: ArticlesProps & {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
  selectedCategorySlug: string;
}) => {
  const articlesPerPage = 6;

  return (
    <>
      <div id="article_section" className="p-0 m-0 h-0 w-0 absolute top-0"></div>
      <div className="py-8">
        <div className="flex w-full flex-col max-w-7xl m-auto px-4 md:px-6 lg:px-8">
          <Heading
            heading={heading}
            className="mb-12 mt-0 text-[36px] lg:text-[64px]"
          />
          <p className="text-[16px] mb-4 font-medium text-primary">{categoriesHeading}</p>

          <div className="flex flex-col lg:flex-row gap-8">

            <div className="flex flex-row flex-wrap gap-2 md:gap-4 lg:flex-col lg:!w-[340px]">
              {tabs?.map((tab: any) => (
                <Link
                  key={tab.slug}
                  href={`?category=${tab.slug}&page=1`}
                  className={`border border-dark/50 rounded-lg h-[46px] lg:h-16 px-4 flex items-center text-start justify-start min-w-fit lg:w-full transition-all duration-300 ${selectedCategorySlug === tab.slug
                    ? "bg-primary/10 text-dark font-semibold"
                    : "bg-transparent text-dark hover:bg-gray-100"
                    }`}
                >
                  <span className="text-[14px] lg:text-xl font-semibold">
                    {tab.title}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex-1">
              <div
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[792px] mx-auto"
                role="list"
                aria-label={`Articles about ${tabs.find((t: { slug: string; title: string }) => t.slug === selectedCategorySlug)?.title || 'Articles'}`}
              >
                {data?.length > 0 ? (
                  data.map((article: any) => (
                    <ArticlesCard
                      key={article._id}
                      image={article.image}
                      date={article.showDate}
                      title={article.title}
                      href={`/articles/${selectedCategorySlug}/${article.slug}`}
                    />
                  ))
                ) : (
                  <p className="col-span-3 text-center py-8">No articles to show</p>
                )}
              </div>

              {/* Pagination */}
              <div className="mt-[40px] mb-[56px] lg:mb-[84px] lg:mx-20">
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    selectedCategorySlug={selectedCategorySlug}
                    totalItems={totalArticles}
                    itemsPerPage={articlesPerPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Articles;