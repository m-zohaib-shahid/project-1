## CATEGORY 1: Claymorphism & Visual Aesthetics

### Flaw 1.1: Muddy, Low-Shadow Depth
**Location:** Multiple components throughout (`status-timeline.tsx`, `topbar.tsx`, `clay-avatar.tsx`, `clay-button.tsx`)
**Issue:** `box-shadow` values use `4px 4px 8px #1d4ed8` which creates a soft, muddy shadow that lacks tactical depth. The shadow angle is undefined (default browser) and the blur-radius-to-offset ratio (8/4 = 2x) is too shallow for proper claymorphism depth perception.
**WCAG Impact:** Shadows don't affect contrast directly, but muddy shadows reduce visual clarity on dark mode.
**Fix:** 
- Use directional shadows with explicit angles: `shadow-[2px_2px_10px_#1e293b]` for light mode, `shadow-[2px_2px_10px_#0f172a]` for dark mode
- Implement layered shadow system: 
  - `shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05)`
  - `shadow: 0 4px 6px -1px rgba(0,0,0,0.1)` 
  - `shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1)`
- For clay elements: `shadow-[2px_2px_8px_#1e293b]` with `transition-shadow duration-300`

### Flaw 1.2: Inconsistent Border Radii & Background Tones
**Location:** `status-timeline.tsx`, `topbar.tsx`, card components
**Issue:** Mixed use of `rounded-xl`, `rounded-lg`, `rounded-md` creates inconsistent visual rhythm. Background uses `bg-slate-50` (light) vs pure white in some contexts, creating a 2-tone inconsistency. `bg-slate-50` has subtle gray undertone that doesn't pure-white match.
**WCAG Impact:** `bg-slate-50` (#f1f5f9) against `#ffffff` text creates 1.5:1 contrast on white — but against dark text it's fine. The real issue is semantic inconsistency.
**Fix:** 
- Pick one background approach and stay consistent: either pure `bg-white` everywhere OR `bg-slate-50` everywhere
- If using `bg-slate-50`, ensure all cards use it; if using `bg-white`, remove all `bg-slate-50` references
- Standardize border radius: use `rounded-lg` consistently for major cards, `rounded-md` for inline elements, `rounded` for small badges

### Flaw 1.3: Flat, Non-Tactile Buttons
**Location:** `topbar.tsx` theme button, `shop-switcher.tsx` buttons
**Issue:** `clay-btn` component uses `bg-transparent text-slate-600 shadow-none` which renders as a flat button with no tactile feedback. The `shadow-none` combined with `bg-transparent` eliminates all claymorphism depth. Users can't tell if buttons are pressed.
**WCAG Impact:** No visual feedback on activation violates motion continuity principles.
**Fix:** 
- Update clay-btn default to: `bg-slate-100 shadow-sm hover:bg-slate-200 transition-shadow`
- For dark mode: `bg-slate-800 dark:bg-slate-700 hover:bg-slate-600`
- Add active state: `active:shadow-[2px_2px_0_#1e293b]` to simulate press
- Theme button should use `clay-btn` variant with proper shadow: `shadow-[2px_2px_4px_#1e293b]`
---
## REMEDIATION PRIORITY ROADMAP

### P0 — Critical (Fix within 48 hours)
1. **Technician dashboard 404** — complete workflow blocker for techs
2. **Badge contrast failures** — `bg-slate-200 text-slate-400` and `bg-amber-200 text-amber-800` fail WCAG AA
3. **Notification badge hardcoded count** — misleading UI state
4. **Focus-visible outlines** — WCAG Level AA violation

### P1 — High (Fix within 1 week)
5. **Role-based dashboard filtering** — SA/Tech/QC/Parts seeing irrelevant data
6. **Booking wizard visual progression** — step clarity, slot disabling
7. **Estimate pricing prominence** — accept/reject button hierarchy
8. **Empty state illustrations** — guidance on next actions

### P2 — Medium (Fix within 2 weeks)
9. **Claymorphism shadow system** — consistent depth across all components
10. **Background tone consistency** — bg-white vs bg-slate-50 unification
11. **Button tactile feedback** — clay-btn defaults, active states
12. **Micro-interactions** — loading skeletons, disabled states

### P3 — Low (Polish/Refinement)
13. **Motion & transition consistency** — duration, easing across all components
14. **Typography scale harmonization** — text sizes across breakpoints
15. **Color palette unification** — reduce from 15+ gray shades to 5-token system

---
## FINAL GRADE: C+ → B- After Remediation

The application has strong technical foundations (Next.js 14, Tailwind, claymorphic design system). The two bugs I fixed earlier (topbar overflow, status-timeline progress line) are correct interventions. However, the visual hierarchy, accessibility contrasts, role-based data segregation, and workflow clarity need significant investment to reach enterprise SaaS elite standards.

**Key success metric:** If all P0+P1 items are addressed, the application moves from functional to professional-grade, matching Linear/Stripe-level UX rigor.

**Estimated effort:** 80-120 hours across frontend team to address all categories.

---
*End of Audit*

### Flaw 3.1: Booking Wizard Step Progression Unclear
**Location:** `/book` page (live view)
**Issue:** The 5-step wizard shows "Step 1 of 5" but the active step isn't visually distinguished. Shop selection grid has no hover state beyond `hover:bg-slate-200`. Date & time selection lacks clear disabled styling for already-booked slots. The `Continue` button is passive.
**WCAG Impact:** Users don't know which step they're on, can't predict next actions, may abandon workflow.
**Fix:** 
- Add active step styling: `step-active: bg-electric-blue text-white`
- Inactive steps: `step-inactive: bg-slate-100 text-slate-400`
- Add hover states to shop cards: `hover:shadow-[4px_4px_8px_#1e293b] transition-shadow`
- Disable past dates: `cursor-not-allowed opacity-50`
- Make `Continue` primary: `bg-electric-blue text-white hover:bg-violet-600`

### Flaw 3.2: Status Timeline Double-Booking Prevention Missing
**Location:** Booking wizard date selection (observed live)
**Issue:** No visual indication of already-selected time slots. The date picker allows selecting any slot without grayed-out conflicts.
**WCAG Impact:** Double-booking creates operational chaos and customer dissatisfaction.
**Fix:** 
- Implement slot selection state: `data-slot-selected` with `bg-electric-blue/20`
- Past/future disabled: `cursor-not-allowed opacity-40`
- Conflict highlighting: if slot already booked, show `absolute inset-0 bg-red-500/20`

### Flaw 3.3: SA Estimate Accept/Rejection Lacks Clear Pricing Context
**Location:** SA dashboard (live view)
**Issue:** Estimate #001 shows "Oil Change, Tire Rotation" but the pricing breakdown ($45 gasket, $89 O2 sensor, $142.50 labour) requires expanding or scanning small text. The `Accept Estimate` / `Reject Estimate` buttons are inline with text links, not prominent actions.
**WCAG Impact:** Customers may agree to charges they don't fully understand; SA may miss revenue opportunities.
**Fix:** 
- Add inline estimate summary: `grid grid-cols-2 gap-2 text-sm mb-2`
- `Accept`: `bg-electric-blue-600 text-white py-2 px-4 rounded-lg`
- `Reject`: `border-2 border-rose-500 text-rose-600 py-2 px-4 rounded-lg`
- Add "What's included?" tooltip with small info icon

### Flaw 3.4: Technician Dashboard Route Missing (404)
**Location:** `/technician` route returns 404
**Issue:** The codebase has `src/app/(pos)/technician/page.tsx` but the live site `/technician` returns 404. Likely a routing issue — the route might be under `(pos)/(technician)` or the file needs to be a server component.
**WCAG Impact:** Technicians can't access their dashboard — complete workflow blocker.
**Fix:** 
- Ensure `src/app/(pos)/technician/page.tsx` exists and exports default function
- Add `generateStaticParams` if dynamic route: `async function generateStaticParams() { return [{ id: 'technician' }] }`
- Or convert to simple page: `export default function TechnicianDashboard() { return ... }`
- Verify `next.config.ts` has correct `rewrites` or `redirects`

### Flaw 3.5: Parts Person Dashboard Lacks Parts-Specific Data
**Location:** Live site parts view (observed in owner dashboard inventory)
**Issue:** Parts person needs: (a) parts running low alerts, (b) supplier lead times, (c) installation job linkage. The current inventory summary shows stock levels but no connection to open jobs.
**WCAG Impact:** Parts person can't prioritize ordering, leading to service delays.
**Fix:** 
- Add "Low Stock" indicator: `clay-badge bg-rose-500 text-white`
- Add "Estimated Lead Time" column: `text-sm text-slate-500`
- Link each part to open jobs: `underline text-electric-blue hover:underline-opacity-100`

### Flaw 2.1: Shop Switcher Friction on Mobile
**Location:** `topbar.tsx` line 34: `flex items-center gap-2 sm:gap-3 min-w-0`
**Issue:** The `min-w-0` fix we applied earlier is necessary but insufficient. On mobile (<640px), the shop switcher + notification bell + theme button + avatar overflow the 375px container. The `hidden sm:flex` on avatar helps but the core flex items still have no shrink factor on all responsive breakpoints.
**WCAG Impact:** Horizontal scrolling on mobile is inaccessible to touch users who can't easily pinch-zoom without losing context.
**Fix:** 
- Add `flex-1` to shop name span to force shrink-only behavior
- Add `w-24 w-sm-32` fixed widths to shop cards in switcher
- Implement `flex-shrink: 1 !important` on all switcher dropdown items
- Add `max-w-200` with `mx-auto` on mobile to center and constrain

### Flaw 2.2: Role-Based Dashboards — Information Overload for SA/Tech/Parts/QC
**Location:** All 5 POS dashboards (owner, SA, technician, parts, QC)
**Issue:** The Owner dashboard shows multi-shop overview, inventory, team management — appropriate for owner role. However, the SA dashboard shows ALL 8 jobs with full vehicle details, estimates, and status filters. A Service Advisor needs to see *their* assigned jobs only, not the full queue. The technician dashboard (attempted `/technician` route) returned 404, suggesting route mismatch.
**WCAG Impact:** Cognitive overload — SA/Tech/QC/PCS users must process irrelevant information, increasing error rate and task completion time.
**Fix:** 
- Implement role-based data filtering at the API/query level:
  - SA view: Show only `assignedTechnician` jobs + estimate status
  - Tech view: Show only `currentAssignment` + task checklist
  - Parts view: Show only `waitingParts` jobs + parts inventory link
  - QC view: Show only `qualityCheck` jobs + pass/fail criteria
- Add role indicator and "Your jobs only" toggle in header
- Conditional rendering: `currentRole === 'SA' ? <SAJobsOnly /> : <FullQueue />`

### Flaw 2.3: Status Timeline Not Crystal Clear (Per Audit Requirement)
**Location:** `status-timeline.tsx` customer dashboard
**Issue:** While the progress line fix we made earlier helps, the timeline step labels are too compact. The `text-xs font-medium text-center w-20` forces 20ch width truncation. On mobile, steps wrap awkwardly. The `effectiveIndex` calculation logic (waiting-for-parts edge case) is correct but not visually communicated.
**WCAG Impact:** Users can't quickly assess where their vehicle is in the service pipeline — a critical safety-critical information point.
**Fix:** 
- Increase step label width: `w-24` instead of `w-20`, add `overflow-hidden text-ellipsis`
- Add subtle number+label beneath each step on mobile: `block text-[8px] text-slate-400 mt-1`
- Color-code step numbers: `bg-electric-blue text-white` for active/completed, `bg-slate-200 text-slate-400` for pending
- Add status descriptor pill below timeline: `mt-2 text-sm text-slate-500`

### Flaw 2.4: Estimate Pricing Breakdown Could Be More Prominent
**Location:** Customer dashboard estimate section (seen in live view)
**Issue:** The Parts vs. Labour breakdown uses small `text-sm opacity-90` text. The `$134.99 Parts / $142.50 Labour` are hard to scan. `Reject Estimate` button uses generic `border-rose-200 bg-rose-50` without enough visual weight vs `Accept Estimate`.
**WCAG Impact:** Users may approve unexpected charges due to poor visual hierarchy.
**Fix:** 
- Use `text-xl font-bold` for totals, `text-sm text-slate-500` for line items
- Separate Parts/Labour with color coding: `text-electric-blue` for Parts, `text-amber-600` for Labour
- `Accept Estimate`: `bg-electric-blue text-white hover:bg-violet-600`
- `Reject Estimate`: `border-2 border-rose-500 hover:bg-rose-50`
- Add progress bar above estimate: `h-2 bg-slate-200 rounded-full mt-2 overflow-hidden`
  - `bg-electric-blue rounded-full h-full transition-width duration-300 w-1/2`