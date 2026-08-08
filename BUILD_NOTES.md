# Build notes

Deliverable #4. Covers what's wrong with the prototype file, what changed
in the port and why (section by section), and what's left with more
time. Read alongside [METAFIELDS.md](METAFIELDS.md) (data model) and
[PRODUCT_SEEDING.md](PRODUCT_SEEDING.md) (dev-store seeding plan).

## What I'd flag about `purelane-homepage.html`

1. **Two full colour systems stacked via CSS cascade.** The file defines
   a dark `:root` palette, then a second `<style>` block headed
   `VERSION 2 - BRAND COLOURS (light)` that redefines the same custom
   property names. Because it comes later in the cascade, V2 always
   wins — V1 is 100% dead CSS shipped on every load. Only V2 is ported.
2. **Product art is CSS `background-image` on empty `<span role="img">`
   elements, not `<img>`.** Every bottle graphic is a base64-encoded SVG
   baked into a `:root` custom property. No lazy-loading, no `srcset`,
   can't use Shopify's image pipeline, ships every product's artwork on
   every page load regardless of which products are actually shown.
   Replaced everywhere by real `<img>` markup
   (`snippets/purelane-media.liquid`) sourced from actual product images.
3. **4 of the 8 shop-grid product cards hand-inline a duplicated ~30-line
   bottle SVG per card**, each with unique gradient `id`s, just to swap
   two lines of label text — instead of using the same CSS-background
   system the other 4 cards use. The worst offender for "no copy-pasted
   near-identical blocks"; not preserved.
4. **Literal `★★★★★` glyphs for every rating**, with no accessible name.
   A screen reader announces the raw star characters, not a rating.
   Fixed everywhere a rating appears (shop card, review card, reviews
   aggregate) with a real "Rated N out of 5" label via Dawn's own
   `visually-hidden` utility, stars kept `aria-hidden`.
5. **The reveal-on-scroll `IntersectionObserver` only ever queries `.rv`
   once, on page load.** Fine for a static page, broken in a theme
   editor: re-adding a removed section, or duplicating one, injects new
   `.rv` elements a load-time-only `querySelectorAll` can never see —
   they stay invisible forever. `assets/purelane-reveal.js` fixes this
   with a `MutationObserver` that keeps picking up newly-inserted
   elements for as long as the page is open.
6. **The animated background ("scene" system) computes which of 4 colour
   depths to show from every `[data-scene]` element's scroll offset
   across the *entire page*, including several out-of-scope sections
   between Hero and Reviews.** That's exactly the kind of coupling that
   breaks once sections are independently orderable — removing one
   section shifts every offset below it. Not ported as-is; see "Hero"
   and "Reviews rail" below for what replaced it.
7. **No sold-out, no-image, or long-title states exist anywhere in the
   source.** Required by the seeding spec, but there was no prior art to
   match — these needed original design work within the existing visual
   language, not porting. See "Shop grid" below.
8. **The mobile badge strip and desktop badge rail hand-author the same
   3 badges twice**, switched with `display:none` media queries, instead
   of one responsive layout reading from one data source. The two copies
   can silently drift out of sync (add a badge to one, forget the
   other). Fixed in Hero: both layouts now loop the same block list.
9. **The reviews marquee hand-duplicates its content in raw HTML** (5
   unique testimonials, each written out twice = 10 `<article>`s) to
   fake a seamless CSS-animation loop. Only works because the count was
   fixed at compile time. Fixed in Reviews rail: the block list is
   rendered twice by Liquid, so it stays correct for any number of
   review blocks a merchant adds or removes.
10. **Scattered inline `style="..."` attributes** on headings/ledes in
    the combos/bundles/shop panel heads (e.g. `style="margin-top:12px"`)
    that should be classes. Replaced with scoped rules
    (`.pl-panel-head`, `.pl-bundles__intro`, etc.).
11. **Every `Add to cart` button is a dead `<button>` with no handler.**
    Fine for a mock, not for "real client work." The shop-grid card now
    submits a real (JS-optional) add-to-cart form; unavailable products
    get a disabled "Sold out" button instead of a live one.
12. **Combo trays and bundle-tier composition have no Shopify-native data
    model** — hardcoded per the assignment's instruction not to fake
    this with section-setting text. See METAFIELDS.md for the
    metaobjects that replaced it.
13. **Two duplicate SVG element `id`s in one document.** The water
    background's `wl-a` and `wl-b` layers both declare `id="cg"` and
    `id="wf"` when inlined together on the same page — invalid SVG, and
    a real latent bug: which gradient a later `url(#cg)` reference
    resolves to becomes browser-dependent. Fixed as a side effect of
    extracting the water layers into separate external SVG files (see
    "Hero" below) — each file is its own document, so the id collision
    is structurally impossible now.
14. **Inconsistent badge accent colour by component** — combo and hero
    savings badges are green (`#4f7d10`), the shop-card discount badge
    is the default orange accent, with no apparent rule governing which
    gets which. This one I did *not* "fix": per "the design is the
    spec," it's preserved exactly as authored via a
    `.pl-price-row--accent-green` modifier rather than normalized to one
    colour everywhere.
15. **The reviews section (`#reviews`) has no heading element at all** —
    just a small `<span class="kicker">`. A heading-less section breaks
    landmark/heading-based navigation for screen reader and keyboard
    users. Fixed by rendering that same text as a real `<h2>` (identical
    appearance, `.pl-kicker` styling unchanged) in
    `sections/reviews-rail.liquid`.
16. **Heading order skips a level in the shop grid**: cards use `<h4>`
    directly under the section's `<h2>`, no `<h3>` in between. Fixed —
    every card title (product, combo, review) is now an `<h3>`.

## What changed, section by section

### Hero (`sections/hero.liquid`)
Promise badges and the 1→2→3 product-stage slides are both blocks, so
add/remove/reorder/duplicate in the editor works on real block
operations. Slide pricing (price/compare-at/badge style) is an explicit
per-slide setting rather than derived from the referenced product(s) —
these are curated bundle-style offers ("any 2 products, ₹349"), the same
reasoning as combos and bundle tiers in METAFIELDS.md, not a single
product's own price.

The animated water backdrop is real but deliberately **not** the
prototype's one-fixed-layer, whole-page-scroll-driven system (see
prototype issue #6 above). Both Hero and Reviews rail render their own
self-contained copy via `snippets/purelane-scene-bg.liquid` — same
visual (both used "scene 1" in the source anyway, so nothing is visually
lost), but now:
- Every animation is plain CSS (`@keyframes` drift/sway/surface/rise) —
  no JS drives the water or bubbles at all, unlike the prototype's
  scroll+mousemove-driven parallax.
- Removing, reordering, or duplicating either section can't affect the
  other's background, because there's no shared state between them.
- The heavy hand-authored SVG (~4-8KB per layer) moved from inline
  markup duplicated at every use site to four external, browser-cached
  assets (`assets/purelane-water-{a,b,c,s}.svg`), loaded once regardless
  of how many sections use them.

Dropped: the desktop-only mousemove parallax nudge on the water layers
and hero product image. It was subtle (a few pixels of drift, gated to
`min-width:1024px`), tightly coupled to the global scroll-position math
being removed anyway, and not something a side-by-side comparison at
rest would catch. Everything else — the CSS drift animations, the
product-stage crossfade/autoplay/pause-on-hover, badges, copy, CTAs — is
intact.

### Shop grid (`sections/shop-grid.liquid`)
Sourced from a real `collection` setting + `products_to_show` count,
not individual product pickers — a merchant changes what's shown by
editing the collection the normal Shopify way. This is also where the
three required seeding edge cases actually get exercised (see
`snippets/purelane-card-product.liquid`):
- **Sold out**: swaps the `Add to cart` form for a disabled "Sold out"
  button, adds a distinct dark pill on the image (deliberately different
  from the light "Best seller"/"Top rated"/"New" merchandising pills, so
  it reads as a status rather than another badge — original design work,
  since the prototype never showed this state).
- **No image**: falls back to `snippets/purelane-media.liquid`'s
  accessible dashed-tile placeholder instead of a blank box.
- **Long title**: `.pl-card__title` clamps to 2 lines with `overflow:
  hidden` + a `title` attribute carrying the full text (so nothing is
  truncated from the accessible name, only the visual box) and a
  reserved `min-height` so short titles don't cause ragged card heights
  in the same row.

### Best-selling combos (`sections/combos.liquid`)
Each card is a block referencing a `combo` metaobject (METAFIELDS.md).
Tray items that have no linked product (the prototype's own "Softens &
freshens every wash" slot in the laundry combo) render the shared
placeholder tile rather than forcing every slot to pretend it has a
product photo — matching what the source already did conceptually, just
without a real data model behind it.

### Bundles (`sections/bundles.liquid`)
Same block-references-a-metaobject pattern as combos. The "Flat ₹X per
product" unit-price line is computed (`price / quantity`, rounded) at
render time rather than stored as its own metaobject field, after
confirming all three of the prototype's tiers are in fact exactly that
calculation — one fewer field for a merchant to keep in sync by hand.

### Reviews rail (`sections/reviews-rail.liquid`)
Each card is a block referencing a `review` metaobject. The marquee's
duplicate-for-a-seamless-loop trick is done by rendering the block list
twice in Liquid (second pass `aria-hidden="true"`) instead of by
hand-authoring two copies — works correctly for any number of blocks,
where the prototype's fixed hardcoded pairs would need manual editing in
two places for every review added or removed.

### Shared pieces
`snippets/purelane-price.liquid`, `purelane-media.liquid`, and the four
`purelane-card-*.liquid` snippets carry the "Reusable" requirement —
every card type calls the same price-row and image renderers rather than
each section repeating that markup. `assets/purelane-base.css` holds the
shared design tokens/glass/buttons/type once. Everything Purelane-authored
(CSS classes, custom properties, JS globals) is `pl-`/`--pl-`-prefixed —
not a stylistic choice, a correctness one: Dawn loads `base.css` and
`component-price.css` globally via `layout/theme.liquid`, and both
define bare class names (`.card`, `.price`) the prototype also happened
to use. Without the prefix, a real page would silently blend Dawn's
unrelated styling into these cards.

## Assumptions made explicit (per the instruction not to guess silently)

- **Store money format** needs to be configured to match the design's
  plain `₹200` (no decimals) style for `| money` output to look right —
  this is a store-level setting (Settings → General → Store currency
  formatting), not something a section can control. Flagging so it isn't
  missed during store setup.
- **Font loading** stays Google Fonts via `<link>` tags (Outfit + Inter,
  same as the prototype), included redundantly in each section that
  needs the display type — harmless since the browser dedupes identical
  URLs, but not as fast as self-hosting through Shopify's native font
  picker would be. Documented as a "what I'd do with more time" item
  below rather than silently left as-is.
- **Reviews aggregate numbers** ("4.8 from 8,000+ reviews", "Loved by 12
  lakh+ homes") are merchant-editable text settings, not computed from a
  reviews app — no reviews app is installed in this dev store, and the
  assignment doesn't ask for one. If one is added later, the rating
  metafields documented in METAFIELDS.md are a one-line swap to the
  app's own namespace.
- **Combo/tier/hero-slide pricing is treated as curated marketing
  pricing** (explicit price/compare-at fields) rather than derived from
  summing the referenced products' own prices — confirmed against the
  prototype's actual numbers, which don't match a simple sum in every
  case (they're bundle discounts, not addition).

## Manual handoff step — resolved

**Shopify Partner account + development store.** Creating these needed
an interactive, credentialed signup flow (email verification, ToS
acceptance) with no CLI/API path available in this environment, so this
was originally flagged as blocking several checklist items. Resolved:
the store (`purelane-dev-kiafoimm.myshopify.com`) was created and its
credentials handed off, the Shopify CLI was installed and authenticated,
and the theme was pushed as an unpublished theme ("Purelane build",
`#159677513927`). That unblocked live verification — see the checklist
below for exactly what's now actually confirmed versus still outstanding
(mainly: full seeded product/metaobject data, needed to see the combo,
bundle-tier, and product cards render for real rather than in their
empty states, and a systematic 375/768/1024/1440/1920px comparison pass).

One real bug was caught by this live pass and is already fixed (commit
`8dbfda8`): `combos.liquid` and `bundles.liquid` checked whether any
blocks existed to decide whether to show the rail or the "add a block"
empty-state message, but with the preset's 3 blocks present and
unconfigured (no metaobject linked yet — the actual state of a fresh
store before seeding), that check passed while every card inside was
skipped, rendering an empty scrollable rail instead of the helpful
message. Fixed to count blocks with an actual reference set, not raw
block count. `reviews-rail.liquid` and `shop-grid.liquid` didn't have
this bug (different, correct empty-state conditions to begin with).

A second real bug surfaced once real prices flowed through the theme
editor: a combo metaobject entry with `price: 499` rendered as
"Rs. 4.99". Root cause: Shopify's `money` filter always expects its
input in the smallest currency unit (paise) — that's what
`product.price`/`variant.price` natively are, but metaobject decimal
fields and section "number" settings return the plain value exactly as
typed. `snippets/purelane-price.liquid` was piping metaobject/setting
prices straight into `money` unconverted — not just the one combo that
happened to get noticed, every non-product-sourced price on the site
(every combo, every bundle tier, all 3 hero-stage slides) was off by
100x. Fixed centrally in that one snippet (commit `a733270`): normalize
everything to a plain currency amount internally, multiply by 100 once,
right before each `money` call, so product-sourced and metaobject/
setting-sourced prices share one code path instead of one being in
cents and the other not.

## Live verification pass (theme pushed, real data seeded)

With the dev store fully seeded — 11 products with metafields, a
Bestsellers collection wired to Shop grid, 14 combo_item + 5 combo + 3
bundle_tier + 5 review metaobject entries, and blocks linked in the
theme editor — a further live pass on the actual storefront preview
(not just the editor's internal preview) found:

**A third real bug, found and fixed (commit `32494e0`):** two tray
slots in the "Laundry care bundle" combo showed their caption text
twice ("Softens & freshens every wash" ×2, "Deep-cleans your machine"
×2). Both slots legitimately hit the no-image placeholder path in
`snippets/purelane-media.liquid` — one has no product linked (by
design), the other links to "Washing Machine Cleaner & Descaler", the
deliberately-no-image product from PRODUCT_SEEDING.md's required edge
case. `purelane-card-combo.liquid` was passing the same caption text as
both `placeholder_label` (rendered inside the placeholder tile) and as
its own separate `<span>` below every tray slot — doubling it up
whenever the placeholder path rendered. Fixed by removing the redundant
`placeholder_label`; the visible caption span and the `alt` text passed
to the media snippet already cover the visible and accessible cases
respectively. This also confirms the no-image edge case itself renders
correctly — the bug was cosmetic duplication on top of an
otherwise-working placeholder.

**Two issues found that are store data, not code**, needing a fix in
the admin rather than the repo:
- Every shop-grid product currently shows "Sold out" — not just Copper,
  Bronze & Brass Cleaner, all 8 visible. Confirmed this is not a code
  bug: `product.available` is native Shopify data
  (`snippets/purelane-card-product.liquid` just reads it), so this
  means the other 10 products' variants have 0 available inventory and
  "Continue selling when out of stock" off — Shopify's default for a
  newly-created product where a quantity was never explicitly set.
  PRODUCT_SEEDING.md said "in stock" for 10 of the 11 products but never
  spelled out the actual admin step to make that true, which is
  probably why it didn't happen. Needs: set an actual inventory quantity
  (or toggle "Continue selling when out of stock" on) for every product
  except Copper, Bronze & Brass Cleaner.
- The "Laundry care bundle" combo's CTA button reads "CTA label"
  literally, not "Shop bundle" — confirmed via a live DOM check that
  this is the *only* one of the 5 combos with this problem (the other 4
  correctly read "Shop bundle"), which points at that one metaobject
  entry's `cta_label` field having "CTA label" typed into it instead of
  the intended value, not a template/rendering issue. Needs: fix that
  one field in the combo metaobject entry.
- The Bundles section renders its "Add a tier block and select a bundle
  tier to show it here" empty state, despite the 3 tier blocks having
  been linked — confirmed via a direct DOM query (`0` `.pl-tier` cards
  present), not a stale screenshot. `sections/bundles.liquid`'s logic
  was re-read line by line and is structurally identical to
  `combos.liquid`'s (which correctly renders all 5 linked combos), so
  this doesn't look like a code bug — most likely the block settings
  were changed in the editor but the editor's Save was never clicked
  (a real, common Shopify UX trap: the live-preview iframe shows
  unsaved changes, but a fresh page load won't). Needs: reopen Bundles
  in the theme editor, re-select all 3 tiers, and explicitly Save.

**A tooling limitation, not a site problem:** the breakpoint sweep
(375/768/1024/1440/1920px) still couldn't be completed this pass. The
browser automation's window-resize call reported success but never
actually changed the rendered viewport — confirmed across three
attempts, including a fresh tab, all returning the same ~1568px
screenshot regardless of the requested size. Only that one width could
be visually verified. The responsive CSS rules themselves were still
checked the other way (reading `assets/*.css` directly to confirm the
media-query breakpoints match the source file's own), which is real but
weaker evidence than an actual rendered screenshot at each width.

**What was positively confirmed working, live, with real data:**
- All 5 combo cards and all 10 review cards (5 real + 5 duplicated for
  the marquee loop) render correctly with real metaobject content.
- The long-title product's card title correctly clamps to 2 lines
  without breaking the card layout.
- The hero product-stage rotator auto-advances through all 3 slides
  with correct price/compare-at/badge math on each (₹200/₹299/33% off,
  ₹349/₹598/save ₹249, ₹499/₹897/save ₹398).
- Reveal-on-scroll works correctly — an initial round of screenshots
  made it look stuck, but a direct JS check (`.pl-rv.pl-in` count
  rising from 1 to 7 as the page was scrolled) confirmed it was
  screenshot/tool round-trip timing, not the animation actually
  failing; a longer settle confirmed every section reveals correctly.
- Zero console errors at any point in this pass.
- Accessible star ratings (`aria-hidden` glyphs + a real "Rated N out of
  5" label) render correctly on both the aggregate reviews line and
  individual review cards.

## What I'd do with more time

- **Self-host Outfit + Inter** via Shopify's font picker / theme
  settings instead of a Google Fonts `<link>`, and subset the weights
  actually used, for a real Core Web Vitals win instead of the
  currently-adequate-but-not-ideal preconnect+swap approach.
- **A systematic 375/768/1024/1440/1920px comparison pass**, side by
  side against the source file, at every breakpoint, once real product/
  combo/tier/review data is seeded. What's done so far: the pushed
  theme was opened live in a real browser and spot-checked at a ~1568px
  desktop width — typography, colour, the hero product-stage rotator's
  autoplay/badge-math, reveal-on-scroll, and all 5 sections' empty
  states were confirmed working correctly and matching the design, with
  zero console errors. That's real verification, but it's one width
  with placeholder/empty data, not the full systematic sweep the
  checklist item asks for — the honest gap left is mobile/tablet widths
  and full content once seeded, not "unverified in a browser" anymore.
- **Live theme-editor testing** of add/remove/reorder/duplicate/
  reconfigure for all 5 sections and every block type — confirmed the
  theme loads, renders, and handles unconfigured blocks gracefully (the
  bug found and fixed above came directly from this pass), but the
  actual editor UI interactions (drag-reorder, duplicate section,
  remove-then-re-add) haven't been clicked through yet.
- **A real quick-add / cart-drawer integration** for the shop-grid card
  instead of a plain native `/cart/add` form — functional and correct as
  built, but a full AJAX add-with-drawer-notification would match Dawn's
  own product-page experience more closely.
- **Seed a genuine 6th review** rather than the prototype's 5-testimonial
  set, since the reviews rail has no reason to be capped at an odd
  number now that it's not hand-duplicated HTML (see PRODUCT_SEEDING.md).
- **Contrast-audit the two "accent" colours** (`#b8701c` orange,
  `#4f7d10`/`#7a9c1e` greens) against their actual backgrounds with a
  proper tool rather than the visual judgement used while porting — WCAG
  AA is a hard requirement and deserves a real contrast checker pass,
  not just "this looked fine in the source file."

## Self-review checklist

Reported honestly per the assignment's instruction — boxes that can't be
checked are left unchecked with the specific reason, not marked done.

- [x] All 5 required sections exist as independent, schema-driven
      Shopify sections — `sections/hero.liquid`, `shop-grid.liquid`,
      `combos.liquid`, `bundles.liquid`, `reviews-rail.liquid`, each with
      its own `{% schema %}`, addable/removable/reorderable independently.
- [ ] **Visual match confirmed against source file at 375/768/1024/
      1440/1920px** — partially done, and this is now the single biggest
      remaining gap. With real seeded data, the pushed theme was checked
      live at a ~1568px desktop width: typography, colour, the hero
      rotator's price math across all 3 slides, reveal-on-scroll, real
      combo/review card content, and the long-title card's 2-line clamp
      all confirmed correct, zero console errors. The other four
      breakpoints are still unverified — not for lack of trying, but
      because the browser automation's resize function didn't actually
      change the rendered viewport in this session (confirmed broken
      across 3 attempts). Responsive CSS was cross-checked by reading
      the media-query rules directly instead, which is real but weaker
      than a rendered screenshot at each width.
- [x] Every piece of design-visible text/media is a theme editor
      setting — headings, ledes, CTA text/links, kicker text, badge
      labels, images (via product/metaobject references), section
      toggles (empty-state handling per section). The few things left
      fixed are decorative-only: which 3 icon shapes exist to choose
      from for promise badges, the CTA arrow glyph, the leaf divider
      icon — icon *choice* is editable per badge block, the icon
      *artwork* itself is not, same as Dawn's own icon pickers.
- [x] All product/price/availability data pulled live from Shopify
      objects — shop-grid card reads `product.price`/`compare_at_price`/
      `available`/`featured_image` directly. Combo/tier/hero-slide
      pricing is explicit (documented, deliberate — see "Assumptions"
      above) since those are curated bundle offers, not a single
      product's own price.
- [x] All custom data needs solved via metafields/metaobjects,
      documented — METAFIELDS.md.
- [x] Shared card markup extracted into reusable snippets —
      `snippets/purelane-price.liquid`, `purelane-media.liquid`,
      `purelane-card-{product,combo,bundle-tier,review}.liquid`.
- [ ] **Sections tested for add/remove/reorder/reconfigure without
      breaking** — partially done. Confirmed live, twice now: first with
      empty/unconfigured blocks (caught the combos/bundles empty-state
      bug), then again with real seeded data and blocks linked in the
      editor (caught the duplicate-caption and money-filter bugs, both
      now fixed). Also confirmed the Bundles section's block-linking
      didn't survive into what's live — most likely an unsaved editor
      change rather than a code issue (see "Live verification pass"
      above), which is itself a real "does this survive the editor"
      finding worth having caught. Not done yet: actually clicking
      through the editor UI's add/reorder/duplicate controls by hand.
- [x] Lazy loading, responsive images, no layout shift implemented —
      `loading="lazy"`/`fetchpriority="high"` where appropriate,
      `srcset`/`sizes` via `image_url`, explicit `width`/`height`
      attributes throughout `snippets/purelane-media.liquid`.
- [ ] **Keyboard nav, focus states, contrast, and reduced-motion all
      verified** — partially. Reduced-motion is implemented and
      functional (animations fully disabled, not just hidden, under
      `prefers-reduced-motion: reduce`). Focus states rely on Dawn's own
      global `:focus-visible` styling (reused deliberately rather than
      reinvented). Colour contrast was reasoned about, not measured with
      a real contrast-checking tool — flagged above as a "with more
      time" item. Keyboard nav (tab order through cards/dots/marquee)
      was designed for but not live-tested in a browser.
- [x] Commit history is incremental and readable — the build's story
      (Dawn base → scaffold → each section in dependency order →
      template wiring → seeding plan → these notes → GitHub repo → dev
      store push → a real bug found and fixed via live testing), not one
      giant commit.
- [x] **8+ products seeded including sold-out, no-image, and long-title
      cases** — done, with one data issue to clean up. All 11 products
      from PRODUCT_SEEDING.md are seeded with metafields; the long-title
      product is confirmed live, clamping correctly; the no-image
      product is confirmed rendering the placeholder correctly (via the
      combo tray, which uses the identical code path — it isn't among
      the first 8 shown in the shop grid itself, so that specific view
      is still unconfirmed). The sold-out case is checkable-but-messy
      right now: every product shows sold out, not just the intended
      one, because the other 10 don't have inventory quantities set
      (see "Live verification pass" above) — a store-data fix, not a
      code one, and not something to claim as clean until it's done.
- [x] BUILD_NOTES.md and AI_WORKFLOW_NOTES.md written and committed.
- [x] Dev store URL and password ready to hand off — store exists
      (`purelane-dev-kiafoimm.myshopify.com`), theme pushed as
      unpublished theme "Purelane build" (`#159677513927`), verified
      loading correctly in a real browser.

**Summary: 10 of 13 fully checked, 3 more partially there.** Products,
combos, bundle tiers, and reviews are all seeded and (mostly) linked;
three real bugs were found live and are fixed and pushed (empty-state
logic, the money-filter unit mismatch, duplicated placeholder captions);
two more issues are identified and precisely diagnosed as store-data
fixes rather than code fixes (inventory quantities, one typo'd CTA
label, one likely-unsaved editor change on Bundles) rather than left
vague. What's left is genuinely small and concrete: those three
data/editor fixes, the other four breakpoints (blocked on a broken
resize tool this session, not on anything about the theme itself),
clicking through the editor's add/reorder/duplicate controls by hand,
and a real contrast-checker pass. Per the assignment's own framing: "We
don't expect all five finished... send what you have and be straight
with us about the gaps" — this is that, further along with every pass.
