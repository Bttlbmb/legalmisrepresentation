# Website instructions

This repository contains the public static viewer. Research belongs in the separate backend repository.

- Preserve the current layout, navigation, responsive rules, and behavior unless the user asks to change them.
- Edit the template in `src/page.html` for an authorized interface change. Its single `/*__DATA__*/null` marker is replaced by the backend.
- Do not edit case text in `dist/`; change its subject's backend JSON and regenerate.
- Serve only `dist/` on loopback for preview. GitHub Pages publishes that same folder at https://bttlbmb.github.io/legalmisrepresentation/. The website must work without a running backend.
- Do not add raw research captures, local paths, credentials, or private backend notes to public output.
- After rebuilding, run the backend's `build --check`, check inline JavaScript syntax, and inspect the affected routes in a browser.
- Commit website changes separately from backend changes. Pushing changes to `dist/`, the route test, or the Pages workflow to `main` deploys automatically. Keep research-only tasks local unless publication is authorized.
- Pages uses the GitHub Actions publishing source and `.github/workflows/pages.yml`. After an authorized deployment, wait for the workflow to succeed and verify the live page. Preserve the project subpath and hash-based case links.

## The case page

The page shows what the data holds and never rewrites a quotation. Each behaviour below is driven by a backend export field, so change the data, not the template, to change what a case shows.

- **Passage** (`quote`, `tr`): the English translation comes first and the original follows under its own label, in the quotation marks of its language (`QUOTES`). An English original stands alone. A first line of up to six words without final punctuation becomes the label's heading; line breaks become paragraphs and "•" items become a list. The original always starts hidden behind "Show", marks included; once a reader opens one, later originals stay open for the rest of the session. An English original has no translation to lead with, so it is always shown.
- **Layout mode**: a case whose default text (the translation, or an English original) has more than 60 words (`LONG_WORDS`) gets a wider source column and a pinned law column; shorter ones keep two equal columns. The mode is fixed per case so switching versions does not move the columns. Below 640px the panels stack with the law text first.
- **Versions** (`versions`): one chip per language above the passage, merged when a version repeats the same page and wording, plus a "Page" selector when a language has several pages. Switching must not move the control or drop focus. `cut` on a version shows a fixed note that the publisher's own text ends mid-sentence.
- **Context quotes** (`ctx`): retained in the dataset but not displayed. The owner removed the "Also on the source site" section for the MVP to keep case pages simple. Keep the main passage and the separate scope disclosure intact.
- **Related cases**: case pages in the A1–A3 layouts end after the scope disclosure. The owner removed the bottom "N cases in [issue]" list for the MVP; the breadcrumb still links to the issue's cases.
- **Marked wording** (`marks`, `lawMarks`): the passage highlights every occurrence of each mark in the matching language, the law text highlights `lawMarks`, and a one-line key explains both. A case with no marks shows no highlights and no key. As of 18 October 2026 the 229 cases published then had source and law marks drafted and cross-reviewed by separate agents, and published on the live site; the cases added afterwards (399 in all) also carry marks. These are presentation reviews against retained research, not fresh legal or live-source checks. Correct source versions stay unmarked: this applies to the Thai Airways French passage and its English translation. See the backend's data format for how researchers add marks.

Display rules agreed with the project owner:

- Titles use the publisher in bold followed by the claim, set with plain `text-wrap: wrap`, not `balance` or `pretty`: balance splits a two-line title evenly, and Safari's `pretty` does much the same, so both break far short of the available width. A title or intro keeps its last two words together (`widow()`) so it never ends on one word. The same holds for the front-page and area-page intro lines and the country breakdown, which have no width cap. Keep `balance` only for headings in narrow columns, such as the issue headings on area pages, where the heading wraps anyway. A claim that already starts with the publisher's name ("Rail Europe says …", "Trainline’s …") is not preceded by it twice.
- Digit ranges such as 7–14 and citation groups such as 5(1)(c) never break across lines. This uses non-breaking spans, so copy and search still work.
- Every area on the front page shows its applicable law (`lawShort`, for example "German law", "EU law" or "EU and German law"), government areas included, so rows look alike. Government areas show their law but no "Cases from N countries": every case concerns a German institution and the countries only mark where an embassy sits. Company areas keep the count.
- The front page lists each area's first four issues and "and N more issues"; the area page lists them all.
- The header shows the logo (white not-equal sign on the dark header tone) beside the title; both words use the ink colour, with no red or green because those colours mean claim and law elsewhere.

## Institution pages

A second way in beside the issue pages: the **By issue / By institution** switch on the front page, a **group page** for each cohort ("Jobcenters") and an **institution page** for each member. All of it is driven by `DATA.groups` (exported from the backend's `subjects/institutions/`); with no groups the page, its routes and its markup are exactly as before, so a build without group data changes nothing visible.

- **Routes** (layout A1 only): `#A1.inst`, `#A1.group.<groupId>`, `#A1.entity.<groupId>~<entityId>`. Unknown ids fall back to the front page.
- **Group page:** summary bar and legend, one card per question (the title opens that question's "Who said what" list below, where the issue page is linked first; the question sentence, "The law" line, count and bar), then "Who said what": one collapsed list per question with the group's institutions that were misstated on it, each with the claim and a "Read the case" link (built from the group's own results so it adds up to the card; the card's "Show the N institutions" link opens it; a card with none misstated shows "Read the issue" or "No institutions to list" in the same place so the cards in a row stay the same height, and its first line, "What the law says and every source: read the issue", leads to the issue page), then a directory with search, a "With a misstatement / All" filter, a state select and "Show more". Directory rows name the misstated questions. Controls update in place so a clicked control never moves or loses focus. Searching inside the misstatement filter offers "Search all" when nothing matches.
- **Institution page:** one card per question with a result footer (label, one sentence, "Page checked" link; a "Run by" line names the company where the data has one, as for mobile brands). "Misstated" always links to a published case. Findings that lack a published case show as "Not yet published" and are never counted as misstatements.
- **Labels:** Misstated, Unclear, Not addressed or not found, No misstatement found, Not yet published (in the legend only for groups that have such rows). The page says "No misstatement found", not "correct": many negative results were not independently reviewed.
- **Display rules agreed with the project owner:** no "not a ranking" note (the group lede states how many were checked on how many questions); question text uses the full card width; questions and results sit in concise cards; red stays "what the source says"; the result squares carry text and an `aria-label` as well as colour. The bar on a group page and front-page line counts institutions, each coloured by its worst result (misstated, else not yet published, else unclear, else no misstatement found), so its red part matches the "N of M had at least one misstatement" figure; the question cards count institutions per question; check totals are written in words and never drawn on the same bar.
- **Data:** see the backend's data format ("Institution groups"). Question sentences and law lines are editorial text in the group file, not derived from the sweep.
- **Checking a change:** `node tests/check_routes.cjs dist/index.html dist/data.json` renders every group and institution route (and checks that, without groups, no institution switch appears); then follow the checks above in the browser at 320, 390, 768 and 1280, light and dark.

## Checking a change

- After a rebuild run the route test, check the inline JavaScript syntax, and open the affected pages at 320, 390, 768 and 1280px. When a change should leave other pages untouched, render every case and area page with the previous and the new build and compare the markup; do this for any change to passage rendering.
- Playwright is not installed and must not be installed without the owner's approval. Measure in the built-in browser. Headless Chrome cannot render below about 500px, so take narrow screenshots inside an exact-width frame (an iframe of the target width). Its dark mode setting did not apply; check dark mode in the browser pane.
- Previews of proposed changes are made by injecting temporary CSS and JavaScript into a copy of the built page. Never edit `src/` or `dist/` to preview an idea the owner has not approved.

## Open design proposals

A review of 18 October 2026 produced ten proposals. Built and published: the version switcher, wider titles, kept-together ranges and citations, and shorter front-page issue lists. Not built, so do not treat them as decided; ask the owner first:

- Stack the compare panels up to 900px instead of 640px (at 768px the law column is only about 300px wide).
- Treat only a first line of three words or fewer as a heading, so a six-word table header stays in the passage.
- Give every disclosure row a 44px tap area on phones.
- Optional: put the hypothetical example after the passage on stacked layouts; add an issue jump list to area pages with five or more issues.

Other treatments for marked wording (spotlighting whole sentences, numbered markers with a "what differs" line, folding the unmarked text) were previewed and not chosen. Folding text is only safe if researchers mark which text may be hidden, because the unmarked text often holds the qualification that makes a finding fair.

Known data issues the page works around or shows as they are:

- Three cases list an identical version twice (`airlines-thai-airways-timing`, `roaming-vodafone-pt-net-label`, `roaming-lebara-current-examples`); the page merges them.
- Five rail claims start with the publisher's name, so titles would repeat it (`rail-sncf-connect-ouigo-voucher-only`, `rail-sncf-connect-ouigo-refund-fallback`, `rail-omio-through-ticket-force-majeure`, `rail-raileurope-retailer-prior-notice`, `rail-trainline-trenitalia-sixty-minute-band`); the page drops the repeat.
- Some passages run a source list together as plain text (for example `rail-raileurope-retailer-prior-notice`); the page can only build a list from line breaks and "•".
