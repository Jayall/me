import { useEffect, useRef, useState } from "react";

const MathBlock = ({ tex, label }) => {
	const ref = useRef(null);
	const [started, setStarted] = useState(
		() => typeof IntersectionObserver === "undefined",
	);
	const [html, setHtml] = useState("");
	const [error, setError] = useState(false);

	useEffect(() => {
		if (started) return;

		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setStarted(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "320px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [started]);

	useEffect(() => {
		if (!started) return;

		let active = true;

		Promise.all([import("katex"), import("katex/dist/katex.min.css")])
			.then(([module]) => {
				if (!active) return;
				const katex = module.default;
				setHtml(
					katex.renderToString(tex, {
						displayMode: true,
						throwOnError: false,
					}),
				);
			})
			.catch(() => {
				if (active) setError(true);
			});

		return () => {
			active = false;
		};
	}, [started, tex]);

	return (
		<figure
			ref={ref}
			className="math-block"
			aria-label={label || "Mathematical formula"}
		>
			{error ? (
				<p className="math-status">[formula unavailable]</p>
			) : html ? (
				<div dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<p className="math-status">[formula loads when in view]</p>
			)}
		</figure>
	);
};

export default MathBlock;
