import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const headers = fs.readFileSync('_headers', 'utf8');
assert.match(headers, /script-src 'self'; script-src-attr 'none'/);
assert.doesNotMatch(headers.match(/script-src [^;]+/)[0], /unsafe-inline|unsafe-eval/);
for (const name of fs.readdirSync('.').filter(n => n.endsWith('.html'))) {
  const html = fs.readFileSync(name, 'utf8');
  assert.doesNotMatch(html, /\son\w+\s*=|(?:href|src)\s*=\s*["']javascript:/i, name);
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attrs, body] = match;
    if (/type=["']application\/ld\+json["']/.test(attrs)) { JSON.parse(body); continue; }
    assert.match(attrs, /src=["']\/?assets\//, name);
    assert.equal(body.trim(), '', name);
  }
  if (html.includes('data-print')) assert.ok(html.includes('/assets/print.js'), name);
}
for (const [saved, system, expected] of [['dark', false, 'dark'], ['light', true, 'light'], [null, true, 'dark'], [null, false, undefined]]) {
  let theme;
  vm.runInNewContext(fs.readFileSync('assets/theme-init.js', 'utf8'), {
    localStorage: { getItem: () => saved },
    document: { documentElement: { setAttribute: (key, value) => { theme = value; } } },
    window: { matchMedia: true }, matchMedia: () => ({ matches: system }),
  });
  assert.equal(theme, expected);
}
let printed = 0; const callbacks = [];
vm.runInNewContext(fs.readFileSync('assets/print.js', 'utf8'), {
  document: { querySelectorAll: () => [1, 2].map(() => ({ addEventListener: (event, cb) => { assert.equal(event, 'click'); callbacks.push(cb); } })) },
  window: { print: () => { printed++; } },
});
assert.equal(printed, 0); callbacks.forEach(cb => cb()); assert.equal(printed, 2);
console.log('Script policy, theme preferences and print controls passed.');
