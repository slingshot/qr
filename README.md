# QR Code Generator

A modern, client-side QR code generator with a glassmorphic UI. Generate QR codes for URLs, text, email, phone numbers, and Wi-Fi credentials — then export as PNG or SVG.

![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

## Features

- **Multiple data types** — URL, plain text, email, phone, Wi-Fi (SSID + password + encryption)
- **Customizable colors** — 8 preset foreground colors + custom color picker
- **Background options** — White or transparent
- **Error correction** — L / M / Q / H levels
- **Export** — Download as high-res PNG (1024x1024) or SVG, or copy SVG markup to clipboard
- **Privacy-first** — Everything runs client-side; no data leaves your browser

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint & format
bunx biome check --write .
```

## Deployment

Configured for one-click deploy on [Vercel](https://vercel.com). Push to `main` and it auto-deploys, or use:

```bash
bunx vercel
```

## Tech Stack

| Layer      | Choice                     |
| ---------- | -------------------------- |
| Framework  | React 19 + TypeScript      |
| Bundler    | Vite 8                     |
| Styling    | Tailwind CSS 4 + shadcn/ui |
| QR Engine  | qrcode                     |
| Icons      | Lucide React               |
| Linting    | Biome                      |

## License

MIT
