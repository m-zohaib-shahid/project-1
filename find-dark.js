const fs = require('fs');
const path = require('path');

const root = 'd:/hack/bayflow/src';
const patterns = [
  'bg-black', 'bg-zinc-900', 'bg-neutral-900', 'bg-slate-900', 'bg-slate-800',
  'bg-slate-700', 'bg-slate-600', 'bg-slate-500', 'bg-slate-400', 'bg-slate-300',
  'bg-slate-200', 'bg-slate-100', 'bg-white', 'bg-slate', 'border-slate-',
  'text-slate-', 'bg-[#ffffff]', 'border-white', 'text-white', 'opacity-0',
  'dark:bg-[#000', 'dark:bg-black', 'dark:bg-[#0a0a0a', 'bg-[#000000]',
  'bg-[#000', 'text-slate-800', 'dark:border-slate-'
];

function walkDir(dir, results) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (!p.includes('node_modules') && !p.includes('.next') && !p.includes('\.next')) {
        results.push(...walkDir(p, []));
      }
    } else if (f.isFile() && (f.name.endsWith('.tsx') || f.name.endsWith('.ts') ||
        f.name.endsWith('.css') || f.name.endsWith('.json') || f.name.endsWith('.mjs'))) {
      try {
        const content = fs.readFileSync(p, 'utf8');
        const hits = [];
        patterns.forEach((pat) => {
          let idx = content.indexOf(pat);
          while (idx >= 0) {
            hits.push({ file: f.name, path: p, pattern: pat, line: content.substring(0, idx).split('\n').length });
            idx = content.indexOf(pat, idx + 1);
          }
        });
        if (hits.length > 0) results.push({ file: f.name, path: p, hits });
      } catch (e) { /* skip */ }
    }
  }
  return results.flat();
}

const all = walkDir(root, []);
const seen = new Set();
const unique = [];
for (const item of all) {
  const key = item.path + '|' + item.pattern;
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(item);
  }
}
console.log(JSON.stringify(unique));
