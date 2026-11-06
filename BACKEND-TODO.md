# Backend work required for the shipped frontend

**Audience:** whoever owns the Express API behind `/api` (proxied to `localhost:5000` in dev,
rewritten in `vercel.json` in prod).
**Assumption:** this repo is the client only. Everything below is what the client already calls or
now needs. Nothing here is optional decoration — each item names the screen that breaks without it.

---

## 0. What the client already sends on every request

`src/utils/api.js` attaches these headers automatically. Your middleware should require them:

| Header | Source | Required |
|---|---|---|
| `Authorization: Bearer <Firebase ID token>` | Firebase Auth | yes, except public reads |
| `X-Org-Id` | `localStorage.activeOrgId` | yes for tenant-scoped routes |
| `X-Correlation-ID` | generated per request (`crypto.randomUUID()`) | echo it back in every error body and in your logs |

**Error envelope the UI already renders.** Keep this shape for every non-2xx:

```json
{
  "message": "Human sentence shown in a toast",
  "code": "VALIDATION_FAILED",
  "errors": { "price": "Price must be above zero." },
  "correlationId": "9f2c…"
}
```

`errors` is what lets the client put a red border and a message **under the field** instead of a
toast. This is new in this session — see §3.

---

## 1. Status of each shipped feature

| Frontend feature (done) | Backend today | What you must do |
|---|---|---|
| Lot cards on home `/` | `GET /api/products` returns everything | Add pagination + `fields` projection (see §2.1) |
| DataTable on document vault | `GET /api/documents` returns everything | Same: pagination, sorting, filters server-side |
| **Bulk delete documents** | only `DELETE /api/documents/:id` — client fans out N parallel calls | Add `DELETE /api/documents/bulk` (§2.2) |
| **Optimistic inventory delete** | `DELETE /api/products/:id` | Make it idempotent, return `404` already-deleted, keep referential integrity (§2.3) |
| **Inline form validation** | server returns `{ message }` only | Return `422` with `errors` keyed by field (§3) |
| **Draft autosave (listing form)** | none — drafts live in `localStorage` | Add draft endpoints so a draft follows the user across devices (§2.4) |
| DataTable on export inventory | `GET /api/products?exporterEmail=` returns all | Pagination + sort params (§2.1) |
| SEO / 404 / legal / social links | n/a | no backend work |

---

## 2. Endpoints

### 2.1 List endpoints — add pagination, sorting, filtering

Applies to `GET /api/products` and `GET /api/documents`.

**Query params (all optional, all additive — old clients must keep working):**

```
?page=1&limit=8                # limit max 100, default 20
&sort=valuation|price|quantity|name|createdAt|status
&order=asc|desc                # default desc
&q=<free text>                 # searches name, hsCode, customsReference
&category=Spices&incoterm=FOB&status=verified
&exporterEmail=<email>         # existing param, keep it
```

**Response envelope** (the client's `DataTable` reads `meta.total`; without it the pager shows the
page length only):

```json
{
  "data": [ /* rows */ ],
  "meta": { "page": 1, "limit": 8, "total": 137, "pages": 18 }
}
```

> Migration note: the client currently accepts a bare array. If you switch to the envelope, bump
> `GET /api/products` under a new query flag (`?envelope=1`) for one release, or ship both clients
> together. Do not break the bare-array contract silently.

`sort=valuation` must compute `quantity * price` **in the database**, not in JS — it is the default
sort on My Exports and the value an exporter opens that screen to see.

### 2.2 `DELETE /api/documents/bulk` — **new, required by the vault**

The vault's bulk bar ships today and fans out N parallel `DELETE /api/documents/:id` calls. That
works but gives you no transaction boundary and no honest partial-failure report.

```
DELETE /api/documents/bulk
{ "ids": ["doc_1", "doc_2", "doc_3"] }
```

Respond `200` even on partial success:

```json
{
  "deleted": ["doc_1", "doc_3"],
  "failed": [{ "id": "doc_2", "reason": "Verification locked: bill of lading is attached to an open PO" }]
}
```

Rules:
- Max 50 ids per call → `413` above that.
- Every id must belong to `X-Org-Id`; any foreign id → treat as `failed`, never as `404` leak.
- Refuse to delete a document referenced by an open purchase order — return it in `failed` with a
  readable `reason`. The UI prints that string verbatim.
- Write one audit-log entry per id, all sharing the request's `X-Correlation-ID`.

### 2.3 `DELETE /api/products/:id` — tighten semantics

The inventory row is removed **optimistically** and restored only if the request fails. So:

- `204` on success.
- `404` if already gone **is a success for the client** (row stays removed). Return
  `{ "message": "Already removed", "code": "ALREADY_DELETED" }` with `410` if you prefer, but do not
  return `500`.
- `409` if a PO references the listing → client restores the row and shows the message.
- Never 5xx for a client-side mistake.

### 2.4 Draft autosave — **new**

Today the listing form (`/dashboard/add-export`) writes a draft to `localStorage` every 700ms and
restores it on mount. That survives a refresh, not a device change. To finish the feature:

```
PUT  /api/products/drafts/:draftId        # idempotent upsert, 200
GET  /api/products/drafts/mine            # -> { data: [ ...drafts ] }
DELETE /api/products/drafts/:draftId      # called after a successful POST /api/products
```

Body = the same shape as `POST /api/products` minus `exporterEmail` (derive it from the token).
Store `updatedAt`; purge drafts older than 30 days. `draftId` is generated client-side (`uuid`) so
the PUT is safely retryable.

### 2.5 Endpoints the UI calls today — verify all exist and behave

| Method | Path | Used by |
|---|---|---|
| POST | `/products` | Add export listing |
| PATCH | `/products/:id` | Edit listing drawer |
| PATCH | `/products/:id/verify` | Admin approval |
| GET | `/products`, `/products/:id` | Marketplace, lot detail, home board |
| GET/POST | `/imports`, `/imports/:id/messages` | Buyer POs + thread |
| PATCH | `/imports/:id/{seller-accept,seller-reject,escrow-fund,escrow-release,confirm-delivery,shipping,status}` | PO lifecycle |
| GET/POST | `/documents`, `/documents/presigned-upload`, `/documents/:id/confirm-upload`, `/documents/:id/download-url`, `PATCH /documents/:id/verify` | Document vault |
| GET/POST | `/rfq`, `PATCH /rfq/:id/{accept,counter}`, `POST /rfq/:id/convert-to-po` | Quote desk |
| GET/POST | `/disputes`, `PATCH /disputes/:id/resolve` | Disputes |
| GET/POST | `/webhooks`, `POST /webhooks/:id/test` | Integrations |
| GET/POST | `/organizations`, `/organizations/invites/:token/accept`, `/company`, `/company/:email` | Tenant + KYB |
| PATCH | `/admin/entities/:id/kyb` | Admin queue |
| GET | `/analytics/export?type=orders&format=csv` | CSV export |

### 2.6 `/api/inquiries` — **new, the contact form is currently a lie**

`/contact` validates and then shows a success toast with **no network call**. Every inquiry sent
today is lost. Implement:

```
POST /api/inquiries        (public, rate-limited, no auth required)
{ "name": "…", "email": "…", "company": "…", "commodity": "…", "volume": "…", "message": "…" }
-> 202 { "id": "inq_…", "receivedAt": "2026-11-06T…" }
```

Persist, email the desk, and return `202` — the client then switches the toast copy to the real
reference id. Until this exists, either wire it or change the copy to a `mailto:` link; a form that
silently drops submissions is worse than no form.

---

## 3. Validation contract (new — the client now renders field errors)

`src/components/ui/Input.jsx` accepts an `error` prop and renders it under the field with
`aria-invalid`. To use it, the server must return per-field messages.

```
422 Unprocessable Entity
{
  "message": "2 fields need attention.",
  "code": "VALIDATION_FAILED",
  "errors": {
    "name": "Give the commodity a name of at least 3 characters.",
    "price": "Enter a price per unit above zero."
  }
}
```

Enforce **exactly** these rules server-side (client rules in `AddExportPage.jsx#validate`):

| Field | Rule |
|---|---|
| `name` | string, trimmed length ≥ 3, ≤ 120 |
| `price` | number > 0, ≤ 1,000,000, max 2 decimals |
| `quantity` | integer > 0, ≤ 10,000,000 |
| `origin` | string length ≥ 2 |
| `hsCode` | optional; `/^\d{4,8}(\.\d{1,2})?$/` |
| `description` | string trimmed length ≥ 20, ≤ 4,000 |
| `category` | enum: Spices, Textiles, Seafood, Agro, Minerals, Leather |
| `incoterm` | enum: FOB, CIF, EXW, DDP |
| `unit` | enum: Metric Tons (MT), Kilograms (KG), Containers (FCL), Pieces (PCS) |
| `moq` | integer ≥ 1 and ≤ `quantity` |
| `image` | see §5 — must become a storage key, not a data URL |

Never trust the client for these; the client copy exists only for latency.

---

## 4. Authorization matrix

| Route group | Guest (`isGuest`) | Verified trader | Admin |
|---|---|---|---|
| `GET /products`, `/products/:id`, `/disputes` read | allow | allow | allow |
| `POST /products`, `PATCH /products/:id` | **deny 403** `{code:"VERIFICATION_REQUIRED"}` | allow own org only | allow |
| `DELETE /products/:id` | deny | own org only | allow |
| `/documents/*` | deny | own org | own org + all |
| `PATCH /documents/:id/verify`, `/products/:id/verify`, `/admin/*` | deny | deny 403 | allow |
| `/imports/*` mutations | deny | party to the PO only | allow read |

Enforce org isolation on **every** query by `X-Org-Id`, not by the `exporterEmail` in the body —
that parameter is client-supplied and trivially spoofable today.

---

## 5. Files, payloads and idempotency

1. **Images are sent as base64 data URLs** (`POST /products` → `image: "data:image/jpeg;base64,…"`).
   That inflates a listing request to megabytes and puts binaries in your database. Fix:
   - keep the existing `POST /documents/presigned-upload` pattern for listing images;
   - cap JSON bodies at `1mb`; reject data URLs with `413` `{code:"IMAGE_MUST_BE_UPLOADED"}`;
   - accept `image: { "key": "products/…", "width": 1200, "height": 900, "blurhash": "…" }`.
2. **Idempotency:** accept `Idempotency-Key` on `POST /products`, `POST /imports`, `POST /payments`.
   The client retries after a timeout in the optimistic flow; without this you will double-create
   listings. Store key → response hash for 24h.
3. **Optimistic UI needs accurate status codes more than speed:** `409` for conflict, `422` for
   validation, `404` for gone, `429` for throttling — the client renders different copy for each.

---

## 6. Status enums and transitions (must be enforced server-side)

```
product.verificationStatus : draft | pending | verified | rejected
document.status            : PendingUpload | Uploaded | Pending | Verified | Rejected
po.status                  : draft | awaiting_seller | awaiting_escrow | funded | shipped
                             | arrived | delivered | settled | cancelled | disputed
```

Illegal transitions → `409` with `{ code: "INVALID_TRANSITION", from, to }`. The UI shows the
message; it does not guess.

`document.status` casing is inconsistent in the client (`PendingUpload` vs `Verified`) — keep these
exact strings for now, fix both sides in one coordinated release.

---

## 7. Non-functional

- **Rate limits:** `POST /inquiries` and `POST /webhooks/:id/test` → 5/min per IP; auth routes →
  10/min per IP; everything else → 120/min per token. Return `429` with `Retry-After`.
- **Telemetry (new, small):** `POST /api/telemetry/client-error` accepting
  `{ message, stack, url, correlationId, userAgent }`. The client's `ErrorBoundary` is ready to
  post here; without it, production failures are invisible.
- **Health:** `GET /api/health` → `{ status: "ok", version, db: "ok|degraded" }`, used by the
  offline/degraded banner.
- **CSV export:** `GET /analytics/export` must stream, not buffer — an admin exporting 50k orders
  currently risks a timeout.
- **Correlation:** log `X-Correlation-ID` on every request; include it in `500` bodies so a support
  ticket maps to a log line.

---

## 8. Acceptance checklist (curl, run before calling it done)

```bash
# 1. field errors reach the right fields
curl -s -X POST localhost:5000/api/products -H "Authorization: Bearer $T" \
  -H 'Content-Type: application/json' -d '{"name":"a","price":0}' | jq '.errors'
# expect: {"name":"…","price":"…"}

# 2. pagination meta
curl -s "localhost:5000/api/products?page=2&limit=8&sort=valuation&order=desc" | jq '.meta'
# expect: {"page":2,"limit":8,"total":>8,"pages":…}

# 3. bulk delete is partial-safe and org-scoped
curl -s -X DELETE localhost:5000/api/documents/bulk -H "Authorization: Bearer $T" \
  -H "X-Org-Id: $ORG" -d '{"ids":["own_doc","foreign_doc"]}' | jq
# expect: deleted:[own_doc], failed:[{id:foreign_doc, reason:…}]

# 4. delete is idempotent
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE localhost:5000/api/products/$ID -H "Authorization: Bearer $T"
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE localhost:5000/api/products/$ID -H "Authorization: Bearer $T"
# expect: 204 then 404/410 — never 500

# 5. drafts round-trip
curl -s -X PUT localhost:5000/api/products/drafts/$(uuidgen) -H "Authorization: Bearer $T" -d '{"name":"draft"}' | jq
```

---

## 9. Order of work (each row unblocks a shipped screen)

1. `422 { errors }` envelope on `POST/PATCH /products` — the inline validation UI is dead without it.
2. `POST /api/inquiries` — stops losing contact-form leads.
3. `DELETE /api/documents/bulk` — makes the vault's bulk bar transactional.
4. Idempotent `DELETE /products/:id` — protects the optimistic delete from false failures.
5. `?page&limit&sort&order` + `meta` on `/products` and `/documents`.
6. Draft endpoints for cross-device autosave.
7. `Idempotency-Key` on create endpoints.
8. `/telemetry/client-error` + `/health`.
9. Move listing images to presigned upload; cap JSON bodies at 1 MB.
