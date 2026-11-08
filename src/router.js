import { useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(to) {
  const path = to.startsWith("/") ? to : `/${to}`;
  return `${BASE}${path}` || "/";
}

export function readLocation() {
  let path = window.location.pathname;
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length);
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path) path = "/";
  return { path: path || "/", hash: window.location.hash || "" };
}

export function navigate(to, { replace = false } = {}) {
  const url = withBase(to);
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
  window.dispatchEvent(new Event("routechange"));
}

export function useRoute() {
  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") return { path: "/", hash: "" };
    return readLocation();
  });

  useEffect(() => {
    const update = () => setLocation(readLocation());
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    window.addEventListener("routechange", update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
      window.removeEventListener("routechange", update);
    };
  }, []);

  return location;
}
