import Link from "next/link";
import Hamburger from "./hamburger";
import Logo from "./logos/logo";
import { NavbarProps } from "@/const/types";
import Image from "next/image";
import { NAV_LINKS } from "@/const/consts";

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

const Navbar = ({ logo, logoText }: NavbarProps) => {

  return (
    <nav className="bg-navbarbg text-background px-4 lg:px-6 py-6 sticky top-0 !z-[99] h-[82px] flex items-center">
      <div className="flex justify-between items-center px-2 md:px-6 lg:px-10 w-full">
        <div className="text-xl font-bold overflow-hidden">
          <Link href="/" aria-label="Meglertip Logo" className="flex gap-1 justify-center items-center">
            {
              logo &&
              <Image
                src={`${imageBaseUrl}${logo}`}
                width={40} height={26}
                alt='Meglertip Logo'
                className='h-full max-md:max-h-[265px] w-[31px]'
                loading="lazy" />
            }
            {
              logoText &&
              <Image
                src={`${imageBaseUrl}${logoText}`}
                width={100} height={20}
                alt='Meglertip Logo'
                className='h-full max-md:max-h-[265px] w-[142px]'
                loading="lazy" />
            }
            {
              (!logo && !logoText) &&
              <Logo />
            }
          </Link>
        </div>
        <div className="hidden md:flex space-x-2 md:space-x-6 lg:space-x-10 items-center !z-20">
          {NAV_LINKS?.map((link) => (
            <div
              key={link.href}
              className="flex items-center space-x-2 md:space-x-6 lg:space-x-10"
            >
              <Link href={link.href}>
                <span className="hover:text-background/80 text-base font-medium">
                  {link.label}
                </span>
              </Link>
            </div>
          ))}
        </div>
        <div className="md:hidden flex items-center relative">
          <Hamburger />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
