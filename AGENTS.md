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
- **Context quotes** (`ctx`): shown under the compare panels as "Also on the source site", translation first.
- **Marked wording** (`marks`, `lawMarks`): the passage highlights every occurrence of each mark in the matching language, the law text highlights `lawMarks`, and a one-line key explains both. A case with no marks shows no highlights and no key. As of 18 October 2026 all 229 published cases have source and law marks drafted and cross-reviewed by separate agents, and published on the live site. These are presentation reviews against retained research, not fresh legal or live-source checks. Correct source versions stay unmarked: this applies to the Thai Airways French passage and its English translation. See the backend's data format for how researchers add marks.

Display rules agreed with the project owner:

- Titles use the publisher in bold followed by the claim, set with `text-wrap: pretty`, not `balance`: balance splits a two-line title evenly and breaks it far short of the available width. The same holds for the front-page and area-page intro lines and the country breakdown, which have no width cap. Keep `balance` only for headings in narrow columns, such as the issue headings on area pages, where the heading wraps anyway. A claim that already starts with the publisher's name ("Rail Europe says …", "Trainline’s …") is not preceded by it twice.
- Digit ranges such as 7–14 and citation groups such as 5(1)(c) never break across lines. This uses non-breaking spans, so copy and search still work.
- Government areas show their law but no "Cases from N countries": every case concerns a German institution and the countries only mark where an embassy sits. Company areas keep the count.
- The front page lists each area's first four issues and "and N more issues"; the area page lists them all.
- The header shows the logo (white not-equal sign on the dark header tone) beside the title; both words use the ink colour, with no red or green because those colours mean claim and law elsewhere.

## Checking a change

- After a rebuild run the route test, check the inline JavaScript syntax, and open the affected pages at 320, 390, 768 and 1280px. When a change should leave other pages untouched, render every case and area page with the previous and the new build and compare the markup; do this for any change to passage rendering.
- Playwright is not installed and must not be installed without the owner's approval. Measure in the built-in browser. Headless Chrome cannot render below about 500px, so take narrow screenshots inside an exact-width frame (an iframe of the target width). Its dark mode setting did not apply; check dark mode in the browser pane.
- Previews of proposed changes are made by injecting temporary CSS and JavaScript into a copy of the built page. Never edit `src/` or `dist/` to preview an idea the owner has not approved.

## Open design proposals

A review of 18 October 2026 produced ten proposals. Built and published: the version switcher, wider titles, kept-together ranges and citations, and shorter front-page issue lists. Not built, so do not treat them as decided; ask the owner first:

- Stack the compare panels up to 900px instead of 640px (at 768px the law column is only about 300px wide).
- Show context quotes in columns about 60 characters wide on wide screens (today a line runs 116 to 135 characters).
- Treat only a first line of three words or fewer as a heading, so a six-word table header stays in the passage.
- Give every disclosure row a 44px tap area on phones.
- Optional: put the hypothetical example after the passage on stacked layouts; add an issue jump list to area pages with five or more issues.

Other treatments for marked wording (spotlighting whole sentences, numbered markers with a "what differs" line, folding the unmarked text) were previewed and not chosen. Folding text is only safe if researchers mark which text may be hidden, because the unmarked text often holds the qualification that makes a finding fair.

Known data issues the page works around or shows as they are:

- Three cases list an identical version twice (`airlines-thai-airways-timing`, `roaming-vodafone-pt-net-label`, `roaming-lebara-current-examples`); the page merges them.
- Five rail claims start with the publisher's name, so titles would repeat it (`rail-sncf-connect-ouigo-voucher-only`, `rail-sncf-connect-ouigo-refund-fallback`, `rail-omio-through-ticket-force-majeure`, `rail-raileurope-retailer-prior-notice`, `rail-trainline-trenitalia-sixty-minute-band`); the page drops the repeat.
- Some passages run a source list together as plain text (for example `rail-raileurope-retailer-prior-notice`); the page can only build a list from line breaks and "•".
