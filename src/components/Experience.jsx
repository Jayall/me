import { experience } from "../portfolioData";
import Section from "./Section";

const Experience = () => (
	<Section id="experience" command="tail -f experience.log" title="Experience">
		<div className="exp-list">
			{experience.map((job) => (
				<article
					key={`${job.company}-${job.period}`}
					className="exp-card panel hud-corners"
				>
					<div className="exp-meta">
						<p className="exp-period">{job.period}</p>
						<p className="exp-company">{job.company}</p>
					</div>
					<div className="exp-body">
						<h3 className="exp-role">{job.role}</h3>
						<ul>
							{job.bullets.map((bullet) => (
								<li key={bullet}>{bullet}</li>
							))}
						</ul>
						<div className="tag-list">
							{job.tags.map((tag) => (
								<span key={tag} className="tag">
									{tag}
								</span>
							))}
						</div>
					</div>
				</article>
			))}
		</div>
	</Section>
);

export default Experience;
