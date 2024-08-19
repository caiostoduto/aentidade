declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_CALENDAR: string | undefined;
			SENTRY_DNS: string | undefined;
		}
	}
}

interface CloudflareEnv {
	REDIRECT: KVNamespace;
}
