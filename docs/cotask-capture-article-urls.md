# Cotask — capture and verify the IslamiCity and Informed Comment articles

Hand this to a Cowork task or Claude Code session that can reach `islamicity.org` and
`juancole.com`. The session that opened `docs/islamicity-informed-comment-intake.md` could
not: those hosts and `archive.org` were blocked by its egress proxy. Everything the runner
needs is below; it does not need to read this repository's history first.

Paste everything between the rules.

---

## TASK: Capture Abdullah al-Ahsan's IslamiCity and Informed Comment articles and add the confirmed ones to the site
## AGENT: Cowork task or Claude Code session with unrestricted web access (or a browser agent driving a real browser)
## REPO: saebchicago/civilizationalunity
## SITE: https://civilizationunity.netlify.app

### CONTEXT

A static HTML site (no framework, no build step) publishing the scholarly record of Professor
Abdullah al-Ahsan, a historian of civilizations. `/writing` is served from `writing-v2.html`
and lists roughly forty pieces as plain `article.piece` elements. `node scripts/site-audit.mjs`
is the only check; GitHub Actions runs it on every PR.

The site's standing rule is that nothing is published without record-level verification.
Professor al-Ahsan supplied three author-archive URLs by email on 2026-09-21. The archives are
linked from `/writing`, but no individual article from them is listed, because the previous
session's network policy blocked both publishers and could not read a single byline.
`docs/islamicity-informed-comment-intake.md` holds sixteen search-derived candidates, labeled
unverified. Your job is to replace that guesswork with what the archives actually say.

### OBJECTIVE

1. Read all three author archives in full, including every page of pagination.
2. Record, for each article, the exact printed title, the byline as printed, and the
   publication date as printed on the article page.
3. Reconcile that capture against the candidate table in the intake note: correct, drop, add.
4. Add the confirmed pieces to `writing-v2.html`.
5. Update the intake note and `docs/source-notes.md` to say what was verified and how.
6. Submit each confirmed URL to the Wayback Machine.
7. Open a draft PR.

### CONSTRAINTS

**MUST**

- Read the byline on the article page itself. An article appearing in an author-archive
  listing is good evidence; the printed byline is the confirmation. Record both.
- Use the title exactly as printed, including subtitle, capitalization and punctuation. Escape
  apostrophes as `&rsquo;` where the surrounding file does.
- Use the date printed on the article page, not the date in the URL, when the two differ, and
  note the discrepancy.
- Run `node scripts/site-audit.mjs` before committing and confirm it passes.
- Work on a new branch off the latest `main`.

**MUST NOT**

- Publish any piece whose byline you did not read. Anything unconfirmed stays in the intake
  note, labeled, rather than going on the site.
- Invent, normalize or "clean up" a title or date. If a page will not load, say so and leave
  the candidate unverified.
- Mention that Professor al-Ahsan advised the Current Affairs Forum. He asked in writing that
  the role not appear anywhere on the site.
- Modify `assets/`, `data/core-works.json`, `_redirects`, `_headers`, `sitemap.xml`, or any
  page other than `writing-v2.html` and the two files in `docs/`.
- Add either IslamiCity slug or any new URL to the homepage `sameAs` list. Both author pages
  are already there; nothing else belongs.

### EXECUTION SEQUENCE

#### Step 1: Get the repo

**Do**: Clone or pull `saebchicago/civilizationalunity`, then
`git checkout -b claude/verify-islamicity-articles origin/main`.
**Verify**: `docs/islamicity-informed-comment-intake.md` exists and `node scripts/site-audit.mjs` passes on a clean tree.
**If fails**: Stop and report. Do not work against a stale or dirty tree.

#### Step 2: Capture the archives

**Do**: Open each of these and page through to the end:

- https://www.islamicity.org/by/abdullah-ahsan/
- https://www.islamicity.org/by/abdullah-al-ahsan/
- https://www.juancole.com/author/abdullah-al-ahsan

For every article listed, open the article page and record four fields: URL, printed title,
printed byline, printed date. Write them to a scratch file as you go, one row per article.

**Verify**: Your row count matches the number of entries the archives list. State the count for
each archive.
**If fails**: If a host blocks you or a page 404s, record the URL with the reason and continue.
A partial capture is fine; a capture that silently skips entries is not.

#### Step 3: Find the series

**Do**: Two candidates are numbered parts ("Part 5", "Part 12") of an IslamiCity series on
Muslims and American politics, described in search results as "Challenging Narratives". If the
series is his, find every part. Use IslamiCity's own search and the archives' pagination.
**Verify**: Either a contiguous list of parts with bylines, or a statement of which parts you
could not locate.
**If fails**: Record what you found, flag the gap in the intake note, do not guess at the rest.

#### Step 4: Resolve the two known ambiguities

**Do**:
1. `/writing` already carries an unlinked 2023 entry, "Is the One-Sided US Response to the Gaza
   Crisis a Sign of our Civilizational Decline?". Check whether it is the same piece as
   https://www.juancole.com/2023/11/leaders-reacting-conflict.html under a different headline.
   If it is, add the link to the existing entry rather than creating a second one.
2. Several IslamiCity pieces look like republications of Informed Comment essays already on the
   page (the Bernadotte essay, the Saudi-Pakistan defense pact essay). Where a piece is a
   republication, keep one entry and note the second venue in the source line rather than
   listing the same essay twice.

**Verify**: State your finding for each, with the evidence that decided it.
**If fails**: Leave both as they are and flag the question in the intake note.

#### Step 5: Reconcile

**Do**: Compare your capture against the candidate table in
`docs/islamicity-informed-comment-intake.md`. Produce three lists: confirmed (byline read),
rejected (byline is someone else's), unresolved (page unreachable). Rewrite the note's table so
each row carries its status.
**Verify**: Every one of the sixteen candidates appears in exactly one of the three lists.
**If fails**: Do not proceed to Step 6 with candidates unaccounted for.

#### Step 6: Publish the confirmed pieces

**Do**: Add each confirmed piece to the `.rows` container in `writing-v2.html`, following the
existing markup exactly. The list runs newest first. Template:

```html
<article class="piece" data-kind="essay"><div class="piece__meta"><span class="tag tag--essay">Essay</span><span class="piece__yr">2026</span></div><div><h2 class="piece__t"><a href="URL">TITLE</a></h2><p class="piece__src">IslamiCity, August 2026</p></div></article>
```

Use `data-kind="essay"` for all of these; that is the filter bucket for commentary. The visible
tag is `Essay` for a general piece or `Analysis` for a current-events analysis, matching how the
page already distinguishes them. The source line names the publication and the month and year.

**Verify**: `node scripts/site-audit.mjs` passes. Open `writing-v2.html` in a browser, confirm
the new entries appear in year order, that the "Commentary" filter chip includes them, and that
the count line at the top of the list updates.
**If fails**: Fix the markup. Do not edit `scripts/site-audit.mjs` to make a check pass.

#### Step 7: Snapshot

**Do**: Submit each confirmed URL to `https://web.archive.org/save/<url>`. Include the three
Current Affairs Forum posts listed in `docs/current-affairs-forum-intake.md`, which are still
unsnapshotted.
**Verify**: Each returns a snapshot URL. Record them in the intake note.
**If fails**: Note which failed. A free WordPress blog and a publisher CMS can both disappear;
the snapshot is the durable citation, so say plainly if one is missing.

#### Step 8: Record and open the PR

**Do**: Add a dated entry to `docs/source-notes.md` in the style of the existing entries: the
primary source, what was verified, what was rejected and why, and any title or date discrepancy
you preserved rather than reconciled. Commit, push, open a **draft** PR.
**Verify**: The Actions `audit` check passes on the PR.
**If fails**: Fix forward on the branch.

### PAUSE: Before publishing anything you are unsure about

If a byline is ambiguous (initials only, a shared byline, an editor's note, a reprint credit),
stop and ask the user rather than deciding. The cost of a wrong attribution on a scholar's own
site is much higher than the cost of one more question.

### FINAL VALIDATION

- [ ] All three archives read to the last page of pagination, with counts stated
- [ ] Every published piece has a byline you read on the article page
- [ ] Titles and dates match the printed pages, with discrepancies noted rather than smoothed
- [ ] No duplicate entry for a piece republished in a second venue
- [ ] `node scripts/site-audit.mjs` passes
- [ ] The Commentary filter and the count line behave correctly in a browser
- [ ] Intake note rewritten: confirmed, rejected, unresolved, with Wayback URLs
- [ ] `docs/source-notes.md` has a dated entry
- [ ] Nothing about the Current Affairs Forum advisory role anywhere
- [ ] Draft PR open, `audit` green

If any check fails, fix it on the branch before reporting the task complete. Report what you
could not verify as plainly as what you could.

---

## If the runner is a browser agent rather than a coding session

Run Steps 2 through 4 only, and have it write the four captured fields per article to a text
file. Then hand that file to a Claude Code session with the rest of this prompt. The capture is
the part that needs a browser; the edit is the part that needs the repo.
