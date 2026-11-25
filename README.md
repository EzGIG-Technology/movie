# TAPIS — Film Classification System (prototype)

Working UI prototype of an AI-assisted film classification system for Lembaga Penapisan Filem (LPF), prepared by EzGIG for KDN/LPF (Nov 2026). Interface in Bahasa Malaysia. **All films, companies, people and figures are fictional.**

## Run it

```bash
python3 app/build.py        # bundles app/ into index.html
python3 -m http.server 8000 # then open http://localhost:8000
```

`index.html` is committed, so you can also open it directly or host the repo on GitHub Pages. Images load from `img/`.

## Portals (switch with "Tukar peranan")

| Role | Route | What it shows |
|---|---|---|
| Login / landing | `#masuk` | Role picker, 2-step sign-in (simulated), process animation, 9-step mechanics diagram, "Otak AI KDN" brain, interactive architecture |
| Pegawai (officer) | `#pegawai` | Papan kerja · Baris gilir · Semakan filem (player, scene × 8-category scores, AI flags, cut marking, decisions) · Arkib keputusan |
| Pengedar (distributor) | `#pengedar` | Summary, submissions by status, new-submission wizard, certificates, invoices & payment, company profile, respond to cut requests, appeals |
| Pengurusan (management) | `#pengurusan` | KPIs, charts, case pipeline, case assignment, officer workload, SLA risk, rejections & appeals, audit trail |
| Orang awam (public) | `#awam` | Dark cinematic site: hero carousel, rows, film pages with consumer advice, rating guide, certificate verification |

## Code layout

- `app/build.py` — concatenates everything into a single HTML file (`index.html`; `myklasifikasi.html` is the variant published as a claude.ai Artifact)
- `app/style.css` — all styles (light blue glass theme; `body.pubmode` = dark public site)
- `app/data.js` — constants (8 categories, ratings, statuses, officers, rejection codes), helpers, `seed()` demo data (36 films)
- `app/views.js` — icons, shell/header band, login page, process & AI-brain sections, studio (`studioView`), wizard, management dashboard, certificate, modals
- `app/officer.js` — case helpers (SLA, timeline, record modal), officer portal tabs, decision panel
- `app/dist.js` — distributor portal
- `app/pub.js` — public site
- `app/mgmt.js` — extra management cards
- `app/arch.js` / `app/mech.js` — interactive architecture and mechanics diagrams
- `app/core.js` — state (`S`, persisted in localStorage `tapis-demo-v3`), `ui`, routing, actions (`A`), event delegation via `data-act`
- `tests/e2e.js` — Playwright click-through (`npm i playwright && mkdir -p tests/shots && node tests/e2e.js` after building)

## Placeholders to confirm with LPF

- The 8 content categories and score thresholds (<18 U, 18–33 P12, 34–51 13, 52–75 16, ≥76 18)
- Fee rate (example RM5/minute, express ×1.5)
- Rejection codes A–E are examples, not real LPF clauses
- Third-party logos (Gemini, Vertex AI, MyDigital ID, etc.) are shown as proposed components only; no endorsement implied
