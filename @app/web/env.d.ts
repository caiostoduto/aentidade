declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Add here the Cloudflare Bindings you want to have available in your application
      // (for more details on Bindings see: https://developers.cloudflare.com/pages/functions/bindings/)
      //
      // KV Example:
      // MY_KV: KVNamespace
      REDIRECT: KVNamespace
      NEXT_PUBLIC_CALENDAR: string | undefined
      SENTRY_DNS: string | undefined
    }
  }
}

export type { }
