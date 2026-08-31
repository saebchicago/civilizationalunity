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
  "Societies hold together when they recognize the dignity",
  "Browse all 50+ publications",
  "verified bibliographic records",
  "Fifty-plus publications"
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
const homeText = home.replace(/<[^>]+>/g, "");
if (!homeText.includes(approved)) failures.push("index.html: missing Professor al-Ahsan’s approved dignity formulation");
const loader = fs.readFileSync("assets/site.js", "utf8");
if (!loader.includes("/assets/visual-polish.css")) failures.push("assets/site.js: visual polish layer is not loaded");
if (!loader.includes("/assets/site-core.js")) failures.push("assets/site.js: behavior layer is not loaded");

const redirects = fs.readFileSync("_redirects", "utf8");
if (!redirects.includes("/explore")) failures.push("_redirects: missing /explore route");
if (!redirects.includes("/learn")) failures.push("_redirects: missing /learn alias");
const sitemap = fs.readFileSync("sitemap.xml", "utf8");
if (!sitemap.includes("/explore</loc>")) failures.push("sitemap.xml: missing /explore");

const explore = fs.readFileSync("explore.html", "utf8");
for (const marker of ["LearningResource", "Guided paths", "For seminars &amp; reading groups", "Carry the record forward"]) {
  if (!explore.includes(marker)) failures.push(`explore.html: missing learning marker ${marker}`);
}
/* The four categories are Professor al-Ahsan's requested grouping: governance,
   dignity, cooperation, flourishing. They must be served as HTML, in that
   order, and must never be re-staged as a causal or reversible sequence. */
const CATEGORIES = ["Governance", "Dignity", "Cooperation", "Flourishing"];
for (const f of ["index.html", "framework.html"]) {
  const s = fs.readFileSync(f, "utf8");
  let cursor = -1;
  for (const term of CATEGORIES) {
    const at = s.indexOf(`<h3>${term}</h3>`);
    if (at < 0) {
      failures.push(`${f}: missing the ${term} category`);
      break;
    }
    if (at < cursor) failures.push(`${f}: ${term} is out of the requested order`);
    cursor = at;
  }
}

/* Content must ship in the markup, not be injected after load. */
for (const [f, markers] of [
  ["index.html", ["A recurring line of argument", "Qur\u2019anic Guidance for Good Governance", "Journal of Law and Religion"]],
  ["framework.html", ["Four categories, and where each one is argued", "Intellectual Discourse", "Al-Shajarah"]],
  ["explore.html", ["Orientation \u00b7 about 10\u201315 min", 'id="path-dignity"']],
  ["writing-v2.html", ['id="archiveSearch"', 'id="archiveClear"']]
]) {
  const s = fs.readFileSync(f, "utf8");
  for (const marker of markers) {
    if (!s.includes(marker)) failures.push(`${f}: expected served markup missing: ${marker}`);
  }
}

/* Retired: the reversible argument chain and the injected reflection layer. */
const retired = [
  "chain__swap", "chainGrid", "Run it in reverse", "node__gloss",
  "human-stakes-home", "human-reflection", "reflection-notebook",
  "carry-question", "learning-entry-home", "question-explorer", "archive-search"
];
for (const f of [...html, "assets/site.js", "assets/site-core.js", "assets/site.css", "assets/home.css", "assets/interior.css"]) {
  const s = fs.readFileSync(f, "utf8");
  for (const token of retired) {
    if (s.includes(token)) failures.push(`${f}: retired affordance still present: ${token}`);
  }
}

/* A linked citation must resolve to the work itself. The IIUM repository profile is
   the author's landing page: correct in schema.org sameAs, misleading on a title. */
for (const f of html) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(/<cite><a href="([^"]+)"/g)) {
    if (m[1].includes("irep.iium.edu.my/profile/")) {
      failures.push(`${f}: citation links to the author profile rather than the work: ${m[1]}`);
    }
  }
}

/* The archive is a selected record. Nothing may promise a count it does not list. */
const writing = fs.readFileSync("writing-v2.html", "utf8");
const listed = (writing.match(/class="piece"/g) || []).length;
for (const f of html) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(/(?:all|browse)\s+(\d+)\+?\s+publications/gi)) {
    if (Number(m[1]) > listed) {
      failures.push(`${f}: promises ${m[1]} publications but the archive lists ${listed}`);
    }
  }
}

/* One search implementation, not three. */
const core = fs.readFileSync("assets/site-core.js", "utf8");
if (!core.includes("writingArchive")) failures.push("assets/site-core.js: writing archive behavior missing");
for (const gone of ["assets/learning.js", "assets/gateway.js", "assets/nav.js", "assets/learning.css"]) {
  if (fs.existsSync(gone)) failures.push(`${gone}: superseded file should be removed`);
}

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

for (const f of ["explore.html", "assets/explore.js", "llms.txt"]) {
  const s = fs.readFileSync(f, "utf8").toLowerCase();
  if (s.includes("concept atlas") || s.includes("intellectual atlas")) failures.push(`${f}: retired terminology found`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Site audit passed: ${html.length} HTML pages checked; the four categories, served markup and scholarly record validated.`);
