import ArticlesByTags from "@/components/global/articlesByTags";
import ArticleSecond from "@/components/global/articleSecond";
import Breadcrumbs from "@/components/global/breadcrumbs";
import GetQuotes from "@/components/quotes/getQuotes";
import { ArticleProps } from "@/const/types";
import { getCachedArticleBySlug } from "@/services/page/getCachedArticleBySlug-service";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";
import { notFound } from 'next/navigation';

const ArticleSlug = async ({ slugValue }: ArticleProps) => {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";
  const articleDoc = await getCachedArticleBySlug(slugValue ?? "");
  const article = await JSON.parse(JSON.stringify(articleDoc));

  if (!article) {
    notFound()
  }

  return (
    <>
      <div className="block lg:hidden">
        {article?.image && (
          <Image
            src={`${imageBaseUrl}${article?.image}`}
            width={100}
            height={100}
            alt={`${article?.title} image`}
            className="w-full rounded-2xl mb-6"
            loading="lazy" 
          />
        )}
      </div>
      <Breadcrumbs className="!mb-4 lg:!mb-6 !pl-0 !m-0 " />
      <div className="w-full flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full">
          <h1 className="text-[36px] lg:text-[48] font-bold text-primary leading-[1.1] !mb-5">
            {article?.title}
          </h1>
          <p className="text-secondary font-bold text-sm lg:text-base my-4">
            {formatDate(article?.showDate)}
          </p>
          <p className="font-normal text-secondary mb-6 text-[14px] lg:text-[16px]">
            {" "}
            {article?.excerpt}
          </p>
          <div className="hidden lg:block">
            {article?.image && (
              <Image
                src={`${imageBaseUrl}${article?.image}`}
                width={100}
                height={100}
                alt={`${article?.title} image`}
                className="w-full rounded-2xl mb-6"
                loading="lazy" 
              />
            )}
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: article?.description || "" }}
            className="article-content"
          ></div>
        </div>
        <div className="w-1/2 max-w-[346px] h-fit sticky top-24 max-md:w-full  max-md:top-2 mt-2 max-md:relative">
          <GetQuotes />
        </div>
      </div>
      {
        article.articleTags ?
          <ArticlesByTags tags={article.articleTags} slug={article.slug} />
          :
          <ArticleSecond />
      }
    </>
  );
};

export default ArticleSlug;
