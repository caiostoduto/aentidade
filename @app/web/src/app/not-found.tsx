"use client";

import { usePathname } from "next/navigation";
import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import LoadingAnimation from "@/components/loading";

export default function NotFound(): ReactNode {
	const code = usePathname().slice(1);

	useEffect(() => {
		fetchRedirectURL(code).then((url) =>
			url ? window.location.replace(url) : undefined,
		);
	}, [code]);

	return LoadingScreen();
}

function LoadingScreen(): ReactElement {
	return (
		<div className="flex flex-col items-center justify-center w-full h-dvh">
			<title>Redirecionando...</title>

			<main>
				<LoadingAnimation />
			</main>
		</div>
	);
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

interface FetchRedirectURLResponse {
	url?: string;
}
