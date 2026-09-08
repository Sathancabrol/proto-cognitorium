/**
 * Sonde d'exécution temps réel — Cognitorium
 * ------------------------------------------
 * Monte les composants RÉELS de src/ dans un DOM (jsdom) via le vrai pipeline Vite
 * (ssrLoadModule) + le vrai react-dom/client, avec les VRAIES données.
 * Aucune logique n'est réimplémentée : ce sont exactement les composants livrés.
 *
 * Usage: node tools/audit/runtime-probe.mjs
 */
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:3000/',
  pretendToBeVisual: true,
});
const GLOBALS = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'SVGElement',
  'Event', 'MouseEvent', 'KeyboardEvent', 'CustomEvent', 'HTMLCanvasElement', 'HTMLInputElement',
  'HTMLSelectElement', 'HTMLTextAreaElement', 'DocumentFragment', 'CSS', 'Range'];
for (const k of GLOBALS) {
  if (dom.window[k] === undefined) continue;
  try { globalThis[k] = dom.window[k]; }
  catch { Object.defineProperty(globalThis, k, { value: dom.window[k], configurable: true, writable: true }); }
}
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.devicePixelRatio = 1;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.innerWidth = 1440;
globalThis.innerHeight = 900;
globalThis.localStorage = dom.window.localStorage;
globalThis.confirm = dom.window.confirm = () => true;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
globalThis.matchMedia = dom.window.matchMedia;
class IO { constructor() {} observe() {} unobserve() {} disconnect() {} }
globalThis.IntersectionObserver = dom.window.IntersectionObserver = IO;
class RO { constructor(cb) { this.cb = cb; } observe(t) { this.cb([{ target: t, contentRect: { width: 1200, height: 800 } }], this); } unobserve() {} disconnect() {} }
globalThis.ResizeObserver = dom.window.ResizeObserver = RO;

const ctxStub = new Proxy({}, {
  get: (_t, p) => {
    if (p === 'canvas') return { width: 1200, height: 800, style: {} };
    if (p === 'measureText') return () => ({ width: 40 });
    if (p === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
    if (String(p).startsWith('create')) return () => ({ addColorStop() {} });
    return () => {};
  },
  set: () => true,
});
dom.window.HTMLCanvasElement.prototype.getContext = () => ctxStub;

const logs = { error: [], warn: [] };
const oe = console.error, ow = console.warn;
console.error = (...a) => { logs.error.push(a.map(String).join(' ')); };
console.warn = (...a) => { logs.warn.push(a.map(String).join(' ')); };

const vite = await createServer({
  root: ROOT, configFile: path.join(ROOT, 'vite.config.ts'), logLevel: 'silent',
  server: { middlewareMode: true, hmr: false }, appType: 'custom',
  ssr: { external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime',
    'lucide-react', 'motion', 'motion/react', 'canvas-confetti', 'three', '@google/genai'] },
});
const load = (m) => vite.ssrLoadModule(m);
const results = [];
const click = async (act, el) => { await act(async () => { el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true })); }); };

try {
  const React = (await import('react')).default;
  const { createRoot } = await import('react-dom/client');
  const { act } = await import('react');
  const App = (await load('/src/App.tsx')).default;
  const dataMod = await load('/src/data/initialData.ts');
  const presets = dataMod.PROFILES_PRESETS || [];
  const TABS = Object.keys((await load('/src/types.ts')).SECTION_OF_TAB);

  console.log(`\nPROFILS (PROFILES_PRESETS) : ${presets.length} → ${presets.map(p => `${p.name}[${p.profile.id}]`).join(' | ')}`);
  console.log(`ONGLETS DÉCLARÉS : ${TABS.length} → ${TABS.join(', ')}\n`);
  console.log('=== A. NAVIGATION RÉELLE DANS App (clics sur le header) ===');

  const container = document.getElementById('root');
  let root = null;

  for (const preset of presets) {
    const label = preset.name;
    if (root) { await act(async () => root.unmount()); }
    container.innerHTML = '';
    root = createRoot(container);
    await act(async () => { root.render(React.createElement(App)); });
    // bascule de profil via le vrai <select>
    const sel = document.querySelector('select');
    if (sel) {
      await act(async () => {
        sel.value = preset.profile.id;
        sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
    }
    for (const tab of TABS) {
      const e0 = logs.error.length;
      let crash = null, html = 0, txt = '', reached = false;
      try {
        // 1) bouton de section par défaut
        const secBtns = [...document.querySelectorAll('header nav')][0]?.querySelectorAll('button') || [];
        const secName = { dashboard: 'Mon profil', signature: 'Mon profil', tree: 'Mes expériences', network: 'Mes expériences', temporal: 'Mes expériences', table: 'Mes compétences', horizons: 'Mes possibilités', metiers: 'Mes possibilités', decay: 'Mon évolution', atlas: 'Savoirs', posters: 'Savoirs', metacog: 'Savoirs', psyref: 'Savoirs', ressources: 'Savoirs', evaluations: 'Savoirs' }[tab];
        const sec = [...secBtns].find(b => b.textContent.trim().includes(secName));
        if (sec) await click(act, sec);
        // 2) bouton de vue (id = tab-btn-*)
        let viewBtn = document.getElementById(`tab-btn-${tab}`) || document.getElementById(`tab-btn-${tab === 'metiers' ? 'metiers-graph' : tab}`);
        if (tab === 'temporal' && !viewBtn) viewBtn = document.getElementById('tab-btn-temporal-evolution');
        if (viewBtn) { await click(act, viewBtn); }
        reached = !!viewBtn || (sec && sec.textContent.trim().includes(secName));
        html = container.innerHTML.length;
        txt = (document.querySelector('main')?.textContent || '').replace(/\s+/g, ' ').trim();
      } catch (e) { crash = `${e?.name}: ${String(e?.message).split('\n')[0]}`; }
      const errs = logs.error.slice(e0).filter(s => !/not wrapped in act|Warning: ReactDOM.render|useLayoutEffect does nothing on the server/.test(s));
      const status = crash ? 'CRASH ' : errs.length ? 'ERR   ' : html < 500 ? 'VIDE  ' : 'OK    ';
      results.push({ scope: 'app', profile: label, tab, status: status.trim(), crash, html, textLen: txt.length, errors: errs.map(s => s.slice(0, 300)) });
      console.log(`  ${status} ${label.padEnd(16)} ${tab.padEnd(12)} html=${String(html).padStart(7)} texte=${String(txt.length).padStart(6)}  ${crash || errs[0]?.slice(0, 90) || ''}`);
    }
  }

  // --- B. Rendu isolé de chaque vue avec données réelles + props complètes ---
  console.log('\n=== B. RENDU ISOLÉ DE CHAQUE VUE (composants réels, données réelles) ===');
  const profile = dataMod.INITIAL_COGNITORIUM_PROFILE;
  const noop = () => {};
  const views = [
    ['/src/components/DashboardView.tsx', 'DashboardView', { profile, simulationYear: 2026, onNavigateTab: noop, onSelectNode: noop, onOpenDistiller: noop, onOpenValidationCenter: noop, onReactivateSkill: noop, complexityMode: 'essential', onToggleComplexity: noop }],
    ['/src/components/DashboardView.tsx', 'DashboardView', 'DashboardView[expert]', { profile, simulationYear: 2026, onNavigateTab: noop, onSelectNode: noop, onOpenDistiller: noop, onOpenValidationCenter: noop, onReactivateSkill: noop, complexityMode: 'expert', onToggleComplexity: noop }],
    ['/src/components/NetworkGraph.tsx', 'NetworkGraph', { nodes: profile.nodes, edges: profile.edges, selectedNodeId: null, onSelectNode: noop, simulationYear: 2026, onAddExperienceClick: noop }],
    ['/src/components/TemporalNetworkGraph.tsx', 'TemporalNetworkGraph', { nodes: profile.nodes, edges: profile.edges, selectedNodeId: null, onSelectNode: noop, simulationYear: 2026 }],
    ['/src/components/TreeView.tsx', 'TreeView', { profile, simulationYear: 2026, onSelectNode: noop }],
    ['/src/components/TableView.tsx', 'TableView', { profile, simulationYear: 2026, onSelectNode: noop, onValidateNode: noop, onReactivateSkill: noop }],
    ['/src/components/HorizonsBridge.tsx', 'HorizonsBridge', { nodes: profile.nodes, profile, complexityMode: 'essential', onSelectNode: noop, onAddHorizon: noop }],
    ['/src/components/MetiersGraph.tsx', 'MetiersGraph', { profile, selectedNodeId: null, onSelectNode: noop, onAddHorizon: noop }],
    ['/src/components/DecayTimeline.tsx', 'DecayTimeline', { nodes: profile.nodes, simulationYear: 2026, onYearChange: noop, onReactivateSkill: noop, onSelectNode: noop }],
    ['/src/components/CognitiveSignature.tsx', 'CognitiveSignature', { profile, simulationYear: 2026 }],
    ['/src/components/PsychologyAtlasView.tsx', 'PsychologyAtlasView', { onNavigate: noop, onOpenPoster: noop, onOpenRef: noop }],
    ['/src/components/ExperimentStudio.tsx', 'ExperimentStudio', { focusId: null, onOpenRef: noop }],
    ['/src/components/MetacogLoopView.tsx', 'MetacogLoopView', {}],
    ['/src/components/PsyRefView.tsx', 'PsyRefView', { focusId: null }],
    ['/src/components/ResourcesView.tsx', 'ResourcesView', { onOpenPoster: noop, onNavigate: noop }],
    ['/src/components/MesEvaluationsView.tsx', 'MesEvaluationsView', { profile, onSelectNodeById: noop, onAdd: noop }],
    ['/src/components/NodeInspectorModal.tsx', 'NodeInspectorModal', { node: profile.nodes[0], allNodes: profile.nodes, edges: profile.edges, simulationYear: 2026, onClose: noop, onSelectNodeById: noop, onReactivateSkill: noop, onValidateNode: noop }],
    ['/src/components/ValidationCenterModal.tsx', 'ValidationCenterModal', { isOpen: true, onClose: noop, nodes: profile.nodes, onValidateNode: noop, onRejectNode: noop, onValidateAll: noop }],
    ['/src/components/OnboardingModal.tsx', 'OnboardingModal', { isOpen: true, onClose: noop, onSelectProfile: noop, onCreateCustomProfile: noop }],
    ['/src/components/ExperienceDistillerModal.tsx', 'ExperienceDistillerModal', { isOpen: true, onClose: noop, onDistillComplete: noop }],
    ['/src/components/QuickAddNodeModal.tsx', 'QuickAddNodeModal', { isOpen: true, onClose: noop, initialType: 'experience', existingNodes: profile.nodes, onAddNode: noop }],
    ['/src/components/GraphLegendModal.tsx', 'GraphLegendModal', { isOpen: true, onClose: noop }],
    ['/src/components/MotionCreateButton.tsx', 'MotionCreateButton', { onOpenQuickAdd: noop, onOpenDistiller: noop, buttonLabel: 'Créer' }],
  ];

  for (const row of views) {
    const [mod, expName] = row;
    const label = row.length === 4 ? row[2] : expName;
    const props = row.length === 4 ? row[3] : row[2];
    const name = label;
    const e0 = logs.error.length;
    let crash = null, html = 0, txt = '';
    const c2 = document.createElement('div'); document.body.appendChild(c2);
    let r2 = null;
    try {
      const M = (await load(mod))[expName];
      if (!M) throw new Error(`export '${expName}' introuvable`);
      r2 = createRoot(c2);
      await act(async () => { r2.render(React.createElement(M, props)); });
      html = c2.innerHTML.length;
      txt = (c2.textContent || '').replace(/\s+/g, ' ').trim();
    } catch (e) { crash = `${e?.name}: ${String(e?.message).split('\n')[0]}`; }
    const errs = logs.error.slice(e0).filter(s => !/not wrapped in act/.test(s));
    const status = crash ? 'CRASH ' : errs.length ? 'ERR   ' : html < 200 ? 'VIDE  ' : 'OK    ';
    results.push({ scope: 'view', profile: '-', tab: name, status: status.trim(), crash, html, textLen: txt.length, errors: errs.map(s => s.slice(0, 300)) });
    console.log(`  ${status} ${name.padEnd(28)} html=${String(html).padStart(7)} texte=${String(txt.length).padStart(6)}  ${crash || errs[0]?.slice(0, 100) || ''}`);
    if (r2) { try { await act(async () => r2.unmount()); } catch {} }
    c2.remove();
  }

  // --- C. Profil par profil, rendu des vues dépendantes des données ---
  console.log('\n=== C. VUES DÉPENDANTES DES DONNÉES, PAR PROFIL ===');
  const perProfileViews = [
    ['/src/components/DashboardView.tsx', 'DashboardView', (p) => ({ profile: p, simulationYear: 2026, onNavigateTab: noop, onSelectNode: noop, onOpenDistiller: noop, onOpenValidationCenter: noop, onReactivateSkill: noop, complexityMode: 'essential', onToggleComplexity: noop })],
    ['/src/components/HorizonsBridge.tsx', 'HorizonsBridge', (p) => ({ nodes: p.nodes, profile: p, complexityMode: 'essential', onSelectNode: noop, onAddHorizon: noop })],
    ['/src/components/TreeView.tsx', 'TreeView', (p) => ({ profile: p, simulationYear: 2026, onSelectNode: noop })],
    ['/src/components/MetiersGraph.tsx', 'MetiersGraph', (p) => ({ profile: p, selectedNodeId: null, onSelectNode: noop, onAddHorizon: noop })],
    ['/src/components/MesEvaluationsView.tsx', 'MesEvaluationsView', (p) => ({ profile: p, onSelectNodeById: noop, onAdd: noop })],
  ];
  for (const preset of presets) {
    const p = preset.profile;
    for (const [mod, name, mk] of perProfileViews) {
      const e0 = logs.error.length;
      let crash = null, html = 0;
      const c3 = document.createElement('div'); document.body.appendChild(c3);
      let r3 = null;
      try {
        const M = (await load(mod))[name];
        r3 = createRoot(c3);
        await act(async () => { r3.render(React.createElement(M, mk(p))); });
        html = c3.innerHTML.length;
      } catch (e) { crash = `${e?.name}: ${String(e?.message).split('\n')[0]}`; }
      const errs = logs.error.slice(e0).filter(s => !/not wrapped in act/.test(s));
      const status = crash ? 'CRASH ' : errs.length ? 'ERR   ' : html < 200 ? 'VIDE  ' : 'OK    ';
      results.push({ scope: 'profile', profile: preset.name, tab: name, status: status.trim(), crash, html, textLen: 0, errors: errs.map(s => s.slice(0, 300)) });
      console.log(`  ${status} ${preset.name.padEnd(16)} ${name.padEnd(20)} html=${String(html).padStart(7)}  ${crash || errs[0]?.slice(0, 90) || ''}`);
      if (r3) { try { await act(async () => r3.unmount()); } catch {} }
      c3.remove();
    }
  }
} finally {
  await vite.close();
}

const bad = results.filter(r => r.status !== 'OK');
console.log(`\n=== BILAN : ${results.length} rendus, ${bad.length} non-OK ===`);
for (const r of bad) console.log(` - [${r.scope}] ${r.profile} / ${r.tab} → ${r.crash || r.errors[0] || 'rendu vide'}`);
fs.mkdirSync(path.join(ROOT, 'tools/audit/out'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'tools/audit/out/runtime-probe.json'), JSON.stringify({ results, errorLog: logs.error.slice(0, 300), warnLog: [...new Set(logs.warn)].slice(0, 100) }, null, 2));
console.log('\n→ tools/audit/out/runtime-probe.json');
process.exit(0);
