type PieChartIconProps = {
  color?: string;
  height?: string;
  width?: string;
};

const PieChartIcon = ({
  color = "#23395B",
  width = "40",
  height = "40",
}: PieChartIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.8341 20.0006C35.1674 20.0006 36.9674 18.334 35.3674 12.8673C34.2841 9.18396 31.1174 6.01729 27.4341 4.93396C21.9674 3.33396 20.3008 5.13396 20.3008 9.46729V14.2673C20.3008 18.334 21.9674 20.0006 25.3008 20.0006H30.8341Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33.6332 24.5003C32.0832 32.2169 24.6832 37.8169 16.2665 36.4503C9.94985 35.4336 4.86652 30.3503 3.83318 24.0336C2.48318 15.6503 8.04985 8.25026 15.7332 6.68359"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PieChartIcon;
