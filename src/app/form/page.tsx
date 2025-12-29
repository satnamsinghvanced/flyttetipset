import { getCachedFormSelect } from "@/services/form/form-select-service";
import { getCachedFormData } from "@/services/form/form-service";
import { generatePageMetadata } from "@/utils/metadata";
import Form from "./form";
export const dynamic = "force-static";

async function getFormData() {
  const doc: any = await getCachedFormData();
  return await JSON.parse(JSON.stringify(doc));
}

export async function generateMetadata() {
  const formData = await getFormData();
  if (!formData) {
    return generatePageMetadata({
      title: "Get in touch | Meglertipset.no",
      description: "Fill out the form to get in touch with real estate agents",
      path: "/form",
    });
  }
  const {
    metaTitle,
    metaDescription,
    metaKeywords,
    metaImage,
    ogTitle,
    ogDescription,
    canonicalUrl,
    robots,
    jsonLd,
    publishedDate,
    lastUpdatedDate,
    subHeading,
    heading,
    ogImage,
    ogType,
    image,
    slug,
  } = formData;

  return generatePageMetadata({
    title: metaTitle || heading || "Form Page",
    description:
      metaDescription || subHeading || "Fill out the form to get in touch",
    path: slug || "/form",
    keywords: metaKeywords
      ? metaKeywords
        .split(",")
        ?.map((k: string) => k.trim())
        .filter(Boolean)
      : ["form", "contact", "get in touch"],
    type: ogType || "website",
    image: metaImage || ogImage || image || null,
    ogTitle: ogTitle || metaTitle || heading || "Form Page",
    ogDescription:
      ogDescription ||
      metaDescription ||
      subHeading ||
      "Fill out the form to get in touch",
    canonicalUrl: canonicalUrl || "/form",
    robots: robots || "index, follow",
    jsonLd: jsonLd || {},
    publishedDate: publishedDate || "2025-11-28T00:00:00Z",
    lastUpdatedDate: lastUpdatedDate || "2025-11-28T00:00:00Z",
  });
}

const FormPage = async () => {
  const formPageData = await getFormData();
  const doc: any = await getCachedFormSelect();
  const formSelect = await JSON.parse(JSON.stringify(doc));

  return (
    <>
      {/* <Form formSelect={formSelect} /> */}
      <Form
        formSelect={formSelect}
        isMultiSelect={formPageData?.multipleSelect}
        pageTitle={formPageData?.title}
        pageDescription={formPageData.description}
        privacyText={formPageData.privacyText}
      />
    </>
  );
};

export default FormPage;
