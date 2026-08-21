# Deploying this site

Static HTML pages, one stylesheet, one script, and a small set of source/media files. No build step,
no framework, no database. It will still work in ten years.

---

## 1. Put it online (about two minutes)

1. Go to **app.netlify.com/drop**
2. Drag the whole `alahsan-site` folder onto the page. Not the zip. The folder.
3. Netlify gives you a live URL like `curious-marmot-8a3d1f.netlify.app`. That is the site.

Free tier. No credit card. It handles HTTPS, the contact form, and the redirects automatically.

---

## 2. Four things to do before you call it published

### A. The portrait
`press.html` shows a dashed placeholder box where his photograph goes.

1. Save an approved photograph as `media/al-ahsan-portrait.jpg`. Portrait orientation,
   at least 1200 x 1500 pixels.
2. In `press.html`, find the block that begins `<div class="portrait">` and the HTML comment
   directly above it. Delete the `<div class="portrait">...</div>` block and uncomment the
   `<img>` line.

**Never generate or approximate a portrait.** A wrong face on a scholar's site is worse than
no face.

### B. The domain
`civilizationunity.netlify.app` appears in the canonical tags, the `og:image` tags, `sitemap.xml`, and the
one-page PDF. Replace all of them with the real domain once you have one.

Search across the folder for `civilizationunity.netlify.app`. There should be zero matches when you are done.

### C. Form notifications
The contact form works the moment the site is live, but nobody is told when it fires.

In Netlify: **Forms > invitation > Settings and usage > Form notifications > Add
notification > Email notification.** Put his address there.

His email address appears nowhere in the published HTML. That is deliberate. Scrapers
harvest `mailto:` links; they do not fill in forms. The form is the public contact path on the site.

### D. Delete the checklist block
The orange block at the bottom of `index.html` is for you, not for visitors. Find the comment
that says `DELETE THIS BLOCK BEFORE PUBLISHING` and delete through the closing `</aside>`.

---

## 3. Worth doing in the first month

These are the things that make a site last and make him findable, rather than just present.

**Wayback Machine.** Go to `web.archive.org/save` and submit the public page URLs. Repeat
annually. This means the site survives its own hosting.

**ORCID.** Register at orcid.org. It is free, takes twenty minutes, and it is the identifier
every publisher and funder now asks for. Add the five books and the peer-reviewed articles.
Then link the ORCID iD from the footer of every page.

**Google Scholar profile.** Claim the profile, merge the duplicate name forms
(Abdullah al-Ahsan / Abdullah Ahsan / Abdullahil Ahsan), then link it from `writing.html`.

**Informed Comment attribution.** His two May 2026 essays are filed under Juan Cole's author
taxonomy rather than his own, so they do not appear in his author archive. One email fixes it:

> Dear Informed Comment editors,
>
> Two essays published in May 2026 under Professor Abdullah al-Ahsan's byline are currently
> filed under Juan Cole's author taxonomy, so they do not appear in his author archive at
> juancole.com/author/abdullah-al-ahsan. The two are "That Time Iran Proposed a Dialogue of
> Civilizations instead of War" and "Can the Davutoglu Middle Powers Plan Reopen Hormuz?"
> Would you be able to reassign them? Thank you.

**Wikipedia.** His article is stale. It uses the present tense for Istanbul Sehir University,
which closed in 2020, describes his birthplace as East Pakistan without noting he has been in
the United States for years, and asserts a Punjab BA the CV does not carry. Do not edit it
yourself; conflict-of-interest rules apply to family. Use the article's Talk page to post the
corrections with sources, and let an uninvolved editor make them.

**GitHub mirror.** Push the folder to a public repository. GitHub Pages will serve it for free
as a second live copy. If Netlify ever disappears, the site does not.

**Custom domain.** A domain is roughly $12 a year. Two things matter more than the name:
register it for ten years at once, and write down who has the registrar login. Sites die when
a renewal notice goes to an inbox nobody checks anymore. Put a note somewhere permanent saying
who takes it over.

**The old WordPress.** `abdullahalahsan.wordpress.com` is dormant and still ranks. Once this
site has a domain, set a redirect from the WordPress site to it, or at minimum put a link at
the top of the WordPress homepage pointing here.

---

## 4. What is deliberately not here

**No hosted PDFs of his articles.** Most were published under agreements that do not permit
self-hosting. Every link on `writing.html` goes to the publisher or to an open-access
repository. Before adding any PDF, check the journal's policy at Open Policy Finder
(openpolicyfinder.jisc.ac.uk). One takedown notice on a scholar's site is a bad day.

**No email address in the HTML.** See section 2C.

**No analytics, no cookies, no trackers.** Nothing to disclose, nothing to consent to.

**No video autoplay.** The YouTube embeds use the privacy-enhanced domain and load nothing at
all until someone presses play.

**No unauthorized scan of Ummah or Nation.** An earlier draft linked an Internet Archive upload
of the full book that carries no license and no publisher permission. It has been replaced with
the publisher edition and a WorldCat library lookup.

**Two items left out on purpose:** a TRT World Kashmir interview and a Centre for Islamic
Knowledge talk. Neither could be verified as his. If you confirm them, they can be added to
`speaking.html`.

**One review still missing.** The 1988 OIC book has no verifiable published review that could be
located; it is heavily cited but the reviews are not digitized. If one surfaces in the Muslim
World Book Review, Hamdard Islamicus, or the untested 1988 to 1990 second issues of the American
Journal of Islamic Social Sciences, it belongs in the Reception section on `index.html`.

---

## 5. Adding a new piece of writing later

Open `writing.html`, copy any existing `<article class="piece">` block, and edit it. Four
things must be right:

- `data-kind` must be one of `peer`, `chapter`, `book`, `essay`. The filter buttons read this.
- The `tag--` class should match the kind.
- The year goes in `piece__yr`.
- Keep the list in reverse chronological order.

The counter above the list is computed by the script. It updates itself.

---

## Files

```
index.html          Home. Argument chain, videos, Caux, books, reception.
writing.html        39 selected works, filterable by type.
speaking.html       Topics, formats, venues, contact form.
press.html          Three bios, fast facts, name and citation guidance.
assets/site.css     One stylesheet. Light and dark.
assets/site.js      Theme toggle, argument chain, filter, video, copy buttons.
media/              One-page PDF, BibTeX file for the five books, social card image.
_headers            Security headers and cache policy. Netlify reads this.
_redirects          Clean URLs: /writing, /speaking, /press.
robots.txt          Points crawlers at the sitemap.
sitemap.xml         Four URLs.
```
