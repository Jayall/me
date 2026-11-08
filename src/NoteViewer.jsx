import { useEffect, useMemo, useRef, useState } from "react";
import Link from "./Link";
import SkullBackground from "./components/SkullBackground";
import notesIndex from "./generated/notes.json";
import "./note-viewer.css";

const noteModules = import.meta.glob("./generated/notes/*.json");

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

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const NotFound = ({ slug }) => (
  <div className="note-page">
    <SkullBackground className="note-background" />
    <main className="note-notfound panel hud-corners">
      <p className="note-command">
        <span className="prompt">$</span> cat notes/{slug}.tex
      </p>
      <h1>404 / note not found</h1>
      <p>
        No note matches <code>{slug}</code>. It may have been renamed or not
        published yet.
      </p>
      <Link className="button-link" to="/#lab">
        ← back to Lab
      </Link>
    </main>
  </div>
);

const NoteViewer = ({ slug }) => {
  const meta = useMemo(() => notesIndex.find((note) => note.slug === slug), [slug]);
  const loader = noteModules[`./generated/notes/${slug}.json`];
  const [note, setNote] = useState(null);
  const bodyHtml = useMemo(() => ({ __html: note?.html ?? "" }), [note]);
  const [error, setError] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const articleRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!meta || !loader) return undefined;
    let cancelled = false;

    loader()
      .then((module) => {
        if (!cancelled) {
          setError(false);
          setNote(module.default || module);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [meta, loader]);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const initial = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!note) return undefined;
    const ids = note.headings.map((heading) => heading.id);
    let frame = 0;

    const update = () => {
      frame = 0;
      let active = ids[0] || "";
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 130) active = id;
      }
      setActiveId(active);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const initial = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [note]);

  useEffect(() => {
    if (!note || !articleRef.current) return undefined;
    let cancelled = false;
    const article = articleRef.current;

    Promise.all([import("katex"), import("katex/dist/katex.min.css")])
      .then(([module]) => {
        if (cancelled) return;
        const katex = module.default;
        article.querySelectorAll("[data-math-tex]").forEach((node) => {
          const tex = node.getAttribute("data-math-tex") || "";
          const display = node.getAttribute("data-display") === "true";
          try {
            katex.render(tex, node, {
              displayMode: display,
              throwOnError: false,
              output: "htmlAndMathml",
              strict: false,
              trust: true,
              macros: note.macros || {},
            });
            if (node.querySelector(".katex-error")) {
              node.innerHTML = `<code class="latex-raw-inline">${escapeHtml(tex)}</code>`;
            }
          } catch {
            node.innerHTML = `<code class="latex-raw-inline">${escapeHtml(tex)}</code>`;
          }
        });
      })
      .catch(() => {
        article.querySelectorAll("[data-math-tex]").forEach((node) => {
          node.textContent = node.getAttribute("data-math-tex") || "";
        });
      });

    return () => {
      cancelled = true;
    };
  }, [note]);

  useEffect(() => {
    if (!note) return undefined;
    const article = articleRef.current;
    if (!article) return undefined;

    const onClick = async (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("[data-copy-tex]");
      if (!button) return;
      const tex = button.getAttribute("data-copy-tex") || "";
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(tex);
        button.textContent = "copied";
      } catch {
        button.textContent = "copy failed";
      }
      window.setTimeout(() => {
        button.textContent = original;
      }, 1400);
    };

    article.addEventListener("click", onClick);
    return () => article.removeEventListener("click", onClick);
  }, [note]);

  if (!meta || !loader || error) return <NotFound slug={slug} />;

  if (!note) {
    return (
      <div className="note-page">
        <SkullBackground className="note-background" />
        <div className="route-loading" role="status">
          <span className="prompt">$</span> cat notes/{slug}.tex …
        </div>
      </div>
    );
  }

  const index = notesIndex.findIndex((item) => item.slug === slug);
  const previous = index > 0 ? notesIndex[index - 1] : null;
  const next = index >= 0 && index < notesIndex.length - 1 ? notesIndex[index + 1] : null;
  const downloadHref = `${import.meta.env.BASE_URL}notes/${slug}.tex`;

  return (
    <div className="note-page">
      <SkullBackground className="note-background" />
      <div className="note-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <a className="skip-link" href="#note-content">
        Skip to note
      </a>
      <header className="note-topbar">
        <div className="note-topbar-inner">
          <Link className="note-back" to="/#lab">
            ← back to Lab
          </Link>
          <span className="note-path">notes/{slug}.tex</span>
        </div>
      </header>
      <div className="note-layout">
        <main id="note-content" className="note-main">
          <article ref={articleRef} className="note-article" aria-labelledby="note-title">
            <header className="note-header">
              <p className="note-command">
                <span className="prompt">$</span> cat notes/{slug}.tex
              </p>
              <h1 id="note-title" className="note-title">
                {note.title}
              </h1>
              <div className="note-meta">
                {note.date && <time dateTime={note.date}>{formatDate(note.date)}</time>}
                <span>{note.readingMinutes} min read</span>
                {note.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
                <a href={downloadHref} download>
                  download .tex
                </a>
              </div>
            </header>
            <div className="note-body" dangerouslySetInnerHTML={bodyHtml} />
            <nav className="note-nav" aria-label="Note navigation">
              {previous ? <Link to={`/lab/${previous.slug}`}>← {previous.title}</Link> : <span />}
              {next ? (
                <Link className="next" to={`/lab/${next.slug}`}>
                  {next.title} →
                </Link>
              ) : null}
            </nav>
          </article>
        </main>
        <aside className="note-sidebar">
          <button
            className="toc-toggle"
            type="button"
            aria-expanded={tocOpen}
            onClick={() => setTocOpen((open) => !open)}
          >
            {tocOpen ? "hide contents" : "contents"}
          </button>
          <nav className={`note-toc${tocOpen ? " is-open" : ""}`} aria-label="Table of contents">
            <p className="toc-title">// contents</p>
            <ol>
              {note.headings.map((heading) => (
                <li key={heading.id} className={`toc-level-${heading.level}`}>
                  <a href={`#${heading.id}`} className={activeId === heading.id ? "is-active" : ""}>
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default NoteViewer;
