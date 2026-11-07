import { interests } from "../portfolioData";
import Section from "./Section";

const Interests = () => (
	<Section id="interests" command="cat ./interests.txt" title="Interests">
		<div className="interest-grid">
			{interests.map((interest) => (
				<article
					key={interest.title}
					id={interest.id === "mathematics" ? "mathematics" : undefined}
					className={`interest-card panel hud-corners${
						interest.id === "mathematics" ? " is-featured" : ""
					}`}
				>
					<h3>{interest.title}</h3>
					<p>{interest.body}</p>
					{interest.links && (
						<div className="interest-links">
							{interest.links.map((link) => (
								<a key={link.href} href={link.href}>
									{link.label} ↗
								</a>
							))}
						</div>
					)}
				</article>
			))}
		</div>
	</Section>
);

export default Interests;
