import { HowItWorksProps } from "@/const/types";
import HowItWorksCard from "./HowItWorksCard";
import DocIcon from "../icons/doc";
import WeighIcon from "../icons/weigh";
import ThumbUpIcon from "../icons/thumbup";
import BatchIcon from "../icons/batch";
import CertificateIcon from "../icons/certificate";
import BarGraphIcon from "../icons/barGraph";

const HowItWorks = ({
  cards,
  flex,
  title = "Hvordan fungerer det?",
  titleClass = "lg:text-5xl text-[36px] ",
  howItWorks = true,
}: HowItWorksProps) => {
  let icons: any = [];
  if (howItWorks) {
    icons = [
      <DocIcon key={0} />,
      <WeighIcon key={1} />,
      <ThumbUpIcon key={2} />,
    ];
  } else {
    icons = [<BarGraphIcon key={0} />, <CertificateIcon key={1} />, <BatchIcon key={2} />];
  }
  return (
    <div className="py-8 max-sm:pb-[42px] sm:py-12 lg:py-20 bg-accent text-center  ">
      <h2
        className={`text-primary font-semibold leading-tight mb-8 ${titleClass}`}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-around gap-4 lg:gap-6 mx-auto max-w-7xl px-4 md:px-6 lg:px-0">
        {cards?.map(
          ({ icon, heading, title, description }: any, index: number) => (
            <HowItWorksCard
              key={index}
              icon={icons[index]}
              heading={(title ? title : heading) ?? ""}
              description={description}
              flex={flex}
            />
          )
        )}
      </div>
    </div>
  );
};

export default HowItWorks;
