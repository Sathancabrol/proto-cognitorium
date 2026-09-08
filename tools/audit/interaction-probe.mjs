/**
 * Sonde d'INTERACTIONS — Cognitorium
 * Monte le vrai App et simule de vrais clics sur de vrais boutons.
 * Usage: node tools/audit/interaction-probe.mjs
 */
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost:3000/', pretendToBeVisual: true });
for (const k of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'SVGElement', 'Event', 'MouseEvent', 'CustomEvent', 'HTMLCanvasElement', 'HTMLInputElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'DocumentFragment']) {
  if (dom.window[k] === undefined) continue;
  try { globalThis[k] = dom.window[k]; } catch { Object.defineProperty(globalThis, k, { value: dom.window[k], configurable: true, writable: true }); }
}
try { globalThis.navigator = dom.window.navigator; } catch { Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true, writable: true }); }
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.innerWidth = 1440; globalThis.innerHeight = 900; globalThis.devicePixelRatio = 1;
globalThis.localStorage = dom.window.localStorage;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.cancelAnimationFrame = clearTimeout;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.matchMedia = dom.window.matchMedia;
globalThis.ResizeObserver = dom.window.ResizeObserver = class { constructor(cb) { this.cb = cb; } observe(t) { this.cb?.([{ target: t, contentRect: { width: 1200, height: 800 } }], this); } unobserve() {} disconnect() {} };
globalThis.IntersectionObserver = dom.window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
const ctx = new Proxy({}, { get: (_t, p) => p === 'canvas' ? { width: 1200, height: 800, style: {} } : p === 'measureText' ? () => ({ width: 40 }) : String(p).startsWith('create') ? () => ({ addColorStop() {} }) : () => {}, set: () => true });
dom.window.HTMLCanvasElement.prototype.getContext = () => ctx;
const errors = [];
console.error = (...a) => errors.push(a.map(String).join(' '));
console.warn = () => {};
// intercepte fetch pour tracer les appels API
const fetchCalls = [];
globalThis.fetch = dom.window.fetch = async (url, opts) => {
  fetchCalls.push({ url: String(url), method: opts?.method || 'GET', body: opts?.body ? String(opts.body).slice(0, 120) : null });
  return { ok: false, status: 599, json: async () => ({ error: 'sonde hors-ligne' }), text: async () => '' };
};

const vite = await createServer({ root: ROOT, configFile: path.join(ROOT, 'vite.config.ts'), logLevel: 'silent', server: { middlewareMode: true, hmr: false }, appType: 'custom', ssr: { external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'lucide-react', 'motion', 'canvas-confetti', 'three'] } });
const load = (m) => vite.ssrLoadModule(m);
const React = (await import('react')).default;
const { createRoot } = await import('react-dom/client');
const { act } = await import('react');
const App = (await load('/src/App.tsx')).default;
const dataMod = await load('/src/data/initialData.ts');

const container = document.getElementById('root');
const root = createRoot(container);
await act(async () => { root.render(React.createElement(App)); });

const txt = () => (document.body.textContent || '').replace(/\s+/g, ' ');
const all = (sel) => [...document.querySelectorAll(sel)];
const byText = (sel, re) => all(sel).find(b => re.test((b.textContent || '').replace(/\s+/g, ' ')));
const click = async (el, label) => {
  if (!el) { console.log(`   ⚠ INTROUVABLE: ${label}`); return false; }
  await act(async () => { el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true })); });
  return true;
};

console.log('\n=== TEST 1 — Centre de validation (humain valide l\'IA) ===');
const badge = document.getElementById('header-btn-validation-center');
console.log(`   badge « à valider » présent: ${!!badge} — texte: ${badge?.textContent?.trim() || '—'}`);
await click(badge, 'badge validation');
const modalOpen = !!document.getElementById('validation-center-modal') || /Centre de validation/i.test(txt());
console.log(`   modal ouvert: ${modalOpen}`);
const btnValiderUn = byText('button', /^(Valider|Confirmer)/i);
const avant = txt().match(/(\d+)\s+(éléments?|inférences?)\s+(inférés?|en attente)/i)?.[1];
await click(btnValiderUn, 'bouton Valider');
const apres = txt().match(/(\d+)\s+(éléments?|inférences?)\s+(inférés?|en attente)/i)?.[1];
console.log(`   compteur avant=${avant ?? '?'} après=${apres ?? '?'} → ${avant && apres ? (Number(apres) < Number(avant) ? 'OK, le compteur baisse' : '⚠ le compteur ne bouge pas') : 'illisible'}`);
const btnTout = byText('button', /Tout valider/i);
await click(btnTout, 'Tout valider');
console.log(`   après « Tout valider »: badge encore présent = ${!!document.getElementById('header-btn-validation-center')}`);
const fermer = byText('#validation-center-modal button, button', /^Fermer|✕/);
await click(fermer, 'fermer');

console.log('\n=== TEST 2 — Recherche ROME par code (bug attendu) ===');
await click(document.getElementById('tab-btn-horizons') || byText('button', /Horizons ROME/), 'onglet horizons');
await click(byText('header nav button', /Mes possibilités/), 'section possibilités');
await click(document.getElementById('tab-btn-horizons'), 'vue horizons');
const input = document.querySelector('input[placeholder*="psychologue"], input[placeholder*="ROME"]');
if (input) {
  for (const q of ['M1412', 'ergonome', 'sophrologue']) {
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, q);
      input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    });
    const t = txt();
    const top = t.match(/Top\s+(\d+)\s+correspondances/i)?.[1];
    const vide = /Aucune correspondance/i.test(t);
    console.log(`   recherche « ${q} » → Top ${top ?? '?'} correspondances | message vide: ${vide}`);
  }
} else console.log('   ⚠ champ de recherche introuvable');

console.log('\n=== TEST 3 — Distillateur IA (ajout de vécu) ===');
await click(document.getElementById('btn-open-distiller-header') || byText('button', /Ajouter un vécu|Créer \/ Ajouter/), 'ouvrir distillateur');
const ta = document.querySelector('textarea');
if (ta) {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, "J'ai encadré 12 ouvriers sur un chantier VRD de 8 mois, avec gestion des imprévus et relation client.");
    ta.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  });
  const go = byText('button', /Analyser|Distiller|Extraire|Lancer/i);
  await click(go, 'lancer l\'analyse');
  console.log(`   appels fetch émis: ${JSON.stringify(fetchCalls)}`);
  console.log(`   message d'erreur affiché: ${txt().match(/(Erreur[^.]{0,80})/i)?.[1] || 'aucun'}`);
} else console.log('   ⚠ textarea introuvable');

console.log('\n=== TEST 4 — Persistance localStorage ===');
const KEY = 'cognitorium_active_profile_v10_full_fusion';
const saved = globalThis.localStorage.getItem(KEY);
console.log(`   clé: ${KEY}`);
console.log(`   taille sauvegardée: ${saved ? saved.length : 0} octets`);
if (saved) {
  const o = JSON.parse(saved);
  console.log(`   champs: ${Object.keys(o).join(', ')}`);
  console.log(`   nœuds=${o.nodes?.length} arêtes=${o.edges?.length} — AUCUN champ de version de schéma: ${!('__schemaVersion' in o)}`);
}

console.log('\n=== TEST 5 — Bascule de profil puis rechargement ===');
const sel = document.querySelector('select');
await act(async () => { sel.value = 'profile-pierre-deniaud'; sel.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
console.log(`   profil affiché après bascule: ${txt().match(/Pierre DENIAUD/)?.[0] || 'non trouvé'}`);
const saved2 = JSON.parse(globalThis.localStorage.getItem(KEY) || '{}');
console.log(`   la clé localStorage ne contient qu'UN profil: id=${saved2.id} (les 6 presets ne sont pas persistés)`);

console.log(`\n=== ERREURS console pendant les interactions: ${errors.length} ===`);
errors.slice(0, 8).forEach(e => console.log('   ' + e.slice(0, 200)));

await vite.close();
process.exit(0);
