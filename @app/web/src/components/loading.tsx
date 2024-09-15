import "@/styles/loading.css";

export default function LoadingAnimation() {
	return (
		<div className="loading-wrapper animate-[spin_5s_linear_infinite]">
			<div className="circle-wrapper rotate-[70deg]">
				<div className="circle primary-color animate-[spin_2s_linear_infinite]" />
			</div>

			<div className="circle-wrapper rotate-[140deg]">
				<div className="circle primary-color animate-[spin_5s_linear_infinite]" />
			</div>

			<div className="circle-wrapper rotate-[0deg]">
				<div className="circle primary-color" />
			</div>

			<div className="circle-wrapper rotate-[0deg]">
				<div className="circle primary-color" />
			</div>

			<div className="circle-wrapper rotate-[0deg]">
				<div className="circle secondary-color" />
			</div>
		</div>
	);
}
