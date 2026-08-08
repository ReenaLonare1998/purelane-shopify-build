# Troopod AI Product Engineer Assignment — Build Instructions

## Role and framing

You are acting as a senior Shopify theme developer converting a static HTML
design prototype into production-grade Shopify sections on the Dawn theme.
This is a job assignment for the "AI Product Engineer" role at Troopod, an
ecommerce growth agency. The reviewer will check your Liquid code, commit
history, and the live dev store. Treat this as real client work, not a demo.

Do not skip, shortcut, or silently simplify any requirement below. If
something is ambiguous or you have to make a judgment call, state the
assumption explicitly in the build notes (deliverable #4) rather than
guessing silently.

## Source file

The file `purelane-homepage.html` is in the project root. It is a single-file
HTML prototype (\~148 KB, no external dependencies) for a plant-based homecare
DTC brand called Purelane. It was built fast as a design prototype — it is
NOT clean code and was never written with Shopify in mind.

**Step 0, before writing any Liquid:** read the entire file. Identify:

* All five required sections (see Scope below) and their exact markup,
inline styles, embedded CSS, and any JS behavior/animations
* Any HTML or CSS in the file that is objectively wrong for production
(bad semantics, accessibility failures, non-responsive logic, layout
hacks that will break at other breakpoints, inline styles that should
be classes, etc.)
* Repeated card/tile patterns across sections (used for the "Reusable"
requirement)

Do not proceed to build until you have a written breakdown of what's in the
file, section by section. Output this breakdown before writing code so it
can be sanity-checked.

## The core instruction that governs everything else

> "The design is the spec. The code is not."

This means:

* The **visual output** (layout, spacing, type, colour, behaviour, at every
width from 375px up) must match the prototype file exactly. This is a
build, not a redesign. Do not improve, restyle, or reinterpret the design.
* The **underlying HTML/CSS** does NOT need to be reproduced as-is. Where it
is wrong for production — semantics, accessibility, performance, breakpoint
logic — fix it properly and document what you changed and why in the build
notes.
* Rebuilding it to look how you would have designed it is an automatic
disqualifier. Do not take creative liberties.

## Scope: build exactly these five sections

Everything else in the prototype file is bonus/optional. Get these five
fully correct before touching anything else.

1. **Hero** — section id/class reference: `section.hero`
2. **Shop / product grid** — reference: `#shop`
3. **Best-selling combos** — reference: `#combos`
4. **Bundles** — reference: `#bundles`
5. **Reviews rail** — reference: `#reviews`

For each section, build it as an independent Shopify section file
(`sections/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*.liquid`) with its own schema block, so it can be added, removed,
and reordered in the theme editor independently.

## Setup requirements

1. Create a Shopify Partner account (free) if one does not already exist.
2. Create a development store (free) on the Partner dashboard.
3. Install a clean, unmodified copy of **Dawn** (Shopify's free default
theme) as the base. Do not use a premium/paid theme or a pre-built
section library — the review is specifically on hand-built Liquid, not
on how well a bought theme's components can be reused.
4. Seed the store with **at least 8 products** suited to a plant-based
homecare brand (e.g. dish soap, laundry detergent, surface cleaner,
fabric softener, hand wash, etc.). Product seeding must include, at
minimum:

   * One product marked **sold out / out of stock**
   * One product with **no image**
   * One product with a **very long title** (long enough to visibly test
card layout wrapping/truncation)
Use realistic product names, prices, and images (can be AI-generated or
stock, but should look plausible for the brand — not placeholder Lorem
Ipsum text).

## Build requirements (apply to all five sections)

### 1\. Pixel-accurate

* Match the prototype file exactly: layout, spacing, typography, colour,
and behaviour (including hover states, transitions, animations).
* Verify and test responsiveness at every width starting from 375px up
(test at minimum: 375px, 768px, 1024px, 1440px, 1920px).
* Do not eyeball this — compare rendered output against the source file
side by side, or describe the specific comparison method used.

### 2\. Merchant-editable

* Nothing hardcoded in Liquid that a marketing team would reasonably want
to change: headings, subheadings, CTA text/links, images, badge text,
section-level toggles, colours if they vary by section, counts (e.g.
number of products shown), etc.
* Use `{% schema %}` settings for section-level content and `blocks` for
repeatable content the merchant should be able to add/remove/reorder
(e.g. individual bundle cards, review cards).
* Every editable piece of copy or media in the source design must map to
a theme editor setting. If something in the prototype looks like it
should be dynamic merchant content, it must be a setting — do not
hardcode it and call it done.

### 3\. Real Shopify data

* Product, price, image, and availability data must come from the Shopify
platform (via `product`, `collection`, or metafield objects) — not typed
directly into Liquid or hardcoded as static content.
* Where a native Shopify field does not exist for something the design
needs (e.g. a custom badge, an ingredient list, a "combo" grouping of
specific products, bundle composition), create a proper **metafield** or
**metaobject** definition to hold that data. Do not fake it with
hardcoded values or section-setting text where it should really be
per-product or reusable structured data.
* Document every metafield/metaobject definition created (namespace, key,
type, and what it's for) — this is deliverable #3.

### 4\. Reusable

* Several sections render similar card patterns (e.g. product cards,
combo cards, bundle cards, review cards likely share structural DNA).
Build shared markup as Liquid **snippets** (`snippets/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*.liquid`) and
reuse them across sections rather than duplicating card markup in each
section file.
* Avoid copy-pasted blocks of near-identical Liquid. If two sections
render visually similar cards, they should call the same snippet with
different parameters.

### 5\. Survives the theme editor

* Test explicitly: add the section, remove it, reorder it relative to
other sections, duplicate it, and reconfigure every setting and block.
Nothing should break, error, or produce broken layout in any of these
states.
* Handle the empty/default state gracefully (e.g. a bundle section with
zero blocks added should not render broken or blank-crash the page —
it should either show sensible defaults or hide cleanly).
* Animations must continue to work correctly after reordering or
reconfiguration, not just on first load.

### 6\. Fast (Core Web Vitals)

* Treat performance as a hard requirement, not a pass to clean up later.
* Lazy-load offscreen images (`loading="lazy"`), use responsive `srcset`
via Shopify's `image\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_url` / `image\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_tag` filters, avoid render-blocking
inline scripts, minimize custom CSS/JS payload, avoid layout shift
(explicit width/height or aspect-ratio on images and media).
* If animations exist in the source, implement them in a way that does
not block first paint or cause jank (prefer CSS transitions/animations
over heavy JS where possible).

### 7\. Accessible

* Full keyboard navigability (tab order, focus trapping where relevant
e.g. carousels/modals).
* Visible focus states on all interactive elements.
* Sufficient colour contrast per WCAG AA at minimum.
* Respect `prefers-reduced-motion` — animations must have a reduced-motion
fallback that disables or simplifies motion, not just visually but
functionally (no motion-dependent content that becomes inaccessible).
* Correct semantic HTML (headings in logical order, alt text on all
images including the deliberately no-image product case, ARIA labels
where native semantics are insufficient, landmark regions).

### 8\. Clean and reviewable

* Meaningful, atomic commit history in the GitHub repo — commits should
tell the story of the build (e.g. "Add hero section schema," "Extract
product card snippet," "Fix mobile breakpoint for combos grid"), not one
giant squashed commit.
* Readable, consistently formatted Liquid/CSS/JS. Comment non-obvious
logic. No dead code, no commented-out experiments left in.
* `.gitignore` appropriately configured (no OS/editor junk files
committed).

## Explicit non-goals / things not to do

* Do not use a premium Shopify theme or third-party section app as a
shortcut — build stock Dawn from scratch for these five sections.
* Do not redesign or "improve" the visual design beyond what's needed to
fix genuinely broken production code (accessibility, semantics,
performance, breakpoints). Visual output must match the prototype.
* Do not hardcode content that should be merchant-editable, even if it
makes the build faster.
* Do not fake dynamic data with static text where a metafield/metaobject
is the correct solution.
* Do not skip the sold-out / no-image / long-title edge cases in product
seeding — these exist specifically to test whether the build handles
real-world data irregularities.

## Deliverables — produce all of these

1. **Dev store URL and password** (output clearly at the end of the build)
2. **GitHub repo** with intact, meaningful commit history — initialize git
at the start of the build, not at the end, and commit incrementally as
each section is completed, not as one final commit
3. **Metafield/metaobject definitions** created — documented list with
namespace, key, type, and purpose for each
4. **Build notes** (short, written document) covering:

   * What you'd flag about the original prototype file (specific issues:
bad semantics, accessibility problems, non-responsive logic, hacks)
   * What you changed in the code and why, section by section
   * What you'd do with more time (be honest about what's incomplete or
could be improved)
5. **AI workflow notes** (short, written document) covering:

   * What was delegated to AI tools during this build
   * Where AI-generated output failed or needed correction, with specifics
   * What you'd systematise or change if doing twenty more of these builds

Produce deliverables #4 and #5 as markdown files in the repo
(`BUILD\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_NOTES.md` and `AI\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_WORKFLOW\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_NOTES.md`) so they ship with the code
and commit history, not as a separate afterthought.

## Self-review checklist before declaring done

Before finishing, explicitly verify and report status against each item:

* \[ ] All 5 required sections exist as independent, schema-driven Shopify
sections
* \[ ] Visual match confirmed against source file at 375px, 768px, 1024px,
1440px, 1920px
* \[ ] Every piece of design-visible text/media is a theme editor setting,
not hardcoded
* \[ ] All product/price/availability data pulled live from Shopify objects
* \[ ] All custom data needs solved via metafields/metaobjects, documented
* \[ ] Shared card markup extracted into reusable snippets
* \[ ] Sections tested for add/remove/reorder/reconfigure without breaking
* \[ ] Lazy loading, responsive images, and no layout shift implemented
* \[ ] Keyboard nav, focus states, contrast, and reduced-motion all verified
* \[ ] Commit history is incremental and readable, not one giant commit
* \[ ] 8+ products seeded including sold-out, no-image, and long-title cases
* \[ ] BUILD\_NOTES.md and AI\_WORKFLOW\_NOTES.md written and committed
* \[ ] Dev store URL and password ready to hand off

If any box cannot be checked, say so explicitly rather than marking the
task complete. Partial completion, clearly flagged, is expected and
acceptable per the assignment ("We don't expect all five finished... send
what you have and be straight with us about the gaps"). Silently skipping
a requirement is not acceptable.

## Final submission reminder (not for Claude Code to execute — human step)

Send the dev store URL/password, GitHub repo link, metafield/metaobject
list, and both notes documents by email. Confirm the correct recipient
address with the sender before sending, since the assignment page and the
recruiter's email listed different addresses — do not guess.

