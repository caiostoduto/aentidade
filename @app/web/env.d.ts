declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SENTRY_DNS: string | undefined;
		}
	}
}

interface CloudflareEnv {
	REDIRECT: KVNamespace;
}
