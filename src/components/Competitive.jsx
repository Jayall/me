import { SiCodechef, SiCodeforces, SiLeetcode } from "react-icons/si";
import { competitiveIntro, contestTimeline, platforms } from "../portfolioData";
import Section from "./Section";

const platformIcons = {
  LeetCode: SiLeetcode,
  Codeforces: SiCodeforces,
  CodeChef: SiCodechef,
};

const PlatformLogo = ({ platform }) => {
  const Icon = platformIcons[platform];
  return Icon ? <Icon className="cp-logo" aria-hidden="true" /> : null;
};

const Competitive = () => (
  <Section
    id="competitive"
    command="whoami --competitive"
    title="Competitive programming"
  >
    <div className="cp-intro panel hud-corners">
      <p className="terminal-command">
        <span className="prompt">$</span> ./approach --short
      </p>
      <p>{competitiveIntro}</p>
      <p className="fine-print">
        Problem solving, algorithms and the math behind them: number theory,
        combinatorics, modular arithmetic.
      </p>
    </div>

    <div className="cp-grid">
      {platforms.map((platform) => (
        <article key={platform.platform} className="cp-card panel hud-corners">
          <div className="cp-card-head">
            <div className="cp-platform-group">
              <PlatformLogo platform={platform.platform} />
              <h3 className="cp-platform glitch">{platform.platform}</h3>
            </div>
            <span className="cp-rank">{platform.rank}</span>
          </div>
          <dl className="cp-stats">
            <div>
              <dt>handle</dt>
              <dd>{platform.handle}</dd>
            </div>
            <div>
              <dt>current</dt>
              <dd>{platform.rating}</dd>
            </div>
          </dl>
          <a
            className="cp-link"
            href={platform.url}
            target="_blank"
            rel="noreferrer"
          >
            view profile ↗
          </a>
        </article>
      ))}
    </div>

    <p className="fine-print">
      Handles and current ratings are carried over from the previous site.{" "}
      <a href="#lab">See the Lab for math notes.</a>
    </p>

    <div className="cp-timeline-wrap">
      <h3 className="subheading">Achievements</h3>
      <p className="fine-print">Contest timeline</p>
      <ol className="timeline">
        {contestTimeline.map((item) => (
          <li key={item.title} className="timeline-item">
            <span className="timeline-year">{item.year}</span>
            <p className="timeline-title">{item.title}</p>
            <p className="timeline-meta">
              {item.result} · {item.org}
            </p>
          </li>
        ))}
      </ol>
    </div>

    <p className="cross-link">
      Competitive programming and <a href="#mathematics">mathematics</a> feed
      each other: see the interest section.
    </p>
  </Section>
);

export default Competitive;
