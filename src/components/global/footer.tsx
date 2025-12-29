
import { SOCIAL_MEDIA_LINKS } from "@/const/consts";
import { FooterProps } from "@/const/types";
import { getCachedFooterData } from "@/services/page/footer-service";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import Cta from "../cta";
import LogoText from "../logos/logoText";
import GoTop from "./goTop";

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

const Footer = async ({ logoText }: FooterProps) => {
  const doc = await getCachedFooterData()
  const FOOTER_DATA = await JSON.parse(JSON.stringify(doc));
  const {
    articles,
    places,
    companies,
    exploreLinks,
    socialLinks,
    footerLinks,
    header,
    footerText,
    address
  } = FOOTER_DATA;

  const [company, location] = address.text.split(",", 2);
  const socialMediaClasses = 'w-6 h-6 aspect-square text-dark group-hover:text-primary transition-all ease-in-out duration-200'

  return (
    <>
      <Cta header={header} />

      <footer className="bg-footerbg">
        <div className="max-w-7xl px-4 md:px-6 lg:px-8 m-auto grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6 max-md:gap-y-[40px] justify-between py-8 sm:py-12 lg:py-20  relative items-baseline">
          <div className="w-fit flex flex-col justify-between h-full max-md:col-span-2 ">
            <div className=" ">
              {
                logoText ?
                  <Image
                    src={`${imageBaseUrl}${logoText}`}
                    width={120} height={32}
                    alt='Meglertip Logo'
                    className='h-full max-md:max-h-[265px] w-full rounded-2xl'
                    loading="lazy" />

                  :
                  <LogoText />
              }
            </div>
            <div className="text-background flex gap-2 items-end max-md:hidden" aria-label="Social Media | Meglertipset.no">
              {socialLinks && socialLinks?.map((link: any, index: number) => (
                <Link
                  key={index}
                  href={link.href}
                  target={link.newPage ? "_blank" : "_self"}
                  className="bg-background p-2 rounded-lg group"
                  aria-label={`${link.icon} page Meglertipset.no`}
                >
                  {link.icon === 'facebook' && <FaFacebook className={socialMediaClasses} />}
                  {link.icon === 'instagram' && <FaInstagram className={socialMediaClasses} />}
                  {link.icon === 'linkedin' && <FaLinkedin className={socialMediaClasses} />}
                  {link.icon === 'youtube' && <FaYoutube className={socialMediaClasses} />}
                  {link.icon === 'twitter' && <FaTwitter className={socialMediaClasses} />}
                  {
                    !['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'].includes(link.icon) &&
                    <FaTwitter className="w-6 h-6 aspect-square" />
                  }
                </Link>
              ))}
            </div>
          </div>
          <div className="w-fit">
            <div className="text-background/70 text-sm">Artikler</div>
            <div className="flex flex-col gap-2 mt-4 text-background/80">
              {articles && articles?.map((article: any, index: number) => (
                <Link href={article.href} key={index}>
                  {article?.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="w-fit">
            <div className="text-background/70 text-sm">Steder</div>
            <div className="flex flex-col gap-2 mt-4 text-background/80">
              {places && places?.map((place: any, index: number) => (
                <Link href={place.href} key={index}>
                  {place?.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="w-fit">
            <div className="text-background/70 text-sm">Selskaper</div>
            <div className="flex flex-col gap-2 mt-4 text-background/80">
              {companies && companies?.map((company: any, index: number) => (
                <Link href={company.href} key={index}>
                  {company?.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-baseline  gap-5">
            <div className="w-fit">
              <div className="text-background/70 text-sm">Utforske</div>
              <div className="flex flex-col gap-2 mt-4 text-background/80">
                {exploreLinks && exploreLinks?.map((link: any, index: number) => (
                  <Link href={link.href} key={index}>
                    {link.text}
                  </Link>
                ))}
              </div>
              <div className="mt-[40px] max-md:hidden">
                <div className="text-background text-[16px] mb-[4px]">
                  {company},
                </div>
                <div className="text-background text-[16px]">
                  {location}
                </div>
              </div>
            </div>
          </div>
          <div className="w-fit max-md:col-span-2 md:hidden">
            <div>
              <div className="text-background text-[16px] mb-[4px]">
                {company},
              </div>
              <div className="text-background text-[16px]">
                {location}
              </div>
            </div>
          </div>
          <div className="w-fit">
            <div className="text-background flex items-end mt-[40px] md:hidden">
              {socialLinks && socialLinks?.map((link: any, index: number) => (
                <Link
                  key={index}
                  href={link.href}
                  target={link.newPage ? "_blank" : "_self"}
                  className="bg-background p-2 rounded-lg"
                >
                  {link.icon === 'facebook' && <FaFacebook className={socialMediaClasses} />}
                  {link.icon === 'instagram' && <FaInstagram className={socialMediaClasses} />}
                  {link.icon === 'linkedin' && <FaLinkedin className={socialMediaClasses} />}
                  {link.icon === 'youtube' && <FaYoutube className={socialMediaClasses} />}
                  {link.icon === 'twitter' && <FaTwitter className={socialMediaClasses} />}
                  {
                    !SOCIAL_MEDIA_LINKS.includes(link.icon) &&
                    <FaTwitter className="w-6 h-6 aspect-square" />
                  }
                </Link>
              ))}
            </div>
          </div>
          <div className="text-background justify-end flex w-fit fixed right-4 bottom-4 shadow-lg">
            <GoTop />
          </div>
        </div>
        <div className="flex sm:flex-nowrap flex-wrap sm:justify-between justify-start max-w-7xl m-auto lg:mt-6 sm:py-8 py-6 px-4">
          <div className="flex items-end w-fit text-sm text-background/80">
            {footerText && footerText?.map((text: any, index: number) => (
              <span key={index}>{text.text}</span>
            ))}
          </div>
          <div className="w-fit mt-2 sm:mt-0 text-sm text-background/80">
            {footerLinks && footerLinks?.map((link: any, index: number) => (
              <span key={index}>
                <Link href={link.href}>{link.text}</Link>
                {index < footerLinks.length - 1 && " | "}
              </span>
            ))}
          </div>
        </div>
      </footer>
      {/* <div className="h-[100px] md:hidden bg-footerbg"></div> */}
    </>
  );
};

export default Footer;
