import Reveal from "./Reveal";

const Section = ({ id, command, title, children, className = "" }) => (
	<section
		id={id}
		className={`section ${className}`.trim()}
		aria-labelledby={`${id}-title`}
	>
		<Reveal>
			<div className="section-heading">
				<p className="section-command">
					<span aria-hidden="true">$</span> {command}
				</p>
				<h2 id={`${id}-title`}>{title}</h2>
			</div>
			{children}
		</Reveal>
	</section>
);

export default Section;
