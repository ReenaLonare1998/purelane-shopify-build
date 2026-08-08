# Metafield & metaobject definitions

Deliverable #3. Everything here exists because the prototype needs
structured data with no native Shopify equivalent — per-product badges,
curated "combo" groupings of specific products, bundle-tier composition,
and hand-picked testimonials. None of it is faked with hardcoded section
text; each is a real metafield/metaobject definition to be created in the
dev store (Settings → Custom data).

All Purelane-specific definitions live under the `purelane` namespace so
they're easy to find and won't collide with definitions any app installs
later.

## Product metafields

| Namespace | Key | Type | Purpose |
|---|---|---|---|
| `purelane` | `badge_label` | Single line text | Optional pill shown on the shop-grid card (`Best seller`, `Top rated`, `New`). Blank = no pill rendered. Free text rather than a fixed list because merchandising language changes seasonally. |
| `purelane` | `rating_value` | Decimal | Star rating shown on the shop-grid card (e.g. `4.8`). Not a review-app field — see note below. |
| `purelane` | `rating_count` | Integer | Review count shown next to the rating (e.g. `237`). |

**Note on ratings:** the dev store has no reviews app installed, so there's
no `product.metafields.reviews.rating` to read. These two fields stand in
for that. If a reviews app is installed later, swap
`snippets/purelane-card-product.liquid` to read the app's namespace
instead (documented inline in the snippet) — one-line change, no schema
migration needed since both are just number fields on the product.

Everything else the shop-grid card needs — title, price, compare-at price,
availability, featured image — comes straight from the native `product`
object, per the "real Shopify data" requirement. No metafield is defined
for these.

## Metaobject: `combo_item`

Represents one tray slot inside a "Best-selling combo" card. Exists
because a combo tray item is sometimes a real product (with its own
image) and sometimes a generic benefit callout with no specific product
behind it (the prototype's dashed-tile "Softens & freshens every wash"
slot in the laundry combo) — that's a shape no single product reference
can capture on its own.

| Key | Type | Purpose |
|---|---|---|
| `product` | Product reference (optional) | If set, the tray shows this product's real image. If blank, the tray shows the generic placeholder tile. |
| `caption` | Single line text | Benefit line under the image/tile, e.g. "Cuts grease instantly". |

## Metaobject: `combo`

One "Best-selling combo" card in `sections/combos.liquid`. A combo is a
curated, fixed-price grouping of 2–5 products that doesn't correspond to
a Shopify collection (it's editorial, not a filter) and needs its own
price/compare-at independent of summing the underlying products — hence
a metaobject rather than a collection reference.

| Key | Type | Purpose |
|---|---|---|
| `title` | Single line text | Card heading, e.g. "Kitchen essentials". |
| `items` | List of metaobject references (`combo_item`) | 2–5 tray slots, rendered in order. Product count shown in the card ("3 products") is `items.size`, computed rather than stored, so it can't drift from the actual list. |
| `description` | Multi line text | "Includes: ..." copy. |
| `price` | Decimal | Combo price. |
| `compare_at_price` | Decimal | Struck-through reference price; the "Save ₹X" badge next to the price is computed from this minus `price`, not stored separately, so the two numbers can never drift out of sync. |
| `tray_label` | Single line text | Short marketing hook shown as a pill above the product tray, e.g. "You save ₹398" — or, for the flagship combo, something non-numeric like "Biggest saving". Kept separate and merchant-free-text (not computed) because the prototype deliberately uses different copy here than the computed savings badge next to the price. |
| `flag_label` | Single line text (optional) | Corner ribbon, e.g. "Most popular" / "Best value". Blank = no ribbon. |
| `featured` | Boolean | Gives the card the gold "hero combo" border/shadow treatment. |
| `fine_print` | Single line text | "Inclusive of all taxes · COD available" — kept editable since tax/COD terms vary by market. |
| `cta_label` | Single line text | Button text, e.g. "Shop bundle". |
| `cta_link` | URL | Where the CTA points. |

## Metaobject: `bundle_tier`

One tier card in `sections/bundles.liquid` (Starter / Most popular / Whole
home in the prototype). Same reasoning as `combo`: a fixed-price,
fixed-quantity offer that isn't a real collection or product, and needs
merchant-editable feature copy per tier.

| Key | Type | Purpose |
|---|---|---|
| `tag` | Single line text | Eyebrow label, e.g. "Starter". |
| `quantity` | Integer | Number of products the shopper picks; drives the large `qty` number. |
| `price` | Decimal | Tier price. |
| `compare_at_price` | Decimal | Struck-through reference price. Per-product unit price ("Flat ₹166 per product") is computed as `price / quantity`, not stored, for the same drift-proofing reason as combos. |
| `features` | List of single line text | Checklist items under the price. |
| `preview_products` | List of product references (2–5) | Products shown in the small image row (`tierpix`) atop the card. |
| `featured` | Boolean | Gives the card the "Most popular" gold-border treatment and swaps its CTA from ghost to primary style. |
| `cta_label` | Single line text | Button text, e.g. "Build this box". |
| `cta_link` | URL | Where the CTA points. |

## Metaobject: `review`

One card in the reviews rail. Deliberately not tied to a specific product
variant purchase record (Shopify has no such object exposed to themes)
and not assumed to come from a reviews app, since the dev store won't
have one installed — these are hand-picked testimonials the merchant
curates directly in the theme editor / custom data section.

| Key | Type | Purpose |
|---|---|---|
| `rating` | Integer (1–5) | Star rating, rendered as an accessible `aria-label` ("Rated 5 out of 5"), not raw `★` glyphs — see BUILD_NOTES.md for why the prototype's literal star characters are a real accessibility bug. |
| `title` | Single line text | Card headline, e.g. "Works like a charm". |
| `quote` | Multi line text | Review body. |
| `reviewer_name` | Single line text | e.g. "Anita". |
| `product_purchased` | Single line text | Free text, e.g. "Laundry detergent" — not a product reference, because the prototype shows a category label, not a link, and forcing it to resolve to a real SKU would break for discontinued/seasonal products a review still legitimately references. |

## Why blocks instead of a metaobject list for the section-editor side

Each of `sections/combos.liquid`, `sections/bundles.liquid`, and
`sections/reviews-rail.liquid` exposes its repeatable content as theme
editor **blocks** of type `metaobject`, each with a single "reference"
setting pointing at a `combo` / `bundle_tier` / `review` entry. This is
what gives merchants add/remove/reorder/duplicate in the theme editor
(the "survives the theme editor" requirement) while the metaobjects
themselves hold the actual structured data, editable from one place
(Settings → Custom data) and reusable if the same combo/tier/review ever
needs to appear in more than one place on the site.
