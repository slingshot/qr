import path from "path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig, siteConfigEnvKeys } from "./site.config";

function resolveConfig() {
    const resolved: Record<string, string> = {};
    for (const [key, envKey] of Object.entries(siteConfigEnvKeys)) {
        resolved[key] =
            process.env[envKey] ??
            siteConfig[key as keyof typeof siteConfig];
    }
    return resolved;
}

function seoPlugin(): Plugin {
    return {
        name: "inject-seo-meta",
        transformIndexHtml(html) {
            const c = resolveConfig();
            const tags = [
                `<meta name="description" content="${c.description}" />`,
                `<meta name="keywords" content="${c.keywords}" />`,
                `<meta name="author" content="${c.author}" />`,
                `<meta name="theme-color" content="${c.themeColor}" />`,
                `<meta name="robots" content="index, follow" />`,
                `<link rel="canonical" href="${c.url}" />`,

                `<meta property="og:type" content="website" />`,
                `<meta property="og:url" content="${c.url}" />`,
                `<meta property="og:title" content="${c.title}" />`,
                `<meta property="og:description" content="${c.description}" />`,
                `<meta property="og:image" content="${c.ogImage}" />`,
                `<meta property="og:image:type" content="${c.ogImageType}" />`,
                `<meta property="og:image:width" content="${c.ogImageWidth}" />`,
                `<meta property="og:image:height" content="${c.ogImageHeight}" />`,
                `<meta property="og:image:alt" content="${c.ogImageAlt}" />`,
                `<meta property="og:site_name" content="${c.siteName}" />`,
                `<meta property="og:locale" content="${c.locale}" />`,

                `<meta name="twitter:card" content="summary_large_image" />`,
                `<meta name="twitter:site" content="${c.twitterHandle}" />`,
                `<meta name="twitter:creator" content="${c.twitterHandle}" />`,
                `<meta name="twitter:url" content="${c.url}" />`,
                `<meta name="twitter:title" content="${c.title}" />`,
                `<meta name="twitter:description" content="${c.description}" />`,
                `<meta name="twitter:image" content="${c.twitterImage}" />`,
            ];

            return html
                .replace("<title>", `${tags.join("\n    ")}\n    <title>`)
                .replace(
                    /<title>.*?<\/title>/,
                    `<title>${c.title}</title>`,
                );
        },
    };
}

export default defineConfig({
    plugins: [react(), tailwindcss(), seoPlugin()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
