# Product seeding plan

I can't create products in the dev store myself (no store exists yet —
see BUILD_NOTES.md for the handoff). This is the exact list to seed so
the theme, once installed, matches the build: 11 products (3 over the
8-minimum), covering every category the prototype's own product art
implies, plus the three required edge cases.

Prices follow the prototype's own numbers (₹200 / ₹299 compare-at, 33%
off) for every single-unit product, since that's the exact pair the hero
stage and shop-grid badge math were built against.

| # | Title | Price | Compare-at | Image | Availability | Notes |
|---|---|---|---|---|---|---|
| 1 | Foaming Kitchen Cleaner | ₹200 | ₹299 | Yes | In stock | `purelane.badge_label`: "Best seller" · `rating_value`: 4.8 · `rating_count`: 254 |
| 2 | Tap Cleaner & Limescale Remover | ₹200 | ₹299 | Yes | In stock | `badge_label`: "Best seller" · `rating_value`: 4.8 · `rating_count`: 237 |
| 3 | Copper, Bronze & Brass Cleaner | ₹200 | ₹299 | Yes | **Sold out** | `badge_label`: "Top rated" · `rating_value`: 4.8 · `rating_count`: 231 — the required sold-out case |
| 4 | Washing Machine Cleaner & Descaler | ₹200 | ₹299 | **None** | In stock | `badge_label`: "New" · `rating_value`: 4.8 · `rating_count`: 183 — the required no-image case (newly launched SKU, photography pending — a realistic reason for a real store to be missing one) |
| 5 | Organic Dishwash Liquid Gel | ₹199 | ₹279 | Yes | In stock | `rating_value`: 4.7 · `rating_count`: 198 |
| 6 | Non-Toxic Laundry Detergent, Concentrated Formula for Everyday Loads and Deep Stain Removal — Family Size | ₹349 | ₹499 | Yes | In stock | `rating_value`: 4.6 · `rating_count`: 142 — the required long-title case (tests `.pl-card__title`'s 2-line clamp) |
| 7 | Natural Herbal Floor Cleaner | ₹220 | ₹319 | Yes | In stock | `rating_value`: 4.7 · `rating_count`: 176 |
| 8 | Non-Toxic Toilet Cleaner | ₹200 | ₹299 | Yes | In stock | `rating_value`: 4.6 · `rating_count`: 121 |
| 9 | Gentle Hydrating Liquid Handwash | ₹179 | ₹249 | Yes | In stock | `rating_value`: 4.8 · `rating_count`: 209 |
| 10 | Fabric Conditioner | ₹229 | ₹329 | Yes | In stock | `rating_value`: 4.5 · `rating_count`: 88 |
| 11 | Multi-Surface Magic Eraser (Pack of 3) | ₹149 | ₹199 | Yes | In stock | `rating_value`: 4.7 · `rating_count`: 96 |

All copy above is realistic, brand-plausible placeholder — not Lorem
Ipsum — but still placeholder, and should be reviewed against actual
Purelane brand voice before this goes live. Images: plausible product
photography (AI-generated or stock is fine per the assignment) on a
plain/light background, consistent lighting across the set, since the
shop-grid card's `.pl-card__shot` box expects roughly-consistent visual
weight across cards in one grid row.

## Shop grid

Point the "Shop grid" section's Collection setting at a collection
containing all 11 products (or however many are seeded) — e.g. a
"Bestsellers" collection — and set "Products to show" as desired (8
matches the prototype).

## Combos (3 to match the prototype)

Each combo needs its `combo` metaobject entries created first (Settings
→ Custom data → Combo), including `combo_item` entries for its tray. Two
of the prototype's five combos are enough to exercise every card layout
this build needs to prove out (mixed real-product/placeholder tray, the
"featured" gold-border treatment); seed all 5 for full parity:

1. **Kitchen essentials** — Foaming Kitchen Cleaner, Organic Dishwash Gel,
   Tap Cleaner & Limescale Remover. Price ₹499, compare-at ₹897, tray
   label "You save ₹398", flag "Most popular".
2. **Laundry care bundle** — Non-Toxic Laundry Detergent, *(no product —
   placeholder tile)* "Softens & freshens every wash", Washing Machine
   Cleaner & Descaler. Price ₹499, compare-at ₹947, tray label "You save
   ₹448". This is the combo that exercises the placeholder-tray-item
   path, since one slot deliberately has no linked product.
3. **Complete home bundle** — Foaming Kitchen Cleaner, Natural Herbal
   Floor Cleaner, Gentle Hydrating Handwash. Price ₹799, compare-at
   ₹1,495, tray label "Biggest saving" (not a rupee amount — see
   METAFIELDS.md on why `tray_label` is free text), flag "Best value",
   `featured`: true.
4. **Bathroom deep clean** — Non-Toxic Toilet Cleaner, Tap Cleaner &
   Limescale Remover, Multi-Surface Magic Eraser. Price ₹499, compare-at
   ₹897, tray label "You save ₹398".
5. **Hard water solution kit** — Tap Cleaner & Limescale Remover,
   Non-Toxic Toilet Cleaner. Price ₹349, compare-at ₹598, tray label
   "You save ₹249".

## Bundle tiers (3 to match the prototype)

1. **Starter** — quantity 2, price ₹349, compare-at ₹598, preview
   products: Tap Cleaner + Foaming Kitchen Cleaner, features: "Pick any
   two products", "Free shipping across India".
2. **Most popular** — quantity 3, price ₹499, compare-at ₹897, preview
   products: Foaming Kitchen Cleaner + Tap Cleaner + Organic Dishwash
   Gel, features: "Pick any three products", "Covers kitchen and
   laundry", "Free shipping across India", `featured`: true.
3. **Whole home** — quantity 5, price ₹799, compare-at ₹1495, preview
   products: Kitchen Cleaner + Tap Cleaner + Floor Cleaner + Toilet
   Cleaner + Laundry Detergent, features: "Pick any five products",
   "Every room in one order", "Free shipping across India".

## Reviews (5 to match the prototype)

The prototype's marquee actually only has 5 distinct testimonials —
its own "duplicate once for a seamless loop" hack repeats the same 5 a
second time to reach 10 hardcoded `<article>`s, not 6+6 as it might look
at a glance. Straight port of those 5 into `review` metaobject entries,
ratings all 5 stars, reviewer names and product-purchased labels exactly
as authored: Anita/Laundry detergent, Priya/Dishwash gel, Sunita/Liquid
handwash, Rohit S./Floor cleaner, "Verified buyer"/Tap cleaner. Worth
seeding a genuine 6th testimonial too while in there, since 5 is an odd
number for a symmetrical rail and real stores generally have more than 5
reviews worth surfacing — the section has no minimum/maximum block
count, so this is just an opportunity, not a requirement.
