# Agent Guidelines

## Project

QR Code Generator — a client-side React + TypeScript app using Vite, Tailwind CSS 4, and shadcn/ui.

## Conventions

- **Language**: TypeScript only, no vanilla JS.
- **Runtime**: Bun for package management and scripts.
- **Styling**: Tailwind CSS utility classes. Custom glassmorphic classes live in `src/index.css`. shadcn/ui components in `src/components/ui/` — do not manually edit those.
- **Linting**: Biome with 4-space indentation, double quotes, semicolons. Run `bunx biome check --write .` before committing.
- **Commits**: Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.).
- **No server-side logic**: All QR generation is client-side. Do not add API routes or server dependencies.

## Structure

```
src/
  components/
    ui/          # shadcn/ui primitives (auto-generated, don't edit)
    qr-generator.tsx  # Main QR generator component
  lib/
    utils.ts     # cn() utility
  App.tsx        # App root
  main.tsx       # Entry point
  index.css      # Tailwind imports + glassmorphic styles
```

## Key Decisions

- QR codes are rendered via the `qrcode` npm package (canvas for display, SVG string for export).
- PNG exports re-render at 1024×1024 for high resolution.
- The transparent background option uses `#00000000` as the QR light color and shows a checkerboard pattern in the preview.
