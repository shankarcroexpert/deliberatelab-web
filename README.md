# Deliberate Lab — website

Experimentation for considered purchases. This is the local build of deliberatelab.com,
built page by page as a plain static site (HTML + CSS + a little JS). No build tools,
no frameworks — it just runs in a browser.

## Folder structure

```
deliberatelab/
├── index.html          ← Home page
├── css/
│   └── styles.css      ← Shared styles for EVERY page (colours, fonts, layout)
├── js/
│   └── main.js         ← Shared scripts (sticky nav, mobile menu, scroll reveals)
├── assets/
│   ├── loop-diagram.svg ← "Closed loop" diagram (also inline in index.html)
│   └── scorecard.svg    ← "Honest scorecard" diagram
└── README.md
```

As we add pages, they go at the root next to index.html — e.g. `services.html`,
`method.html`, `about.html`, `contact.html` — and each one links the same
`css/styles.css` and `js/main.js`, so the whole site stays consistent.

## How to run it locally

### Option A — simplest
Double-click **index.html**. It opens in your browser. Done.
(Needs internet the first time so Google Fonts can load.)

### Option B — proper local server (recommended)
A local server behaves exactly like a real host, so what you see is what you'll deploy.

1. Open a terminal in this folder.
2. Run one of these:
   - If you have Python 3:  `python3 -m http.server 8000`
   - If you have Node:      `npx serve`
3. Open your browser to **http://localhost:8000**

Press `Ctrl + C` in the terminal to stop the server.

## How to edit

- **Change a colour or font once, everywhere:** edit the variables at the top of
  `css/styles.css` (`--ink`, `--gold`, `--paper`, `--serif`, etc.).
- **Change wording / sections:** edit `index.html`. The page is commented section by
  section (HERO, 01 BLIND SPOT, 02 THE LOOP, and so on) so it's easy to find things.
- **The diagrams** live inline inside `index.html` (so they always load) and also as
  standalone files in `assets/` (handy if you rebuild in another tool).

## Brand tokens (for reference)

| Token        | Hex       | Use                          |
|--------------|-----------|------------------------------|
| Ink          | `#17191E` | Text, dark sections, buttons |
| Gold         | `#9C7A2C` | Accent text, eyebrows        |
| Gold line    | `#C9A24B` | Hairlines, ticks, highlights |
| Warm paper   | `#F7F4EE` | Alternating section backgrounds |
| Hairline     | `#E7E2D8` | Dividers, borders            |

Fonts: **Fraunces** (headings), **Hanken Grotesk** (body), **IBM Plex Mono** (labels/data).

## Deploying

Because it's a plain static site, the whole `deliberatelab/` folder can be uploaded to
any static host, then pointed at deliberatelab.com. Build and test everything here first;
deploy once you're happy.

---
Pages built so far: **Home**. Next: Services / The Offer.
