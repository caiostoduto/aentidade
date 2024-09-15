import "../styles/loading.css";

export default function LoadingAnimation() {
	return (
		<div className="loading-container animate-[spin_5s_linear_infinite]">
			<div className="circle-container rotate-[70deg]">
				<div className="circle primary-color animate-[spin_2s_linear_infinite]" />
			</div>

			<div className="circle-container rotate-[140deg]">
				<div className="circle primary-color animate-[spin_5s_linear_infinite]" />
			</div>

			<div className="circle-container rotate-[0deg]">
				<div className="circle primary-color" />
			</div>

			<div className="circle-container rotate-[0deg]">
				<div className="circle primary-color" />
			</div>

			<div className="circle-container rotate-[0deg]">
				<div className="circle secondary-color" />
			</div>
		</div>
	);
}
