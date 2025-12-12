import { HeadingProps } from "@/const/types";

const Heading = ({ heading = '', className = '' }: HeadingProps) => {
  return (
    <h1 className={`text-primary font-bold lg:text-5xl text-[36px] lg:mb-10 mb-6 ${className}`}>{heading}</h1>
  );
};

export default Heading;
