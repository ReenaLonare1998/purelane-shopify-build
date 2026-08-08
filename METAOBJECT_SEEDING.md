# Metaobject seeding walkthrough

Deliverable-adjacent doc, companion to [METAFIELDS.md](METAFIELDS.md) (field
definitions and reasoning) and [PRODUCT_SEEDING.md](PRODUCT_SEEDING.md)
(products, already seeded). Written for zero prior Shopify admin
experience — every step names the exact screen, field, type, and key.

**Before you start:** for every field below, Shopify auto-generates a
"Key" from the field name — check it matches what's listed here exactly,
and edit it if it doesn't. A mismatched key doesn't error, it just makes
that field silently return blank on the storefront. Leave every field's
"Required" toggle **off** — some are meant to be legitimately blank (a
combo tray slot with no linked product, a combo with no flag ribbon).

---

## Part 1 — Create the 4 metaobject definitions

Go to **Settings → Custom data → Metaobjects → Add definition**. Do
these in this exact order — `combo` depends on `combo_item` existing
first.

### 1a. `combo_item` definition

- Name: `Combo item` (type/handle auto-fills to `combo_item` — leave it)
- Add definition, then add these 2 fields:

| Field name | Type | Key | Required |
|---|---|---|---|
| Product | Product | `product` | No |
| Caption | Single line text | `caption` | No |

Save.

### 1b. `combo` definition

- Name: `Combo` (handle `combo`)
- Add these fields:

| Field name | Type | Key | Required |
|---|---|---|---|
| Title | Single line text | `title` | No |
| Items | Metaobject reference → pick `Combo item`, then enable the "list/multiple values" option | `items` | No |
| Description | Multi line text | `description` | No |
| Price | Number (decimal) | `price` | No |
| Compare at price | Number (decimal) | `compare_at_price` | No |
| Tray label | Single line text | `tray_label` | No |
| Flag label | Single line text | `flag_label` | No |
| Featured | True or false | `featured` | No |
| Fine print | Single line text | `fine_print` | No |
| CTA label | Single line text | `cta_label` | No |
| CTA link | URL | `cta_link` | No |

Save.

### 1c. `bundle_tier` definition

- Name: `Bundle tier` (handle `bundle_tier`)
- Add these fields:

| Field name | Type | Key | Required |
|---|---|---|---|
| Tag | Single line text | `tag` | No |
| Quantity | Number (integer) | `quantity` | No |
| Price | Number (decimal) | `price` | No |
| Compare at price | Number (decimal) | `compare_at_price` | No |
| Features | Single line text, with the "list/multiple values" option enabled | `features` | No |
| Preview products | Product, with the "list/multiple values" option enabled | `preview_products` | No |
| Featured | True or false | `featured` | No |
| CTA label | Single line text | `cta_label` | No |
| CTA link | URL | `cta_link` | No |

Save.

### 1d. `review` definition

- Name: `Review` (handle `review`)
- Add these fields:

| Field name | Type | Key | Required |
|---|---|---|---|
| Rating | Number (integer) | `rating` | No |
| Title | Single line text | `title` | No |
| Quote | Multi line text | `quote` | No |
| Reviewer name | Single line text | `reviewer_name` | No |
| Product purchased | Single line text | `product_purchased` | No |

Save. All 4 definitions now exist.

---

## Part 2 — Create entries

For every definition: **Settings → Custom data → Metaobjects → [the
definition name] → Add entry**. Fill the fields, Save, repeat for the
next entry. Do them in this order: all 14 `combo_item` entries first
(the 5 `combo` entries need to reference them), then `combo`, then
`bundle_tier`, then `review` (no dependencies, any order).

### 2a. Combo item entries (14)

One entry per tray slot below. "Product" = pick that product from the
picker; "—" means leave Product blank (this is the deliberate
placeholder-tile slot).

**For combo 1, Kitchen essentials:**
1. Product: Foaming Kitchen Cleaner · Caption: `Cuts grease instantly`
2. Product: Organic Dishwash Liquid Gel · Caption: `Squeaky clean dishes`
3. Product: Tap Cleaner & Limescale Remover · Caption: `Melts hard water stains`

**For combo 2, Laundry care bundle:**
4. Product: Non-Toxic Laundry Detergent (the long-title one) · Caption: `Removes tough stains & odour`
5. Product: — (leave blank) · Caption: `Softens & freshens every wash`
6. Product: Washing Machine Cleaner & Descaler · Caption: `Deep-cleans your machine`

**For combo 3, Complete home bundle:**
7. Product: Foaming Kitchen Cleaner · Caption: `Cuts grease instantly`
8. Product: Natural Herbal Floor Cleaner · Caption: `Kills 99.9% germs`
9. Product: Gentle Hydrating Liquid Handwash · Caption: `Gentle hydration for hands`

**For combo 4, Bathroom deep clean:**
10. Product: Non-Toxic Toilet Cleaner · Caption: `Kills 99.9% germs`
11. Product: Tap Cleaner & Limescale Remover · Caption: `Melts hard water stains`
12. Product: Multi-Surface Magic Eraser (Pack of 3) · Caption: `Scrubs away soap scum`

**For combo 5, Hard water solution kit:**
13. Product: Tap Cleaner & Limescale Remover · Caption: `Melts hard water stains`
14. Product: Non-Toxic Toilet Cleaner · Caption: `Fights limescale in the bowl`

(Entries 1/7, 3/11/13, and 10/14 are near-duplicates of each other —
that's fine, create them as separate entries rather than hunting for
reuse; it's less error-prone than trying to find and re-link an
existing one.)

### 2b. Combo entries (5)

For the **Items** field on each: click it, and add the combo_item
entries in the order listed (matching the numbered list above — e.g.
combo 1 uses combo_item entries #1, #2, #3 in that order).

**1. Kitchen essentials**
- Title: `Kitchen essentials`
- Items: combo_item entries #1, #2, #3
- Description: `Includes: Foaming Kitchen Cleaner, Dishwash Gel & Tap Cleaner. Everything for a sparkling kitchen, no need to pick separately.`
- Price: `499`
- Compare at price: `897`
- Tray label: `You save ₹398`
- Flag label: `Most popular`
- Featured: off
- Fine print: `Inclusive of all taxes · COD available`
- CTA label: `Shop bundle`
- CTA link: `/#bundles`

**2. Laundry care bundle**
- Title: `Laundry care bundle`
- Items: combo_item entries #4, #5, #6
- Description: `Includes: Laundry Detergent, Fabric Conditioner & Machine Cleaner Powder. Softer, fresher wash, all in one box.`
- Price: `499`
- Compare at price: `947`
- Tray label: `You save ₹448`
- Flag label: (leave blank)
- Featured: off
- Fine print: `Inclusive of all taxes · COD available`
- CTA label: `Shop bundle`
- CTA link: `/#bundles`

**3. Complete home bundle**
- Title: `Complete home bundle`
- Items: combo_item entries #7, #8, #9
- Description: `Includes: Kitchen Cleaner, Laundry Detergent, Floor Cleaner, Toilet Cleaner & Handwash. Our biggest saving box.`
- Price: `799`
- Compare at price: `1495`
- Tray label: `Biggest saving`
- Flag label: `Best value`
- Featured: **on**
- Fine print: `Inclusive of all taxes · COD available`
- CTA label: `Shop bundle`
- CTA link: `/#bundles`

**4. Bathroom deep clean**
- Title: `Bathroom deep clean`
- Items: combo_item entries #10, #11, #12
- Description: `Includes: Toilet Cleaner, Tap Cleaner & Magic Eraser. A complete bathroom refresh in one box.`
- Price: `499`
- Compare at price: `897`
- Tray label: `You save ₹398`
- Flag label: (leave blank)
- Featured: off
- Fine print: `Inclusive of all taxes · COD available`
- CTA label: `Shop bundle`
- CTA link: `/#bundles`

**5. Hard water solution kit**
- Title: `Hard water solution kit`
- Items: combo_item entries #13, #14
- Description: `Includes: Tap Cleaner & Toilet Cleaner. A quick, focused fix for hard water stains across the home.`
- Price: `349`
- Compare at price: `598`
- Tray label: `You save ₹249`
- Flag label: (leave blank)
- Featured: off
- Fine print: `Inclusive of all taxes · COD available`
- CTA label: `Shop bundle`
- CTA link: `/#bundles`

### 2c. Bundle tier entries (3)

**1. Starter**
- Tag: `Starter`
- Quantity: `2`
- Price: `349`
- Compare at price: `598`
- Features: `Pick any two products` and `Free shipping across India` (two separate list items)
- Preview products: Tap Cleaner & Limescale Remover, Foaming Kitchen Cleaner
- Featured: off
- CTA label: `Build this box`
- CTA link: `/#shop`

**2. Most popular**
- Tag: `Most popular`
- Quantity: `3`
- Price: `499`
- Compare at price: `897`
- Features: `Pick any three products`, `Covers kitchen and laundry`, `Free shipping across India` (three list items)
- Preview products: Foaming Kitchen Cleaner, Tap Cleaner & Limescale Remover, Organic Dishwash Liquid Gel
- Featured: **on**
- CTA label: `Build this box`
- CTA link: `/#shop`

**3. Whole home**
- Tag: `Whole home`
- Quantity: `5`
- Price: `799`
- Compare at price: `1495`
- Features: `Pick any five products`, `Every room in one order`, `Free shipping across India` (three list items)
- Preview products: Foaming Kitchen Cleaner, Tap Cleaner & Limescale Remover, Natural Herbal Floor Cleaner, Non-Toxic Toilet Cleaner, Non-Toxic Laundry Detergent (the long-title one)
- Featured: off
- CTA label: `Build this box`
- CTA link: `/#shop`

### 2d. Review entries (5)

All 5 ratings are `5`.

**1.**
- Rating: `5`
- Title: `Works like a charm`
- Quote: `Finally an eco option that cleans as well as the chemical detergent I used for years, and it smells better.`
- Reviewer name: `Anita`
- Product purchased: `Laundry detergent`

**2.**
- Rating: `5`
- Title: `Best dishwash ever`
- Quote: `Our old dishwash left my help with dry, cracked skin. That stopped completely after we switched.`
- Reviewer name: `Priya`
- Product purchased: `Dishwash gel`

**3.**
- Rating: `5`
- Title: `Great product, great packaging`
- Quote: `Very soft on hands with a lovely fragrance, and it feels good to be using far less plastic.`
- Reviewer name: `Sunita`
- Product purchased: `Liquid handwash`

**4.**
- Rating: `5`
- Title: `Dog friendly`
- Quote: `We switched because chemical floor cleaners were setting off my dog's allergies. No reactions since.`
- Reviewer name: `Rohit S.`
- Product purchased: `Floor cleaner`

**5.**
- Rating: `5`
- Title: `Sparkling taps again`
- Quote: `Hard water had ruined our bathroom fittings. Two sprays and the scale wipes straight off, no scrubbing.`
- Reviewer name: `Verified buyer`
- Product purchased: `Tap cleaner`

(Optional 6th review, per PRODUCT_SEEDING.md's note that 5 is an
arbitrary cap left over from the prototype — add a genuine one here if
you want, no code changes needed either way.)

---

## Part 3 — Link entries into the theme editor

Go to the theme editor (**Online Store → Themes → Purelane build →
Customize**, or use the editor link the CLI printed when the theme was
pushed).

### Best-selling combos section
1. Click into the **Best-selling combos** section in the section list.
2. It should already have 3 empty **Combo** blocks (from the preset).
   Click the first block, then in its settings find the **Combo**
   field and pick "Kitchen essentials" from the metaobject picker.
3. Repeat for the 2nd and 3rd blocks with "Laundry care bundle" and
   "Complete home bundle".
4. Click **Add block → Combo** twice more, and set those to "Bathroom
   deep clean" and "Hard water solution kit".
5. You should now see all 5 combo cards rendering in the preview.

### Bundles section
1. Click into the **Bundles** section.
2. It should have 3 empty **Bundle tier** blocks. Set them to "Starter",
   "Most popular", and "Whole home" respectively via each block's
   **Bundle tier** field.
3. All 3 tier cards should now render, with "Most popular" showing the
   gold-border treatment.

### Reviews rail section
1. Click into the **Reviews rail** section.
2. This section has **no preset blocks** — click **Add block → Review**
   five times (six if you added the optional extra).
3. For each block, set its **Review** field to one of the 5 (or 6)
   review entries — order doesn't matter, they scroll in a loop either
   way.
4. Save, then check the marquee is scrolling through all of them.

Once all three sections show real content, the theme matches the build
end to end and the remaining self-review checklist items (visual match
across breakpoints, theme-editor add/remove/reorder) are ready to run —
let me know and I'll do that pass live.
