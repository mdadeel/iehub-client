# IEHUB — UI audit & shippability review

**Scope:** `src/` (24 pages, 29 routes, ~13.3k LOC), marketing pages, marketplace, workspace.
**Date:** 6 November 2026.

---

## Verdict in one line

The product is **built like an admin dashboard and dressed like a brand site**. Almost every
"generic / not premium / not responsive" symptom you described traces to that single mismatch —
the layout system is optimised for dense, bordered, 12px information, while the pages you are
judging are supposed to sell confidence.

That is why it feels AI-generated: AI output tends to optimise for *completeness and uniformity*,
which is exactly what the current UI does — same container, same border, same eyebrow, same CTA,
same 12px label, in every section of every page.

---

## 1. Why it reads as generic (design-level, measured)

| # | Issue | Evidence | Why it feels cheap |
|---|-------|----------|--------------------|
| 1.1 | **Type is dashboard-sized** | 27 instances of 10–11px labels and **13 different font sizes** on the home page alone | Premium marketing pages use ~4 sizes with big jumps (16 / 22 / 44 / 72). When everything is 10–13px, the eye has no entry point — it reads as a control panel, not a statement |
| 1.2 | **Everything is a bordered rectangle** | 7 `border border-border-default` containers on the home page, plus 1px borders on every card, panel, chip and divider | Borders flatten hierarchy. Premium layouts separate content with **tone** (paper → white → ink) and **shadow**, and use borders only for interactive edges |
| 1.3 | **Identical section rhythm 8×** | 8 `eyebrow` kickers on one page, each followed by heading → paragraph → link | Repeating the same block turns a page into a template. Real editorial layouts alternate: full-bleed image, off-centre text, asymmetric split, quiet typographic break |
| 1.4 | **Surfaces are too close in tone** | canvas `#F6F4F1`, surface `#FFFFFF`, subtle `#F1EDE8`, border `#E1DBD3` | A 2–3% luminance step reads as "dirty white", not as layering. Sections need a real step (e.g. `#F1EDE8` vs `#FFFFFF`) or a dark band |
| 1.5 | **One accent, one intensity** | `#C2181F` used identically for text links, icons, 2px rules, buttons and hover | Premium systems use a **scale**: 7% tint background, 20% tint border, 100% fill, darkened hover, one "loud" moment per screen |
| 1.6 | **Photographic grade is inconsistent** | Hero is teal/blue-hour, truck is warm gold, warehouse is neutral grey, food shots are daylight | The eye reads four photographers, i.e. a stock collage. A single grade (same contrast + temperature) is what makes a site feel art-directed |
| 1.7 | **Motion is only colour change** | Hover = `border-color` + `text-color`; no entrance, no stagger, no scroll reveal | Premium feel is 70% timing: 120–160ms hovers, 400–600ms reveals, one easing curve everywhere |
| 1.8 | **A data table sits in the middle of a sales page** | "Open export positions" table on `/` with 6 columns of 11px mono text | This is the single biggest density offender. A landing page should show 3–4 big lots with prices, not a spreadsheet |
| 1.9 | **Copy patterns repeat** | "One desk…" / "trade desk" in hero, CTA, auth aside, footer | Repetition reads as generated. Each section needs its own angle, not its own slogan |
| 1.10 | **Numbers without provenance** | `2,840 exporters`, `4.9 average rating`, `1,240 settlements` | Premium = specific and sourced ("SGS-verified lots only, 43 inspections in October"), not round marketing numbers |

### The type scale I recommend (replacing 13 sizes)

| Role | Size / weight | Use |
|---|---|---|
| Display | 56–72px / 700, tracking −2.5% | Home hero only |
| H2 | 40–44px / 700, tracking −2% | section heads |
| H3 | 22–24px / 600 | card titles |
| Body | 15–16px / 400, line-height 1.65 | paragraphs |
| Meta | 12px / 600 uppercase, tracking +12% | labels — **max 6 per screen**, not 27 |

---

## 2. Responsive & wrapping bugs (root causes, then fixes)

These are real defects, not taste. All were reproduced by measuring the fixed layout, not guessed.

| Symptom | Root cause | Fix (applied) |
|---|---|---|
| **Button/label text wrapping to a 2nd line** — worst at 1024–1200px | Navbar budget at 1024px: content width 944px, but brand (~104) + search (176) + 5 links (~450) + right cluster (265) ≈ **990px**. The CTA `<Link>` had no `whitespace-nowrap`, so flexbox shrank it and "Request quote" wrapped | Links now appear only from `lg`, search from `xl`, sign-in from `lg`; every nav label + CTA is `whitespace-nowrap shrink-0` |
| **Nav feels cramped / scrolls sideways** | 5 uppercase links at 11px with 0.12em tracking inside a shrinkable flex row | Shorter labels ("Why us"), reduced tracking, `gap-0.5`, no internal overflow scroller |
| **Table forces horizontal scroll on phones** | 6 columns always rendered | Origin hides `< sm`, Inspection `< md`, Available `< lg`; commodity/price/action remain |
| **Cards too small / text colliding on tablet** | Industry mosaic switched to 4 columns at 640px | Mosaic moves to `md`; spans updated |
| **Footer becomes one long column on tablet** | `grid-cols-1 … lg:grid-cols-12` | New step: 2 cols → 3 cols → 12 cols |
| **Dashboard misaligned by 8px** | Header is `h-16` (64px) but the dashboard still used `mt-14` / `top-14` / `100vh-56px` | Corrected to 64px offsets |
| **No navigation at all for workspace on phones** | Sidebar is `hidden md:flex`, and the mobile drawer only lists public links | Added a sticky, horizontally scrollable workspace switcher under the header on `< md` |
| **Headings too timid next to body copy** | Section H2 at 36px vs 13px body | H2 raised to 32–42px, tightening the jump ratio |

### Still weak on mobile (needs design work, not a patch)

- Workspace tables still rely on horizontal scroll; they need a **card-per-row fallback** below `md`.
- No bottom tab bar for the workspace; the new top switcher is a stopgap.
- The home hero stacks into ~1,100px of content before the first product.
- Tap targets: several 11px links have ~28px height (guideline is 44px).

---

## 3. Why it doesn't feel *human made*

1. **Symmetry everywhere.** Every section is a 12-column grid with left-aligned text and one
   right-aligned link. Humans break the grid: an image that bleeds past the container, a caption in
   the margin, a quote pulled left.
2. **No named people.** Testimonials use initials in a dark square. Real trust comes from a face, a
   role, a company, a date. You already have strong photography of an inspector — put a name on it.
3. **No editorial voice in details.** Image captions, footnotes, "last updated", a phone number with
   a real area code — these micro-details are what separate a studio site from a template.
4. **Contrast is uniform.** Everything is medium importance. Humans rank: one hero idea, one
   supporting idea, everything else quiet.
5. **Zero imperfection.** No overline rules, no hand-set spacing, no deliberate asymmetry, no
   rotated label, no oversized index numbers with breathing room. Perfection-by-uniformity is the
   signature of generated design.

---

## 4. Why it isn't shippable yet (hard blockers)

| Blocker | Status |
|---|---|
| No 404 route — any bad URL rendered a blank shell | **Fixed this turn**: designed 404 + catch-all |
| Four footer legal links pointed at `#` | **Fixed**: `/legal` page with Privacy / Terms / Escrow / Security |
| Broken default OG image (`/logo.png` did not exist) | **Fixed**: defaults to the hero photograph |
| 18 of 24 pages had no route-level title/description | **Partially fixed**: 6 marketing pages + auth (`noindex`) now covered; dashboard pages still missing |
| Dead social links (`#`) | Open — needs real accounts |
| No error telemetry, no analytics, no consent banner | Open |
| No tests, no CI pipeline, no e2e smoke | Open |
| No pagination on any list — admin tables load everything | Open (blocking at scale) |
| No entitlement/tier model, so "upgrade" UI cannot exist | Open (product decision) |
| Currency/locale handling is USD-only, no i18n | Open |

---

## 5. The 20 capabilities — verified against the code

Legend: ✅ present · ⚠️ partial · ❌ missing

| # | Capability | Verdict | Evidence / gap |
|---|---|---|---|
| 1 | Optimistic UI updates | ⚠️ | Was absent. Now: inventory delete removes the row immediately and **rolls back** on API failure (`MyExportsPage.jsx`). Everything else is `await → setState`. Next: quantity/price edits, PO status changes |
| 2 | Skeleton loaders | ✅ | 18 `animate-pulse` blocks across 8 files (`AllProductsPage`, `DashboardPage`, `MyImports`, `MyExports`, `ProductDetails`, `GlobalLogistics`, `OrderMessageThread`, `Webhooks`). Gap: no shared `<Skeleton>` primitive — markup is duplicated and drifts |
| 3 | Command palette | ✅ | `ui/CommandPalette.jsx`, ⌘K/Ctrl-K, arrow + enter + esc handling, theme + admin commands. Gap: navigation-only — no product/order/company search |
| 4 | Persistent sidebar | ✅ | `DashboardLayout` sticky aside (now correctly offset). Gap: was desktop-only; a mobile switcher was added this turn |
| 5 | Loading & empty states | ⚠️ | `EmptyState` used in MyExports (4), MyImports (4), Dashboard (2), Admin (6), Webhooks (1). Gap: `DocumentVaultPage` has none; several "error" states are a toast with no in-place retry |
| 6 | Autosave | ❌ | Only theme + guest session in `localStorage`. Listing/PO forms lose work on refresh — needs debounced draft persistence + "saved 2m ago" |
| 7 | Debouncing | ✅ | `/products` search debounces the API call 300ms (`AllProductsPage.jsx:124`). Gap: only applied there |
| 8 | Throttling | ⚠️ | Navbar scroll now `requestAnimationFrame`-throttled. Gap: no `AbortController` on superseded product searches, no rate-limit backoff |
| 9 | Smart form validation | ⚠️ | HTML5 `required` + toast errors; password rules in Register. `utils/validation.js` exists but is barely wired. Gap: **no inline field-level errors**, no disabled-until-valid, no server-field-error mapping |
| 10 | Bulk actions on lists | ❌ | No selection model anywhere (no `selectAll`/`selectedRows`). Needed on inventory, POs, document vault, admin queues |
| 11 | Reusable data table | ⚠️ | `ui/Table.jsx` gives primitives only. No sorting, no pagination, no column config, no selection, no sticky header — every page re-implements rows |
| 12 | Advanced filtering | ⚠️ | `/products` is genuinely good: search + category + Incoterm + sort, synced to the URL. Gaps: no price/quantity/date ranges, no saved views, no filter chips persistence across navigation |
| 13 | Keyboard shortcuts | ⚠️ | ⌘K / Ctrl-K, `/` (added this turn), arrows + Enter + Esc in palette, Esc in dropdowns. Gap: no `g`-chords, no shortcuts help sheet, no focus trap parity |
| 14 | Tier-based UI indicators | ❌ | No plan, entitlement or quota model exists. "Demo vs Live" badge is a user state, not a tier. Requires product definition before UI |
| 15 | Onboarding data capture | ❌ | No first-run flow. Registration collects email/password only; role, commodity interest, volume, destination market are never captured, so nothing can personalise |
| 16 | Referral & affiliate pages | ❌ | Only organisation **invites** (`/invites/:token`). No referral codes, attribution, or share pages |
| 17 | Custom 404 page | ✅ | `NotFoundPage` + `<Route path="*">` added this turn |
| 18 | Mobile-optimised SaaS layouts | ⚠️ | Top switcher added, sidebar behaviour fixed, home mosaic fixed. Still: table-scroll on mobile, no bottom nav, some 28px tap targets |
| 19 | Destructive action protection | ✅ | `ConfirmDialog` on inventory delete (`MyExportsPage:867`) and purchase-order actions (`MyImportsPage:990`). Gap: not applied to every destructive path (document delete, webhook delete, org removal) |
| 20 | Graceful error recovery | ⚠️ | Global `ErrorBoundary` (`main.jsx`), retry button on `/products`, mock-data fallback when the API is cold. Gaps: no automatic retry with backoff, no offline banner, no error telemetry, least-effort messages ("Failed to remove listing") |

**Score: 4 present · 8 partial · 8 missing.** The four that matter most for how it *feels* —
inline validation, autosave, bulk actions, and one real data table — are the missing ones.

---

## 5b. Tier 1 status (in progress)

| Tier 1 item | Status |
|---|---|
| Cut the type scale to a small set of roles | **Done** — `.t-display / .t-h2 / .t-h3 / .t-body / .t-meta` now govern marketing pages; the home page dropped from 13 ad-hoc sizes to 6 roles (11 meta / 13 dense / 14 body / 19 h3 / clamp h2 / clamp display) |
| Remove borders from non-interactive containers | **Done** — `.panel` + `.panel-lift` replace `border border-border-default` on capability, lane and category cards; the trade board lost its outer box |
| Three visible surface layers | **Done** — canvas `#F3EFE9`, sunken `#EAE4DC`, surface `#FFFFFF`, hover `#E1DAD0`; the old set differed by 2–3% luminance and read as one flat white |
| One photographic grade | **Done** — every `.media` image now runs `saturate(.93) contrast(1.05) brightness(.99)` |
| Vary section composition | **Partial** — 01–07 index numerals replace eight identical eyebrow kickers and headings get a 620ms entrance curve. A full-bleed image band and an asymmetric split are still to do |
| Replace the home data table with lot cards | **Done** — four photographic lot cards (price, incoterm, origin, MOQ, tonnage) in a hairline grid; the six-column table now lives only on `/products` |
| One radius language | **Done** — the last `rounded-xl/2xl` outliers (12/16px) were folded onto the 6px system radius |

## 6. Fix order (highest perceived-quality gain per hour)

**Tier 1 — makes it feel designed (2–3 days)**
1. Cut the type system to 5 sizes; remove ~60% of the 10–11px labels.
2. Delete borders from non-interactive containers; introduce a third surface tone + one shadow level.
3. Replace the home data table with 4 big lot cards (keep the board on `/products`).
4. Grade all photography to one look (same contrast/temperature), one aspect ratio per section.
5. Vary section composition: 2 full-bleed image bands, 1 asymmetric split, 1 quiet typographic break.

**Tier 2 — makes it feel human (2 days)**
6. Named testimonials with photos + company + date; add 3 client logos.
7. Editorial captions on the two strongest photographs.
8. Rewrite the six repeated "trade desk" lines so each section has one job.
9. Replace round marketing numbers with sourced, dated ones.

**Tier 3 — makes it shippable (3–5 days)**
10. Inline form validation + disabled-until-valid + server error mapping.
11. Autosave drafts on listing/PO forms with a "saved" indicator.
12. One `<DataTable>` (sort, paginate, select, bulk actions) reused by inventory, POs, vault, admin.
13. Mobile card fallbacks for those tables; bottom tab bar in the workspace.
14. Error telemetry + retry/backoff + offline banner; consent + analytics; CI with a Playwright smoke test.

---

## 7. What was already shipped this turn

`Navbar` breakpoints + nowrap · dashboard offsets + mobile workspace switcher · home table
column collapse · footer tablet grid · heading scale bump · contrast tokens raised to ~4.5:1 ·
designed 404 + catch-all · `/legal` policies page · per-route SEO for 6 marketing pages + `noindex`
auth · real OG image · optimistic inventory delete with rollback · rAF-throttled scroll · `/`
shortcut. Build and lint clean; committed to `arena/5cc34e18-iehub-client`.
