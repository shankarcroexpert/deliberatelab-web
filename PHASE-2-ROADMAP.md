# Deliberate Lab — Phase 2 Roadmap (Reference-Site Upgrades)

Built from a full read of two reference sites — increase-conversion-rate.com (Lucia
van den Brink) and funnelfreaks.co — plus the top CRO agencies (Speero, SplitBase,
The Good), compared against our live site.

Each day below has three parts:
- **Why** — what we're borrowing and from whom.
- **Exact copy** — the real sentences to use (honest, on-brand). Edit names/figures in {{ }}.
- **VS Code prompt** — paste into VS Code Claude to build it.

Reuse the CONTEXT PRIMER from ROADMAP.md at the start of each session. All house rules
still apply: our colours/fonts, animated, responsive, reduced-motion, accessible, and
**no fabricated proof** (no fake logos, testimonials, awards, or unverifiable stats).

---

## DAY 1 — "Friction, visualized" + an outcome word-cycler  ⭐ our biggest differentiator

**Why:** Neither reference *shows* the problem — they describe it. If a visitor can
*watch* the friction (rage clicks, abandoned forms, the online→offline signal going
dark), they understand what we solve in seconds. This is the visual proof of our whole
positioning: we see the invisible. Nothing on either reference site does this.

### Exact copy

Section eyebrow: `FIELD NOTES — FRICTION, VISUALISED`

Heading: **This is what a leaking considered-purchase journey looks like.**

Sub: *You can't fix what you can't see. Here's the friction that quietly costs you the
sale — the kind we find, measure, and remove.*

Four vignettes (each = a looping animation + a label + a one-line cost):
1. **Rage clicks** — *A visitor jabs a control that won't respond. High intent, wasted.*
2. **The abandoned form** — *Half-filled, then gone. Your enquiry, lost at the last step.*
3. **Comparison paralysis** — *Three tabs, no decision. The sale stalls before it starts.*
4. **The blind handoff** — *The enquiry goes offline — and your measurement goes dark.
   This is the gap we close.*

Closing line: **Multiply these across every high-intent visitor and it stops being a UX
problem. It's revenue.**

CTA: `See how we find it →` (link to method.html)

Outcome word-cycler (hero or a thin band under it) — stem + rotating word:
Stem: **We measure the lift in what actually pays:**
Rotating words: `test drives` · `deliveries` · `disbursed loans` · `showroom bookings`
· `policy sales` · `enrolments` · `site visits` · `closed sales`

### VS Code prompt
```
Add a new "Friction, visualised" section to index.html, placed immediately AFTER the
"01 — The blind spot" section (it dramatises that blind spot). Use the eyebrow label
"FIELD NOTES — FRICTION, VISUALISED" (no exhibit number, so we don't renumber the rest).

Build 4 looping, lightweight CSS/SVG animation tiles in our ink+gold editorial style
(NOT gifs, NOT stock images — crisp vector animations that match our diagrams). Each
tile shows a generic (non-client) user-behaviour vignette and loops subtly:

1. RAGE CLICKS: a cursor repeatedly clicks a button that doesn't respond; small radial
   "click burst" marks pulse on each jab; after a few jabs the cursor drifts away.
2. THE ABANDONED FORM: three form fields fill in sequence, the cursor hesitates, then
   drifts to a "×" and the fields clear — the form is abandoned.
3. COMPARISON PARALYSIS: three browser tabs flick back and forth, a small hesitation
   spinner, no decision is reached.
4. THE BLIND HANDOFF (our signature): a signal dot travels from an ONLINE node toward
   an OFFLINE "showroom" node; midway the line goes dark/dashed and the dot fades —
   measurement lost. Then show our version: the line continues in gold all the way to
   the sale. This one is the emotional peak — make it the largest / most prominent tile.

Each tile has the label and one-line cost copy I provide. Under reduced-motion, freeze
each animation on its most legible frame. Fully responsive (2x2 grid → 1 column on
mobile). Add the closing line and a CTA linking to method.html.

Then, in the hero, add an accessible "outcome word-cycler": the stem sentence I provide,
followed by a single word that rotates through the list I provide (fade/slide, pause
~1.6s each, respects reduced-motion by showing the first word statically). Use an
aria-live="polite" region so it's screen-reader friendly.

Use the exact copy I paste next. Show me how to test and confirm reduced-motion behaviour.
```

---

## DAY 2 — The problem in numbers + founder presence

**Why:** FunnelFreaks agitates with sourced stats ("76% — Dynamic Yield"). Lucia builds
trust with a face and concrete credentials ("Small team, big wins. 1000+ tests"). We add
both — honestly. RULE: every stat needs a real source or it doesn't ship.

### Exact copy — "The problem, in numbers"

Eyebrow: `WHY THIS MATTERS`
Heading: **Acquisition gets the budget. The sale gets guessed at.**

Three stat blocks (VERIFY each figure + source before publishing; replace any you can't
source with one you can — do NOT publish an unverifiable number):
- **{{~7 in 8}}** — *experiments that don't win.* Most ideas fail, which is why what you
  test first decides your return. `Source: {{CRO win-rate benchmark — verify}}`
- **{{70%+}}** — *of a considered purchase happens before a buyer ever contacts you.*
  `Source: {{buyer-research study — verify}}`
- **Then it goes offline** — *and that's exactly where most brands stop measuring.*
  (no number — framing line)

Closing line: *We don't sell you a scare statistic. On the first call we model the real
number from your traffic and average order value — honestly.*

### Exact copy — founder presence (home band)

Eyebrow: `WHO YOU WORK WITH`
Heading: **A senior operator, not a junior handoff.**
Body: *Deliberate Lab is founder-led on purpose. You work directly with a CRO
practitioner who ran experimentation inside the automotive world — where every sale is a
high-value, researched purchase closed in a showroom or online — now brought to other
considered-purchase brands. Backed, when a project needs it, by a bench of specialist
researchers, developers and designers.*
Credential chips (all real): `Ex-automotive CRO` · `CXL-trained: CRO & Experimentation,
A/B Testing, CRO Agency` · `Writes weekly on experimentation`
CTA: `More about the approach →` (about.html)

### VS Code prompt
```
Two additions.

(A) Add a "The problem, in numbers" band to index.html, just before "02 — The loop".
Three stat blocks using the copy I provide, in our style: large Fraunces figure in ink,
gold underline, label in Hanken, and a small IBM Plex Mono source line under each.
IMPORTANT: leave each figure and its source as clearly-marked {{VERIFY}} placeholders —
do not invent numbers. Animate the figures with a count-up on scroll (reduced-motion:
show final value). Responsive 3-up → 1 column.

(B) Add a founder-presence band to index.html (good placement: just before "06 — Why
us"), and mirror it on about.html. Use the heading, body, credential chips and CTA I
provide. Include a {{FOUNDER_PHOTO}} image placeholder (tasteful, editorial framing,
gold hairline border) and {{FOUNDER_NAME}}. The credential chips are small pill labels
in our style. Fully responsive (photo stacks above text on mobile) and animated.

Use the exact copy I paste next.
```

---

## DAY 3 — Resources hub  ⭐ highest-leverage move for a founding-stage agency

**Why:** Lucia's Resources page is her smartest asset — a library of genuinely useful
downloads (checklists, Miro boards, a tool advisor) that builds authority and captures
leads *without needing a single client result*. You already own the raw material: your
PROOF model, prioritisation sheets (CRO Test Prioritization Model.xlsx), hypothesis list,
and scorecard template. Turn them into honest give-aways.

### Exact copy

Nav: add `Resources` (points to resources.html). Page:

Eyebrow: `RESOURCES`
Heading: **The tools we use — yours to take.**
Sub: *We'd rather be useful than mysterious. These are the actual frameworks we run our
engagements on. Take them, use them — no email wall.*

Resource cards (each = title, one-line, format tag, CTA "Get it →"):
1. **The PROOF Score sheet** — *Score and rank your own test ideas the way we do — the
   weighted model as a ready-to-use spreadsheet.* `Sheet`
2. **The Offline-Loop Measurement checklist** — *The checks that tell you whether your
   online experiments are actually connected to the sale.* `PDF`
3. **The Test Prioritisation template** — *A working prioritisation sheet for your
   experiment backlog, so you stop shipping whatever's easiest.* `Sheet`
4. **The Considered-Purchase Research starter** — *The questions we ask to find where
   high-intent buyers hesitate on the way to a big decision.* `PDF`
5. **A/B Test Tool chooser** — *Answer a few questions, get three tool suggestions matched
   to your traffic and stack.* `Tool`  *(build simple version now, or link "coming soon")*

Closing CTA band: **Want us to run these on your funnel, not just hand them over?**
`Book a discovery call →`

### VS Code prompt
```
Create resources.html — a free-resources / give-away hub (Lucia van den Brink's Resources
page is the model). Add "Resources" to the nav across all pages (via the partials).

Layout: hero (eyebrow, heading, sub I provide), then a responsive card grid of resource
cards. Each card: title, one-line description, a small format tag chip (Sheet / PDF /
Tool), and a "Get it →" CTA. For now, point each download CTA at a {{RESOURCE_URL}}
placeholder (I'll wire the real files). Card 5 (tool) can link to tools.html or show a
"coming soon" state. Close with a CTA band I provide.

Match our editorial style, animate the cards in on scroll (staggered, reduced-motion
safe), fully responsive. Use the exact copy I paste next.
```
> Note: the downloads must be real. Adapt your existing files — CRO Test Prioritization
> Model.xlsx, the hypothesis list, Scorecard_Template.pdf, and a one-page PROOF sheet —
> into clean, branded give-aways. Genuine usefulness is the whole point.

---

## DAY 4 — Results/testimonials structure + "pick your variant" framing

**Why:** FunnelFreaks pairs each testimonial with a hard metric (104% uplift) and a name.
Lucia frames her two offers as variant_A / variant_B — a delightful, on-brand device for
an experimentation agency. We build the honest, ready-to-fill version of the first, and
steal the second outright.

### Exact copy — results (honest interim)

Eyebrow: `RESULTS`
Heading: **Founding-client results — reported in full, as they land.**
Interim body: *We're onboarding our first founding clients now. When their experiments
run, the outcomes — wins and losses, online lift and lift at the sale — will appear here
exactly as they happened. No cherry-picking. Want to be one of them?*
CTA: `Become a founding client →`
(Build the metric+quote card component now, hidden or in a "first result coming" state,
so a real one drops in with zero rework.)

### Exact copy — "pick your variant" (services.html + home offer)

Eyebrow: `TWO WAYS IN — PICK YOUR VARIANT`
- **Variant A — The Deliberate Audit.** *One project. A full teardown and a PROOF-scored
  roadmap you own. Best when you want direction, fast.*
- **Variant B — The Deliberate Program.** *An ongoing experimentation program. Best when
  you're ready to compound wins, month over month.*
Tagline: **There's no wrong variant — only the one that fits where you are.**

### VS Code prompt
```
Two additions.

(A) On case-studies.html (or a new results section on index.html — your call for best
placement), build a reusable results card component: a testimonial quote + a highlighted
metric (big Fraunces number + label) + name + role + optional logo slot. Since we have no
results yet, render the honest "founding-client — reported in full, as they land" state I
provide, with a CTA. Make swapping in a real quote+metric a one-object change.

(B) Reframe the two main engagement paths as an A/B variant on services.html and in the
home offer section: label them "Variant A — The Deliberate Audit" and "Variant B — The
Deliberate Program", with the copy and tagline I provide. Style it as a tasteful,
experiment-flavoured toggle/split (two panels), on brand. Keep the third option
(On-demand) present but secondary.

Animated, responsive, reduced-motion safe. Use the exact copy I paste next.
```

---

## DAY 5 — FAQ that actually answers + contact selector + consistency pass

**Why:** Lucia's and FunnelFreaks' FAQs do real work — ROI expectations, traffic
thresholds, "why are you different", with personality. FunnelFreaks' contact form has a
service selector. We upgrade both, in our honest voice.

### Exact copy — FAQ (use on services.html and/or a home FAQ)

**How much traffic do I need before A/B testing is worth it?**
*Honestly? Less than most people fear, and sometimes more than you'd hope. A rule of
thumb is ~1,000 conversions a month on the page you're testing for clean reads. Below
that we don't fake significance — we switch to research-led, bundled rollouts and measure
at the sale instead. On the first call we'll tell you which camp you're in, straight.*

**We sell offline. Can you even measure that?**
*That's the whole reason we exist. We connect online actions — configurations, enquiries,
test-drive bookings — to what happens at the showroom, branch or counter, so every
experiment is judged on real revenue, not clicks. If your systems can't link the two yet,
closing that gap is usually the first thing we fix.*

**What's the ROI of working with you?**
*We aim for a program to return several times its cost — but we won't stick a fake number
on a business we haven't measured. On the first call we model it from your average order
value and traffic, honestly, and tell you if it isn't worth it yet.*

**How is this different from a normal CRO agency?**
*Most optimise the click and stop at the form. We measure to the sale — online or offline
— and we report the losses, not just the wins. If a test does nothing, you'll hear it
from us first.*

**You're new. Why should we trust you?**
*Fair question. We're a founding-stage agency and won't pretend otherwise. You get a
senior operator doing the actual work, a method built on the field's best practice, and
total transparency — a scorecard showing every result. Judge us on how we think on the
first call.*

**What if we already have GA4 or a testing tool?**
*Great — we'll use what you have and audit it for the leaks that quietly corrupt
decisions. Most setups we see measure the wrong thing, or miss the offline link entirely.*

### Exact copy — contact selector

Heading: **Tell us what you need.**
Selector label: `I'm interested in…`
Options: `A Deliberate Audit` · `The Deliberate Program` · `On-demand hours` ·
`Just exploring`
Reassurance line under submit: *We reply within one business day. No sequences, no spam.*

### VS Code prompt
```
Three things.

(A) Build/upgrade an accessible FAQ accordion on services.html (and a short 4-item
version on index.html) using the exact Q&As I provide. Accordion = button + aria-expanded,
keyboard operable, one open at a time optional, reduced-motion friendly.

(B) Add a proper contact section/page with an "I'm interested in…" service selector
(options I provide), name, email, company, and message, plus the reassurance line. Keep
the existing working booking flow as the primary CTA; this is the lower-commitment path.
Do NOT break the current form — extend it.

(C) Consistency pass: make sure every new Phase-2 section matches our spacing rhythm,
uses the shared header/footer, animates consistently, and is clean at 320/375/768/1024/
1440px. List anything you changed.

Use the exact copy I paste next.
```

---

---

# UPDATE — new opportunities from the deeper service & content pages

Added after reading: cro-expert-audit, testing-tool (the A/B tool advisor), and the
practical UX-research articles on increase-conversion-rate.com.

## DAY 6 — Make the Deliberate Audit page concrete  ⭐ it's our #1 product

**Why:** Their Audit page wins by being specific — it lists the research that goes in and
the exact deliverables that come out, with a 3-step "how it works." Ours is described
abstractly. For our flagship "one door in", vague = fewer bookings. Give it a real page.

### Exact copy

Eyebrow: `THE DELIBERATE AUDIT`
Heading: **Your considered-purchase journey, taken apart and rebuilt on evidence.**
Sub: *A fixed-scope, fixed-price teardown that turns research into a prioritised,
offline-aware roadmap you own — whether or not we ever work together again.*

**What goes in — the research**
*We analyse every source that reveals where high-intent buyers hesitate:*
- **Behavioural analytics** (GA4 / your stack) — where they drop off
- **Session recordings & heatmaps** — how they actually move, not how you think they do
- **5-second & first-impression tests** — is the offer even understood in the first breath
- **Voice-of-customer** (surveys, polls, enquiry-team interviews) — *why* they hesitate
- **The offline seam** — where online intent hands off to the showroom, branch or call,
  and where your measurement currently goes dark

**What comes out — the roadmap**
*From the findings we build:*
- **1–5 optimisation strategies**, each tied straight back to the evidence
- **20+ prioritised, PROOF-scored recommendations** (A/B tests and direct fixes)
- **Mockups** for the highest-impact changes
- **An offline-loop measurement plan** — how to connect the experiments to the actual sale
- **A live read-out** plus the full deck and prioritisation sheet — yours to keep

**How it works**
1. **30-min goal call** — *We align on your goals, your funnel, the offline seam, and what
   research already exists.*
2. **Research sprint** — *We run the research, analyse it, and translate the findings into
   prioritised recommendations.*
3. **Read-out** — *You get the strategies, the 20+ recommendations, the mockups, the
   measurement plan and the deck — walked through live.*

**Audit FAQ**
- *What's the ROI of the Audit?* — **The Audit's value is direction: a research-backed,
  prioritised roadmap means you stop guessing and spend your build time only on what moves
  the sale. It's the cheapest way to find where your revenue is really leaking. If a
  Program follows, the Audit becomes its foundation.**
- *Do I have to sign up for anything after?* — **No. The roadmap is yours to run with your
  own team. If you'd like us to execute it, the Deliberate Program is there — no obligation.**

CTA: `Book your Audit call →`

### VS Code prompt
```
Create deliberate-audit.html — a dedicated, concrete page for our flagship product (their
cro-expert-audit page is the structural model, but keep OUR voice and offline angle).
Link it from the home offer card, the services page, and the nav dropdown if present.

Sections, all on brand + animated + responsive:
1. Hero (eyebrow, heading, sub I provide) + primary CTA to the booking flow.
2. "What goes in — the research": the 5 research inputs I provide, as an editorial list
   with small mono labels; highlight "the offline seam" as the distinctive one.
3. "What comes out — the roadmap": the 5 deliverables I provide, visually stronger (this
   is what they're buying) — consider a "dossier contents" styled block.
4. "How it works": the 3 steps I provide as a stepped timeline (reuse the process style).
5. Audit-specific FAQ accordion with the Q&As I provide.
6. Closing CTA band.
Use the exact copy I paste next. Do not invent prices or numbers beyond what I give.
```

## DAY 7 — Testing Tool Advisor (real tool) + the service-page pattern

**Why:** Their tool advisor is a genuine lead magnet. Ours can beat it by being
**offline-aware** — asking where the sale closes, which no generic advisor does. Also, every
one of their service pages follows the same trust pattern (concrete "how it works" +
deliverables + honest FAQ + related links + repeated CTA) — we should apply it everywhere.

### Exact copy — Testing Tool Advisor

Value prop: **Which experimentation tool actually fits you? Find out in 60 seconds.**
Bullets: `30+ tools considered` · `Matched to your traffic, stack & budget` ·
`Offline-aware — built for considered purchases`

Questions:
1. **How much monthly traffic runs through the pages you'd test?** — Under 50k / 50k–500k / 500k+
2. **Where does the sale close?** — Fully online / Online enquiry → offline close / Mostly offline
3. **How should tests run?** — Client-side (visual editor) / Server-side / In an app / Not sure
4. **Must-haves** (pick any) — Feature flagging / Server-side testing / Personalization /
   Session replay / Free tier / Shopify support
5. **Budget** — Free/low / Mid-range / Enterprise

Result screen: **Your 3 best-fit tools** — each with a one-line "why it fits you", plus:
*Want help setting it up and actually running tests that measure to the sale? Book a call.*
(Show the result first; offer to email it — no hard email wall.)

### Exact copy — service-page pattern (apply to Method, Services, Program)

Program FAQ:
- *How many tests will you run a month?* — **It depends on your traffic — we calculate your
  realistic test velocity on the first call. For considered-purchase sites with thinner
  volume, we run fewer, bigger, research-backed bets and measure them to the sale, rather
  than spraying low-value tests for a bigger-looking number.**
- *What do the tiers actually differ on?* — **Research depth, test velocity, and how much
  of the offline-loop measurement we build and maintain. Foundation gets you running
  honestly; Growth compounds wins; Scale runs the whole program as an embedded team.**

### VS Code prompt
```
Two things.

(A) Build a real "Testing Tool Advisor" on tools.html (or its own page tool-advisor.html)
in js/tool-advisor.js. Multi-step quiz using the questions I provide; on finish, show the
3 best-fit tools with a one-line rationale each. Keep the tool dataset in a small JS array
(tool name, best-for traits) so it's easy to maintain — and it MUST be accurate; do not
misstate a tool's capabilities. Question 2 ("where does the sale close?") should genuinely
influence the recommendation logic (favour server-side / data-warehouse-native tools for
offline-heavy cases). Show result first; offer an optional "email me this" step (no hard
wall). Accessible, animated, reduced-motion safe.

(B) Apply our service-page pattern consistently to method.html, services.html and the
Program section: each gets a concrete 3-step "How it works", a deliverables list, a short
honest FAQ accordion, related-content links, and a repeated CTA. Add the Program FAQ Q&As
I provide. Match design system. Use the exact copy I paste next.
```

## DAY 8 — Turn Insights into a real content engine

**Why:** Their articles build authority through depth — first-person, practical, real
examples with numbers, embedded visuals, categories, breadcrumbs, related links. Our
Insights hub is thinner. Upgrade the architecture and seed a genuinely useful niche piece.

### Exact copy / structure

Categories (taxonomy): `Offline-loop measurement` · `Experimentation` · `Research methods`
· `Considered-purchase CRO`
Breadcrumb pattern: `Home › Insights › {{Category}}`
Article cards: category tag, title, date, read-time, excerpt.
Each article foot: 2–3 **Related articles** + a CTA band.

New seed article (write it fully) — title:
**How to measure an experiment that ends in a showroom**
Intro (exact): *Most A/B testing advice quietly assumes the sale happens on the same screen
as the test. For a car, a home, a policy or a degree, it doesn't — the decision starts
online and closes at a showroom, a branch or a counsellor's call. Here's how we connect the
two, so an experiment can be judged on the sale it actually caused, not the click it got.*
Then teach, honestly and practically: pick a stable online action tied to intent (a
configured quote, a booked test-drive, an enquiry); pass a durable ID with it; reconcile it
against the offline outcome (CRM / dealership / branch record); measure lift at the sale,
accepting longer timeframes; report online lift AND sale lift side by side — including flats.
End with a key-takeaways callout and a CTA.

### VS Code prompt
```
Upgrade insights.html and article-template.html into a real content engine.

- Add a category taxonomy (the 4 categories I provide) with a category filter on the hub
  and category tags on cards. Add breadcrumbs (Home › Insights › Category) to articles.
- Article cards show category, date, read-time, excerpt. Each article ends with a
  "Related articles" block (2–3 links) and a CTA band.
- Improve the article reading template: hero image slot, breadcrumb, date/read-time,
  first-person practical voice, support for embedded figures (let me drop in our friction
  animations / diagrams), a "Key takeaways" callout box, and an author line.
- Write the new seed article "How to measure an experiment that ends in a showroom" fully
  from the intro + outline I provide (~700 words, our voice, honest — examples from method
  and experience, NOT invented client results).
Match design system, responsive, animated. Use the exact copy I paste next.
```

---



1. **Day 6 — The concrete Audit page.** It's your #1 product and it's currently vague —
   specificity here converts directly into booked Audits. Do this first.
2. **Day 1 — Friction, visualised.** Your single most differentiating asset.
3. **Day 3 — Resources hub.** The one play that builds authority with zero client proof.

(Then Day 2 founder presence, Day 7 tool advisor, Day 8 content engine.)

## What we deliberately did NOT copy
Fake client logos, borrowed testimonials, award badges, and unsourced scare-stats. Both
reference sites have real versions of these; we don't yet, and faking them would break the
one thing we sell — the truth. Honest placeholders now; real proof as clients land.
