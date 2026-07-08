/**
 * Build-time prerender.
 *
 * Renders the built app in headless Chromium against the live API and
 * overwrites dist/index.html with the fully-rendered HTML plus the API
 * payloads inlined as window.__PRELOADED_API__. Crawlers get complete
 * content without executing JS; users get an instant first paint and a
 * background revalidation keeps data fresh (see src/lib/api.js).
 *
 * Fail-soft: any error leaves the normal CSR build untouched and exits 0
 * so deploys never break. CI needs `npx playwright install chromium`.
 */
import { preview } from "vite";
import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PORT = 4599;
const OUT = path.resolve("dist/index.html");

/** Fallback: find any cached Playwright Chromium (version-mismatch safe). */
function findCachedChromium() {
  const roots = [
    path.join(os.homedir(), "Library/Caches/ms-playwright"),
    path.join(os.homedir(), ".cache/ms-playwright"),
  ];
  const candidates = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root)) {
      const base = path.join(root, dir);
      for (const rel of [
        "chrome-headless-shell-mac-arm64/chrome-headless-shell",
        "chrome-headless-shell-mac-x64/chrome-headless-shell",
        "chrome-headless-shell-linux64/chrome-headless-shell",
        "chrome-linux/chrome",
        "chrome-mac/Chromium.app/Contents/MacOS/Chromium",
        "chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium",
      ]) {
        const p = path.join(base, rel);
        if (fs.existsSync(p)) candidates.push(p);
      }
    }
  }
  return candidates.sort().pop(); // newest build number wins
}

async function launchBrowser() {
  try {
    return await chromium.launch({ args: ["--no-sandbox"] });
  } catch (err) {
    const cached = findCachedChromium();
    if (!cached) throw err;
    console.log(`[prerender] default browser unavailable, using ${cached}`);
    return chromium.launch({ args: ["--no-sandbox"], executablePath: cached });
  }
}

let server;
try {
  if (!fs.existsSync(OUT)) throw new Error("dist/index.html not found — run vite build first");

  server = await preview({ preview: { port: PORT, strictPort: true } });
  const browser = await launchBrowser();
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.addInitScript(() => {
    window.__PRERENDER__ = true;
  });
  const page = await context.newPage();

  const failed = [];
  page.on("pageerror", (e) => failed.push(String(e)));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle", timeout: 90000 });
  // Let late reveals/fonts/API stragglers settle.
  await page.waitForTimeout(2500);

  if (failed.length) throw new Error(`page errors during prerender:\n${failed.join("\n")}`);

  const apiData = await page.evaluate(() => window.__DUMP_API_CACHE__?.() || {});
  const endpoints = Object.keys(apiData);
  if (endpoints.length < 3) {
    throw new Error(`only ${endpoints.length} API payloads captured — API unreachable at build time?`);
  }

  let html = await page.content();
  await browser.close();

  // Inline the API payloads so the hydrating app repaints instantly
  // with the exact data the snapshot was rendered from.
  const payload = JSON.stringify(apiData).replace(/</g, "\\u003c");
  html = html.replace(
    /<head([^>]*)>/i,
    (m) => `${m}<script>window.__PRELOADED_API__=${payload}</script>`
  );

  if (!html.includes('id="root"')) throw new Error("snapshot missing #root");

  fs.writeFileSync(OUT, "<!doctype html>\n" + html.replace(/^<!doctype html>\s*/i, ""));
  const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
  console.log(`[prerender] ✓ dist/index.html now contains full HTML (${kb} KB, ${endpoints.length} API payloads inlined)`);
} catch (err) {
  console.warn(`[prerender] skipped — shipping client-rendered build. Reason: ${err.message}`);
} finally {
  await server?.close().catch(() => {});
  process.exit(0);
}
