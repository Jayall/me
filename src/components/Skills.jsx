import { skillGroups } from "../portfolioData";
import Section from "./Section";

const Skills = () => (
	<Section id="skills" command="cat ./skills.json" title="Skills">
		<div className="skill-grid">
			{skillGroups.map((group) => (
				<article
					key={group.title}
					className={`skill-group panel hud-corners${
						group.featured ? " is-featured" : ""
					}`}
				>
					<h3>{group.title}</h3>
					<div className="chips">
						{group.skills.map((skill) => (
							<span key={skill} className="chip">
								{skill}
							</span>
						))}
					</div>
					{group.link && (
						<a className="skill-link" href={group.link.href}>
							{group.link.label} ↗
						</a>
					)}
				</article>
			))}
		</div>
	</Section>
);

export default Skills;
