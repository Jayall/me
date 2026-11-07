import { useEffect, useRef, useState } from "react";

const Reveal = ({ as: Tag = "div", className = "", delay = 0, children }) => {
	const ref = useRef(null);
	const [visible, setVisible] = useState(() => {
		if (typeof IntersectionObserver === "undefined") return true;
		if (typeof window === "undefined") return false;
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	});

	useEffect(() => {
		if (visible) return;

		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [visible]);

	return (
		<Tag
			ref={ref}
			className={`reveal${visible ? " is-visible" : ""} ${className}`.trim()}
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
		>
			{children}
		</Tag>
	);
};

export default Reveal;
