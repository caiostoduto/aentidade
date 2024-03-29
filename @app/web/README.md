aentidade website + URL Shortner using [Next.js](https://nextjs.org/), [Cloudflare Pages](https://pages.cloudflare.com/) & [KVNamespace](https://developers.cloudflare.com/kv/learning/kv-namespaces/)

## Features

- [x] URL Shortener
- [x] Configurable Redirects *(using Cloudflare KVNamespace)*
- [x] Configurable Default Redirect *(app/not-found.tsx)*
- [x] (*Link in Bio*)[https://aentidade.pages.dev/bio]
- [ ] *Homepage*

## Try it

- https://aentidade.pages.dev/ (Default redirect > https://instagram.com/aentidade.ufabc/)
- https://aentidade.pages.dev/bio (Link in Bio)

## Getting Started

1. Clone the repository
```bash
$ git clone git@github.com:caiostoduto/aentidade.git
$ cd aentidade
```

2. Install dependencies
```bash
$ pnpm web install
```

3. [Create a new Cloudflare KVNamespace](https://developers.cloudflare.com/kv/get-started/#3-create-a-kv-namespace)
```bash
$ pnpm web wrangler kv:namespace create REDIRECT
```

4. Deploy the worker
```bash
$ pnpm web run pages:deploy
```

5. [Enable Node.js from the Cloudflare dashboard](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#enable-nodejs-from-the-cloudflare-dashboard)

6. [Add environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard)

| Name | Value |
|------|-------|
| NEXT_PUBLIC_CALENDAR | `google_calendar_id` |
| SENTRY_AUTH_TOKEN | `sentry_auth_token` |
| SENTRY_DNS | `sentry_dns` |

7. [Bind your KV namespace to your Pages Function](https://developers.cloudflare.com/pages/functions/bindings/#kv-namespaces) (Repeat step 4 after)

8. Add your redirect routes to the KVNamespace *(suggest using [Cloudflare KVNamespace Dashboard](https://dash.cloudflare.com/))*\
**must include '/' (default) route**

![Image from Cloudflare Pages Dashboard setting kv routes](https://github.com/caiostoduto/aentidade/blob/main/@app/web/docs/images/kv.jpeg)
