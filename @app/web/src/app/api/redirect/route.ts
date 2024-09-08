// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<Response> {
	// In the edge runtime you can use Bindings that are available in your application
	// (for more details see:
	//    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
	//    - https://developers.cloudflare.com/pages/functions/bindings/
	// )

	// Get the query from the URL
	const url = new URL(request.url);
	let query = url.searchParams.get("q")?.toLocaleLowerCase();

	// If the query is empty, return the default redirect
	if (query === undefined || query === "") {
		query = "/"; // return new Response('Missing query', { status: 400 })
	}

	// Return the redirect URL
	return await returnKVResponse(query);
}

async function returnKVResponse(query: string): Promise<Response> {
	// Get the redirect URL from the KV namespace
	const kv = getRequestContext().env.REDIRECT;
	// Get the value from the KV namespace
	const value = await kv.get(query);

	// If the value is not null, return the redirect URL
	if (value !== null) {
		// Return the redirect URL
		return new Response(
			JSON.stringify({
				url: value,
				default: query === "/",
			}),
			{ status: 200 },
		);
	}

	// If the query is not the default redirect, return the default redirect
	if (query !== "/") {
		return await returnKVResponse("/");
	}

	// If query === "/" and the value is null, return a 404
	return new Response("Not found", { status: 404 });
}
