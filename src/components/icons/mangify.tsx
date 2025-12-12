type MagnifyIconProps = {
  color?: string;
  height?: string;
  width?: string;
};

const MagnifyIcon =({
  color = "#23395B",
  width = "40",
  height = "40",
}: MagnifyIconProps)  => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
    >
      <path
        d="M23.334 8.33398H33.334"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.334 13.334H28.334"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35.0007 19.1673C35.0007 27.9173 27.9173 35.0007 19.1673 35.0007C10.4173 35.0007 3.33398 27.9173 3.33398 19.1673C3.33398 10.4173 10.4173 3.33398 19.1673 3.33398"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36.6673 36.6673L33.334 33.334"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MagnifyIcon;
