# Deliberate Lab — website

Experimentation for considered purchases. This is the local build of deliberatelab.com,
built page by page as a plain static site (HTML + CSS + a little JS). No build tools,
no frameworks — it just runs in a browser.

## Folder structure

```
deliberatelab/
├── index.html          ← Home page
├── method.html          } stub pages — hero only for now,
├── services.html        } content coming next. Each one already
├── case-studies.html    } wires up the shared header/footer/nav
├── about.html            } and the "Book a call" modal.
├── insights.html        }
├── css/
│   └── styles.css      ← Shared styles for EVERY page (colours, fonts, layout)
├── js/
│   ├── partials.js     ← THE header/footer/nav/booking-modal markup, in ONE
│   │                      place. Injected into every page's #site-header /
│   │                      #site-footer mount points. Edit nav links or footer
│   │                      columns here — every page picks it up automatically.
│   ├── main.js          ← Shared scripts (sticky nav, mobile menu, booking
│   │                       modal, scroll reveals)
│   └── motion.js        ← Shared motion/animation system
├── assets/
│   ├── loop-diagram.svg ← "Closed loop" diagram (also inline in index.html)
│   └── scorecard.svg    ← "Honest scorecard" diagram
└── README.md
```

Every page follows the same skeleton: an empty `<div id="site-header"></div>`
near the top of `<body>`, an empty `<div id="site-footer"></div>` near the
bottom, the page's own content in between, then
`<script src="js/partials.js"></script>` loaded **before** `main.js` and
`motion.js` (it has to inject the header/footer markup first, since those two
scripts look up header/footer elements by id as soon as they run).

To add a new page: copy a stub, keep the `#site-header` / `#site-footer` divs
and the three `<script>` tags, and — if it should be reachable from the nav —
add a link with a matching `data-page="yourpage.html"` attribute in
`js/partials.js`'s `HEADER_HTML` (this also drives the "active page"
highlight in the nav).

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
Pages built so far: **Home** (full), plus stub heroes for **Method, Services,
Case Studies, About, Insights**. Next: fill in each stub's content.
