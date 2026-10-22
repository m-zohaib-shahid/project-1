const fs = require('fs');
const files = [
  'd:/hack/bayflow/src/app/(customer)/book/page.tsx',
  'd:/hack/bayflow/src/app/(customer)/dashboard/page.tsx',
  'd:/hack/bayflow/src/app/(customer)/page.tsx',
  'd:/hack/bayflow/src/app/(pos)/sa/page.tsx',
  'd:/hack/bayflow/src/components/customer/shop-card.tsx',
  'd:/hack/bayflow/src/components/customer/status-timeline.tsx',
  'd:/hack/bayflow/src/components/layout/notification-bell.tsx',
  'd:/hack/bayflow/src/components/layout/sidebar.tsx',
  'd:/hack/bayflow/src/components/layout/topbar.tsx',
  'd:/hack/bayflow/src/components/ui/clay-modal.tsx'
];

const pats = ['bg-black', 'bg-zinc-900', 'bg-neutral-900', 'bg-slate-900',
  'bg-white', 'border-white', 'text-slate-800', 'text-slate-700', 'bg-slate',
  'dark:bg-', 'dark:text-', 'bg-[#000', 'background: #000', 'opacity-0'];

let found = false;
for (const p of pats) {
  for (const f of files) {
    try {
      const c = fs.readFileSync(f, 'utf8');
      const n = (c.match(new RegExp(p, 'g')) || []).length;
      if (n > 0) {
        found = true;
        console.log('FOUND ' + p + ' in ' + f.split('\\\\').pop() + ': ' + n + ' occurrences');
      }
    } catch (e) { /* skip */ }
  }
}
if (!found) {
  console.log('ALL CLEAR - No dark/slate colors remain in checked files');
}

console.log('--- Replacement string counts across all files ---');
const reps = ['bg-[#fdfbf7]', 'bg-[#f4f1ea]', 'bg-[#e2ddd0]', 'bg-[#e8e2d4]',
  'text-[#2d3748]', 'text-[#6b6258]', 'text-[#9a9186]', 'bg-[#fefaf5]',
  'bg-[#f0ebe2]', 'border-[#e2ddd0]'];
for (const r of reps) {
  let total = 0;
  for (const f of files) {
    try {
      const c = fs.readFileSync(f, 'utf8');
      total += (c.match(new RegExp(r, 'g')) || []).length;
    } catch (e) { /* skip */ }
  }
  console.log(r + ' -> ' + total + ' occurrences');
}
