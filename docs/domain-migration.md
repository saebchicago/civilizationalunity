# Canonical domain migration

## Recommended public identity

Primary brand and canonical domain: **Civilizational Unity** / `civilizationalunity.com`.

If available and reasonably priced, also acquire `civilizationunity.com` and redirect it permanently to the primary domain. The shorter phrase is useful as a defensive alias, but it is less precise as the name of Professor Abdullah al-Ahsan's intellectual platform.

## Why the longer name is primary

- **Civilizational** describes the level of analysis in Professor al-Ahsan's scholarship: civilizations, institutions, encounter, dialogue, decline and renewal.
- **Civilization Unity** can read as an advocacy organization or a general social-cohesion initiative rather than a scholarly thesis or intellectual program.
- The homepage should resolve any abstraction by immediately pairing the brand with **Abdullah al-Ahsan — Historian of Civilizations**.
- Consistency between brand, domain, page titles and structured data is more valuable than saving four characters.

## Do not cut over before ownership and Netlify attachment

The current `civilizationunity.netlify.app` URLs remain canonical until the preferred custom domain is registered, attached to the Netlify project, DNS is verified and HTTPS is active. Do not publish canonicals pointing to an unowned or unattached domain.

## Cutover checklist

Once `civilizationalunity.com` is owned and attached:

1. Make `https://civilizationalunity.com` the Netlify primary domain and confirm HTTPS.
2. Configure `www.civilizationalunity.com` to redirect to the apex domain (or choose the reverse, but use one canonical host consistently).
3. If owned, redirect `civilizationunity.com` and its `www` host to `https://civilizationalunity.com` with permanent redirects.
4. Replace `https://civilizationunity.netlify.app` in:
   - HTML canonical links
   - Open Graph URLs and absolute images
   - JSON-LD `@id` and `url` values
   - `robots.txt`
   - `sitemap.xml`
   - `llms.txt` and any deployment documentation where it is intended as the public canonical
5. Add an explicit Netlify redirect from the `netlify.app` hostname to the custom canonical host if Netlify configuration permits without creating redirect loops.
6. Validate every production route and the invitation form after cutover.
7. Submit the new sitemap to Google Search Console and Bing Webmaster Tools, and request indexing for the homepage, Writing, About, Speaking and Press pages.
8. Update authoritative identity records where appropriate (for example Wikidata and institutional profiles) to point to the canonical site.
9. Keep the old Netlify hostname operational only as an infrastructure alias; it should not remain the public canonical identity.

## Domain principle

The site should read as **a scholar's intellectual home**, not as an anonymous institution. The public pairing should remain:

> Civilizational Unity  
> Abdullah al-Ahsan — Historian of Civilizations
