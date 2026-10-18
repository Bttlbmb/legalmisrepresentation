# Website instructions

This repository contains the public static viewer. Research belongs in the separate backend repository.

- Preserve the current layout, navigation, responsive rules, and behavior unless the user asks to change them.
- Edit the template in `src/page.html` for an authorized interface change. Its single `/*__DATA__*/null` marker is replaced by the backend.
- Do not edit case text in `dist/`; change its subject's backend JSON and regenerate.
- Serve only `dist/` on loopback for preview. The website must work without a running backend.
- Do not add raw research captures, local paths, credentials, or private backend notes to public output.
- After rebuilding, run the backend's `build --check`, check inline JavaScript syntax, and inspect the affected routes in a browser.
- Commit website changes separately from backend changes. Deployment requires an explicit request.
