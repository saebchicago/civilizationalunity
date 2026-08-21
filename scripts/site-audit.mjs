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
  "more than eighty published pieces"
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
for (const f of ["llms.txt", "about.html", "framework.html", "thanks.html"]) {
  if (!fs.existsSync(f)) failures.push(`missing ${f}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Site audit passed: ${html.length} HTML pages checked.`);
