My Personal Website + URL Shortner using [Next.js](https://nextjs.org/), [Cloudflare Pages](https://pages.cloudflare.com/) & [KVNamespace](https://developers.cloudflare.com/kv/learning/kv-namespaces/)

## Features

- [x] URL Shortner
- [x] Configurable Redirects *(using Cloudflare KVNamespace)*
- [x] Configurable Default Redirect *(app/not-found.tsx)*
- [ ] *Homepage*

## Try it

- https://caios.pages.dev/ (Default Redirect to https://github.com/caiostoduto)
- https://caios.pages.dev/linkedin (Redirect to https://www.linkedin.com/in/caiostoduto/)

## Getting Started

1. Clone the repository
```bash
$ git clone git@github.com:caiostoduto/caios.pages.dev.git
$ cd caios.pages.dev
```

2. Install dependencies
```bash
$ pnpm install
```

3. [Create a new Cloudflare KVNamespace](https://developers.cloudflare.com/kv/get-started/#3-create-a-kv-namespace)
```bash
$ pnpm wrangler kv:namespace create REDIRECT
```

4. Deploy the worker
```bash
$ pnpx run pages:deploy
```

5. [Bind your KV namespace to your Pages Function](https://developers.cloudflare.com/pages/functions/bindings/#kv-namespaces)

6. Add your redirect routes to the KVNamespace *(suggest using [Cloudflare KVNamespace Dashboard](https://dash.cloudflare.com/))*\
**must include '/' (default) route**

![Image from Cloudflare Pages Dashboard setting kv routes](https://github.com/caiostoduto/caios.pages.dev/blob/main/docs/images/kv.jpeg)
