import { WiAlien } from "react-icons/wi";
import { navLinks } from "../portfolioData";

const StatusBar = () => (
  <header className="status-bar">
    <div className="status-inner">
      <a className="brand" href="#top" aria-label="Back to top">
        <WiAlien aria-hidden="true" />
        <span className="brand-name">Portfolio</span>
        <span className="brand-path">~/ando</span>
      </a>
      <nav className="status-nav" aria-label="Sections">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <a href="#" className="nav-external">
          blogs
        </a>
      </nav>
    </div>
  </header>
);

export default StatusBar;
