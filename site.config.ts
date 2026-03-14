/**
 * Site configuration defaults for SEO and sharing meta tags.
 *
 * Each field can be overridden at deploy time via the corresponding
 * VITE_-prefixed environment variable. The Vite plugin injects these
 * into index.html at build time, and the client reads them at runtime.
 *
 * Environment variable mapping:
 *   title         → VITE_SITE_TITLE
 *   description   → VITE_SITE_DESCRIPTION
 *   url           → VITE_SITE_URL
 *   ogImage       → VITE_OG_IMAGE
 *   ogImageAlt    → VITE_OG_IMAGE_ALT
 *   ogImageWidth  → VITE_OG_IMAGE_WIDTH
 *   ogImageHeight → VITE_OG_IMAGE_HEIGHT
 *   ogImageType   → VITE_OG_IMAGE_TYPE
 *   siteName      → VITE_SITE_NAME
 *   twitterHandle → VITE_TWITTER_HANDLE
 *   twitterImage  → VITE_TWITTER_IMAGE
 *   themeColor    → VITE_THEME_COLOR
 *   locale        → VITE_LOCALE
 *   author        → VITE_AUTHOR
 *   keywords      → VITE_KEYWORDS
 */
export const siteConfig = {
    title: "Slingshot QR Code Generator",
    description:
        "Generate QR codes for URLs, text, email, phone numbers, and Wi-Fi credentials. Free, private, and open source.",
    url: "https://qr.slingshot.fm",
    ogImage: "https://slingshot.fm/cover.jpg",
    ogImageAlt:
        "Slingshot QR Code Generator — generate and export QR codes instantly.",
    ogImageWidth: "1200",
    ogImageHeight: "630",
    ogImageType: "image/jpeg",
    siteName: "Slingshot",
    twitterHandle: "@slingshot_fm",
    twitterImage: "https://slingshot.fm/cover-xl.jpg",
    themeColor: "#000000",
    locale: "en_US",
    author: "Slingshot",
    keywords:
        "qr code generator, qr code maker, free qr code, svg qr code, png qr code, wifi qr code, slingshot",
} as const;

/** Map from config key to env var name */
export const siteConfigEnvKeys: Record<keyof typeof siteConfig, string> = {
    title: "VITE_SITE_TITLE",
    description: "VITE_SITE_DESCRIPTION",
    url: "VITE_SITE_URL",
    ogImage: "VITE_OG_IMAGE",
    ogImageAlt: "VITE_OG_IMAGE_ALT",
    ogImageWidth: "VITE_OG_IMAGE_WIDTH",
    ogImageHeight: "VITE_OG_IMAGE_HEIGHT",
    ogImageType: "VITE_OG_IMAGE_TYPE",
    siteName: "VITE_SITE_NAME",
    twitterHandle: "VITE_TWITTER_HANDLE",
    twitterImage: "VITE_TWITTER_IMAGE",
    themeColor: "VITE_THEME_COLOR",
    locale: "VITE_LOCALE",
    author: "VITE_AUTHOR",
    keywords: "VITE_KEYWORDS",
};
