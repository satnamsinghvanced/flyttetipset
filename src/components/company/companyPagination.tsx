import { CompanyPaginationProps } from "@/const/types";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const CompanyPagination = ({
    com_current_page,
    com_total_pages,
}: CompanyPaginationProps) => {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 10;

        if (com_total_pages <= maxVisiblePages) {
            for (let i = 1; i <= com_total_pages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            const middleStart = Math.max(2, com_current_page - 4);
            const middleEnd = Math.min(com_total_pages - 1, com_current_page + 5);
            let startPage = Math.max(2, middleStart);
            let endPage = Math.min(com_total_pages - 1, middleEnd);

            startPage = Math.max(2, startPage);
            endPage = Math.min(com_total_pages - 1, endPage);

            if (startPage > 2) {
                pages.push("...");
            }

            for (let i = startPage; i <= endPage; i++) {
                if (i >= 1 && i <= com_total_pages) {
                    pages.push(i);
                }
            }

            if (endPage < com_total_pages - 1) {
                pages.push("...");
            }

            if (com_total_pages > 1) {
                pages.push(com_total_pages);
            }
        }

        return pages;
    };

    const generatePageUrl = (page: number) => {
        const params = new URLSearchParams();
        params.set('cp', page.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-4 w-fit mt-6 m-auto md:m-0">
            <div className="flex items-center gap-3">

                {/* back button  */}
                {com_current_page > 1 ? (
                    <Link
                        href={generatePageUrl(com_current_page - 1)}
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
                    {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-2">
                                ...
                            </span>
                        ) : (
                            <Link
                                key={`${page}-${index}`}
                                href={generatePageUrl(page as number)}
                                aria-label={`Page ${page}`}
                                aria-current={com_current_page == page ? "page" : undefined}
                                className={`rounded-full bg-transparent hover:bg-transparent text-[18px] min-w-6.5 h-6.5 flex items-center justify-center font-semibold ${com_current_page == page
                                    ? "text-dark cursor-default"
                                    : "text-secondary cursor-pointer"
                                    }`}
                            >
                                {page}
                            </Link>
                        )
                    )}
                </div>

                {/* Next button */}
                {com_current_page < com_total_pages ? (
                    <Link
                        href={generatePageUrl(Number(com_current_page) + 1)}
                        // href={generatePageUrl(parseInt(com_current_page) + 1)}
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

export default CompanyPagination;