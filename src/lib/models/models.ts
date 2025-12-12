import { IUser } from "@/const/types";
import mongoose, { Model, Schema } from "mongoose";

// faq category schema
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// article category schema
const articleCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    originalSlug: { type: String, required: false },
  },
  { timestamps: true }
);

// article schema
const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    image: { type: String, required: true },
    excerpt: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "articleCategory",
      required: false,
    },
    showDate: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split("T")[0],
    },
    language: { type: String, required: true },
    originalSlug: { type: String },
  },
  { timestamps: true }
);

// faq schema
const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

// home page schema
const homepageSchema = new mongoose.Schema(
  {
    heroSection: {
      title: { type: String },
      subtitle: { type: String },
      backgroundImage: { type: String },
      buttonText: { type: String },
      ctaLink: { type: String },
    },
    howDoesItworks: {
      heading: { type: String },
    },
    howDoesItworksCards: [
      {
        title: { type: String },
        icon: { type: String },
        description: { type: String },
      },
    ],
    ourArticlesHeading: {
      heading: { type: String },
    },
    whyChooseMeglertipHeading: {
      heading: { type: String },
    },
    whyChooseMeglertipCards: [
      {
        title: { type: String },
        icon: { type: String },
        description: { type: String },
      },
    ],
    citySectionHeading: {
      title: { type: String },
      description: { type: String },
    },
    prosSection: [
      {
        title: { type: String },
        subHeading: { type: String },
        description: [{ type: String }],
        image: {
          type: String,
        },
        imagePosition: { type: String },
        buttonText: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// about  schema
const aboutSchema = new mongoose.Schema(
  {
    heading: { type: String, trim: true, required: true },
    subHeading: { type: String, trim: true, required: true },
    image: { type: String, trim: true, required: true },
    heading1: { type: String, trim: true, required: true },
    subHeading1: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

// partner schema
const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    preferences: { type: String },
    address: { type: String },
    city: { type: String },
    postalCodes: {
      exact: [
        {
          code: { type: String, required: true },
        },
      ],

      ranges: [
        {
          from: { type: String, required: true },
          to: { type: String, required: true },
        },
      ],
    },
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    leads: {
      lastMonth: { type: Number, default: 0 },
      currentMonth: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    leadType: {
      type: String
    },

    wishes: [
      {
        question: { type: String, required: true },
        expectedAnswer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// privacy policy schema
const privacyPolicySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// term of service schema
const termOfServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// form schema
const FieldSchema = new mongoose.Schema({
  label: { type: String, required: true, default: "" },
  name: { type: String, required: true, default: "" },
  type: { type: String, required: true, default: "text" },
  placeholder: { type: String, default: "" },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  visible: { type: Boolean, default: true },
});

const StepSchema = new mongoose.Schema({
  stepTitle: { type: String, required: true, default: "" },
  stepOrder: { type: Number, required: true, default: 1 },
  fields: { type: [FieldSchema], default: [] },
  visible: { type: Boolean, default: true },
});

const FormSchema = new mongoose.Schema(
  {
    formName: { type: String, required: true, default: "" },
    description: { type: String, default: "" },
    steps: { type: [StepSchema], default: [] },
    isActive: { type: Boolean, default: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "FormSelect" },
  },
  { timestamps: true }
);

const themeSchema = new mongoose.Schema(
  {
    primary: { type: String },
    primarylight: { type: String },
    secondary: { type: String },
    dark: { type: String },
    accent: { type: String },
    background: { type: String },
    cardbg: { type: String },
    navbarbg: { type: String },
    footerbg: { type: String },
    formsteps: { type: String },
  },
  { timestamps: true }
);

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    companyImage: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    description: {
      type: String,
    },
    extractor: {
      type: [String],
    },
    brokerSites: {
      type: [String],
    },
    websiteAddress: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    features: { type: [String] },
  },
  { timestamps: true }
);

// county
const countySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    excerpt: {
      type: String,
    },
  },
  { timestamps: true }
);

// Places need to delete
const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    countyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "County",
      required: true,
    },
    slug: { type: String, required: true },
    excerpt: { type: String },
    title: { type: String },
    description: { type: String },
    // image: { type: String, required: true },
    isRecommended: { type: Boolean, default: false },
    rank: { type: Number, default: 0 },
    companiesId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Company",
    },
    zipCode: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const websiteSettingsSchema = new mongoose.Schema(
  {
    theme: {
      primary: { type: String, required: true, trim: true },
      primarylight: { type: String, required: true, trim: true },
      secondary: { type: String, required: true, trim: true },
      dark: { type: String, required: true, trim: true },
      accent: { type: String, required: true, trim: true },
      background: { type: String, required: true, trim: true },
      cardbg: { type: String, required: true, trim: true },
      navbarbg: { type: String, required: true, trim: true },
      footerbg: { type: String, required: true, trim: true },
      formsteps: { type: String, required: true, trim: true },
    },
    logos: {
      logo: { type: String, required: true, trim: true },
      logoDark: { type: String, trim: true },
      wordmark: { type: String, required: true, trim: true },
      wordmarkDark: { type: String, trim: true },
      lettermark: { type: String, trim: true },
      tagline: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

const quoteSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    points: { type: [String] },
    button: { type: String },
  },
  { timestamps: true }
);

// partner form submission schema
const contactUsSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: false, trim: true },
    ip: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

const realEstateAgentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// footer page
const FooterSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      button: { type: String, required: true },
      buttonLink: { type: String, required: true },
    },

    articles: [
      {
        title: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    places: [
      {
        title: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    companies: [
      {
        title: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    exploreLinks: [
      {
        text: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    socialLinks: [
      {
        icon: { type: String, required: false },
        href: { type: String, required: true },
        newPage: { type: Boolean, default: false },
      },
    ],

    contactInfo: [
      {
        type: {
          type: String,
          enum: ["phone", "email", "location"],
          required: true,
        },
        value: { type: String, required: true },
        href: { type: String, required: true },
        newPage: { type: Boolean, default: false },
      },
    ],

    footerLinks: [
      {
        text: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const SitemapPageSchema = new mongoose.Schema({
  href: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const SitemapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Sitemap",
    },
    description: {
      type: String,
      required: true,
    },
    pages: {
      type: [SitemapPageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// collaborate partner schema
const CollaboratePartners = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    preferences: { type: String },
    address: { type: String },
    city: { type: String },
    postalCodes: {
      exact: [
        {
          code: { type: String },
        },
      ],

      ranges: [
        {
          from: { type: String, },
          to: { type: String, },
        },
      ],
    },
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    leads: {
      total: { type: Number, default: 0 },
    },
    leadTypes: [
      {
        typeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FormSelect",
          required: true,
        },

        price: { type: Number, required: true },
      },
    ],

    wishes: [
      {
        question: { type: String },
        expectedAnswer: { type: [String] },
      },
    ],
  },
  { timestamps: true }
);



const emailTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const smtpSchema = new mongoose.Schema(
  {
    host: { type: String, required: true },
    port: { type: Number, required: true },
    secure: { type: Boolean, default: false },
    user: { type: String, required: true },
    pass: { type: String, required: true },
    fromEmail: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const faqPageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
    metaImage: { type: String, trim: true, default: "" },
    canonicalUrl: { type: String, trim: true, default: "" },
    jsonLd: { type: String, default: "" },

    ogTitle: { type: String, trim: true, default: "" },
    ogDescription: { type: String, trim: true, default: "" },
    ogImage: { type: String, trim: true, default: "" },
    ogType: { type: String, trim: true, default: "website" },

    publishedDate: { type: Date },
    lastUpdatedDate: { type: Date },
    showPublishedDate: { type: Boolean, default: false },
    showLastUpdatedDate: { type: Boolean, default: false },

    robots: {
      noindex: { type: Boolean, default: false },
      nofollow: { type: Boolean, default: false },
      noarchive: { type: Boolean, default: false },
      nosnippet: { type: Boolean, default: false },
      noimageindex: { type: Boolean, default: false },
      notranslate: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const articlePageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    categoriesHeading: { type: String, default: "" },
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
    metaImage: { type: String, trim: true, default: "" },
    canonicalUrl: { type: String, trim: true, default: "" },
    jsonLd: { type: String, default: "" },

    ogTitle: { type: String, trim: true, default: "" },
    ogDescription: { type: String, trim: true, default: "" },
    ogImage: { type: String, trim: true, default: "" },
    ogType: { type: String, trim: true, default: "website" },

    publishedDate: { type: Date },
    lastUpdatedDate: { type: Date },
    showPublishedDate: { type: Boolean, default: false },
    showLastUpdatedDate: { type: Boolean, default: false },

    robots: {
      noindex: { type: Boolean, default: false },
      nofollow: { type: Boolean, default: false },
      noarchive: { type: Boolean, default: false },
      nosnippet: { type: Boolean, default: false },
      noimageindex: { type: Boolean, default: false },
      notranslate: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);


const counterSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

const userSchema = new Schema(
  {
    uniqueId: {
      type: Number,
      unique: true,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Complete", "Archive", "Reject"],
      default: "Pending",
      required: true,
    },
    profit: {
      type: Number,
      default: 0,
    },
    // leadTypes: [
    //   {
    //     // typeId: {
    //     //   type: mongoose.Schema.Types.ObjectId,
    //     //   ref: "LeadType",
    //     //   required: true,
    //     // },
    //     name: { type: String },
    //     price: { type: Number, required: true },
    //   },
    // ],
    partnerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "CollaboratePartners",
      },
    ],

    ip: {
      type: String,
      trim: true,
    },
    dynamicFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    log: {
      type: String,
      required: false
    },
    logSummary: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const counter = await Counter.findOneAndUpdate(
//       { model: "User" },
//       { $inc: { count: 1 } },
//       { new: true, upsert: true }
//     );

//     this.uniqueId = counter.count;
//   }
//   next();
// });


const FormSelectSchema = new mongoose.Schema(
  {
    // formId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "FormBuilder",
    // },
    formTitle: {
      type: String,
      required: true,
      trim: true,
    },
    formDescription: {
      type: String,
      default: "",
      trim: true,
    },
    formNumber: {
      type: Number,
      unique: true,

    },
    price: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);
FormSelectSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); // Only on create

  const lastForm = await mongoose.model("FormSelect").findOne().sort({ formNumber: -1 });

  this.formNumber = lastForm ? lastForm.formNumber + 1 : 1;

  next();
});



const formPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    // seo: {
    //   type: seoDataSchema,
    //   default: () => ({}),
    // },
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
    metaImage: { type: String, trim: true, default: "" },
    // categoriesHeading:{type: String, default:""},

    canonicalUrl: { type: String, trim: true, default: "" },
    jsonLd: { type: String, default: "" },

    ogTitle: { type: String, trim: true, default: "" },
    ogDescription: { type: String, trim: true, default: "" },
    ogImage: { type: String, trim: true, default: "" },
    ogType: { type: String, trim: true, default: "website" },

    publishedDate: { type: Date },
    lastUpdatedDate: { type: Date },
    showPublishedDate: { type: Boolean, default: false },
    showLastUpdatedDate: { type: Boolean, default: false },

    robots: {
      noindex: { type: Boolean, default: false },
      nofollow: { type: Boolean, default: false },
      noarchive: { type: Boolean, default: false },
      nosnippet: { type: Boolean, default: false },
      noimageindex: { type: Boolean, default: false },
      notranslate: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const partnerLimitSchema = new mongoose.Schema(
  {
    limit: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);


export const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);
export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export const ArticleCategory = mongoose.models.ArticleCategory || mongoose.model("ArticleCategory", articleCategorySchema);
export const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);
export const Faq = mongoose.models.Faq || mongoose.model("Faq", faqSchema);
export const Homepage = mongoose.models.Homepage || mongoose.model("Homepage", homepageSchema);
export const About = mongoose.models.About || mongoose.model("About", aboutSchema);
export const Partner = mongoose.models.Partner || mongoose.model("Partner", partnerSchema);
export const PrivacyPolicy = mongoose.models.PrivacyPolicy || mongoose.model("PrivacyPolicy", privacyPolicySchema);
export const TermOfService = mongoose.models.TermOfService || mongoose.model("TermOfService", termOfServiceSchema);
export const FormBuilder = mongoose.models.FormBuilder || mongoose.model("FormBuilder", FormSchema);
export const Theme = mongoose.models.Theme || mongoose.model("Theme", themeSchema);
export const Company = mongoose.models.Company || mongoose.model("Company", companySchema);
export const County = mongoose.models.County || mongoose.model("County", countySchema);
export const Places = mongoose.models.Places || mongoose.model("Places", placeSchema);
export const WebsiteSettings = mongoose.models.WebsiteSettings || mongoose.model("WebsiteSettings", websiteSettingsSchema);
export const Quote = mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
export const ContactUs = mongoose.models.ContactUs || mongoose.model("ContactUs", contactUsSchema);
export const RealEstateAgent = mongoose.models.RealEstateAgent || mongoose.model("RealEstateAgent", realEstateAgentSchema);
export const Footer = mongoose.models.Footer || mongoose.model("Footer", FooterSchema);
export const Sitemap = mongoose.models.Sitemap || mongoose.model("Sitemap", SitemapSchema);
export const CollaboratePartner = mongoose.models.CollaboratePartners || mongoose.model("CollaboratePartners", CollaboratePartners);
export const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", emailTemplateSchema);
export const SmtpConfig = mongoose.models.SmtpConfig || mongoose.model("SmtpConfig", smtpSchema);
export const FaqPage = mongoose.models.FaqPage || mongoose.model("FaqPage", faqPageSchema);
export const ArticlePage = mongoose.models.ArticlePage || mongoose.model("ArticlePage", articlePageSchema);
export const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
export const FormSelect = mongoose.models.FormSelect || mongoose.model("FormSelect", FormSelectSchema);
export const FormPage = mongoose.models.FormPage || mongoose.model("FormPage", FormSelectSchema);
export const PartnerLimit = mongoose.models.PartnerLimit || mongoose.model("PartnerLimit", partnerLimitSchema); 