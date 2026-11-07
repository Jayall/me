import { identity } from "../portfolioData";
import Section from "./Section";

const Contact = () => (
  <Section
    id="contact"
    command="./contact --secure"
    title="Let's work together"
  >
    <div className="contact-grid">
      <article className="contact-card panel hud-corners">
        <span className="contact-label">Email</span>
        <a className="contact-value" href={`mailto:${identity.email}`}>
          {identity.email}
        </a>
      </article>
      <article className="contact-card panel hud-corners">
        <span className="contact-label">GitHub</span>
        <a
          className="contact-value"
          href={identity.github}
          target="_blank"
          rel="noreferrer"
        >
          {identity.githubLabel}
        </a>
      </article>
      <article className="contact-card panel hud-corners">
        <span className="contact-label">LinkedIn</span>
        <a
          className="contact-value"
          href={identity.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          {identity.linkedinLabel}
        </a>
      </article>
    </div>
    <p className="privacy-note">Based in {identity.location}.</p>
  </Section>
);

export default Contact;
