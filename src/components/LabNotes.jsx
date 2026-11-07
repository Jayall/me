import { labFormula } from "../portfolioData";
import MathBlock from "./MathBlock";
import Section from "./Section";

const LabNotes = () => (
  <Section id="lab" command="ls ./lab" title="Lab / Notes">
    <div className="lab-grid">
      {/* <article className="lab-card panel hud-corners">
				<h3 className="subheading">Selected problems / write-ups</h3>
				<p className="lab-empty">
					No write-ups published yet. This space is reserved for notes
					on number theory, combinatorics, systems security, and
					embedded systems.
				</p>
				<div className="chips">
					{labTopics.map((topic) => (
						<span key={topic} className="chip">
							{topic}
						</span>
					))}
				</div>
			</article> */}
      <article className="lab-card panel hud-corners">
        <h3 className="subheading">{labFormula.title}</h3>
        <p className="terminal-command">
          <span className="prompt">$</span> cat fav_formula.md
        </p>
        <MathBlock tex={labFormula.tex} label="My fav formula" />
      </article>
    </div>
  </Section>
);

export default LabNotes;
