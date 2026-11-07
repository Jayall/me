import About from "./components/About";
import Competitive from "./components/Competitive";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Interests from "./components/Interests";
import LabNotes from "./components/LabNotes";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import StatusBar from "./components/StatusBar";
import { buildSkullBackground } from "./skullPattern";

const { primaryTile, accentTile } = buildSkullBackground({
  primaryFill: "rgba(255,255,255,0.14)",
  accentFill: "rgba(57,255,122,0.08)",
  scale: 2.8,
});

const landscapeStyle = {
  backgroundImage: `url("${primaryTile}"), url("${accentTile}")`,
  backgroundRepeat: "repeat, repeat",
  backgroundPosition: "center, 12.5% 12.5%",
  backgroundSize:
    "clamp(180px, 28vmax, 360px) clamp(180px, 28vmax, 360px), clamp(180px, 28vmax, 360px) clamp(180px, 28vmax, 360px)",
};

const Homepage = () => {
  return (
    <div className="site-shell">
      <div
        className="background-layer"
        aria-hidden="true"
        style={landscapeStyle}
      />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <StatusBar />
      <main id="main" className="site-main">
        <Hero />
        <About />
        <Competitive />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Interests />
        <LabNotes />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
