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
