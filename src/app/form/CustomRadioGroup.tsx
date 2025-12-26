const CustomRadioGroup = ({
  field,
  value,
  isInvalid,
  error,
  onChange,
}: any) => (
  <div className="pb-4">
    <label className="font-medium">
      {field.label}
      {field.required && field.label && "*"}
    </label>
    {isInvalid && error && <p className="text-danger text-sm mb-2">{error}</p>}
    <div
      className="flex gap-2 w-full md:flex-row flex-col"
      role="radiogroup"
      aria-invalid={isInvalid}
    >
      {Array.isArray(field.options) &&
        field.options?.map((opt: string, optIndex: number) => {
          const isSelected = value === opt;
          return (
            <button
              key={`${field._id}-${optIndex}`}
              type="button"
              onClick={() => onChange(opt)}
              className={`max-h-[246px] px-4 py-6 rounded-md shadow text-sm transition-all w-full flex flex-col justify-start items-start gap-4.5 
                            ${isSelected
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-background text-primary border-2 border-transparent"
                } 
                            ${isInvalid ? "border-2 border-danger" : ""
                } transition ease-in-out`}
              role="radio"
              aria-label={opt}
              aria-checked={isSelected}
            >
              <div className="text-2xl">{opt.replace(/\([^)]*\)/, "")}</div>
              <p className="font-normal text-secondary text-start">
                {opt.match(/\(([^)]+)\)/)?.[1] || ""}
              </p>
            </button>
          );
        })}
    </div>
  </div>
);

export default CustomRadioGroup;
