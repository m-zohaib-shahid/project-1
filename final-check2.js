const fs = require('fs');
const files = [
  'd:/hack/bayflow/src/app/(customer)/book/page.tsx',
  'd:/hack/bayflow/src/app/(customer)/dashboard/page.tsx',
  'd:/hack/bayflow/src/app/(customer)/page.tsx',
  'd:/hack/bayflow/src/app/(pos)/sa/page.tsx',
  'd:/hack/bayflow/src/app/(pos)/qc/page.tsx',
  'd:/hack/bayflow/src/app/(pos)/owner/page.tsx',
  'd:/hack/bayflow/src/app/(pos)/parts/page.tsx',
  'd:/hack/bayflow/src/app/(pos)/technician/page.tsx',
  'd:/hack/bayflow/src/app/(pos)/layout.tsx',
  'd:/hack/bayflow/src/app/layout.tsx',
  'd:/hack/bayflow/src/app/globals.css',
  'd:/hack/bayflow/src/components/customer/shop-card.tsx',
  'd:/hack/bayflow/src/components/customer/status-timeline.tsx',
  'd:/hack/bayflow/src/components/layout/notification-bell.tsx',
  'd:/hack/bayflow/src/components/layout/shop-switcher.tsx',
  'd:/hack/bayflow/src/components/layout/sidebar.tsx',
  'd:/hack/bayflow/src/components/layout/topbar.tsx',
  'd:/hack/bayflow/src/components/ui/clay-avatar.tsx',
  'd:/hack/bayflow/src/components/ui/clay-badge.tsx',
  'd:/hack/bayflow/src/components/ui/clay-button.tsx',
  'd:/hack/bayflow/src/components/ui/clay-modal.tsx'
];

const pats = [
  'bg-black', 'bg-zinc-900', 'bg-neutral-900', 'bg-slate-900',
  'bg-slate-800', 'bg-slate-700', 'bg-slate-600', 'bg-slate-500',
  'bg-slate-400', 'bg-slate-300', 'bg-slate-200', 'bg-slate-100',
  'bg-slate-50', 'bg-white', 'border-white', 'text-slate-800',
  'text-slate-700', 'text-slate-600', 'text-slate-500',
  'text-slate-400', 'text-slate-300', 'text-slate-200',
  'text-slate-100', 'text-white', 'bg-slate', 'border-slate',
  'dark:bg-slate', 'dark:text-slate', 'dark:bg-[#000', 'dark:bg-black',
  'background: #000', 'opacity-0'
];

let anyIssues = false;
for (const f of files) {
  try {
    const c = fs.readFileSync(f, 'utf8');
    const issues = [];
    for (const p of pats) {
      const re = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const n = (c.match(re) || []).length;
      if (n > 0) issues.push(p + ':' + n);
    }
    if (issues.length > 0) {
      anyIssues = true;
      console.log(f.split('/').pop() + ' => ' + issues.join(', '));
    }
  } catch (e) {
    console.log('ERR: ' + f + ' - ' + e.message);
  }
}

if (!anyIssues) {
  console.log('ALL CLEAR - No slate/dark colors remain in checked files');
}
