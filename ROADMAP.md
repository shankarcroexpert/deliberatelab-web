# Deliberate Lab — 5-Day "World-Class" Build Roadmap

A day-by-day plan to take deliberatelab.com from a strong single page to a
world-class CRO agency site. Each task has a **copy-paste prompt** for your
VS Code Claude. Workflow: open a new VS Code Claude session, paste the
**Context Primer** once, then paste that day's prompt(s) one at a time.

Keep our existing colours, fonts and theme throughout. We are *adding* a
world-class layer, not restyling.

---

## ▶ CONTEXT PRIMER — paste this FIRST in every new VS Code Claude session

```
You are working on the Deliberate Lab website — a CRO / experimentation agency
for high-consideration, offline-closing brands (auto, real estate, BFSI, luxury,
premium education). Positioning: "experimentation for considered purchases —
online decisions, measured all the way to the offline sale. Evidence, not guesswork."

Before writing any code, read these files to learn our conventions and match them
exactly: index.html, css/styles.css, js/main.js, assets/*.svg, README.md.

HOUSE RULES (apply to everything you build):
1. Brand tokens live in css/styles.css :root — reuse them, never hardcode new colours.
   Ink #17191E · Gold #9C7A2C · Gold-line #C9A24B · Warm paper #F7F4EE · Hairline #E7E2D8.
   Fonts: Fraunces (headings), Hanken Grotesk (body), IBM Plex Mono (labels/data).
2. Visual language: white/editorial, "lab dossier" feel — numbered exhibits, mono
   labels, gold used as the "signal" colour. Generous whitespace. Keep it disciplined.
3. Everything must be responsive and tested at 320, 375, 768, 1024, 1440px.
4. Everything animates tastefully but MUST respect @media (prefers-reduced-motion: reduce).
5. Accessibility floor: visible keyboard focus, alt text / aria-labels, colour contrast,
   semantic HTML.
6. NO fabricated proof — no fake client logos, no invented results. Use honest
   placeholders clearly marked where real proof will go.
7. Our "Book a call" form already works — link CTAs to it, do not replace it.
8. It's a plain static site (HTML/CSS/vanilla JS, no framework, no build step).
   New pages sit at repo root and link the same css/styles.css and js/main.js.
9. After each task, tell me what files you changed and how to test locally
   (python3 -m http.server 8000).

Confirm you've read the files and understood, then wait for my task.
```

---

## DAY 1 — Motion system + world-class Home + responsive foundation

**Goal:** Make the page we already have feel *alive* and flawless on every device,
and build the reusable animation system every future page will inherit.

### Prompt 1.1 — the motion layer
```
Build a reusable motion system for the site in a new file js/motion.js (loaded after
js/main.js on every page), plus any needed CSS in css/styles.css. Implement, all
gated behind prefers-reduced-motion:

1. Hero entrance sequence on load: eyebrow, headline (word-by-word or line-by-line
   stagger), lead, CTAs, and footnote fade+rise in sequence. Subtle, ~600ms total.
2. Self-drawing SVG: animate the hero closed-loop diagram (FIG. A) so the arcs draw
   in (stroke-dashoffset) and the ONLINE→OFFLINE nodes fade in on first view.
3. Staggered scroll reveals: upgrade the current .reveal so children stagger in
   (e.g. .reveal[data-stagger] animates its direct children with incremental delay).
4. Count-up animation for any number with class .countup (animate from 0 to the
   data-target value when scrolled into view). Apply to the PROOF weight bars filling.
5. Magnetic hover on .btn (button gently follows cursor within a few px) and a soft
   lift/shadow on .card and .step hover.
6. Active-section highlighting in the sticky nav: as you scroll, the current section's
   nav link gets an active underline.
7. A thin gold scroll-progress bar at the very top of the header.

Keep it lightweight vanilla JS, no libraries. Everything must degrade gracefully and
be fully disabled under prefers-reduced-motion. Show me the diff and how to test.
```

### Prompt 1.2 — responsive + mobile polish
```
Do a full responsive pass on index.html / css/styles.css. Test and fix layout at
320, 375, 414, 768, 1024, 1280 and 1440px. Specifically:
- Hero: stack cleanly on mobile, diagram scales, no overflow.
- Mobile nav: refine the open/close (animated, focus-trapped, closes on Esc and on
  link tap, background scroll locked while open).
- Section paddings tighten sensibly on small screens; type scales are comfortable.
- The PROOF readout, offer cards, steps grid and footer all reflow to 1 column nicely.
- No horizontal scroll at any width. Tap targets >= 44px.
Report any issues you found and fixed. Show me before/after for the trickiest breakpoint.
```

**Done when:** Home loads with a polished entrance, animates on scroll, and is
pixel-clean from 320px to 1440px with reduced-motion respected.

---

## DAY 2 — Multi-page architecture + Services + Method (interactive PROOF calculator)

**Goal:** Turn the one-pager into a real site and ship two flagship pages.

### Prompt 2.1 — multi-page architecture
```
Convert the site from a single anchored page into a real multi-page site while keeping
one source of truth for the shared header and footer.

- Create a js/partials.js that injects the shared <header> and <footer> markup into a
  <div id="site-header"></div> and <div id="site-footer"></div> on every page, so we
  edit nav/footer in ONE place. Keep index.html working (move its header/footer into
  the partials). Make sure it still works when served via http.server.
- Update nav links to point to real pages: Method (method.html), Services
  (services.html), Case Studies (case-studies.html), About (about.html),
  Insights (insights.html), plus the "Book a call" CTA to our existing form.
- Add an "active page" state to the nav.
- Create empty, on-brand stub pages for method/services/case-studies/about/insights
  (just header + a titled hero + footer) so all links resolve. We'll fill them next.
Show me the new file structure and how to test.
```

### Prompt 2.2 — Services / The Offer page
```
Build services.html — our detailed offer page. Match our design system and motion.

Sections:
1. Hero: eyebrow "The offer", headline about how to work with us, short lead.
2. The Deliberate Audit (the "one door in"): what it is, what's inside (research,
   PROOF-scored roadmap, offline-measurement plan), who it's for, deliverables list,
   fixed-scope/fixed-price note, CTA. Make this the visually dominant offer.
3. The Deliberate Program: a clean comparison of the three tiers
   Foundation / Growth / Scale as a responsive table or 3 cards — cadence, research
   depth, tests per month, offline-loop measurement, reporting. Mark Growth as popular.
4. On-demand hours: short block.
5. Sub-services strip (like Speero): Research · A/B Testing · Offline-loop Measurement ·
   Analytics/Tracking Audit · UX Review — each a short titled item.
6. A short FAQ accordion (accessible: button + aria-expanded, keyboard operable,
   reduced-motion friendly). 5-6 Q&As about how engagements work.
7. Closing CTA band linking to the booking form.

No invented prices beyond what's already implied; use "fixed scope · fixed price" and
tier names rather than fake numbers unless I give you numbers. Fully responsive + animated.
```

### Prompt 2.3 — Method page + interactive PROOF Score calculator
```
Build method.html — our thought-leadership / framework page, and an interactive tool.

Sections:
1. Hero: "How we decide what to build — and how we measure it."
2. The closed-loop measurement explained, reusing/expanding the FIG. A diagram with the
   self-drawing animation from js/motion.js.
3. Our process (Research → Prioritise → Experiment → Measure) as an animated vertical
   or stepped timeline with more detail than the home summary.
4. THE PROOF SCORE — INTERACTIVE CALCULATOR (build in a new js/proof-calc.js):
   - Let the visitor score a hypothetical idea on 5 sliders (1-5 each):
     Potential revenue (×3), Reach (×1), Odds of success (×2), Offline impact (×3),
     Feasibility (×1).
   - Live-compute the weighted total (max 50), show it on an animated gauge/bar in our
     ink+gold style, with a short verdict ("High priority / Worth testing / Park it")
     based on thresholds.
   - Explain in one line why offline impact & revenue are weighted ×3.
   - Include a "This is exactly how we prioritise your roadmap → book a call" CTA.
   - Fully keyboard-accessible sliders with labels; reduced-motion friendly.
5. Closing CTA band.
Match design system, responsive, animated. Show me how to test the calculator.
```

**Done when:** nav links to real pages, Services and Method are live and on-brand, and
the PROOF calculator works and feels delightful.

---

## DAY 3 — Proof system + lead-gen tools

**Goal:** The "practice what we preach" layer — the honest proof architecture plus a
real interactive lead magnet.

### Prompt 3.1 — Case Studies system (honest, ready to fill)
```
Build case-studies.html (index) and a reusable case-study template
case-study-template.html.

Index page:
- Hero + short intro that is HONEST about being new: e.g. "Founding-client results,
  as they land — reported in full, wins and losses."
- A filter bar by sector (Automotive / Real Estate / BFSI / Luxury / Education) —
  functional vanilla-JS filtering.
- A grid of case-study cards. Since we have no results yet, create 3 clearly-labelled
  "In progress — founding client" placeholder cards with the sector, the challenge
  framed generically, and a "measurement live" tag. Design them so swapping in a real
  result later is trivial. Do NOT fabricate numbers.

Template page (case-study-template.html):
- Layout for a single case study: sector eyebrow, challenge, research insight,
  the experiment, the honest scorecard (reuse FIG. B style — online lift AND offline
  lift, including any flat results), what we learned, CTA.
- Leave clearly-marked {{PLACEHOLDER}} fields so I can duplicate it per client.
Responsive + animated + on brand.
```

### Prompt 3.2 — interactive lead-gen tool
```
Build an interactive "Offline Revenue Leak" assessment as a new page tools.html
(and js/assessment.js). Goal: a 2-3 minute self-assessment that produces a score and
drives a booking — like SplitBase's CRO assessment but focused on our niche.

- 6-8 single-select questions about the visitor's considered-purchase funnel, e.g.:
  Do you track online actions through to the offline sale? Do you run structured A/B
  tests? Do you know your cost per offline conversion? Is your enquiry-to-sale journey
  measured? etc. Each answer carries points.
- Multi-step UI: one question at a time, progress indicator, back/next, keyboard
  accessible, smooth (reduced-motion friendly) transitions.
- End screen: a "Measurement Maturity" score out of 100 with an ink+gold gauge, a
  short honest diagnosis in 2-3 bands (e.g. "Analytics-only / Testing-but-loop-open /
  Loop-closing"), and a strong CTA to book a discovery call. No email wall for the
  score (keep friction low); offer booking as the next step.
- All state in JS memory only (no localStorage — it won't run in some sandboxes).
Match our design system. Show me how to test end to end.
```

**Done when:** there's a case-studies system ready to fill and a working assessment
tool that ends in a booking CTA.

---

## DAY 4 — About + Insights + trust content

**Goal:** The human + authority layer.

### Prompt 4.1 — About / founder page
```
Build about.html. Sections, all on brand + animated + responsive:
1. Hero: why Deliberate Lab exists — the offline-measurement blind spot, told as a POV.
2. Founder story: an operator from the automotive world (considered, offline purchases)
   who now brings that discipline to other high-consideration brands. Leave a
   {{PHOTO}} placeholder and {{FOUNDER_NAME}} where I'll add details.
3. A "credentials" strip that is REAL: CXL / CRO Agency Masterclass training, method
   grounded in the field's best practice. Include a tasteful CXL-certified style badge
   placeholder (I'll drop in the real asset).
4. A manifesto / principles block: 4-5 short beliefs (evidence over opinion; measure to
   the sale; report losses honestly; rigour over vanity tests; considered purchases
   need considered experimentation).
5. A "Deliberate Lab vs. a typical CRO agency" comparison table (honest, opinionated):
   e.g. optimises clicks vs measures offline sales; ships tests vs ships decisions;
   cherry-picks wins vs reports everything.
6. Closing CTA.
```

### Prompt 4.2 — Insights hub + article template
```
Build insights.html (blog hub) and article-template.html.

Hub:
- Hero + intro. A responsive grid of article cards (image/gradient block, category tag,
  title, date, read-time, excerpt). Category filter (vanilla JS).
- A newsletter capture block ("Get our experiments and teardowns" — email + button).
  Wire it to a placeholder handler / mailto for now; I'll connect it later.
- Seed with 3 cards; make ONE fully link to a real article page.

Article template (article-template.html):
- Clean editorial reading layout (measure ~68ch, Fraunces headings, generous spacing),
  hero title + meta, body styles (h2/h3, blockquote in gold, lists, figure/caption,
  code), a "key takeaways" callout, author line, and a CTA at the end.
- Populate the one seeded article with a real ~600-word post titled
  "Why most CRO stops at the click — and what closing the loop actually means."
  Write it in our voice: sharp, honest, practical. No fluff.
Responsive + animated + on brand.
```

**Done when:** About tells our story with real credentials, and Insights is live with
one genuine article and a repeatable template.

---

## DAY 5 — World-class finish + launch

**Goal:** The final 10% that makes it feel truly top-tier, then ship.

### Prompt 5.1 — transitions + cross-page consistency
```
Add tasteful page-transition animations between our pages (fade/slide the main content
on navigation using the View Transitions API where supported, with a graceful fallback;
respect prefers-reduced-motion). Then audit EVERY page for consistency: identical header
& footer (from partials), consistent section rhythm, spacing, hover states, and that all
internal links resolve. Fix any drift. List anything you changed.
```

### Prompt 5.2 — SEO, meta, performance, accessibility
```
Production-hardening pass across all pages:
- Unique <title> + meta description per page. Open Graph + Twitter card tags with a
  {{OG_IMAGE}} placeholder. Canonical URLs (https://deliberatelab.com/...).
- Add a favicon set + a simple SVG favicon using our lab mark. Add site.webmanifest.
- Create sitemap.xml and robots.txt for deliberatelab.com.
- Add a styled 404.html on brand.
- Performance: add font-display:swap, lazy-load non-critical images, preconnect fonts,
  minify nothing by hand but remove dead CSS/JS. Defer non-critical JS.
- Accessibility sweep: run through headings order, landmarks, aria on interactive
  widgets (accordion, sliders, assessment, menu), focus visibility, and colour contrast.
  Fix issues and report them.
Give me a short before/after note (e.g. Lighthouse-style checklist).
```

### Prompt 5.3 — final QA + deploy
```
Final launch checklist:
- Re-test all pages at 320/375/768/1024/1440 and on touch: no overflow, tap targets OK,
  menus/tools/accordions all work.
- Verify reduced-motion disables animations everywhere.
- Verify the "Book a call" form and all CTAs point to the right place.
- Confirm all assets load over http (no file:// only paths).
Then give me the exact steps to deploy this static site to deliberatelab.com on my
current host, and a 10-item pre-publish checklist I can tick off.
```

**Done when:** the site is consistent, fast, accessible, SEO-ready, and deployed.

---

## Appendix — concepts we're adding, mapped to who does them well

| Concept | Seen on | Our version |
|---|---|---|
| Interactive assessment lead magnet | SplitBase (3-min CRO assessment) | Offline Revenue Leak assessment (Day 3) |
| Named framework, made interactive | Speero (XOS), Conversion (LIFT) | Interactive PROOF Score calculator (Day 2) |
| Sub-services broken out | Speero services menu | Services sub-strip (Day 2) |
| Case-study system w/ filtering | Speero, SplitBase | Honest, ready-to-fill system (Day 3) |
| Testimonials w/ attribution | SplitBase | Structure ready, filled as clients land |
| Research-led POV / manifesto | The Good, Speero | About manifesto + comparison table (Day 4) |
| Thought-leadership content hub | Speero (heavy content moat) | Insights hub + article template (Day 4) |
| Motion: reveals, count-ups, drawn SVG | most top sites | Day 1 motion system |
| Page transitions | polished modern agency sites | Day 5 |
| Conversion instrument (site itself) | all of them | multiple CTAs, tools, honest proof |

Pages after 5 days: Home · Method · Services · Case Studies · Tools/Assessment ·
About · Insights (+ article) · 404. All animated, responsive, honest.
