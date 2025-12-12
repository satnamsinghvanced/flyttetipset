"use client";

import { NAV_LINKS } from "@/const/consts";
import Link from "next/link";
import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <>
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        className="flex flex-col justify-center items-center space-y-1.5 md:hidden cursor-pointer"
      >
        <span className="block w-6 h-0.5 bg-background rounded" />
        <span className="block w-6 h-0.5 bg-background rounded" />
        <span className="block w-6 h-0.5 bg-background rounded" />
      </button>
      {isOpen && (
        <div className="fixed top-40 right-0 bottom-40 w-full bg-background z-5">
          <div className="bg-background p-4 w-full fixed top-[74px] right-0 h-full z-10">
            <ul className="list-none p-0 m-0 px-4 pr-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="mb-3 group">
                  <Link
                    href={link.href}
                    onClick={toggleMenu}
                    className="flex justify-between"
                  >
                    <span className="text-lg font-medium text-dark/80 group-hover:translate-x-2 group-hover:text-dark transition ease-in-out duration-300">
                      {link.label}
                    </span>
                    <span>
                      <FaArrowRightLong width="28" className="text-dark" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Hamburger;
