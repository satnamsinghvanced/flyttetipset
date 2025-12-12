"use client";

import { capitalizeTitle } from "@/utils/capitalizeTitle";
import { BreadcrumbItem, Breadcrumbs as NextUIBreadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BreadcrumbsProps } from "@/const/types";

const Breadcrumbs = ({ className = "" }: BreadcrumbsProps) => {
    const pathname = usePathname();
    const path = pathname?.split("/").filter((segment) => segment) || [];
    const pathSegments = path.map((segment) => capitalizeTitle(segment));

    return (
        <div className={`m-auto max-w-7xl max-h-[68px] flex items-end text-base px-4 md:px-6  text-dark lg:px-8 ${className}`}>
            <NextUIBreadcrumbs className=" text-dark">
                {pathname === "/" ? (
                    <BreadcrumbItem key="home" className="text-base  text-dark">
                        <p color="text-dark">Home</p>
                    </BreadcrumbItem>
                ) : (
                    <BreadcrumbItem key="home" className="text-base">
                        <Link href="/" className="text-dark">
                            Home
                        </Link>
                    </BreadcrumbItem>
                )}

                {pathSegments.map((segment, index) => {
                    const formattedSegment =
                        segment.charAt(0) + segment.slice(1);
                    const href = "/" + path.slice(0, index + 1).join("/");
                    // console.log('formattedSegment: ', formattedSegment, 'pathSegments: ', pathSegments, 'segment: ', segment);
                    return (
                        <BreadcrumbItem key={index + 1} className="text-base text-dark ">
                            {capitalizeTitle(formattedSegment) !== pathSegments[pathSegments.length - 1] ?
                                (<Link
                                    href={capitalizeTitle(formattedSegment) === pathSegments[pathSegments.length - 1] ? '' : href}
                                    className={` text-dark`}
                                >
                                    {capitalizeTitle(formattedSegment)}
                                </Link>)
                                :
                                (
                                    <span className={` text-dark`}>
                                        {capitalizeTitle(formattedSegment)}
                                    </span>
                                )
                            }
                        </BreadcrumbItem>
                    );
                })}
            </NextUIBreadcrumbs>
        </div>
    );
};

export default Breadcrumbs;
