import { competitiveLine, identity } from "../portfolioData";
import pfp from "../assets/sarySelfie-opt.jpg";

const Hero = () => (
	<section id="top" className="hero-section" aria-labelledby="hero-title">
		<div className="hero-grid">
			<div className="hero-copy">
				<p className="terminal-command">
					<span className="prompt">$</span> whoami
				</p>
				<div className="status-inline">
					<span className="status-dot" aria-hidden="true" />
					{identity.status}
				</div>
				<h1 id="hero-title">{identity.name}</h1>
				<p className="hero-role">{identity.role}</p>
				<p className="hero-tagline">{identity.tagline}</p>
				<p className="hero-competitive">{competitiveLine}</p>
				<p className="hero-summary">{identity.summary}</p>
				<p className="hero-existing">{identity.existingDescription}</p>
				<div className="hero-links">
					<a className="button-link" href={`mailto:${identity.email}`}>
						email me
					</a>
					<a
						className="button-link"
						href={identity.github}
						target="_blank"
						rel="noreferrer"
					>
						GitHub ↗
					</a>
					<a
						className="button-link"
						href={identity.linkedin}
						target="_blank"
						rel="noreferrer"
					>
						LinkedIn ↗
					</a>
					<a className="button-link" href="#competitive">
						competitive programming ↓
					</a>
				</div>
			</div>
			<aside className="hero-identity">
				<div className="portrait-frame hud-corners">
					<img
						src={pfp}
						alt="Portrait of Ando Tiana RAKOTOARISOA"
						width="900"
						height="1200"
						loading="eager"
						decoding="async"
					/>
				</div>
				<div className="identity-panel panel hud-corners">
					<p className="identity-line">
						<span className="identity-key">id</span>{" "}
						{identity.legacyName}
					</p>
					<p className="identity-line">
						<span className="identity-key">loc</span>{" "}
						{identity.location}
					</p>
					<p className="identity-line">
						<span className="identity-key">focus</span> software ·
						security · DevOps
					</p>
					<p className="identity-line">
						<span className="identity-key">lang</span> Malagasy ·
						French · English
					</p>
				</div>
			</aside>
		</div>
		<div className="boot-strip" aria-hidden="true">
			<span>
				<span className="ok">[ok]</span> identity verified
			</span>
			<span>
				<span className="ok">[ok]</span> profile loaded
			</span>
			<span>
				<span className="ok">[ok]</span> competitive mode ready
			</span>
			<span className="boot-cursor">
				<span className="cursor" />
			</span>
		</div>
	</section>
);

export default Hero;
