# 🌐 aentidade

A Bun monorepo powering [aentidade.pages.dev](https://aentidade.pages.dev) — a URL shortener deployed on **Cloudflare Pages** and a **CLI tool** for batch-generating digitally signed PDF certificates.

---

## 📦 Packages

| Package | Description |
|---------|-------------|
| [`@aentidade/web`](@app/web) | Next.js website with URL shortening and a link-in-bio page, deployed on Cloudflare Pages |
| [`@aentidade/cli`](@app/cli) | CLI tool to bulk-generate digitally signed PDF certificates from an SVG template and a CSV sheet |

---

## 🏗️ Architecture

```
aentidade/
├── @app/
│   ├── web/                  # Next.js app (Cloudflare Pages)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/redirect/  # KV-backed redirect API
│   │   │   │   └── not-found.tsx  # Client-side redirect handler
│   │   │   └── components/
│   │   └── wrangler.toml          # Cloudflare Pages config (KV binding)
│   └── cli/                  # Certificate generation CLI
│       ├── src/
│       │   ├── index.ts           # CLI entry point (aen)
│       │   └── commands/
│       │       └── parse.ts       # parse command implementation
│       └── resources/fonts/       # Bundled Inter font
├── package.json              # Workspace root
└── biome.json                # Shared linter/formatter config
```

---

## 🌍 Web — URL Shortener

The website is built with **Next.js 14**, deployed to **Cloudflare Pages** via `@cloudflare/next-on-pages`.

Redirect routes are stored in a **Cloudflare KV Namespace** (`REDIRECT`). When a user visits an unknown path (e.g. `aentidade.pages.dev/ig`), the `not-found` page fires a client-side lookup to `/api/redirect?q=ig` and immediately redirects if a match is found. The `/` route is the default fallback redirect.

### Features

- [x] URL shortener backed by Cloudflare KV
- [x] Configurable per-route redirects
- [x] Configurable default redirect (the `/` key)
- [x] [Link in bio](https://aentidade.pages.dev/bio) page
- [ ] Homepage

### Try it

- [`aentidade.pages.dev/`](https://aentidade.pages.dev/) → default redirect
- [`aentidade.pages.dev/bio`](https://aentidade.pages.dev/bio) → link in bio

---

## 🖨️ CLI — Certificate Generator

The `aen parse` command generates **digitally signed PDF certificates** in bulk from an SVG template (e.g. designed in Figma) and a CSV data sheet.

### How it works

1. Reads an **SVG template** and replaces `{{column_name}}` placeholders with data from each CSV row.
2. Renders the populated SVG into a **PDF** using PDFKit + svg-to-pdfkit.
3. **Signs** each PDF with a provided `.p12` certificate using `@signpdf`.
4. Writes one signed `.pdf` per row to the specified output folder.

### Usage

```bash
aen parse \
  --template path/to/template.svg \
  --csv      path/to/data.csv \
  --output   path/to/output/ \
  --p12      path/to/signer.p12 \
  --password <p12-password>      # optional
```

| Flag | Description |
|------|-------------|
| `-t, --template <path>` | Path to the SVG template |
| `-c, --csv <path>` | Path to the CSV data sheet |
| `-o, --output <path>` | Path to the output folder |
| `--p12 <path>` | Path to the `.p12` signing certificate |
| `-p, --password <string>` | Password for the `.p12` file *(optional)* |

**SVG template conventions:** column headers from the CSV become `{{placeholders}}` in the SVG. The third CSV column (`record[2]`) is used as the output filename.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.1
- A [Cloudflare account](https://cloudflare.com) (for the web app)

### Install dependencies

```bash
git clone https://github.com/caiostoduto/aentidade.git
cd aentidade
bun install
```

### Run the web app locally

```bash
bun web dev
```

### Run the CLI

```bash
bun cli src/index.ts parse --help
```

---

## ☁️ Deploying the Web App

1. **Create a KV Namespace**
   ```bash
   bun web wrangler kv:namespace create REDIRECT
   ```
   Update the `id` in [`@app/web/wrangler.toml`](@app/web/wrangler.toml) with the returned ID.

2. **Deploy to Cloudflare Pages**
   ```bash
   bun web run pages:deploy
   ```

3. **Enable Node.js compatibility** in the [Cloudflare dashboard](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#enable-nodejs-from-the-cloudflare-dashboard).

4. **Add environment variables** via the dashboard:

   | Name | Value |
   |------|-------|
   | `SENTRY_DSN` | Your Sentry DSN |

5. **Bind the KV namespace** to your Pages Function via the dashboard, then redeploy (step 2).

6. **Add redirect routes** to the KV namespace using the [Cloudflare dashboard](https://dash.cloudflare.com/). The key is the short code (use `/` for the default redirect) and the value is the destination URL.

---

## 🛠️ Tech Stack

### Web
- [Next.js 14](https://nextjs.org/) — React framework
- [Cloudflare Pages](https://pages.cloudflare.com/) — hosting & edge runtime
- [Cloudflare KV](https://developers.cloudflare.com/kv/) — redirect storage
- [Sentry](https://sentry.io/) — error monitoring
- [Tailwind CSS](https://tailwindcss.com/) — styling

### CLI
- [Bun](https://bun.sh/) — runtime & toolchain
- [Commander.js](https://github.com/tj/commander.js/) — CLI framework
- [PDFKit](https://pdfkit.org/) + [svg-to-pdfkit](https://github.com/alafr/SVG-to-PDFKit) — PDF generation
- [@signpdf](https://github.com/vbuch/node-signpdf) — digital signing
- [csv-parse](https://csv.js.org/parse/) — CSV parsing

### Shared
- [Biome](https://biomejs.dev/) — linter & formatter

---

## 📄 License

[MIT](LICENSE) © [caiostoduto](https://github.com/caiostoduto)
