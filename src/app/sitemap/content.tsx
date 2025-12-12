import Heading from "@/components/global/heading";
import { Divider } from "@heroui/react";
import Link from "next/link";

const SiteMapContent = async ({ sitemapData }: any) => {
    return (
        <div className="  bg-background  text-darkColor min-h-screen">
            <Heading heading={sitemapData.title} className="!mt-4 !mb-6" />
            <p className="text-dark/80 font-semibold max-w-3xl text-sm lg:text-base">
                {sitemapData.description}
            </p>
            <Divider className="my-5 lg:my-10 bg-primary/50" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10">
                {sitemapData.pages && sitemapData.pages.map((page: any, index: number) => (
                    <Link
                        href={page.href}
                        key={index}
                        className="p-4 lg:p-6 rounded-xl   bg-accent  border border-accent hover:border-primary/3"
                    >
                        <h2 className="text-primary  text-xl font-bold underline hover:text-dark transition-all ease-in-out duration-300">
                            {page.title}
                        </h2>
                        <p className="text-secondary mt-2 text-sm lg:text-base">
                            {page.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SiteMapContent