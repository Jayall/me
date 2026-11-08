import notes from "../generated/notes.json";
import Link from "../Link";
import { labFormula } from "../portfolioData";
import MathBlock from "./MathBlock";
import Section from "./Section";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const NoteCard = ({ note }) => (
  <article className="note-card panel hud-corners">
    <div className="note-card-top">
      <h3 className="note-card-title">{note.title}</h3>
      {note.date && (
        <time className="note-card-date" dateTime={note.date}>
          {formatDate(note.date)}
        </time>
      )}
    </div>
    {note.overview && <p className="note-card-overview">{note.overview}</p>}
    <div className="note-card-foot">
      <div className="chips">
        {note.tags.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>
      <Link className="note-card-link" to={`/lab/${note.slug}`}>
        Read note →
      </Link>
    </div>
  </article>
);

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
    <div className="lab-notes">
      <div className="lab-notes-head">
        <h3 className="subheading">Notes</h3>
      </div>
      <div className="note-card-grid">
        {notes.map((note) => (
          <NoteCard key={note.slug} note={note} />
        ))}
      </div>
    </div>
  </Section>
);

export default LabNotes;
