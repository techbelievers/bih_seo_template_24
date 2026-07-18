import config from "../../config";

// One in-flight/settled promise per endpoint for the whole app.
// Every section shares this cache, so each API is hit exactly once
// per page load (the old template fetched /header 3x and /footer 3x).
const cache = new Map();

// Plain-object mirror of settled payloads. The prerender script dumps
// this into dist/index.html as window.__PRELOADED_API__, and the next
// page load seeds from it — first paint needs zero API round-trips.
const snapshot = {};

// path -> Set<fn>; lets stale-while-revalidate push fresh data into
// already-rendered components.
const listeners = new Map();
const revalidated = new Set();

const PRELOADED =
  typeof window !== "undefined" && window.__PRELOADED_API__ ? window.__PRELOADED_API__ : null;

if (PRELOADED) {
  for (const [path, data] of Object.entries(PRELOADED)) {
    snapshot[path] = data;
    cache.set(path, Promise.resolve(data));
  }
}

export function apiUrl(path) {
  const sep = path.includes("?") ? "&" : "?";
  return `${config.API_URL}/${path}${sep}website=${config.SLUG_URL}`;
}

function request(path) {
  return fetch(apiUrl(path)).then((res) => {
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
  });
}

/** Synchronous read of an already-settled payload (no network). */
export function peekApi(path) {
  return snapshot[path] ?? null;
}

export function subscribeApi(path, fn) {
  if (!listeners.has(path)) listeners.set(path, new Set());
  listeners.get(path).add(fn);
  return () => listeners.get(path)?.delete(fn);
}

/**
 * Run once the page has finished loading and the main thread is idle.
 * Background revalidation is never urgent — the inlined payload is already
 * on screen — but firing it during first paint competes with images for
 * bandwidth and lets a differing payload swap content out from under the
 * user mid-scroll. Waiting until idle keeps the opening seconds stable.
 */
function whenIdle(fn) {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    fn();
  };
  const go = () =>
    "requestIdleCallback" in window
      ? window.requestIdleCallback(run, { timeout: 3000 })
      : setTimeout(run, 1200);

  if (document.readyState === "complete") return go();
  window.addEventListener("load", go, { once: true });
  // `load` waits on every image and third-party embed, so on a gallery-heavy
  // page it can be many seconds out — or never, if the map stalls. Fall back
  // on a timer so CMS edits still reach the user either way.
  setTimeout(run, 5000);
}

export function fetchApi(path) {
  if (!cache.has(path)) {
    const promise = request(path)
      .then((data) => {
        snapshot[path] = data;
        return data;
      })
      .catch((err) => {
        cache.delete(path); // allow retry on failure
        throw err;
      });
    cache.set(path, promise);
  }

  // Build-time data paints instantly; refresh it once in the background
  // so CMS edits made after the last deploy still reach the user.
  if (PRELOADED && path in PRELOADED && !revalidated.has(path)) {
    revalidated.add(path);
    whenIdle(() => {
      request(path)
        .then((data) => {
          if (JSON.stringify(data) !== JSON.stringify(snapshot[path])) {
            snapshot[path] = data;
            cache.set(path, Promise.resolve(data));
            listeners.get(path)?.forEach((fn) => fn(data));
          }
        })
        .catch(() => {});
    });
  }

  return cache.get(path);
}

export function postEnquiry(formData) {
  return fetch(apiUrl("contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then(async (res) => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Submission failed. Please try again.");
    }
    return res.json().catch(() => ({}));
  });
}

if (typeof window !== "undefined") {
  // Read by scripts/prerender.mjs after the page settles.
  window.__DUMP_API_CACHE__ = () => snapshot;

  // Warm the critical path before React mounts — the hero image URL
  // arrives sooner, which directly improves LCP.
  fetchApi("header").catch(() => {});
  fetchApi("footer").catch(() => {});
}
