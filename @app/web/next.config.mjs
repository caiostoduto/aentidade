import { setupDevBindings } from '@cloudflare/next-on-pages/next-dev'

/** @type {import('next').NextConfig} */
const nextConfig = {}

// we only need to use the function during development so Cloudflare can check `NODE_ENV`
// (note: this check is recommended but completely optional)
if (process.env.NODE_ENV === 'development') {
  // call the function with the bindings you want to have access to
  await setupDevBindings({
    bindings: {
      REDIRECT: {
        type: "kv",
        id: "REDIRECT",
      },
    },
  })
}

export default nextConfig