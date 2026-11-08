import { Suspense, lazy, useEffect } from "react";
import Homepage from "./Homepage";
import { useRoute } from "./router";

const NoteViewer = lazy(() => import("./NoteViewer"));

const NoteFallback = () => (
  <div className="route-loading" role="status">
    <span className="prompt">$</span> loading note…
  </div>
);

function App() {
  const { path, hash } = useRoute();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [path, hash]);

  const match = path.match(/^\/lab\/([^/]+)\/?$/);

  if (match) {
    const slug = decodeURIComponent(match[1]);
    return (
      <Suspense fallback={<NoteFallback />}>
        <NoteViewer key={slug} slug={slug} />
      </Suspense>
    );
  }

  return <Homepage />;
}

export default App;
