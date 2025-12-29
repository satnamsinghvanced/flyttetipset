"use client";

import { BreadcrumbsProps } from "@/const/types";
import { capitalizeTitle } from "@/utils/capitalizeTitle";
import { BreadcrumbItem, Breadcrumbs as NextUIBreadcrumbs } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs = ({ className = "", showBackground = false }: BreadcrumbsProps) => {
    const pathname = usePathname();
    const path = pathname?.split("/").filter((segment) => segment) || [];
    const pathSegments = path?.map((segment) => capitalizeTitle(segment));

    return (
        <>
            {showBackground && <div className="absolute top-0 left-0 w-full h-[150px] bg-accent z-1 p-1"> </div>}
            <div className={`m-auto max-w-7xl max-h-[68px] flex items-end text-base px-4 md:px-6  text-dark lg:px-8 relative ${className}`}>
                <NextUIBreadcrumbs className=" text-dark z-2">
                    {pathname === "/" ? (
                        <BreadcrumbItem key="hjem" className="text-base  text-dark">
                            <p color="text-primary/60 font-medium">Hjem</p>
                        </BreadcrumbItem>
                    ) : (
                        <BreadcrumbItem key="hjem" className="text-base font-medium">
                            <Link href="/" className="text-primary/60 font-medium">
                                Hjem
                            </Link>
                        </BreadcrumbItem>
                    )}
                    {/* if include  '%C3%B8' replace with 'ø' */}
                    {pathSegments?.map((segment, index) => {
                        const formattedSegment =
                            segment.charAt(0) + segment.slice(1);
                        const href = "/" + path.slice(0, index + 1).join("/");
                        // console.log('formattedSegment: ', formattedSegment, 'pathSegments: ', pathSegments, 'segment: ', segment);
                        return (
                            <BreadcrumbItem key={index + 1} className="text-base text-primary/60 font-medium">
                                {capitalizeTitle(formattedSegment) !== pathSegments[pathSegments.length - 1] ?
                                    (<Link
                                        href={capitalizeTitle(formattedSegment) === pathSegments[pathSegments.length - 1] ? '' : href}
                                        className={` !text-primary/60`}
                                    >
                                        {capitalizeTitle(formattedSegment)}
                                    </Link>)
                                    :
                                    (
                                        <span className={` text-primary`}>
                                            {capitalizeTitle(formattedSegment)?.replace('%C3%B8', 'ø') === 'About' ? 'Om oss' :
                                                capitalizeTitle(formattedSegment)?.replace('%C3%B8', 'ø') === 'Partner' ? 'Partner' :
                                                    capitalizeTitle(formattedSegment)?.replace('%C3%B8', 'ø') === 'Ofte Stilte Sporsmal' ? 'Ofte stilte spørsmål' :
                                                        capitalizeTitle(formattedSegment)?.replace('%C3%B8', 'ø')}
                                        </span>
                                    )
                                }
                            </BreadcrumbItem>
                        );
                    })}
                </NextUIBreadcrumbs>
            </div>
        </>
    );
};

export default Breadcrumbs;
