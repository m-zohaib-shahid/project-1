# Bayflow

Multi-tenant auto repair shop management platform. Claymorphic UI/UX with role-based dashboards for service advisors, technicians, parts, QC, and shop owners.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.4.2 (App Router, Turbopack, Cache Components) |
| UI | React 19.3 |
| Styling | Tailwind CSS v4 (`@theme` tokens, `@tailwindcss/turbopack`) |
| Icons | lucide-react |
| Language | TypeScript 5 (strict) |
| Lint | ESLint 9 + eslint-config-next |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint
npx tsc --noEmit   # type-check
```

## Routes

Route groups `(customer)` and `(pos)` are **not** URL segments - they only organize the file tree.

### Customer

| Route | Page |
| --- | --- |
| `/` | Landing page with shop cards |
| `/dashboard` | Customer bookings, status timeline, estimate |
| `/book` | Booking flow - shop and service selection |

### POS (staff)

| Route | Page | Role |
| --- | --- | --- |
| `/sa` | Service advisor dashboard | `SA` |
| `/technician` | Job board + vehicle inspection modal | `TECHNICIAN` |
| `/parts` | Inventory and parts | `PARTS` |
| `/qc` | Quality control checklist | `QC` |
| `/owner` | Owner dashboard, shops and team | `OWNER` |

## Project Structure

```
src/
|-- app/
|   |-- (customer)/      # customer-facing routes
|   |   |-- page.tsx     # /
|   |   |-- dashboard/   # /dashboard
|   |   |-- book/        # /book
|   |   +-- layout.tsx
|   |-- (pos)/           # staff-facing routes
|   |   |-- layout.tsx   # shared sidebar + topbar shell
|   |   +-- sa/  technician/  parts/  qc/  owner/
|   |-- globals.css      # Tailwind v4 theme + claymorphism utilities
|   +-- layout.tsx       # root layout, Inter font
|-- components/
|   |-- customer/        # estimate-card, status-timeline, shop-card
|   |-- layout/          # sidebar, topbar, shop-switcher, notification-bell
|   +-- ui/              # clay-button, clay-card, clay-input, clay-modal, clay-badge, clay-avatar
+-- lib/
    |-- mockData.ts      # typed mock domain data + lookup helpers
    +-- utils.ts         # cn() class merge helper
```

## Design System

Claymorphism (soft neumorphic) styling built on Tailwind v4 `@theme` tokens in `globals.css`:

- `--color-electric-blue: #2563eb` - primary actions, active nav
- `--color-amber-accent: #d97706` - pending / warnings
- `--color-emerald-accent: #059669` - success / active
- `--color-rose-accent: #e11d48` - errors / urgent
- `--color-clay-shadow-outer` / `--color-clay-shadow-inner` - the two-tone shadow pair

Utility classes: `clay-card`, `clay-card-pressed`, `clay-btn`, `clay-shadow`, `clay-shadow-inset`.

## Data Layer

`src/lib/mockData.ts` provides the full typed domain model, backed by mock data:

`Role`, `User`, `Shop`, `Service`, `Vehicle`, `Booking`, `Estimate`, `EstimateItem`, `InventoryItem`, `JobCard`, `BookingStatus`

Lookup helpers: `getShopById`, `getServiceById`, `getServicesByIds`, `getBookingById`, `getEstimateByBookingId`, `getVehicleById`, `getStaffById`, `getInventoryById`, `getJobCardByBookingId`.

## Responsive Behavior

The POS shell is responsive by default. The sidebar is off-canvas on mobile (`< md`) and pinned on desktop (`md:translate-x-0`, content offset `md:ml-64`).

- Hamburger button in the topbar opens the sidebar on mobile
- Overlay dims the page and closes the sidebar on click
- X button and nav-link clicks also close it

> **Note:** Tailwind v4 implements `translate-x-*` using the standalone CSS `translate` property, not `transform`. When asserting off-screen state in tests, use `getBoundingClientRect()`.

## Testing

A dependency-free smoke suite drives headless Chrome over the Chrome DevTools Protocol using Node's global `WebSocket`.

```bash
node tests/run.mjs
```

Requires the dev server on port 3111 and a Chrome instance with remote debugging on port 9333. See `tests/harness.mjs` for the setup.

Coverage: route responses, image optimization, sidebar links and active state, technician inspection modal, mobile navigation (open/close/overlay/nav), desktop layout, and console/network errors.

## License

Private project.