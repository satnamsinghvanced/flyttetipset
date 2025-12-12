import { HowItWorksProps } from "@/const/types";
import HowItWorksCard from "./HowItWorksCard";

const HowItWorks = ({
  cards, flex, title = 'Hvordan fungerer det?', titleClass = 'lg:text-5xl text-[36px] ' }: HowItWorksProps) => {

  return (
    <div className="py-8 max-sm:pb-[42px] sm:py-12 lg:py-20 bg-accent text-center  ">
      <h2 className={`text-primary font-semibold leading-tight mb-8 ${titleClass}`}>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-around gap-4 lg:gap-6 mx-auto max-w-7xl px-4 md:px-6 lg:px-0">
        {cards.map(({ icon, heading, title, description }: any, index: number) => (
          <HowItWorksCard
            key={index}
            icon={icon}
            heading={(title ? title : heading) ?? ""}
            description={description}
            flex={flex}
          />
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
