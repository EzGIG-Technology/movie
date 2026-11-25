# Notes for Claude Code

- Vanilla JS, no framework or bundler. Edit files in `app/`, then run `python3 app/build.py` to regenerate `index.html`. Never edit `index.html` by hand.
- Files are concatenated in this order: data.js, views.js, arch.js, mech.js, officer.js, dist.js, pub.js, mgmt.js, core.js — all share one global scope.
- Rendering: each view returns an HTML string; `render()` in core.js replaces `#app`. Clicks dispatch through `data-act="name"` to the `A` actions map.
- All UI text is Bahasa Malaysia. Data is fictional; keep the "prototaip / rekaan" labels.
- Bump `LS_KEY` in data.js when the seed data shape changes so browsers reload fresh demo data.
- Test with Playwright: `node tests/e2e.js` (expects `index.html` built and `tests/shots/` to exist). Check phone width (390 px) has no horizontal overflow.
