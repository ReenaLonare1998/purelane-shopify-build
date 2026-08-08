# AI workflow notes

Deliverable #5. This entire build — reading the prototype, the Step 0
breakdown, every section/snippet/schema, the metaobject definitions, and
these notes themselves — was done in one Claude Code session. This
document is about that process: what the AI actually did, where it got
things wrong and had to be caught, and what I'd change running this
twenty more times.

## What was delegated to AI

Essentially the whole build. Concretely:

- **Reading and breaking down the 1,717-line prototype file** before
  writing any code (Step 0), including spotting the dead V1/V2 colour
  system, the inline-SVG product-art approach, the hand-duplicated
  badge/marquee markup, and the whole-page scroll-coupled background
  system — all flagged from reading the file, not from being told about
  them.
- **All Liquid, CSS, and JS** for the 5 sections and 8 shared snippets.
- **The data-model decisions** (what becomes a metaobject vs. a
  metafield vs. a plain setting vs. a block), documented with reasoning
  in METAFIELDS.md rather than just handed over as a schema dump.
- **The product/combo/tier/review seeding plan**, including deciding
  where to place the three required edge cases (sold out, no image,
  long title) and why those specific products.
- **Both other deliverable documents** (this one and BUILD_NOTES.md).

What was *not* delegated to AI: creating the actual Shopify Partner
account and dev store, which needs an interactive signup flow no CLI/API
in this environment can drive. That's flagged as a manual handoff step
in BUILD_NOTES.md rather than silently skipped or faked.

## Where it failed or needed correction, with specifics

Kept to what actually happened in this session, not hypothetical risks:

1. **Almost shadowed Dawn's own snippets.** The plan going in was to
   name the shared snippets `price.liquid`, `product-media.liquid`, and
   `card-product.liquid`. After extracting stock Dawn, `git status`
   showed Dawn already ships files with exactly those names, serving
   Dawn's native product/cart pages. Writing to those paths would have
   silently overwritten part of the "clean, unmodified Dawn base" the
   assignment requires. Caught by checking the actual extracted file
   tree before writing anything, not by any built-in safeguard — renamed
   everything to a `purelane-` prefix as a direct result.
2. **A wrong colour assumption that would have shipped if unchecked.**
   While writing the shared price-badge CSS, I initially hardcoded the
   savings-badge colour to green for every use site, working from
   memory of the source file's V2 colour block read much earlier in the
   session. Before finishing the shop-grid card I grep-verified the
   actual selector (`.card .pr em`) against the source and found it's
   *not* overridden to green there — it stays the default orange, unlike
   the combo and hero badges which are explicitly green. The fix
   (`.pl-price-row--accent-green` as an opt-in modifier rather than a
   blanket default) is now in BUILD_NOTES.md as a deliberately preserved
   inconsistency. The lesson isn't "the AI got a colour wrong" — it's
   that recalling a specific value from a 1,700-line file read several
   steps earlier is unreliable, and needs a grep to confirm before it
   goes in code, not after.
3. **A real functional bug from a first-draft, not a final one.** The
   first pass at the hero section's `fetchpriority` handling passed
   `forloop.first` (a boolean) directly as the attribute value instead
   of the string `'high'`, gated correctly. Caught on a self-review
   re-read of the file before committing, not by any test — this build
   has no automated test suite, so every check like this was a manual
   re-read.
4. **Reintroduced a defect I'd just finished flagging.** Writing the
   reviews-rail section, I took a shortcut: reused the Hero section's
   own CSS class plus inline `style="..."` overrides to get the water
   background positioned, rather than writing a dedicated rule. That's
   the exact "inline styles that should be classes" issue called out in
   Step 0 as something to fix, not repeat. Caught immediately on
   re-reading the file I'd just written, before it was committed — but
   the fact that it happened at all after explicitly documenting the
   anti-pattern earlier in the same session is worth being honest about.
5. **Left dead code in a first draft.** An early version of the hero
   slide loop had several `assign`/`capture` statements building toward
   an approach I abandoned mid-write in favour of a simpler one, and the
   leftover unused variables weren't removed until a deliberate cleanup
   pass. Caught by re-reading the file, not automatically.
6. **A factual miscount in a first draft of the seeding plan.** Initially
   wrote "6 reviews to match the prototype" from a rough memory of the
   marquee's length. Re-checking the actual source markup showed it's 5
   distinct testimonials, each duplicated once (10 hardcoded
   `<article>`s, not 12) — corrected before committing.
7. **A stray text artifact almost shipped in a deliverable doc.** The
   first draft of BUILD_NOTES.md ended with a leftover
   `EOF_NOTE_TO_SELF_...` line — an artifact of drafting the file's
   content while thinking in shell-heredoc terms, not a review comment
   meant to stay in the doc. Caught on the standard re-read-before-commit
   pass and removed. Small, but it's exactly the kind of thing that's
   invisible if the deliverable is skimmed rather than read end to end.
8. **A tooling dead end, not a content error.** `git clone` of the Dawn
   theme repo failed with an SSL certificate error in this environment,
   even though the network path was fine (confirmed via `curl`, which
   succeeded immediately). Worked around by downloading the repo tarball
   over HTTPS with `curl` and extracting it locally instead of debugging
   git's certificate store — a pragmatic substitution, not a fix to the
   underlying cause, which is still unexplained.

Every one of these was caught by a deliberate re-read/re-verify step
before code or docs were committed — none were caught by any automated
check, because there isn't a Shopify CLI / theme-check available in this
environment to run one. That absence is itself worth naming, not just
working around.

## What I'd systematize running this twenty more times

- **Namespace-collision audit as step zero, not a reactive catch.**
  Checking the base theme's own global class/variable/file names should
  happen *before* deciding on a naming convention for the new build, not
  get discovered by accident while extracting the base theme. Would have
  saved the near-miss on `price.liquid`/`card-product.liquid` and made
  the `.card`/`.price` collision analysis (that led to the `pl-` prefix
  decision) a planned step instead of a mid-build detour.
- **Grep-verify every colour/spacing/timing value pulled from a large
  source file at the point of use, never from memory of an earlier read**
  — even within the same session. The badge-colour mistake above is the
  concrete example; it's cheap to prevent and easy to skip if rushing.
- **A standing "assumptions log" written incrementally as decisions are
  made, not reconstructed from memory at the end.** This build kept
  Step 0's breakdown as a running reference and that worked reasonably
  well, but the BUILD_NOTES "assumptions made explicit" section was
  still partly reconstructed after the fact. Writing the assumption down
  in the same turn as the decision, in the file it'll eventually live in,
  would remove that reconstruction step entirely.
- **A real lint/validate pass after every schema-bearing file, as a
  fixed habit, not an ad hoc one.** JSON-validated each section's
  `{% schema %}` block and `templates/index.json` with a quick Node
  one-liner partway through this build (no `theme-check`/Shopify CLI was
  available in this environment) — useful, and worth being systematic
  about running after *every* schema file rather than as a batch check
  near the end.
- **Get theme-check or the Shopify CLI available in-environment before
  starting**, if doing this repeatedly. Every correctness check in this
  build was a manual re-read; a real linter would have caught at least
  the dead-code and JSON-shape issues mechanically and cheaply, freeing
  the manual re-reads to focus on things a linter can't catch (pixel
  accuracy, data-model reasoning, accessibility semantics).
