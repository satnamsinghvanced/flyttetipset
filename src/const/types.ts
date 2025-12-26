import mongoose from "mongoose";
import { ReactNode } from "react";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant =
  | "solid"
  | "bordered"
  | "light"
  | "flat"
  | "faded"
  | "shadow"
  | "ghost";
export type ButtonColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";
export type SpinnerPlacement = "start" | "end";
export type ButtonType =
  | "custom"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type LabelPlacement = "inside" | "outside" | "outside-left";

export type HowItWorksCardType = {
  icon: string;
  heading?: string;
  description: string;
  title?: string;
};

export interface PointItem {
  id: number;
  text: string;
  icon?: React.ReactNode;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface FAQSectionProps {
  title: string;
  faqs: FAQItem[];
  backgroundColor?: string;
  titleColor?: string;
  questionBgColor?: string;
  questionTextColor?: string;
  chevronColor?: string;
  answerBgColor?: string;
  answerTextColor?: string;
  className?: string;
}

export interface AboutContentProps {
  content: {
    image: string;
    content: {
      title: string;
      descriptions: string;
    }[];
  };
}

export interface Articles {
  title: string;
  id?: string | number;
  image?: string;
  showDate?: string;
  href?: string;
  slug?: string;
  categoryId?: any;
}

export interface ArticlesProps {
  category?: string;
  heading?: string;
  categoriesHeading?: string;
  tabs?: any;
  defaultTab?: string;
  isVertical?: boolean;
  gridColumns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
  data?: any;
}

export interface ArticlesListProps {
  category?: string;
  initialData?: any;
  currentPage?: number;
  articlesPerPage?: number;
}

export interface ArticleProps {
  slugValue?: string;
}

export interface SlugContentProps {
  slug?: string;
  county?: any;
  searchParams?: any;
}

export interface SlugPageProps {
  params: {
    slug?: string;
    articleSlug?: string;
    category?: string;
  };
}

export interface Faq {
  _id?: string;
  question: string;
  answer: string;
}

export interface AllFaqCategory {
  title: string;
  faqData: Faq[];
}

export interface LatestInsightsCardProps {
  image: string;
  date: string;
  title: string;
  href?: string;
  role?: string;
}

export interface FeatureChipProps {
  label?: string;
}

export interface ContactField {
  _id: string;
  label: string;
  placeholder: string;
  name: string;
  type: "text" | "email" | "tel" | "number" | "textarea";
  required: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  _id?: string;
  heading?: string;
  subHeading?: string;
  contactFormTitle?: string;
  contactFields?: ContactField[];
  buttonText?: string;
  formText?: string;
  title?: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface FormValues {
  [key: string]: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseContactFormProps {
  fields: ContactField[];
  onSubmit: (data: FormValues) => void;
}

export interface NotFoundPageProps {
  hideNavFooter?: boolean;
}

export interface ContactFormProps {
  data: ContactFormData;
  onSubmit?: (formData: Record<string, string>) => Promise<void> | void;
}

export interface ContactFormBody {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  ip?: string;
}
export interface IEmailResult {
  partnerId: mongoose.Types.ObjectId;
  email: string;
  status: "sent" | "failed" | "pending";
  sentAt?: Date;
  error?: string;
}

export interface IUser extends Document {
  status: "Pending" | "Complete" | "Archive";
  profit: number;
  ip: string;
  partnerIds: mongoose.Types.ObjectId[];
  dynamicFields: Map<string, any>;
  emailResults?: IEmailResult[];
  createdAt: Date;
  updatedAt: Date;
  uniqueId: number;
}

export interface CompanyPaginationProps {
  com_current_page: number;
  com_total_pages: number;
  com_total_items?: number;
  com_items_per_page?: number;
}

export interface ArticlePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface ArticleContentProps {
  title?: string;
  categoriesHeading?: string;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface ArticleCategoryPageProps extends SlugPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface HowItWorksProps {
  cards: any;
  flex?: boolean;
  title?: string;
  data?: any;
  titleClass?: string;
  howItWorks?: boolean;
}

export interface LogoProps {
  logo?: string;
  logoText?: string;
}

export interface NavbarProps extends LogoProps {
  title?: string;
}

export interface FooterProps extends LogoProps {
  title?: string;
}

export interface ArticlesCardProps {
  image: string;
  date: string;
  title: string;
  href?: string;
  readMoreText?: string;
}

export interface BreadcrumbsProps {
  className?: string;
}

export type DescriptionProps = {
  description: string;
};

export type HeadingProps = {
  heading: string;
  className?: string;
};

export interface RedirectButtonProps {
  text?: any;
  redirect?: string;
  className?: string;
  isIconOnly?: boolean;
  disableAnimation?: boolean;
}

export interface County {
  _id: string;
  slug: string;
  name: string;
}

export interface City {
  slug: string;
  name: string;
}

export interface RegionSelectorProps {
  countyData: County[];
  cityData: City[];
  selectedCountySlug: string;
}

export type ArticleCardProps = {
  icon?: any;
  heading?: string;
  description?: string;
  href?: string;
};

export interface GuidesCardProps {
  city: string;
  description: string;
  href?: string;
  icon?: string;
}

export type HowItWorksCardProps = {
  icon: ReactNode | string;
  heading: string;
  description: string;
  flex?: boolean;
};

export interface FormSelectItem {
  _id: string;
  formTitle: string;
}

export interface FormSelectButtonsProps {
  forms: FormSelectItem[];
  selectedFormId?: string | null;
  loading?: boolean;
  isInvalid?: boolean;
  touched?: boolean;
  onSelect: (formId: string) => void;
}

export interface EiendomsmeglerPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
