/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SITE_TITLE?: string;
    readonly VITE_SITE_DESCRIPTION?: string;
    readonly VITE_SITE_URL?: string;
    readonly VITE_OG_IMAGE?: string;
    readonly VITE_OG_IMAGE_ALT?: string;
    readonly VITE_OG_IMAGE_WIDTH?: string;
    readonly VITE_OG_IMAGE_HEIGHT?: string;
    readonly VITE_OG_IMAGE_TYPE?: string;
    readonly VITE_SITE_NAME?: string;
    readonly VITE_TWITTER_HANDLE?: string;
    readonly VITE_TWITTER_IMAGE?: string;
    readonly VITE_THEME_COLOR?: string;
    readonly VITE_LOCALE?: string;
    readonly VITE_AUTHOR?: string;
    readonly VITE_KEYWORDS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
