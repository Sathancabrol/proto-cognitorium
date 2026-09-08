/**
 * Diagnostic ciblé du moteur de matching ROME — Cognitorium
 * Usage: node tools/audit/rome-diagnostic.mjs
 */
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const vite = await createServer({ root: ROOT, configFile: path.join(ROOT, 'vite.config.ts'), logLevel: 'silent', server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const load = (m) => vite.ssrLoadModule(m);

const { PROFILES_PRESETS } = await load('/src/data/initialData.ts');
const rm = await load('/src/utils/romeMatching.ts');
const rd = await load('/src/data/romeData.ts');

console.log('\n=== A. EXACT vs FUZZY par compétence de profil ===');
const synth = {};
for (const p of PROFILES_PRESETS) {
  const skills = p.profile.nodes.filter(n => n.category.startsWith('skill_'));
  let exact = 0, fuzzyOnly = 0, none = 0;
  const fuzzyEx = [];
  for (const s of skills) {
    const codes = rm.getRomeCodesForSkill(s.name);
    if (codes.some(c => c.matchType === 'exact')) exact++;
    else if (codes.length) { fuzzyOnly++; fuzzyEx.push(`${s.name} → ${codes.length} codes flous (tronqué à 40 max)`); }
    else none++;
  }
  const res = rm.computeAllRomeMatches(p.profile, 60);
  synth[p.profile.id] = { skills: skills.length, exact, fuzzyOnly, none, matches: res.length };
  console.log(`\n ${p.profile.personName}`);
  console.log(`   ${skills.length} compétences → EXACT=${exact}  FUZZY seulement=${fuzzyOnly}  aucun=${none}`);
  console.log(`   computeAllRomeMatches → ${res.length} fiche(s) retenue(s)`);
  if (fuzzyEx.length) console.log(`   exemples « flou seulement »: ${fuzzyEx.slice(0, 3).join(' | ')}`);
}

console.log('\n=== B. POURQUOI 0 RÉSULTAT : test du garde-fou exactCount ===');
const nathan = PROFILES_PRESETS[0].profile;
const K = rd.ROME_FICHES;
let evaluated = 0, matchedButNotExact = 0;
for (const fiche of K) {
  const r = rm.computeFicheMatch(nathan, fiche);
  if (r.evaluated) evaluated++;
}
console.log(`   Näthan : fiches « evaluated » sur 1911 = ${evaluated}`);
// recomptage manuel : combien de fiches auraient ≥1 correspondance (exacte OU floue) ?
const idx = new Map();
for (const s of nathan.nodes.filter(n => n.category.startsWith('skill_'))) {
  for (const c of rm.getRomeCodesForSkill(s.name)) {
    if (!idx.has(c.code)) idx.set(c.code, []);
    idx.get(c.code).push({ skill: s.name, type: c.matchType });
  }
}
console.log(`   codes ROME touchés par au moins une compétence du profil (exact ou flou) = ${idx.size}`);
const fuzzyTouched = [...idx.entries()].filter(([, v]) => v.some(x => x.type === 'fuzzy')).length;
const exactTouched = [...idx.entries()].filter(([, v]) => v.some(x => x.type === 'exact')).length;
console.log(`   dont via flou uniquement = ${fuzzyTouched}, dont via exact = ${exactTouched}`);
console.log(`   ⇒ ${fuzzyTouched} métiers potentiels écartés par le garde-fou « ≥1 correspondance exacte »`);
console.log(`   exemples de métiers écartés: ${[...idx.entries()].filter(([, v]) => !v.some(x => x.type === 'exact')).slice(0, 6).map(([c, v]) => `${c} ${rd.ROME_FICHES.find(f => f.code === c)?.libelle} (${v[0].skill.slice(0, 30)})`).join(' | ')}`);

console.log('\n=== C. RECHERCHE LIBRE : le code ROME est-il cherchable ? ===');
for (const q of ['K1106', 'M1412', 'F1208', '1106', 'K11']) {
  const r = rm.searchRomeFiches(q, 5);
  console.log(`   "${q}" → ${r.length} résultat(s)${r.length ? ' : ' + r.slice(0, 3).map(x => x.code).join(', ') : ''}`);
}
console.log(`   → searchRomeFiches ne cherche que dans libelle+grandDomaine+domaine (jamais dans fiche.code)`);

console.log('\n=== D. FICHES SANS DONNÉES DE COMPÉTENCES ===');
const sansComp = K.filter(f => !(rd.ROME_CODE_SKILLS[f.code] || []).length);
console.log(`   ${sansComp.length} fiches sur ${K.length} n'ont AUCUNE compétence dans l'arborescence → jamais matchables`);
console.log(`   ex: ${sansComp.slice(0, 5).map(f => `${f.code} ${f.libelle}`).join(' | ')}`);

console.log('\n=== E. TAILLE DES FORMATIONS FORMACODE ===');
const fmCounts = Object.values(rd.ROME_FORMACODE).map(v => v.length);
const zero = fmCounts.filter(c => c === 0).length;
console.log(`   fiches avec 0 formation FORMACODE: ${zero}/${fmCounts.length} | moyenne: ${(fmCounts.reduce((a, b) => a + b, 0) / fmCounts.length).toFixed(1)}`);

console.log('\n=== F. HORIZONS « EN DUR » DANS LES PROFILS vs MOTEUR ===');
for (const p of PROFILES_PRESETS) {
  const jobs = p.profile.nodes.filter(n => n.category === 'horizon_job');
  const res = rm.computeAllRomeMatches(p.profile, 60);
  const moteurCodes = new Set(res.map(r => r.fiche.code));
  const enDur = jobs.filter(j => j.romeCode && !moteurCodes.has(j.romeCode));
  console.log(`   ${p.profile.personName.padEnd(20)} horizons codés en dur: ${jobs.length} | scores en dur: ${jobs.map(j => j.matchScore).join(',')} | non confirmés par le moteur: ${enDur.length} (${enDur.map(j => j.romeCode).join(',') || '—'})`);
}

await vite.close();
process.exit(0);
