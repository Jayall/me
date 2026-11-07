export const navLinks = [
  { label: "about", href: "#about" },
  { label: "cp", href: "#competitive" },
  { label: "experience", href: "#experience" },
  { label: "projects", href: "#projects" },
  { label: "skills", href: "#skills" },
  { label: "contact", href: "#contact" },
];

export const identity = {
  name: "Ando Tiana RAKOTOARISOA",
  legacyName: "RAKOTOARISOA Ando Tiana",
  role: "Software Engineer",
  tagline: "Electronic Engineer x Fullstack developer x DSA",
  existingDescription:
    "I'm passionate about engineering, web architecture and embedded system",
  summary:
    "Full-stack dev with an electronics background, bridging hardware and software. I build secure, production-ready systems and favor simple, elegant solutions to complex problems. Seeking an ambitious team and concrete projects.",
  location: "Antananarivo, Madagascar",
  status: "open to opportunities",
  email: "rktandoscoud@gmail.com",
  github: "https://github.com/Jayall",
  githubLabel: "jayall",
  linkedin: "https://www.linkedin.com/in/ando-tiana-rakotoarisoa-486abb290/",
  linkedinLabel: "Ando Tiana Rakotoarisoa",
};

export const competitiveIntro =
  "I solve algorithmic problems for the same reason I enjoy engineering: there is usually a simple structure underneath the noise. Most of my practice goes into data structures, number theory, combinatorics and modular arithmetic, then into C++ for contests. I care about the proof, the complexity bound, and code that survives the edge cases.";

export const platforms = [
  {
    platform: "LeetCode",
    rank: "Guardian",
    handle: "4ndO",
    rating: "2158",
    maxRating: "[LEETCODE_MAX_RATING]",
    url: "https://leetcode.com/4nd0/",
  },
  {
    platform: "Codeforces",
    rank: "Specialist",
    handle: "N1664",
    rating: "1406",
    maxRating: "[CODEFORCES_MAX_RATING]",
    url: "https://codeforces.com/profile/N1664",
  },
  {
    platform: "CodeChef",
    rank: "3★",
    handle: "deds3c",
    rating: "1623",
    maxRating: "[CODECHEF_MAX_RATING]",
    url: "https://www.codechef.com/users/deds3c",
  },
];

export const competitiveLine = `Competitive programmer — ${platforms
  .map((platform) => `${platform.platform} ${platform.rank}`)
  .join(" · ")}`;

export const contestTimeline = [
  {
    year: "2024",
    title: "Hackathon Independence Day",
    result: "Podium",
    org: "42 Antananarivo",
  },
  {
    year: "2023",
    title: "Cloudfight Coding Contest",
    result: "1st place — #classic category",
    org: "HEI (Haute Ecole de l'Informatique)",
  },
];

export const experience = [
  {
    period: "05/2026 — present",
    role: "Full-stack Developer (work-study)",
    company: "ACADE Sarl",
    bullets: [
      "Designed and built backend and frontend features for an internal task-management web app used daily by ~10 colleagues (NestJS, React, TypeScript, Prisma, PostgreSQL).",
      "Owned end-to-end deployment on the company's local server: containerized with Docker and configured Nginx as a reverse proxy.",
      "Set up monitoring and observability with Prometheus and Grafana to track application and server health.",
    ],
    tags: [
      "NestJS",
      "React",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Docker",
      "Nginx",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    period: "2024",
    role: "Python Trainer (freelance)",
    company: "Freelance",
    bullets: [
      "Taught Python programming fundamentals and algorithmic concepts.",
      "Designed custom exercises and coached students through problem solving.",
    ],
    tags: ["Python", "Algorithms", "Teaching"],
  },
];

export const projects = [
  {
    title: "ft_transcendence",
    kind: "42 project",
    description:
      "Real-time full-stack web app built in a team: authentication, live chat, and containerized deployment with FastAPI, React, WebSocket, PostgreSQL, and Docker.",
    tags: ["FastAPI", "React", "WebSocket", "PostgreSQL", "Docker"],
  },
  {
    title: "Born2beroot",
    kind: "42 project",
    description:
      "Linux system administration and infrastructure security. Set up and configured a virtualized Linux system applying system-administration and security best practices (scripting, configuration, monitoring).",
    tags: ["Linux", "Security", "Scripting", "Monitoring"],
  },
  {
    title: "Inception",
    kind: "42 project",
    description:
      "Multi-service Docker infrastructure (NGINX, WordPress, MariaDB) orchestrated with Docker Compose, including volumes, networks, and environment variables.",
    tags: ["Docker Compose", "NGINX", "WordPress", "MariaDB"],
  },
  {
    title: "Libasm",
    kind: "42 project",
    description:
      "Low-level x86-64 assembly library implementing system and data-manipulation functions with rigorous stack, register, and memory management.",
    tags: ["x86-64 assembly", "Systems", "Memory"],
  },
];

export const skillGroups = [
  {
    title: "Competitive programming",
    featured: true,
    skills: [
      "Algorithms",
      "Data structures",
      "Number theory",
      "Optimization",
      "Matrices",
      "C++",
      "Problem solving",
    ],
    link: { label: "open the CP dashboard", href: "#competitive" },
  },
  {
    title: "Systems",
    skills: [
      "C",
      "C++",
      "Embedded",
      "FPGA",
      "IoT",
      "Network",
      "x86-64 assembly",
      "Linux",
    ],
  },
  {
    title: "Backend",
    skills: [
      "Python",
      "FastAPI",
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Prisma",
      "WebSocket",
    ],
  },
  {
    title: "Frontend",
    skills: ["TypeScript", "React", "Tailwind"],
  },
  {
    title: "DevOps",
    skills: [
      "Docker",
      "Docker Compose",
      "k3s",
      "Prometheus",
      "Grafana",
      "Github Actions (CI/CD)",
    ],
  },
  {
    title: "Data & security",
    skills: ["Data Science", "Cybersecurity", "Monitoring", "Observability"],
  },
  {
    title: "Collaboration",
    skills: ["Trello", "Microsoft Teams", "Visual Studio Code", "OpenCode"],
  },
];

export const education = [
  {
    period: "2024 — present",
    title: "Computer Science curriculum — Specialization",
    school: "42 Antananarivo",
  },
  {
    period: "2018 — 2024",
    title: "Master of Science — Electronics and Applied Computer Science",
    school: "École Supérieure Polytechnique d'Antananarivo (ESPA)",
  },
];

export const languages = [
  { name: "Malagasy", level: "Native" },
  { name: "French", level: "Fluent" },
  { name: "English", level: "C1" },
];

export const interests = [
  {
    id: "security",
    title: "Cybersecurity & hacking",
    body: "Systems security is the direction I want to keep growing in: understanding how a system fails before building one that does not. This connects directly to my DevOps and Linux work.",
  },
  {
    id: "embedded",
    title: "Embedded systems",
    body: "My electronics background shapes how I reason about systems, from the hardware layer up. I am interested in the boundary where firmware, low-level code, and software meet.",
  },
  {
    id: "mathematics",
    title: "Mathematics",
    body: "Number theory, combinatorics, linear algebra, and the math behind algorithms and optimization. Competitive programming is where this interest becomes concrete.",
    links: [
      { label: "competitive programming", href: "#competitive" },
      { label: "lab notes", href: "#lab" },
    ],
  },
];

export const labTopics = [
  "Number theory",
  "Combinatorics",
  "Modular arithmetic",
  "Systems security",
  "Embedded systems",
];

export const labExample = {
  title: "Möbius function",
  tex: "\\sum_{d \\mid n} \\mu(d) = [n = 1]",
};

export const labFormula = {
  title: "Favorite formula",
  tex: "\\text{Let } x_i > 0 \\text{ be the variable representing hard work in record } i. \\\\ \\boxed{\\mathbf{TALENT} = \\sum_{i=1}^{N} x_i^{d_i} \\quad (d_i > 0)}",
};
