# Civilizational Unity source notes

## Website CV — 2026-08-05

Primary source: `CV Abdullah Ahsan.docx`, supplied by Abdullah al-Ahsan by email specifically for the website.

Professor al-Ahsan described that document as “not complete yet” while saying he had included most of the record. Public pages should therefore describe it as a supplied/selected record rather than an exhaustive lifetime bibliography.

### Public-use decisions

- Education, academic appointments, affiliations, languages, books, publication details and selected presentations may be used with the source caveat.
- Private home address and telephone information are excluded from the public repository.
- Translation/reprint statements remain attributed to the supplied CV unless separately verified.
- A professor-approved website portrait was not identified in the website CV thread or targeted Gmail search; passport and unrelated inline images must not be repurposed.
- Online class presentations are not treated as approved because Professor al-Ahsan expressed uncertainty about posting them.
- The first YouTube presentation he supplied should not be described as an edited master unless separately confirmed; he asked that it be edited before posting.
- ORCID and Google Scholar identities must not be inferred. Publication identifiers may be added only after record-level verification against a publisher, journal, institutional repository, or authoritative library record.

## Structured scholarly record

`data/core-works.json` is a curated subset for research-tool development, not a complete bibliography. It now carries verified DOI/ISBN/OCLC or repository information where independently established. Citation exports must preserve creator roles: edited volumes are not to be represented as sole-authored books.

### Open metadata discrepancies

These are intentionally preserved rather than silently reconciled:

- **The Never-Ending Kashmir Dispute…** — supplied CV: pp. 5–34; IIUM Repository: pp. 1–27. Check the authoritative published issue before changing the public record.
- **Muslim and European Perceptions of Oceanic “Trade”…** — supplied CV: pp. 172–188; journal-hosted PDF: pp. 169–184. Check the authoritative issue/contents record before changing the public record.
- **Law, Religion and Human Dignity…** — Cambridge publisher record: pp. 569–597; IIUM Repository profile: pp. 569–598. The structured record follows the publisher while preserving this note.

### Verified identifier examples

- *Qur’anic Guidance for Good Governance* — DOI `10.1007/978-3-319-57873-6` and Springer ISBNs verified from Springer Nature.
- “Law, Religion and Human Dignity…” — DOI `10.1017/S0748081400001715` verified from Cambridge University Press.
- “Is Pakistan a Failed State?” — DOI `10.25253/99.2018201.08` verified from Insight Turkey.
- “The Question of Palestine and the Muslim World” — DOI `10.29311/nmes.v8i2.3059` added only after record-level verification.

The public interface should favor concise statements and let readers expand or follow links for depth. Curatorial pathways must remain visibly separable from Professor al-Ahsan’s own wording and published arguments.

## Current Affairs Forum archive — 2026-09-07

Primary source: email from Abdullah al-Ahsan reporting that a former student sent him
`https://currentaffairsforum.wordpress.com/category/current-affairs-articles/` and stating, "I have articles here."

### Public-use decisions

- The archive is linked from `/writing` as an outward pointer on the strength of that author statement.
- It is a multi-author forum, not a personal author archive. The link text and surrounding sentence say so; the site must not present the whole archive as his work.
- Professor al-Ahsan confirmed by email (2026-09-07) that three posts are his contributions and supplied their links. Those three are listed on `/writing`; nothing else from the archive is.
- He also stated he was the forum's main advisor and asked that this not be mentioned. The role must not appear on the site, in the CV page, or in structured data.
- The printed titles of the Kashmir and Erdogan-Davutoglu pieces are rendered from their post slugs; the pages themselves were not reachable from this environment. Confirm the printed titles when the archive is next accessible.
- The archive was not reachable from the environment used to make this change (network egress to `wordpress.com` blocked), so the candidate list in the intake note is drawn from search-engine results and is labeled unverified.
- Do not add this URL to the `sameAs` list in the homepage JSON-LD. `sameAs` asserts identity, and a multi-author forum is not an identity record for one person.

## IslamiCity and Informed Comment archives — 2026-09-21

Primary source: email from Abdullah al-Ahsan listing three author-archive URLs as "the
websites that have published my articles in recent years" —
`islamicity.org/by/abdullah-ahsan/`, `islamicity.org/by/abdullah-al-ahsan/` and
`juancole.com/author/abdullah-al-ahsan`.

### Public-use decisions

- The second IslamiCity author page (`abdullah-ahsan`) is added to the `/writing` archive
  links and to the homepage `sameAs` list. Both slugs are author pages for him, supplied by
  him, so both are identity records; this is not the multi-author case that keeps the Current
  Affairs Forum out of `sameAs`.
- `/writing` states that IslamiCity files his work under two author pages, so a reader who
  finds one does not assume it is the whole record.
- No individual IslamiCity or Informed Comment article is added. His email confirms the
  archives, not specific pieces, and the article pages could not be read: `islamicity.org`,
  `juancole.com` and `archive.org` are all blocked by the egress proxy of the environment used
  for this change. Search results give titles and URLs but no byline and no date, and both
  publications are multi-author, so a name-matched search hit is not attribution.
- Candidates found by search are held in `docs/islamicity-informed-comment-intake.md`, labeled
  unverified, with a prompt for a session that can reach the archives.

Superseded the same day by the verification pass below, which read the archives and published
the confirmed articles. The record above is kept because it states why the hold existed.

## IslamiCity and Informed Comment articles — 2026-09-21 (verification pass)

Primary sources: the three author archives named in his email, read to the last entry, and
every article page behind them. Informed Comment was read directly. IslamiCity serves a
Cloudflare bot challenge that returns 403 to plain HTTP clients, so both of its author pages
were read in a browser session, paging each list with its "Load More" control until the control
was hidden. The full capture is in `docs/islamicity-informed-comment-intake.md`.

### What was verified

- Thirty-six archive entries: fourteen under `islamicity.org/by/abdullah-ahsan/`, twelve under
  `islamicity.org/by/abdullah-al-ahsan/`, ten on Informed Comment across two pages.
- Every printed title, printed byline and printed date was read on the article page itself, not
  inferred from a listing or a URL slug.
- Twenty-seven rows added to `/writing`; two existing rows corrected. Thirteen of the sixteen
  earlier search-derived candidates confirmed, three rejected, none unresolved.

### What was rejected, and why it matters

Three candidates carry another writer's byline: one IslamiCity piece by Muhammed Ali, and two
Informed Comment pieces by Juan Cole. All three had surfaced under searches restricted to
Professor al-Ahsan's name. This is the concrete case for the standing rule that a name-matched
search hit is not attribution.

### Byline forms

IslamiCity prints **Abdullah Ahsan** under one slug and **Abdullah Al-Ahsan** under the other;
Informed Comment prints **Abdullah al-Ahsan**. All three are his, on archives he supplied. The
site uses its own established form in prose and does not normalize the publishers' records.

### Discrepancies preserved rather than reconciled

- Part 7 of the American-politics series prints 2024-05-29 and part 8 prints 2024-05-28. The
  listing follows the printed dates, so part 7 sits above part 8.
- The series has no printed name. "Challenging Narratives" appears only inside one URL slug, so
  no series label is published.
- The slugs for parts 4 and 8 omit the part number their headlines carry.
- The 2005 Kashmir headline prints backticks around `Irreversible Peace Process`; they are kept.
- IslamiCity and Informed Comment print different subtitles for the Bernadotte essay. The site
  keeps the form it already carried.
- Titles already on the page that are lightly shortened against the printed headlines were left
  alone. They are a known, separate question and were out of scope for this pass.
- `writing-v2.html` uses straight apostrophes and literal typographic characters rather than
  HTML entities. New rows follow the file, not the publishers' entity choices.

### Republication handling

Three essays ran in both venues. Each is one entry, with the second venue named in the source
line, on evidence of verbatim or near-verbatim openings. A fourth pair — the Informed Comment
and IslamiCity pieces on the Saudi-Pakistan defense pact — shares an argument and a source set
but no verbatim passage, so both are listed. Collapse that pair only on his word.

### Still open

- No Wayback snapshots. Save Page Now returned HTTP 500 and a sign-in form for unauthenticated
  requests, and the Internet Archive's lookup services were degraded during the attempt, so
  existing snapshot status could not be established either. Every confirmed URL, and the three
  Current Affairs Forum posts, remain unsnapshotted.
- No individual article URL was added to the homepage `sameAs` list, and none should be.
