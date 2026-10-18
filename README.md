# Legal Misrepresentation

A static viewer of published guidance that conflicts with the law it describes. Each case pairs the wording with a legal comparison, a hypothetical example, and its scope and source context. [AGENTS.md](AGENTS.md) describes what the case page shows, which export field drives each part, the agreed display rules, and the open design proposals.

Live website: **https://bttlbmb.github.io/legalmisrepresentation/**

- `src/page.html` contains the page template, CSS, and browser JavaScript.
- `dist/index.html` is the complete generated website, with data embedded.
- `dist/data.json` is the same published dataset for inspection or reuse.

Serve **only `dist/`**:

```sh
python3 -m http.server 8731 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8731. There is no server application, database, or installation step. Fonts load from Google Fonts, with local fallbacks.

GitHub Pages serves only `dist/`. The [deployment workflow](.github/workflows/pages.yml) checks all viewer routes and publishes that folder when changes to `dist/`, the route test, or the workflow reach `main`. Documentation-only changes do not redeploy. A deployment can also be started manually from the repository's Actions tab. Pages settings must use **GitHub Actions** as the publishing source.

Research and generation live in the separate [backend repository](https://github.com/Bttlbmb/legalmisrepresentation-generator). With both repositories checked out beside one another, generate an update from the backend:

```sh
python3 run.py validate
python3 run.py build --website ../website
python3 run.py build --website ../website --check
```

If Node.js is available, check every area, topic, and case in all six layouts with `node tests/check_routes.cjs dist/index.html dist/data.json` from this repository. This exercises both narrow and wide rendering branches; it does not replace visual inspection in a browser.

To publish reviewed changes, commit and push the updated `dist/` files to this repository's `main` branch. Wait for **Deploy GitHub Pages** to succeed in Actions, then check the live page and affected case links. Pushing only backend changes does not update the live website. A template edit must be rebuilt before it can be deployed.

The October 2026 restructuring preserved the original template, generated HTML, and all 166 cases byte for byte. GitHub Pages hosts the combined viewer; the earlier prototypes are not part of this deployment.
