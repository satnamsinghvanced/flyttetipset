"use client";
import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import Button from "./button";

const GoTop = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > window.innerHeight) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {hasScrolled && (
        <div
          className={`text-background justify-end flex w-fit fixed right-4 bottom-4 shadow-lg`}
        >
          <a href="#top">
            <Button isIconOnly className="aspect-square bg-background">
              <FaArrowRightLong className="rotate-270 text-dark" />
            </Button>
          </a>
        </div>
      )}
    </>
  );
};

export default GoTop;
