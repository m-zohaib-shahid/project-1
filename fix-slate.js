const fs = require('fs');

const root = 'd:/hack/bayflow/src';
const replacements = [
  ['bg-slate-900', 'bg-[#1a1714]'],
  ['bg-slate-800', 'bg-[#2a2420]'],
  ['bg-slate-700', 'bg-[#3a3028]'],
  ['bg-slate-600', 'bg-[#4a433a]'],
  ['bg-slate-500', 'bg-[#5a4f45]'],
  ['bg-slate-400', 'bg-[#6b6258]'],
  ['bg-slate-300', 'bg-[#d4ccc0]'],
  ['bg-slate-200', 'bg-[#e8e2d4]'],
  ['bg-slate-100', 'bg-[#f0ebe2]'],
  ['bg-slate-50', 'bg-[#fdfbf7]'],
  ['bg-white', 'bg-[#fefaf5]'],
  ['border-white', 'border-[#fdfbf7]'],
  ['text-slate-800', 'text-[#2d3748]'],
  ['text-slate-700', 'text-[#4a433a]'],
  ['text-slate-600', 'text-[#6b6258]'],
  ['text-slate-500', 'text-[#9a9186]'],
  ['text-slate-400', 'text-[#b8aea5]'],
  ['text-slate-300', 'text-[#c4baa8]'],
  ['text-slate-200', 'text-[#d4ccc0]'],
  ['text-slate-100', 'text-[#e8e2d4]'],
  ['text-white', 'text-[#fdfbf7]'],
  ['dark:bg-slate-800', 'dark:bg-[#2a2420]'],
  ['dark:bg-slate-700', 'dark:bg-[#3a3028]'],
  ['dark:bg-slate-600', 'dark:bg-[#4a433a]'],
  ['dark:bg-slate-500', 'dark:bg-[#5a4f45]'],
  ['dark:bg-slate-200', 'dark:bg-[#e8e2d4]'],
  ['dark:border-slate-200', 'dark:border-[#3a332c]'],
  ['dark:text-slate-200', 'dark:text-[#c4baa8]'],
  ['dark:text-slate-300', 'dark:text-[#a89988]'],
  ['dark:text-slate-400', 'dark:text-[#8a7f75]'],
  ['dark:text-slate-500', 'dark:text-[#7a6f65]'],
  ['dark:text-slate-600', 'dark:text-[#6b6258]'],
  ['dark:text-slate-700', 'dark:text-[#4a433a]'],
  ['dark:text-slate-800', 'dark:text-[#2d3748]'],
  ['dark:hover:bg-slate-700', 'dark:hover:bg-[#4a433a]'],
  ['dark:hover:bg-slate-200', 'dark:hover:bg-[#e8e2d4]'],
  ['focus-visible:ring-slate-200', 'focus-visible:ring-[#e2ddd0]'],
  ['focus-visible:ring-slate-300', 'focus-visible:ring-[#ddd0bc]'],
  ['focus-visible:ring-slate-400', 'focus-visible:ring-[#b8aea5]'],
  ['bg-[#f8fafc]', 'bg-[#fdfbf7]'],
  ['text-[#f8fafc]', 'text-[#fdfbf7]'],
  ['background: #f8fafc', 'background: #fdfbf7'],
  ['background: #f1f5f9', 'background: #f4f1ea'],
  ['text-[#000000]', 'text-[#2d3748]'],
  ['text-[#ffffff]', 'text-[#fdfbf7]'],
  ['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.25)'],
  ['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.15)'],
  ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.08)'],
  ['rgba(0, 0, 0, 0.3)', 'rgba(30, 25, 20, 0.2)'],
  ['rgba(0, 0, 0, 0.2)', 'rgba(40, 35, 25, 0.12)'],
  ['hover:bg-slate-100', 'hover:bg-[#e8e2d4]'],
  ['hover:bg-slate-200', 'hover:bg-[#e8e2d4]'],
  ['hover:bg-slate-300', 'hover:bg-[#d4ccc0]'],
  ['hover:bg-white', 'hover:bg-[#fefaf5]'],
  ['border-slate-200', 'border-[#e2ddd0]'],
  ['border-slate-300', 'border-[#ddd0bc]'],
];

const filesToProcess = [
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
  'd:/hack/bayflow/src/components/customer/estimate-card.tsx',
  'd:/hack/bayflow/src/components/customer/shop-card.tsx',
  'd:/hack/bayflow/src/components/customer/status-timeline.tsx',
  'd:/hack/bayflow/src/components/layout/notification-bell.tsx',
  'd:/hack/bayflow/src/components/layout/shop-switcher.tsx',
  'd:/hack/bayflow/src/components/layout/sidebar.tsx',
  'd:/hack/bayflow/src/components/layout/topbar.tsx',
  'd:/hack/bayflow/src/components/ui/clay-avatar.tsx',
  'd:/hack/bayflow/src/components/ui/clay-badge.tsx',
  'd:/hack/bayflow/src/components/ui/clay-button.tsx',
  'd:/hack/bayflow/src/components/ui/clay-card.tsx',
  'd:/hack/bayflow/src/components/ui/clay-input.tsx',
  'd:/hack/bayflow/src/components/ui/clay-modal.tsx',
  'd:/hack/bayflow/src/components/ui/clay-select.tsx',
];

let totalChanges = 0;
const changedFiles = [];
let totalReplacements = 0;

for (const file of filesToProcess) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let changed = false;
    let replacementCount = 0;
    for (const [from, to] of replacements) {
      if (content.includes(from)) {
        const newContent = content.split(from).join(to);
        if (newContent !== content) {
          fs.writeFileSync(file, newContent, 'utf8');
          changed = true;
          replacementCount++;
          console.log(`CHANGED: ${file.replace('d:/hack/bayflow/src/', '')} => ${from} => ${to} (${replacementCount} times)`);
        }
      }
    }
    if (changed) {
      changedFiles.push(file);
      totalChanges++;
      totalReplacements += replacementCount;
    }
  } catch (e) {
    console.log(`ERROR reading ${file}: ${e.message}`);
  }
}

console.log(`\nTotal files changed: ${totalChanges}`);
console.log(`Total replacements made: ${totalReplacements}`);
console.log('Done.');
