import type { Metadata } from "next";

export const SITE_URL = "https://www.luahpartners.com";
export const SITE_NAME = "Luah Partners";
export const LEGAL_NAME = "Luah Partners, Inc.";
export const SITE_TAGLINE = "Every Home, a Blessing.";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_ALT =
  "Luah Partners — Residential Real Estate, Property Management, and Home Improvement in Washington, DC and Maryland";

export const BUSINESS_CONTACT = {
  telephone: "+1-800-800-2911",
  telephoneDisplay: "800 800 2911",
  faxNumber: "+1-202-803-6801",
  email: "Info@luahpartners.com",
  streetAddress: "818 18th St NW, Suite 810 - 1323",
  addressLocality: "Washington",
  addressRegion: "DC",
  postalCode: "20006",
  addressCountry: "US",
} as const;

export const DEFAULT_TITLE =
  "Residential Property Management Washington DC, Maryland | Luah Partners";
export const DEFAULT_DESCRIPTION =
  "Building and stewarding homes in the capital region. Residential property management, acquisition, leasing, and home improvement across Washington, DC and Maryland.";

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const canonicalUrl = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/twitter-image"],
    },
  };
}

export function createOrganizationGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        slogan: SITE_TAGLINE,
        description: DEFAULT_DESCRIPTION,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/luah-about-mark.jpg`,
          width: 341,
          height: 308,
        },
        image: `${SITE_URL}/images/hero_image.png`,
        telephone: BUSINESS_CONTACT.telephone,
        faxNumber: BUSINESS_CONTACT.faxNumber,
        email: BUSINESS_CONTACT.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS_CONTACT.streetAddress,
          addressLocality: BUSINESS_CONTACT.addressLocality,
          addressRegion: BUSINESS_CONTACT.addressRegion,
          postalCode: BUSINESS_CONTACT.postalCode,
          addressCountry: BUSINESS_CONTACT.addressCountry,
        },
        areaServed: [
          { "@type": "City", name: "Washington, DC" },
          { "@type": "State", name: "Maryland" },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "10:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "10:00",
            closes: "15:00",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en-US",
      },
    ],
  };
}

export function createBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}
