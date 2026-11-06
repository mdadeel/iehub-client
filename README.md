# 🚢 IEHUB Client (Frontend)

Institutional B2B Commodity Trading & Physical Trade Execution Platform. Built with React 19, Vite, Tailwind CSS 4, and Firebase Auth.

---

## 🧭 System Overview

IEHUB Client is the client-side single-page application for the **Import Export Hub** platform. Designed against institutional commodity trade standards (ICC Incoterms® 2020, UCP 600, UN/LOCODE), it provides bilateral commodity discovery, direct RFQ negotiation, cryptographic trade document verification, and escrow settlement monitoring.

- **Stack:** React 19, Vite 7, Tailwind CSS 4, React Router 7, Framer Motion, Recharts.
- **Authentication:** Firebase Client SDK (Email/Password & Google OAuth).
- **Architecture:** Zero frontend secrets. Runtime Firebase and API configurations are served directly from the backend via `GET /api/config`.

---

## 📦 Key Capabilities

### 1. Institutional Commodity Market Board
- **Instant 0ms Catalog Render:** Bundled with realistic commodity positions for instant visual rendering without waiting on cold database connections.
- **Passive Revalidation:** User scroll and idle listeners automatically revalidate and reconcile state with live database positions from `GET /api/products`.
- **Incoterm & Spec Filtering:** Filter by delivery terms (`FOB`, `CIF`, `EXW`, `DDP`), HS Code, minimum order quantity (MOQ), and laboratory assay verification status.

### 2. Direct Negotiation & RFQ Desk
- **4-Stage Pipeline:** Track orders through `Buyer Submitted` → `Exporter Countered` → `Terms Agreed` → `Converted to PO`.
- **Variance Matrix:** Side-by-side inspection of proposed prices, volumes, laycan delivery windows, and discharge ports.
- **One-Click PO Conversion:** Converts agreed terms into binding purchase orders tied to escrow milestones.

### 3. Digital Trade Document Vault
- **Cryptographic Inspector:** Inspect bills of lading, certificates of origin, and SGS/Bureau Veritas assay certificates with SHA-256 Merkle hashes.
- **Transactional Bulk Deletion:** Multi-select document deletion using `DELETE /api/documents/bulk` with strict tenant isolation and active PO attachment safeguards.
- **Secure Presigned Retrieval:** Direct-to-storage download via presigned URLs (S3/Cloudflare R2/Local Provider).

### 4. Bilateral Trade & Dispute Arbitration
- **Flexport-Style Milestones:** Audit trail tracking pre-shipment inspection, container drayage, bill of lading issuance, and discharge confirmation.
- **Super Admin Mission Control:** ICC Tribunal dispute arbitration modal with side-by-side claimant/respondent evidence inspection and settlement execution presets.

---

## 🛠️ Project Structure

```plaintext
iehub-client/
├── public/                # Static assets, sitemap.xml, robots.txt, verification files
├── src/
│   ├── assets/            # Local image assets and branding
│   ├── components/        # Reusable UI components (Hero, Navbar, Footer, SEOHead, ProductCard)
│   │   └── ui/            # Design system primitives (Button, Card, Modal, DataTable, Badge)
│   ├── context/           # React context providers (AuthProvider)
│   ├── data/              # Instant mock commodity catalog (mockProducts.js)
│   ├── hooks/             # Custom application hooks (useAuth, useTheme)
│   ├── lib/               # Utilities and client permission catalogs (utils.js, permissions.js)
│   ├── pages/             # Route-level page views (HomePage, AllProductsPage, DocumentVaultPage)
│   ├── routes/            # Route configurations and authentication guards (PrivateRoute)
│   └── utils/             # API client (Axios baseURL: '/api'), formErrors, telemetry
├── index.html             # HTML entry point with semantic markup
├── vite.config.js         # Vite configuration with Rollup chunk splitting
└── package.json           # Dependencies and build scripts
```

---

## ⚙️ Development & Setup

### Prerequisites
- Node.js 18+
- Active backend running on port 5000 (`iehub-server`)

### Environment Rule
> **IMPORTANT:** Do NOT create a `.env` file in `iehub-client`. All environment variables (Firebase config, database URIs, API keys) live exclusively in `iehub-server/.env`.
> 
> The client automatically proxies `/api` calls to `http://localhost:5000` during development (configured in `vite.config.js`) and fetches its runtime configuration from `GET /api/config`.

### Commands

```bash
# Install dependencies
npm install

# Start Vite development server (http://localhost:5173)
npm run dev

# Run ESLint check
npm run lint

# Compile production build
npm run build

# Preview production bundle locally
npm run preview
```

---

## 🧪 Verification & Quality Standards

- **Code Quality:** Zero ESLint warnings or errors (`npm run lint`).
- **Production Build:** Vite Rollup build compiles cleanly with manual chunk splitting (`vendor`, `ui`, `charts`, `firebase`).
- **Copy & Design:** Audited under the `unslop` anti-slop contract—zero marketing filler, zero radial/linear gradient washes, and high data density.
