import { BsStack } from "react-icons/bs";
import { FaHammer } from "react-icons/fa";
import { IoHardwareChipSharp } from "react-icons/io5";
import { TbBinaryTreeFilled } from "react-icons/tb";
import Section from "./Section";

const differentiators = [
  { icon: IoHardwareChipSharp, label: "Hardware - Software bridge" },
  { icon: TbBinaryTreeFilled, label: "Strong DSA fundamentals" },
  { icon: BsStack, label: "Fullstack + low-level depth" },
  { icon: FaHammer, label: "Engineer mindset - build things" },
];

const About = () => (
  <Section id="about" command="cat ./about.md" title="About">
    <div className="about-grid">
      <article className="about-card panel hud-corners">
        <ul className="about-list">
          <li>
            I love maths and it helps me to improve at engineering and problem
            solving.
          </li>
          <li>
            My electronics background shapes how I think about systems: from the
            hardware layer up.
          </li>
        </ul>
      </article>
      <article className="about-card panel hud-corners">
        <strong className="about-strong">what I bring to the table ?</strong>
        <ul className="about-list about-list-icons">
          {differentiators.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  </Section>
);

export default About;
