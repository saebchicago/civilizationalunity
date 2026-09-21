# IslamiCity and Informed Comment — intake record

Status: **open.** Nothing in the candidate table below is on the site. The three author
archives are linked from `/writing`; the individual pieces are not listed because they could
not be verified from the environment used to open this record.

This note describes the repository, not the world: it says what has been verified *here*, so
it stays accurate whether or not a capture is under way elsewhere. Whoever lands a completed
capture closes it out in the same commit — rewrite the candidate table into confirmed,
rejected and unresolved, delete `docs/cotask-capture-article-urls.md`, and remove the pointer
to it below. Until then this note stands on its own and nothing here is waiting on anything.

## Author statement

Abdullah al-Ahsan supplied three URLs by email (2026-09-21) as "the websites that have
published my articles in recent years":

| Archive | URL | On the site |
| --- | --- | --- |
| IslamiCity (slug `abdullah-ahsan`) | https://www.islamicity.org/by/abdullah-ahsan/ | Linked from `/writing` as of this change |
| IslamiCity (slug `abdullah-al-ahsan`) | https://www.islamicity.org/by/abdullah-al-ahsan/ | Already linked |
| Informed Comment | https://www.juancole.com/author/abdullah-al-ahsan | Already linked |

His email confirms the archives, not any particular article. That distinction is the reason
for the split between what was published and what is held below.

## Why the individual pieces are not published

`www.islamicity.org`, `www.juancole.com` and `archive.org` are all blocked by the network
egress proxy of the environment used for this change (403 on CONNECT). The author pages, the
article pages and the Wayback Machine were therefore all unreachable. The only working channel
was a web search tool, which returns titles and URLs but no byline and no publication date.

Attribution matters more than volume here. Both IslamiCity and Informed Comment are
multi-author publications, so an article surfacing in a search for his name is not evidence
that he wrote it. A targeted check confirmed the limit directly: a search for the byline of
one candidate returned "the author byline is not visible in the search results."

## Candidates — unverified, do not publish as-is

Titles and URLs below come from search-engine results. Dates come from the same summaries or,
where the URL carries one, from the permalink. None of the three fields is confirmed.

### IslamiCity

| Apparent date | Title as indexed | URL |
| --- | --- | --- |
| 2026-08 | Makkah or Military Power? Has the Muslim World Lost the Meaning of the Ummah? | https://www.islamicity.org/107009/makkah-or-military-power-has-the-muslim-world-lost-the-meaning-of-the-ummah/ |
| 2026-06 | Can Muslims Really Trust Artificial Intelligence?! | https://www.islamicity.org/106752/can-muslims-really-trust-artificial-intelligence/ |
| 2026-03 | Human Intelligence and Artificial Intelligence: Distinction, Dignity, and Complementarity | https://www.islamicity.org/106383/human-intelligence-and-artificial-intelligence-distinction-dignity-and-complementarity/ |
| 2025-10 | Israeli Aggression, Saudi-Pakistan Defense Pact, and the Question of Muslim Unity | https://www.islamicity.org/105749/israeli-aggression-saudi-pakistan-defense-pact-and-the-question-of-muslim-unity/ |
| 2025-09 | Assassinating Peace: How Bernadotte's Murder Ended the Two-State Dream | https://www.islamicity.org/105626/assassinating-peace-how-bernadottes-murder-ended-the-two-state-dream/ |
| 2025 | Pakistan's Operation Bunyan-un-Marsus and Its Implications | https://www.islamicity.org/104696/pakistans-operation-bunyan-un-marsus-and-its-implications/ |
| 2025-03 | The Battle of Badr: A Victory That Shaped the Muslim Ummah | https://www.islamicity.org/104341/the-battle-of-badr-a-victory-that-shaped-the-muslim-ummah/ |
| 2025-03 | Taqwah Through Time: Ethics, Fasting & Civilization | https://www.islamicity.org/104204/taqwah-through-time-ethics-fasting-civilization/ |
| 2024-08 | Part 12: Netanyahu's Reinterpretation of Civilizations and Barbarism | https://www.islamicity.org/102391/part-12-challenging-narratives-netanyahus-reinterpretation-of-civilizations-and-barbarism/ |
| 2024 | Part 5: How do Muslims Interact with Non-Muslims in America? | https://www.islamicity.org/101614/part-5-how-do-muslims-interact-with-non-muslims-in-america/ |
| undated | The Gaza Crisis: A National Interest? | https://www.islamicity.org/91475/the-gaza-crisis-national-interest/ |

Two of these are numbered parts of what search results describe as a "Challenging Narratives"
series on Muslim participation in American politics. If the series is his, the other parts
belong in the same pass; the series has at least twelve parts and only two surfaced in search.

### Informed Comment

| Apparent date | Title as indexed | URL |
| --- | --- | --- |
| 2026-08 | From the Mecca Program of 2005 to the "Mecca Defense Agreement" of 2026: Has the Muslim World Moved from Civilizational Renewal to Regime Security? | https://www.juancole.com/2026/08/agreement-civilizational-security.html |
| 2025-11 | Conflicting Visions of an International Force for Gaza in Istanbul and Washington | https://www.juancole.com/2025/11/conflicting-international-washington.html |
| 2024-11 | Killing One Innocent Soul is the Same as Killing all of Humanity: Jewish and Muslim Teachings against Cosmocide | https://www.juancole.com/2024/11/innocent-teachings-cosmocide.html |
| 2023-11 | How are Leaders in the Muslim World Reacting to the Gaza Conflict? | https://www.juancole.com/2023/11/leaders-reacting-conflict.html |
| 2020-05 | The Coronavirus and Geo-Politics: Trump's Xenophobia and Weapons of the Weak | https://www.juancole.com/2020/05/coronavirus-xenophobia-weak.html |

The 2023 Informed Comment entry already on `/writing`, "Is the One-Sided US Response to the
Gaza Crisis a Sign of our Civilizational Decline?", carries no link. Check whether it is the
same piece as the 2023-11 candidate under a different headline before listing both.

## Prompt for the next session

The full handoff prompt is `docs/cotask-capture-article-urls.md`. The short form:

Run this where `islamicity.org` and `juancole.com` are reachable — a local machine, or a
session whose egress policy allows those hosts.

> Open https://www.islamicity.org/by/abdullah-ahsan/ ,
> https://www.islamicity.org/by/abdullah-al-ahsan/ and
> https://www.juancole.com/author/abdullah-al-ahsan , including every page of each archive.
> For each article listed there, record the exact printed title, the byline, and the
> publication date shown on the article page itself. Compare that list against the candidate
> table in `docs/islamicity-informed-comment-intake.md`: correct any title or date that
> differs, drop any candidate whose byline is not his, and add anything the archives list that
> the table missed. Then add the confirmed pieces to the `.rows` list in `writing-v2.html`,
> following the existing `article.piece` markup, `data-kind="essay"`, newest first within the
> year ordering, with the source line naming IslamiCity or Informed Comment and the month and
> year. Update `docs/source-notes.md` with a dated entry recording what was verified and how.
> Do not publish anything whose byline you did not read on the article page.

Also worth doing in that session: submit each confirmed URL to the Wayback Machine, the same
durable-citation step still open for the Current Affairs Forum posts.
