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
import SkullBackground from "./components/SkullBackground";
import StatusBar from "./components/StatusBar";

const Homepage = () => {
  return (
    <div className="site-shell">
      <SkullBackground />
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
