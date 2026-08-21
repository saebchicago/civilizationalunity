import fs from "node:fs";
import path from "node:path";

const html = fs.readdirSync(process.cwd()).filter((f) => f.endsWith(".html"));
const failures = [];
const banned = [
  "EDIT-DOMAIN",
  "still publishing monthly",
  "Monthly cadence through 2026",
  "answers press requests himself",
  "DELETE THIS BLOCK BEFORE PUBLISHING",
  "more than eighty published pieces",
  "Societies hold together when they recognize the dignity"
];

function count(s, needle) {
  return s.split(needle).length - 1;
}

for (const f of html) {
  const s = fs.readFileSync(path.join(process.cwd(), f), "utf8");
  for (const token of banned) {
    if (s.includes(token)) failures.push(`${f}: stale or unsupported phrase: ${token}`);
  }

  for (const req of ["<title>", "name=\"description\"", "rel=\"canonical\"", "<main", "<h1", "class=\"skip\""]) {
    if (!s.includes(req)) failures.push(`${f}: missing ${req}`);
  }

  for (const [needle, label] of [
    ["<title>", "title"],
    ["name=\"description\"", "meta description"],
    ["rel=\"canonical\"", "canonical"],
    ["property=\"og:title\"", "og:title"],
    ["property=\"og:description\"", "og:description"],
    ["property=\"og:url\"", "og:url"]
  ]) {
    const n = count(s, needle);
    if (n > 1) failures.push(`${f}: duplicate ${label} (${n})`);
  }

  const ids = [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const duplicates = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (duplicates.length) failures.push(`${f}: duplicate ids ${[...new Set(duplicates)].join(",")}`);

  const opener = '<script type="application/ld+json">';
  const closer = '</script>';
  let pos = 0;
  while ((pos = s.indexOf(opener, pos)) >= 0) {
    const a = pos + opener.length;
    const b = s.indexOf(closer, a);
    if (b < 0) {
      failures.push(`${f}: unclosed JSON-LD`);
      break;
    }
    try {
      JSON.parse(s.slice(a, b));
    } catch (e) {
      failures.push(`${f}: invalid JSON-LD: ${e.message}`);
    }
    pos = b + closer.length;
  }
}

const headers = fs.readFileSync("_headers", "utf8");
if (headers.includes("max-age=31536000, immutable")) failures.push("_headers: unversioned assets cached immutable");
if (!headers.includes("Content-Security-Policy:")) failures.push("_headers: missing CSP");
for (const f of ["llms.txt", "about.html", "framework.html", "explore.html", "thanks.html", "data/core-works.json", "assets/civilizational-motif.svg", "assets/visual-polish.css"]) {
  if (!fs.existsSync(f)) failures.push(`missing ${f}`);
}

const home = fs.readFileSync("index.html", "utf8");
const approved = "Civilizations are born and progress when they recognize and practice human dignity, and they decline and fall when they stop.";
if (!home.includes(approved)) failures.push("index.html: missing Professor al-Ahsan’s approved dignity formulation");
const loader = fs.readFileSync("assets/site.js", "utf8");
if (!loader.includes("/assets/visual-polish.css")) failures.push("assets/site.js: visual polish layer is not loaded");

const redirects = fs.readFileSync("_redirects", "utf8");
if (!redirects.includes("/explore")) failures.push("_redirects: missing /explore route");
const sitemap = fs.readFileSync("sitemap.xml", "utf8");
if (!sitemap.includes("/explore</loc>")) failures.push("sitemap.xml: missing /explore");

try {
  const data = JSON.parse(fs.readFileSync("data/core-works.json", "utf8"));
  if (!Array.isArray(data.works) || data.works.length < 10) failures.push("data/core-works.json: expected a non-trivial works array");
  const seenDoi = new Set();
  for (const [i, work] of (data.works || []).entries()) {
    if (!work.title || work.year == null || !work.type) failures.push(`data/core-works.json: work ${i + 1} missing title/year/type`);
    if (work.doi) {
      if (!/^10\.\d{4,9}\/.+/.test(work.doi)) failures.push(`data/core-works.json: malformed DOI ${work.doi}`);
      if (seenDoi.has(work.doi)) failures.push(`data/core-works.json: duplicate DOI ${work.doi}`);
      seenDoi.add(work.doi);
    }
  }
} catch (e) {
  failures.push(`data/core-works.json: invalid JSON: ${e.message}`);
}

for (const f of ["explore.html", "assets/explore.js", "assets/nav.js", "llms.txt"]) {
  const s = fs.readFileSync(f, "utf8").toLowerCase();
  if (s.includes("concept atlas") || s.includes("intellectual atlas")) failures.push(`${f}: retired terminology found`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Site audit passed: ${html.length} HTML pages checked; scholarly record and visual layer validated.`);
