import { education, languages } from "../portfolioData";
import Section from "./Section";

const Education = () => (
	<Section
		id="education"
		command="cat ./education.log"
		title="Education & languages"
	>
		<div className="edu-grid">
			<article className="edu-card panel hud-corners">
				<h3 className="subheading">Education</h3>
				{education.map((item) => (
					<div key={item.title} className="edu-item">
						<p className="edu-period">{item.period}</p>
						<p className="edu-title">{item.title}</p>
						<p className="edu-school">{item.school}</p>
					</div>
				))}
			</article>
			<article className="edu-card panel hud-corners">
				<h3 className="subheading">Languages</h3>
				<dl className="lang-list">
					{languages.map((language) => (
						<div key={language.name} className="lang-row">
							<dt>{language.name}</dt>
							<dd>{language.level}</dd>
						</div>
					))}
				</dl>
			</article>
		</div>
	</Section>
);

export default Education;
