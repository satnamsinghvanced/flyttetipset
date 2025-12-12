type ChartIconProps = {
  color?: string;
  height?: string;
  width?: string;
};
const ChartIcon =  ({
  color = "#23395B",
  width = "40",
  height = "40",
}: ChartIconProps)  => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 41 40"
      fill="none"
    >
      <path
        d="M15.8815 36.6673H25.8815C34.2148 36.6673 37.5482 33.334 37.5482 25.0007V15.0007C37.5482 6.66732 34.2148 3.33398 25.8815 3.33398H15.8815C7.54818 3.33398 4.21484 6.66732 4.21484 15.0007V25.0007C4.21484 33.334 7.54818 36.6673 15.8815 36.6673Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.7142 30.8327C28.5475 30.8327 30.0475 29.3327 30.0475 27.4993V12.4993C30.0475 10.666 28.5475 9.16602 26.7142 9.16602C24.8809 9.16602 23.3809 10.666 23.3809 12.4993V27.4993C23.3809 29.3327 24.8642 30.8327 26.7142 30.8327Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0482 30.834C16.8815 30.834 18.3815 29.334 18.3815 27.5007V21.6673C18.3815 19.834 16.8815 18.334 15.0482 18.334C13.2148 18.334 11.7148 19.834 11.7148 21.6673V27.5007C11.7148 29.334 13.1982 30.834 15.0482 30.834Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChartIcon;
