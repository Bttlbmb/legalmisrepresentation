# Legal Misrepresentation

A static viewer of published guidance that conflicts with the law it describes. Each case pairs the wording with a legal comparison, a hypothetical example, and its scope and source context.

- `src/page.html` contains the page template, CSS, and browser JavaScript.
- `dist/index.html` is the complete generated website, with data embedded.
- `dist/data.json` is the same published dataset for inspection or reuse.

Serve **only `dist/`**:

```sh
python3 -m http.server 8731 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8731. Any static host can serve these files; there is no server application, database, or installation step. Fonts load from Google Fonts, with local fallbacks.

Research and generation live in the separate [backend repository](https://github.com/Bttlbmb/legalmisrepresentation-generator). With both repositories checked out beside one another, generate an update from the backend:

```sh
python3 run.py validate
python3 run.py build --website ../website
python3 run.py build --website ../website --check
```

If Node.js is available, check every area, topic, and case in all six layouts with `node tests/check_routes.cjs dist/index.html dist/data.json` from this repository. This exercises both narrow and wide rendering branches; it does not replace visual inspection in a browser.

The October 2026 restructuring preserved the original template, generated HTML, and all 166 cases byte for byte. This repository does not configure a deployment or republish the earlier prototypes.
