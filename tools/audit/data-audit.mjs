/**
 * Audit d'intégrité des données & des moteurs — Cognitorium
 * Utilise les VRAIS modules de src/ via le pipeline Vite.
 * Usage: node tools/audit/data-audit.mjs
 */
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const vite = await createServer({ root: ROOT, configFile: path.join(ROOT, 'vite.config.ts'), logLevel: 'silent', server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const load = (m) => vite.ssrLoadModule(m);
const out = {};
const say = (...a) => console.log(...a);

const data = await load('/src/data/initialData.ts');
const presets = data.PROFILES_PRESETS;

// ---------------------------------------------------------------- 1. PROFILS
say('\n=== 1. INVENTAIRE DES PROFILS ===');
out.profiles = [];
for (const p of presets) {
  const pr = p.profile;
  const byCat = {};
  for (const n of pr.nodes) byCat[n.category] = (byCat[n.category] || 0) + 1;
  const ids = new Set(pr.nodes.map(n => n.id));
  const dupIds = pr.nodes.length - ids.size;
  const dangling = pr.edges.filter(e => !ids.has(e.source) || !ids.has(e.target));
  const noEvidence = pr.nodes.filter(n => !n.evidence || n.evidence.length === 0);
  const noStatus = pr.nodes.filter(n => !n.verificationStatus);
  const noConf = pr.nodes.filter(n => typeof n.confidenceScore !== 'number');
  const skills = pr.nodes.filter(n => n.category.startsWith('skill_'));
  const exps = pr.nodes.filter(n => ['experience', 'formation', 'research_project'].includes(n.category));
  const jobs = pr.nodes.filter(n => n.category === 'horizon_job');
  const tasks = pr.nodes.filter(n => n.category === 'task');
  const jobsWithoutRome = jobs.filter(j => !j.romeCode);
  const skillsWithoutOrigin = skills.filter(s => !s.originExperienceIds || s.originExperienceIds.length === 0);
  const caps = pr.nodes.filter(n => n.category === 'capacity_cognitive');
  const capsWithoutSkills = caps.filter(c => !c.underlyingSkills || c.underlyingSkills.length === 0);
  const evals = pr.evaluations || [];
  out.profiles.push({
    id: pr.id, nom: pr.personName, noeuds: pr.nodes.length, aretes: pr.edges.length, byCat,
    dupIds, danglingEdges: dangling.length, noEvidence: noEvidence.length, noStatus: noStatus.length,
    noConfidence: noConf.length, tasks: tasks.length, skills: skills.length, capacities: caps.length,
    horizons: jobs.length, horizonsSansCodeRome: jobsWithoutRome.length,
    competencesSansExperienceOrigine: skillsWithoutOrigin.length,
    capacitesSansCompetence: capsWithoutSkills.length, evaluations: evals.length,
    riasec: !!pr.riasec, matchMetiers: !!pr.matchMetiers,
    annees: exps.length ? `${Math.min(...exps.map(e => e.startYear))}→${Math.max(...exps.map(e => e.endYear || e.startYear))}` : 'n/a',
  });
  const r = out.profiles[out.profiles.length - 1];
  say(`\n ${pr.personName} (${pr.id}) — ${pr.nodes.length} nœuds / ${pr.edges.length} arêtes`);
  say(`   catégories: ${Object.entries(byCat).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  say(`   ⚠ arêtes pendantes (nœud inexistant): ${dangling.length} | doublons d'id: ${dupIds} | nœuds sans preuve: ${noEvidence.length} | sans statut: ${noStatus.length} | sans confiance: ${noConf.length}`);
  say(`   ⚠ tâches: ${tasks.length} | compétences sans expérience d'origine: ${skillsWithoutOrigin.length}/${skills.length} | capacités sans compétence: ${capsWithoutSkills.length}/${caps.length}`);
  say(`   ⚠ horizons: ${jobs.length} dont SANS code ROME: ${jobsWithoutRome.length} | évaluations: ${evals.length} | RIASEC: ${pr.riasec ? 'oui' : 'NON'} | matchMetiers: ${pr.matchMetiers ? 'oui' : 'NON'}`);
  say(`   période couverte: ${r.annees}`);
  if (dangling.length) say(`     exemples arêtes pendantes: ${dangling.slice(0, 4).map(e => `${e.source}→${e.target}`).join(' | ')}`);
}

// ---------------------------------------------------------- 2. MOTEUR DE DÉCLIN
say('\n=== 2. MOTEUR DE DÉCLIN (decay.ts) ===');
const decayMod = await load('/src/utils/decay.ts');
say('   exports: ' + Object.keys(decayMod).join(', '));
out.decay = [];
for (const p of presets) {
  const skills = p.profile.nodes.filter(n => n.category.startsWith('skill_'));
  const rows = skills.map(s => {
    const v26 = decayMod.calculateSkillVitality(s, 2026, !!s.isReactivated);
    const v35 = decayMod.calculateSkillVitality(s, 2035, !!s.isReactivated);
    return { nom: s.name, base: s.baseMastery, last: s.lastPracticedYear, hl: s.halfLifeYears, v2026: v26, v2035: v35, inactif: 2026 - s.lastPracticedYear };
  });
  out.decay.push({ profil: p.profile.id, rows });
  const inactifs = rows.filter(r => r.inactif > 0);
  const dormant = rows.filter(r => r.v2035 < 55);
  say(`   ${p.profile.id.padEnd(12)} ${rows.length} compétences | inactives en 2026: ${inactifs.length} | demi-vies utilisées: ${[...new Set(rows.map(r => r.hl))].sort((a,b)=>a-b).join(',')} | dormantes en 2035: ${dormant.length}`);
  const extremes = rows.slice(0, 3).map(r => `${r.nom.slice(0,26)}(b=${r.base},hl=${r.hl},v26=${r.v2026},v35=${r.v2035})`);
  say(`      ex: ${extremes.join(' | ')}`);
}

// ------------------------------------------------------- 3. MOTEUR ROME MATCH
say('\n=== 3. DONNÉES ROME (romeData.ts) ===');
const romeData = await load('/src/data/romeData.ts');
const rm = await load('/src/utils/romeMatching.ts');
const F = romeData.ROME_FICHES, CS = romeData.ROME_CODE_SKILLS, SR = romeData.SKILL_TO_ROME, FM = romeData.ROME_FORMACODE;
const codes = new Set(F.map(f => f.code));
const skillTotal = Object.values(CS).reduce((a, v) => a + v.length, 0);
const uniqueSkills = new Set(Object.values(CS).flat());
const codesAvecCompetences = Object.keys(CS).filter(c => CS[c].length).length;
say(`   fiches ROME: ${F.length} | codes uniques: ${codes.size} | codes avec compétences: ${codesAvecCompetences} | compétences référencées: ${skillTotal} | compétences uniques: ${uniqueSkills.size}`);
say(`   codes avec FORMACODE: ${Object.keys(FM).length} | clés SKILL_TO_ROME: ${Object.keys(SR).length}`);
const orph = Object.keys(CS).filter(c => !codes.has(c));
say(`   ⚠ clés de ROME_CODE_SKILLS absentes de ROME_FICHES: ${orph.length}`);
const fmOrph = Object.keys(FM).filter(c => !codes.has(c));
say(`   ⚠ clés de ROME_FORMACODE absentes de ROME_FICHES: ${fmOrph.length}`);
say(`   grands domaines: ${new Set(F.map(f => f.grandDomaine)).size}`);
out.rome = { fiches: F.length, codes: codes.size, codesAvecCompetences, competencesRef: skillTotal, competencesUniques: uniqueSkills.size, formacode: Object.keys(FM).length, skillToRome: Object.keys(SR).length, orphelinsCS: orph.length, orphelinsFM: fmOrph.length, grandsDomaines: new Set(F.map(f => f.grandDomaine)).size };

say('\n=== 3b. MOTEUR DE MATCHING (computeAllRomeMatches) ===');
out.romeMatches = {};
for (const p of presets) {
  const t0 = Date.now();
  let res, err = null;
  try { res = rm.computeAllRomeMatches(p.profile, 60); } catch (e) { err = e.message.split('\n')[0]; }
  const ms = Date.now() - t0;
  if (err) { say(`   ${p.profile.personName.padEnd(20)} ERREUR ${err}`); continue; }
  const lab = {};
  res.forEach(r => lab[r.label] = (lab[r.label] || 0) + 1);
  say(`   ${p.profile.personName.padEnd(20)} → ${String(res.length).padStart(3)} correspondances en ${String(ms).padStart(4)} ms | labels: ${JSON.stringify(lab)}`);
  say(`      top5: ${res.slice(0,5).map(r => `${r.code} ${r.libelle?.slice(0,34)}(${Math.round(r.score ?? 0)}%,${(r.matchedSkills||[]).length} comp. profil)`).join(' | ')}`);
  out.romeMatches[p.profile.id] = { n: res.length, ms, labels: lab, top: res.slice(0, 15).map(r => ({ code: r.code, libelle: r.libelle, score: Math.round(r.score ?? 0), matched: (r.matchedSkills||[]).length, missing: (r.missingSkills||[]).length, formations: (r.formations||[]).length })) };
}

say('\n=== 3c. RECHERCHE LIBRE ROME (searchRomeFiches) ===');
for (const q of ['sophro', 'ergonome', 'data', 'K2102', 'zzzzinexistant']) {
  const r = rm.searchRomeFiches(q, 5);
  say(`   "${q}" → ${r.length} résultat(s)${r.length ? ' : ' + r.slice(0,3).map(x => `${x.code} ${x.libelle}`).join(' | ') : ''}`);
  out['romeSearch_' + q] = r.slice(0,5).map(x => ({ code: x.code, libelle: x.libelle }));
}

say('\n=== 3d. COUVERTURE DES COMPÉTENCES DE PROFIL DANS LE RÉFÉRENTIEL ===');
out.skillCoverage = {};
for (const p of presets) {
  const skills = p.profile.nodes.filter(n => n.category.startsWith('skill_'));
  let hit = 0; const misses = [];
  for (const s of skills) { const c = rm.getRomeCodesForSkill(s.name); if (c.length) hit++; else misses.push(s.name); }
  say(`   ${p.profile.personName.padEnd(20)} ${hit}/${skills.length} compétences reconnues par le référentiel`);
  if (misses.length) say(`      non reconnues: ${misses.slice(0, 6).map(m => m.slice(0,40)).join(' | ')}`);
  out.skillCoverage[p.profile.id] = { total: skills.length, reconnues: hit, nonReconnues: misses };
}
fs.writeFileSync(path.join(ROOT, 'tools/audit/out/data-audit.json'), JSON.stringify(out, null, 2));
await vite.close();
say('\n→ tools/audit/out/data-audit.json');
process.exit(0);
