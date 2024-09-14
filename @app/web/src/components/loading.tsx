export default function LoadingAnimation() {
	return (
		<div
			className="w-[30dvh] h-[31.2dvh] animate-spin"
			style={{ animation: "spin 5s linear infinite" }}
		>
			<div className="absolute w-[30dvh] h-[31.2dvh] rotate-[70deg]">
				<div
					className="w-full h-full rounded-full border-[rgba(245,210,720.7)] border-solid border-r-0 border-t-0 border-l-[0.5dvh] border-b-[5px] shadow-[inset_0_0_10px_rgba(245,210,72,0.15)]"
					style={{ animation: "spin 2s linear infinite" }}
				/>
			</div>

			<div className="absolute w-[30dvh] h-[31.2dvh] rotate-[140deg]">
				<div
					className="w-full h-full rounded-full border-[rgba(245,210,72,0.7)] border-solid border-r-0 border-t-0 border-l-[0.5dvh] border-b-[5px] shadow-[inset_0_0_10px_rgba(245,210,72,0.15)]"
					style={{ animation: "spin 2s linear infinite" }}
				/>
			</div>

			<div className="absolute w-[30dvh] h-[31.2dvh] rotate-[0deg]">
				<div className="w-full h-full rounded-full border-[rgba(245,210,72,0.7)] border-solid border-r-0 border-t-0 border-l-[0.5dvh] border-b-[5px] shadow-[inset_0_0_10px_rgba(245,210,72,0.15)]" />
			</div>

			<div className="absolute w-[30dvh] h-[31.2dvh] rotate-[0deg]">
				<div className="w-full h-full rounded-full border-[rgba(245,210,72,0.7)] border-solid border-r-0 border-t-0 border-l-[0.5dvh] border-b-[5px] shadow-[inset_0_0_10px_rgba(245,210,72,0.15)]" />
			</div>

			<div className="absolute w-[30dvh] h-[31.2dvh] rotate-[0deg]">
				<div className="w-full h-full rounded-full border-[rgba(255,255,255,0.7)] border-solid border-r-0 border-t-0 border-l-[0.5dvh] border-b-[5px] shadow-[inset_0_0_10px_rgba(255,255,255,0.15)]" />
			</div>
		</div>
	);
}
