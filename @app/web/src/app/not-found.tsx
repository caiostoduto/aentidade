"use client";

import Head from "next/head";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { type ReactElement, type ReactNode, useEffect, useState } from "react";
import "../styles/not-found.css";

export default function NotFound(): ReactNode {
	const code = (usePathname() as string)?.slice(1);
	const [redirectURL, setRedirectURL] = useState<string | null>(null);
	const [isLoading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const url = await fetchRedirectURL(code);
			setRedirectURL(url);
			setLoading(false);
		})();
	}, [code]);

	if (isLoading) return LoadingScreen();
	if (redirectURL) window.location.replace(redirectURL);
}

function LoadingScreen(): ReactElement {
	return (
		<main className="flex flex-col items-center justify-center w-full h-screen">
			<Head>
				<title>Redirecting...</title>
			</Head>

			<Image
				className="grow fixed"
				src="/logo_transparente.svg"
				width={85}
				height={85}
				alt="Picture of the author"
			/>
		</main>
	);
}

interface FetchRedirectURLResponse {
	url?: string;
}

async function fetchRedirectURL(code: string): Promise<string | null> {
	const url = `/api/redirect?q=${code}`;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		return ((await response.json()) as FetchRedirectURLResponse).url ?? null;
	} catch (e) {
		return null;
	}
}
