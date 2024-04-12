"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Bio(): JSX.Element {
	const [showCalendar, setShowCalendar] = useState(false);

	function toggleShowCalendar() {
		setShowCalendar(!showCalendar);
	}

	return (
		<main className="flex flex-col items-center justify-center w-full px-[20px] pt-16">
			<Head>
				<title>Bio</title>
			</Head>

			<header className="grid place-items-center mb-4">
				<Image
					className="relative pb-[20px]"
					src="/logo_transparente.svg"
					width={115}
					height={115}
					alt="aentidade logo"
				/>

				<span className="mt-3.5 text-[19px]">aentidade</span>

				<div className="flex mt-2 mb-2 opacity-80">
					<Image
						className="relative me-[2px]"
						src="/icons/pin.svg"
						height={14}
						width={14}
						alt="Ícone de pin"
					/>
					<span className="text-[14px]">Santo André, UFABC</span>
				</div>

				<div className="flex">
					<Link href="https://instagram.com/aentidade.ufabc/" className="p-2">
						<Image
							className="relative"
							src="/icons/instagram.svg"
							width={28}
							height={28}
							alt="Ícone do Instagram"
						/>
					</Link>
					<Link href="https://github.com/caiostoduto/aentidade" className="p-2">
						<Image
							className="relative"
							src="/icons/github.svg"
							width={28}
							height={28}
							alt="Ícone do GitHub"
						/>
					</Link>
				</div>
			</header>

			<section className="mt-4 grid place-items-center max-w-[560px] w-full text-center">
				<Link
					href="https://aentidade.pages.dev/participe"
					className="flex items-center mb-4 border-2 rounded-2xl w-full bg-gray-800/20"
				>
					<div className="m-[17.5px] w-full">
						{" "}
						{/* ms-[67px] = m-[17.5px] + left-[49.5] */}
						<span className="relative">
							{" "}
							{/* left-[-49.5px] = img_width-[32] + m-[17.5px] */}
							Faça Parte!
						</span>
					</div>
				</Link>

				<button
					type="button"
					className="items-center mb-4 border-2 rounded-2xl w-full bg-gray-800/20 overflow-hidden"
					onClick={toggleShowCalendar}
				>
					<div className="flex">
						<Image
							className="relative ms-[17.5px]"
							src="/icons/google_calendar.svg"
							width={32}
							height={32}
							alt="Ícone do Google Calendar"
						/>

						<div className="m-[17.5px] ms-[67px] w-full">
							{" "}
							{/* ms-[67px] = m-[17.5px] + left-[49.5] */}
							<span className="relative left-[-49.5px]">
								{" "}
								{/* left-[-49.5px] = img_width-[32] + m-[17.5px] */}
								Nosso Calendário
							</span>
						</div>
					</div>

					<div
						className="overflow-hidden transition-all duration-300 bg-[var(--secondary-rgb)]"
						style={{ height: showCalendar ? 300 : 0 }}
					>
						<iframe
							title="Google Calendário da aentidade"
							src={`https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FSao_Paulo&bgcolor=%23134337&showTitle=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&src=${process.env.NEXT_PUBLIC_CALENDAR}&color=%23039BE5`}
							height="300"
							className="w-full"
						/>
					</div>
				</button>

				<Link
					href="https://aentidade.pages.dev/comentário"
					className="flex items-center mb-4 border-2 rounded-2xl w-full bg-gray-800/20"
				>
					<Image
						className="relative ms-[17.5px]"
						src="/icons/typeform.svg"
						width={32}
						height={21.3}
						alt="Ícone do Google Forms"
					/>

					<div className="m-[17.5px] ms-[67px] w-full">
						{" "}
						{/* ms-[63px] = m-[17.5px] + left-[45.5] */}
						<span className="relative left-[-49.5px]">
							{" "}
							{/* left-[-45.5px] = img_width-[28] + m-[17.5px] + img_left-[4px]*/}
							Denúncias, Elogios e Sugestões
						</span>
					</div>
				</Link>

				<Link
					href="https://aentidade.pages.dev/normas"
					className="flex items-center mb-4 border-2 rounded-2xl w-full bg-gray-800/20"
				>
					<Image
						className="relative ms-[17.5px] left-1"
						src="/icons/google_docs.svg"
						width={28}
						height={59}
						alt="Ícone do Google Docs"
					/>

					<div className="m-[17.5px] ms-[67px] w-full">
						{" "}
						{/* ms-[63px] = m-[17.5px] + left-[45.5] */}
						<span className="relative left-[-49.5px]">
							{" "}
							{/* left-[-45.5px] = img_width-[28] + m-[17.5px] + img_left-[4px]*/}
							Normas aentidade
						</span>
					</div>
				</Link>
			</section>

			<section className="relative mt-6 max-w-[560px] w-full h-[500px] bg-[#282828] rounded-2xl overflow-hidden">
				<div className="static mt-[200px] z-10 w-full h-[300px] bg-[#242424]" />

				<iframe
					title="Spotify Playlist da aentidade"
					src="https://open.spotify.com/embed/playlist/4ONy8cyUkojEkYOWAHR0Fe?utm_source=generator&theme=0"
					className="absolute top-0 z-0 w-full"
					height={500}
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					loading="lazy"
				/>
			</section>

			<footer className="my-8 text-center opacity-80">
				<Link href="https://caios.pages.dev/" className="flex">
					<span>Feito pelo Caio Stoduto</span>
					<Image
						className="ps-1"
						src="/icons/heart.svg"
						width={25}
						height={25}
						alt="aentidade logo"
					/>
				</Link>

				<span>aentidade © 2024</span>
			</footer>
		</main>
	);
}
