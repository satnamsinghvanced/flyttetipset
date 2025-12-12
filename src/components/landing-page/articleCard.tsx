import { ArticleCardProps } from "@/const/types";
import Link from "next/link";
import { ReactElement } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import ChartIcon from "../icons/chart";
import MagnifyIcon from "../icons/mangify";
import PieChartIcon from "../icons/pieChart";

const ArticleCard = ({ icon, heading, description, href = '/' }: ArticleCardProps) => {
  const icons: ReactElement[] = [<ChartIcon key={0} />, <MagnifyIcon key={1} />, <PieChartIcon key={1} />];

  return (
    <Link href={href} className="bg-background/80 p-6 rounded-xl shadow-sm w-full md:w-1/3 text-left hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary text-2xl p-2 ">
          {icons[icon]}
        </div>
        <h3 className="text-[20px] md:text-2xl font-bold text-primary">{heading}</h3>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-secondary">{description}</p>
        <div>
          <span className="text-primary text-right text-3xl">
            <HiOutlineArrowRight />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
