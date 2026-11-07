import { projects } from "../portfolioData";
import Section from "./Section";

const Projects = () => (
  <Section id="projects" command="ls ./42-projects" title="Projects">
    <div className="project-grid">
      {projects.map((project) => (
        <article key={project.title} className="project-card panel hud-corners">
          <div className="project-top">
            <h3 className="project-title">{project.title}</h3>
            <span className="project-kind">{project.kind}</span>
          </div>
          <p className="project-desc">{project.description}</p>
          <div className="tag-list">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  </Section>
);

export default Projects;
