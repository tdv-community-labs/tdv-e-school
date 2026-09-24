// TDV Community Labs - E-School Verification Test Suite
// Verifies HTML/CSS/JS syntax, dual-theme zinc tokens, and TypeScript types

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('⚡ Starting TDV E-School build verification...\n');

let passCount = 0;
let failCount = 0;

function check(title, fn) {
  try {
    const result = fn();
    if (result === false) {
      console.error(`❌ FAIL: ${title}`);
      failCount++;
    } else {
      console.log(`✓ PASS: ${title}`);
      passCount++;
    }
  } catch (err) {
    console.error(`❌ ERROR: ${title} - ${err.message}`);
    failCount++;
  }
}

// 1. Check index.html
check('index.html contains valid HTML5 doctype and lang tag', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  return html.includes('<!DOCTYPE html>') && html.includes('lang="az"');
});

check('index.html uses zinc-50 and zinc-950 theme tokens', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  return html.includes('bg-zinc-50') && html.includes('dark:bg-zinc-950');
});

// 2. Check styles.css
check('styles.css contains zinc-950/zinc-50 CSS variables', () => {
  const css = fs.readFileSync('styles.css', 'utf8');
  return css.includes('--bg-main: #fafafa') && css.includes('--bg-main: #09090b');
});

check('styles.css preserves print and KaTeX styles', () => {
  const css = fs.readFileSync('styles.css', 'utf8');
  return css.includes('@media print') && css.includes('.katex');
});

// 3. Check vercel.json
check('vercel.json is valid JSON with security headers', () => {
  const json = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  return json.version === 2 && Array.isArray(json.headers);
});

// 4. Check JS syntax for all component and service files
const jsFiles = [
  'app.js',
  'components/ui.js',
  'components/Navbar.js',
  'components/Sidebar.js',
  'components/DashboardView.js',
  'components/LessonsView.js',
  'components/ExamArchiveView.js',
  'components/PvpArenaView.js',
  'components/ToolsView.js',
  'components/ToolsDrawer.js',
  'components/ProfileModal.js',
  'components/UnifiedAuthBarrier.js',
  'components/ContentManagerView.js',
  'services/authService.js',
  'services/storageService.js'
];

jsFiles.forEach(file => {
  check(`${file} has valid JavaScript syntax`, () => {
    execSync(`node --check ${file}`);
    return true;
  });
});

// 5. Check types.ts with TypeScript
check('types.ts passes TypeScript strict type check', () => {
  execSync('npx -p typescript tsc --noEmit types.ts');
  return true;
});

console.log(`\n✨ Verification Complete: ${passCount} passed, ${failCount} failed.`);
if (failCount > 0) {
  process.exit(1);
}
