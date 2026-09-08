/**
 * Audit des contenus & captures de l'UI réellement affichée — Cognitorium
 * Usage: node tools/audit/content-audit.mjs
 */
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const vite = await createServer({ root: ROOT, configFile: path.join(ROOT, 'vite.config.ts'), logLevel: 'silent', server: { middlewareMode: true, hmr: false }, appType: 'custom', ssr: { external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react', 'motion', 'canvas-confetti', 'three'] } });
const load = (m) => vite.ssrLoadModule(m);
const out = {};

// --------------------------------------------- 1. INVENTAIRE DES CATALOGUES
console.log('\n=== 1. CATALOGUES DE CONTENU (exports réels) ===');
out.catalogs = {};
const CATS = [
  ['/src/data/psychologyAtlas.ts', 'Atlas psycho'],
  ['/src/data/experimentCatalog.ts', 'Expériences/posters'],
  ['/src/data/psyRefLibrary.ts', 'PsyRef (bibliothèque)'],
  ['/src/data/psyRefSources.ts', 'PsyRef (sources)'],
  ['/src/data/savoirsResources.ts', 'Ressources OER'],
  ['/src/data/savoirsOutilsCatalog.ts', 'Outils'],
  ['/src/data/savoirsLinks.ts', 'Liens savoirs'],
  ['/src/data/evaluationsCatalog.ts', 'Catalogue évaluations'],
];
for (const [m, label] of CATS) {
  const mod = await load(m);
  const counts = {};
  const urls = new Set();
  const dois = new Set();
  const walk = (o, d = 0) => {
    if (d > 10 || !o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach(x => walk(x, d + 1));
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string') {
        const u = v.match(/https?:\/\/[^\s"'<>)]+/g); if (u) u.forEach(x => urls.add(x));
        const dd = v.match(/10\.\d{4,9}\/[^\s"'<>)]+/g); if (dd) dd.forEach(x => dois.add(x));
      }
      if (v && typeof v === 'object') walk(v, d + 1);
    }
  };
  for (const [k, v] of Object.entries(mod)) {
    if (Array.isArray(v)) counts[k] = v.length;
    else if (v && typeof v === 'object') counts[k] = `{${Object.keys(v).length} clés}`;
    walk(v);
  }
  out.catalogs[label] = { fichier: m.split('/').pop(), exports: Object.keys(mod), counts, urls: urls.size, dois: dois.size, urlList: [...urls] };
  console.log(`\n ${label} — ${m.split('/').pop()}`);
  console.log(`   exports: ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  console.log(`   URLs: ${urls.size} | DOI: ${dois.size}`);
}

// --------------------------------------------- 2. URLS : joignabilité
console.log('\n=== 2. TEST DE JOIGNABILITÉ DES LIENS EXTERNES (échantillon) ===');
const allUrls = [...new Set(Object.values(out.catalogs).flatMap(c => c.urlList))];
console.log(`   total d'URLs uniques dans les catalogues: ${allUrls.length}`);
const sample = allUrls.slice(0, 40);
out.linkCheck = [];
for (const u of sample) {
  let code = 'ERR', err = '';
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(u, { method: 'GET', redirect: 'follow', signal: ctl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (audit cognitorium)' } });
    clearTimeout(t); code = r.status;
  } catch (e) { err = String(e.message || e).slice(0, 60); }
  out.linkCheck.push({ url: u, code, err });
  console.log(`   ${String(code).padEnd(5)} ${err.padEnd(24)} ${u.slice(0, 88)}`);
}

// --------------------------------------------- 3. CE QUE L'UI AFFICHE VRAIMENT
console.log('\n=== 3. CAPTURE DU TEXTE AFFICHÉ PAR LES VUES CLÉS (profil Näthan) ===');
const { JSDOM } = await import('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost:3000/', pretendToBeVisual: true });
for (const k of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'SVGElement', 'Event', 'MouseEvent', 'CustomEvent', 'HTMLCanvasElement', 'HTMLInputElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'DocumentFragment']) {
  if (dom.window[k] === undefined) continue;
  try { globalThis[k] = dom.window[k]; } catch { Object.defineProperty(globalThis, k, { value: dom.window[k], configurable: true, writable: true }); }
}
try { globalThis.navigator = dom.window.navigator; } catch { Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true,writable:true}); }
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.innerWidth = 1440; globalThis.innerHeight = 900; globalThis.devicePixelRatio = 1;
globalThis.localStorage = dom.window.localStorage;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.cancelAnimationFrame = clearTimeout;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.matchMedia = dom.window.matchMedia;
globalThis.ResizeObserver = dom.window.ResizeObserver = class { observe(t) { this.cb?.([{ target: t, contentRect: { width: 1200, height: 800 } }], this); } unobserve() {} disconnect() {} constructor(cb) { this.cb = cb; } };
globalThis.IntersectionObserver = dom.window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
const ctx = new Proxy({}, { get: (_t, p) => p === 'canvas' ? { width: 1200, height: 800 } : p === 'measureText' ? () => ({ width: 40 }) : String(p).startsWith('create') ? () => ({ addColorStop() {} }) : () => {}, set: () => true });
dom.window.HTMLCanvasElement.prototype.getContext = () => ctx;
console.error = () => {}; console.warn = () => {};

const React = (await import('react')).default;
const { act } = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');
const { INITIAL_COGNITORIUM_PROFILE } = await load('/src/data/initialData.ts');
const profile = INITIAL_COGNITORIUM_PROFILE;
const noop = () => {};

const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
out.captures = {};
const VIEWS = [
  ['HorizonsBridge', '/src/components/HorizonsBridge.tsx', { nodes: profile.nodes, profile, complexityMode: 'essential', onSelectNode: noop, onAddHorizon: noop }],
  ['DashboardView', '/src/components/DashboardView.tsx', { profile, simulationYear: 2026, onNavigateTab: noop, onSelectNode: noop, onOpenDistiller: noop, onOpenValidationCenter: noop, onReactivateSkill: noop, complexityMode: 'essential', onToggleComplexity: noop }],
  ['MetiersGraph', '/src/components/MetiersGraph.tsx', { profile, selectedNodeId: null, onSelectNode: noop, onAddHorizon: noop }],
  ['MesEvaluationsView', '/src/components/MesEvaluationsView.tsx', { profile, onSelectNodeById: noop, onAdd: noop }],
  ['DecayTimeline', '/src/components/DecayTimeline.tsx', { nodes: profile.nodes, simulationYear: 2026, onYearChange: noop, onReactivateSkill: noop, onSelectNode: noop }],
  ['CognitiveSignature', '/src/components/CognitiveSignature.tsx', { profile, simulationYear: 2026 }],
];
for (const [name, mod, props] of VIEWS) {
  try {
    const M = (await load(mod))[name];
    const html = renderToStaticMarkup(React.createElement(M, props));
    const txt = strip(html);
    out.captures[name] = txt;
    console.log(`\n--- ${name} (${txt.length} caractères de texte) ---`);
    console.log(txt.slice(0, 1400));
  } catch (e) { console.log(`${name}: ERREUR SSR ${e.message.split('\n')[0]}`); }
}

fs.writeFileSync(path.join(ROOT, 'tools/audit/out/content-audit.json'), JSON.stringify(out, null, 2));
console.log('\n→ tools/audit/out/content-audit.json');
await vite.close();
process.exit(0);
