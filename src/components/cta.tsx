import RedirectButton from "./global/redirectButton";

const Cta = ({ header }: any) => { 
  return (
    <div className="relative py-8 sm:py-12 lg:py-20 bg-cover bg-center bg-footerbg lg:px-4">
      <div className="relative z-8 flex flex-col justify-center items-center h-full text-center text-background px-4">
        <h2 className="text-[36px] lg:text-[72px] font-semibold max-w-2xl leading-tight mb-4 !text-background">
          {header.title}
        </h2>
        <p className="text-sm sm:text-base mb-8 max-w-2xl">
          {header.description}
        </p>

        <RedirectButton
          className="!bg-background !text-primary py-3 px-20 sm:h-14 text-base rounded-lg text-[16px] font-semibold transition"
          text={header.button}
          redirect={`/form`}
        />
      </div>
    </div>
  );
};

export default Cta;
