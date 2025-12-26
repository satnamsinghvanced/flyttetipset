import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  selectedCategorySlug: string;
  totalItems?: number;
  itemsPerPage?: number;
  baseUrl?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  selectedCategorySlug,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 10;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      const middleStart = Math.max(2, currentPage - 4);
      const middleEnd = Math.min(totalPages - 1, currentPage + 5);
      let startPage = Math.max(2, middleStart);
      let endPage = Math.min(totalPages - 1, middleEnd);

      startPage = Math.max(2, startPage);
      endPage = Math.min(totalPages - 1, endPage);

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i >= 1 && i <= totalPages) {
          pages.push(i);
        }
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };
  // const generatePageUrl = (page: number) => {
  //   return `${baseUrl}?page=${page}`;
  // };
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-4 w-fit mt-6 m-auto md:m-0">
      <div className="flex items-center gap-3">
        {/* Previous Page Button */}
        {currentPage > 1 ? (
          <Link
            href={`?category=${selectedCategorySlug}&page=${currentPage - 1}#article_section`}
            aria-label="Previous page"
            className="rounded-full !p-0 min-w-6.5 h-6.5 bg-secondary/20 flex justify-center items-center hover:bg-secondary/30 transition-colors"
          >
            <FaChevronLeft />
          </Link>
        ) : (
          <span className="rounded-full !p-0 min-w-6.5 h-6.5 bg-secondary/20 flex justify-center items-center opacity-50">
            <FaChevronLeft />
          </span>
        )}

        {/* Page Numbers */}
        <div className="flex gap-0.5">
          {getPageNumbers()?.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2">
                ...
              </span>
            ) : (
              <Link
                key={`${page}-${index}`}
                href={`?category=${selectedCategorySlug}&page=${page}#article_section`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={`rounded-full bg-transparent hover:bg-transparent text-[18px] min-w-6.5 h-6.5 flex items-center justify-center ${currentPage === page
                  ? "text-dark font-semibold cursor-default"
                  : "hover:text-dark/90 cursor-pointer"
                  }`}
              >
                {page}
              </Link>
            )
          )}
        </div>

        {/* Next Page Button */}
        {currentPage < totalPages ? (
          <Link
            href={`?category=${selectedCategorySlug}&page=${currentPage + 1}#article_section`}
            aria-label="Next page"
            className="rounded-full !p-0 min-w-6.5 h-6.5 bg-secondary/20 flex justify-center items-center hover:bg-secondary/30 transition-colors"
          >
            <FaChevronRight />
          </Link>
        ) : (
          <span className="rounded-full !p-0 min-w-6.5 h-6.5 bg-secondary/20 flex justify-center items-center opacity-50">
            <FaChevronRight />
          </span>
        )}
      </div>
    </div>
  );
};

export default Pagination;
