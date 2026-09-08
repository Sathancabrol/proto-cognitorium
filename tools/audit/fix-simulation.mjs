/**
 * Simulation de correctifs — ne modifie AUCUN fichier livré.
 * Recalcule le matching ROME avec des règles alternatives pour chiffrer l'impact.
 * Usage: node tools/audit/fix-simulation.mjs
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

// Variante A : on garde le garde-fou mais on accepte le flou si ≥2 compétences profil convergent sur la fiche
// Variante B : plus de troncature à 40 codes
function computeVariant(profile, { acceptFuzzy = true, minConvergence = 2, cap = Infinity } = {}) {
  const skills = profile.nodes.filter(n => n.category.startsWith('skill_'));
  const perSkill = new Map();
  for (const s of skills) {
    const codes = rm.getRomeCodesForSkill(s.name);
    const seen = new Set();
    for (const c of codes) { if (seen.size >= cap) break; if (!seen.has(c.code)) { seen.add(c.code); if (!perSkill.has(c.code)) perSkill.set(c.code, []); perSkill.get(c.code).push({ s, type: c.matchType }); } }
  }
  const out = [];
  for (const [code, hits] of perSkill) {
    const fiche = rd.ROME_FICHES.find(f => f.code === code);
    if (!fiche) continue;
    const exact = hits.filter(h => h.type === 'exact').length;
    if (!acceptFuzzy && exact === 0) continue;
    if (hits.length < minConvergence) continue;
    const required = rd.ROME_CODE_SKILLS[code] || [];
    const quality = hits.reduce((a, h) => a + Math.min(1, h.s.baseMastery / 100), 0) / hits.length;
    const score = Math.max(0, Math.min(100, Math.round(100 * Math.min(1, hits.length / 6) * (0.68 + 0.32 * quality) + (exact >= 2 ? 8 : 0))));
    out.push({ code, libelle: fiche.libelle, score, hits: hits.length, exact, required: required.length, formations: (rd.ROME_FORMACODE[code] || []).length });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}

console.log('\n=== IMPACT DES CORRECTIFS SUR LE NOMBRE DE MÉTIERS PROPOSÉS ===');
console.log('profil'.padEnd(20), 'actuel'.padEnd(8), 'A: flou ≥2'.padEnd(12), 'B: A + cap 200'.padEnd(15));
for (const p of PROFILES_PRESETS) {
  const cur = rm.computeAllRomeMatches(p.profile, 60).length;
  const a = computeVariant(p.profile, { minConvergence: 2 }).length;
  const b = computeVariant(p.profile, { minConvergence: 2, cap: 200 }).length;
  console.log(p.profile.personName.padEnd(20), String(cur).padEnd(8), String(a).padEnd(12), String(b).padEnd(15));
}

console.log('\n=== TOP 8 POUR NÄTHAN AVEC LA VARIANTE A (ce que l\'utilisateur verrait) ===');
const nathan = PROFILES_PRESETS[0].profile;
for (const r of computeVariant(nathan, { minConvergence: 2 }).slice(0, 8)) {
  console.log(`   ${r.code}  ${r.libelle.slice(0, 52).padEnd(54)} score=${String(r.score).padStart(3)}  comp.profil=${r.hits}  req=${r.required}  formations=${r.formations}`);
}

console.log('\n=== FIX searchRomeFiches : recherche par code ===');
const byCode = (q) => rd.ROME_FICHES.filter(f => f.code.toLowerCase().includes(q.toLowerCase()));
for (const q of ['M1412', 'K1106', 'F1208']) {
  console.log(`   "${q}" → ${byCode(q).length} résultat(s) : ${byCode(q).map(f => `${f.code} ${f.libelle}`).join(' | ')}`);
}
await vite.close(); process.exit(0);
