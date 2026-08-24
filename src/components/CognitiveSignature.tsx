import React, { useState } from 'react';
import { CognitiveProfile, SkillNode, CapacityNode } from '../types';
import { calculateSkillVitality } from '../utils/decay';
import { getEpistemicLevel } from '../utils/epistemics';
import { 
  Brain, 
  Sparkles, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Compass, 
  HeartHandshake, 
  Scale, 
  BookOpen, 
  Users, 
  Zap, 
  Lightbulb,
  Briefcase,
  Layers,
  MapPin,
  Mail,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CognitiveSignatureProps {
  profile: CognitiveProfile;
  simulationYear: number;
}

export const CognitiveSignature: React.FC<CognitiveSignatureProps> = ({
  profile,
  simulationYear
}) => {
  const [selectedCodexQuadrant, setSelectedCodexQuadrant] = useState<number | null>(null);

  const skills = profile.nodes.filter((n) => n.category.startsWith('skill_')) as SkillNode[];
  const capacities = profile.nodes.filter((n) => n.category === 'capacity_cognitive') as CapacityNode[];
  const horizonJobs = profile.nodes.filter((n) => n.category === 'horizon_job');

  const activeSkillsCount = skills.filter(
    (s) => calculateSkillVitality(s, simulationYear, s.isReactivated) >= 80
  ).length;

  const dormantSkillsCount = skills.filter(
    (s) => calculateSkillVitality(s, simulationYear, s.isReactivated) < 55
  ).length;

  const averageTransferability = Math.round(
    skills.reduce((acc, s) => acc + (s.transferabilityScore || 7), 0) / (skills.length || 1) * 10
  );

  const handleExportJSON = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognitorium-${profile.personName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const codexQuadrants = [
    {
      id: 1,
      title: "1. Trop plein d'informations",
      subtitle: "Nous filtrons massivement ce qui nous entoure",
      color: "from-blue-600 to-cyan-600",
      border: "border-blue-200",
      bgLight: "bg-blue-50/60",
      textCol: "text-blue-900",
      keyBiases: ["Heuristique de disponibilité", "Biais attentionnel", "Effet de simple exposition", "Effet de contexte", "Biais de négativité"],
      application: "Dans vos recherches en cognition spatiale (SNCF & CATIE), ce cadran explique comment les piétons sélectionnent les repères saillants en gare face à la surcharge visuelle."
    },
    {
      id: 2,
      title: "2. De quoi devons-nous nous souvenir ?",
      subtitle: "Nous ne stockons que les éléments clés",
      color: "from-indigo-600 to-purple-600",
      border: "border-indigo-200",
      bgLight: "bg-indigo-50/60",
      textCol: "text-indigo-900",
      keyBiases: ["Effet de primauté / récence", "Effet d'espacement", "Inhibition mnésique", "Niveaux de traitement", "Règle pic-fin"],
      application: "Cœur théorique du moteur de 'Decay' Cognitorium : la mémoire s'étiole sans réactivation, mais le ré-apprentissage est consolidé par les traces sémantiques profondes."
    },
    {
      id: 3,
      title: "3. Nécessité d'agir vite",
      subtitle: "Nous sautons aux conclusions pour survivre",
      color: "from-amber-600 to-orange-600",
      border: "border-amber-200",
      bgLight: "bg-amber-50/60",
      textCol: "text-amber-900",
      keyBiases: ["Biais de statu quo", "Rasoir d'Ockham", "Escalade d'engagement", "Aversion à la perte", "Loi de futilité de Parkinson"],
      application: "Sur vos chantiers VRD & Génie Civil (SOBECA / COLAS), la prise de décision rapide sous pression temporelle nécessite de neutraliser l'escalade d'engagement face aux aléas de voirie."
    },
    {
      id: 4,
      title: "4. Pas assez de sens",
      subtitle: "Nous comblons les vides avec nos suppositions",
      color: "from-emerald-600 to-teal-600",
      border: "border-emerald-200",
      bgLight: "bg-emerald-50/60",
      textCol: "text-emerald-900",
      keyBiases: ["Biais de confirmation", "Malédiction du savoir", "Effet Dunning-Kruger", "Erreur fondamentale d'attribution", "Effet de halo"],
      application: "En tutorat universitaire (6 classes UM3), désamorcer la malédiction du savoir vous permet d'adapter votre pédagogie à chaque niveau d'apprenant sans supposer de prérequis implicites."
    }
  ];

  return (
    <div id="cognitorium-passport-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              <span>Passeport de Capital Cognitif & Humain</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.personName}</h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">{profile.headline}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {profile.location}
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  {profile.email}
                </span>
              )}
            </div>

            <p className="text-xs text-amber-300 italic font-medium pt-1">« {profile.coreMotto} »</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              id="export-passport-btn"
              onClick={handleExportJSON}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Exporter Passeport (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Indice de Transférabilité
          </span>
          <span className="text-2xl font-black text-blue-600">{averageTransferability}%</span>
          <p className="text-[11px] text-slate-500 mt-1">Facilité à pivoter de secteur</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Compétences Actives
          </span>
          <span className="text-2xl font-black text-emerald-600">
            {activeSkillsCount} / {skills.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">{dormantSkillsCount} en sommeil réactivables</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Capacités Cognitives
          </span>
          <span className="text-2xl font-black text-pink-600">{capacities.length}</span>
          <p className="text-[11px] text-slate-500 mt-1">Piliers méta développés</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Horizons Révélés
          </span>
          <span className="text-2xl font-black text-orange-600">{horizonJobs.length}</span>
          <p className="text-[11px] text-slate-500 mt-1">Métiers à fort potentiel</p>
        </div>
      </div>

      {/* SECTION: RIASEC DIAGNOSTIC & BEHAVIORAL PROFILE */}
      {profile.riasec && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold mb-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Modèle Holland (Test RIASEC)</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Profil Dominant : <span className="text-indigo-600">S - I - C</span> (Social • Investigateur • Conventionnel)
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-xl">
              Réf #QDE-2025-38377
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {profile.riasec.dominantSummary}
          </p>

          {/* RIASEC Visual Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">S</span>
                  <strong className="text-xs text-slate-900">Social (76%)</strong>
                </div>
                <span className="text-xs font-bold text-emerald-700">53 / 70 pts</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '76%' }} />
              </div>
              <p className="text-[11px] text-slate-600">Relations humaines, pédagogie, empathie et écoute.</p>
            </div>

            <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">I</span>
                  <strong className="text-xs text-slate-900">Investigateur (69%)</strong>
                </div>
                <span className="text-xs font-bold text-blue-700">48 / 70 pts</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '69%' }} />
              </div>
              <p className="text-[11px] text-slate-600">Analyse rigoureuse, sciences, résolution de problèmes complexes.</p>
            </div>

            <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">C</span>
                  <strong className="text-xs text-slate-900">Conventionnel (63%)</strong>
                </div>
                <span className="text-xs font-bold text-purple-700">44 / 70 pts</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '63%' }} />
              </div>
              <p className="text-[11px] text-slate-600">Organisation, structure, respect des protocoles et précision.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-600 text-white font-bold text-xs flex items-center justify-center">E</span>
                  <strong className="text-xs text-slate-900">Entreprenant (53%)</strong>
                </div>
                <span className="text-xs font-bold text-slate-700">37 / 70 pts</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full" style={{ width: '53%' }} />
              </div>
              <p className="text-[11px] text-slate-600">Prise d'initiative, coordination de projets.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-600 text-white font-bold text-xs flex items-center justify-center">A</span>
                  <strong className="text-xs text-slate-900">Artistique (44%)</strong>
                </div>
                <span className="text-xs font-bold text-slate-700">31 / 70 pts</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full" style={{ width: '44%' }} />
              </div>
              <p className="text-[11px] text-slate-600">Créativité, conception de supports innovants.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-600 text-white font-bold text-xs flex items-center justify-center">R</span>
                  <strong className="text-xs text-slate-900">Réaliste (43%)</strong>
                </div>
                <span className="text-xs font-bold text-slate-700">30 / 70 pts</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full" style={{ width: '43%' }} />
              </div>
              <p className="text-[11px] text-slate-600">Pratique concrète, terrain, travaux physiques.</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: MATCH MÉTIERS+ & DRIVERS MOTIVATIONNELS */}
      {profile.matchMetiers && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold mb-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Rapport Match Métiers+ (Futur and Co)</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Leviers de Réussite & Environnements Idéaux
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Motivations */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Moteurs & Motivations Dominantes
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                    <span>Équilibre Vie Pro / Vie Perso</span>
                    <span className="text-emerald-600">100%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="text-[11px] text-slate-500">Recherche d'harmonie, flexibilité, bien-être au travail.</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                    <span>Impact Social et Environnemental</span>
                    <span className="text-blue-600">73%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '73%' }} />
                  </div>
                  <span className="text-[11px] text-slate-500">Contribuer positivement par des actions éthiques & humaines.</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 mb-1">
                    <span>Collaboration & Relations</span>
                    <span className="text-purple-600">100%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="text-[11px] text-slate-500">Sens inné du collectif, écoute et diplomatie active.</span>
                </div>
              </div>
            </div>

            {/* Preferred Contexts & Role */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Organisation & Activités de Prédilection
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Organisation</span>
                  <strong className="text-sm font-bold text-slate-900">Agile (76%)</strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dynamique de groupe, flexibilité, adaptation.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Rôle Préféré</span>
                  <strong className="text-sm font-bold text-slate-900">Manager (66%)</strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">Coordination bienveillante et vision partagée.</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-700 mb-1.5">Top Activités de Référence :</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.matchMetiers.topActivities.map((act, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800">
                      ⭐ {act.name} (<strong>{act.score}/100</strong>)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: CODEX DES BIAIS COGNITIFS (INTEGRATION OF USER'S FLAGSHIP THEORETICAL BASIS) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Matrice Fondatrice : Codex des Biais Cognitifs (2016)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Les 4 Cadrans du Fonctionnement Cérébral Appliqués
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Traduction & Modélisation John Manoogian III / Buster Benson
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Le Codex structure l'ensemble des heuristiques et raccourcis mentaux autour de 4 problèmes universels auxquels le cerveau fait face. Votre parcours mobilise directement cette grille pour concevoir des systèmes et orienter les décisions :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {codexQuadrants.map((quad) => (
            <div
              key={quad.id}
              onClick={() => setSelectedCodexQuadrant(selectedCodexQuadrant === quad.id ? null : quad.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedCodexQuadrant === quad.id
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20 bg-blue-50/20'
                  : `${quad.border} ${quad.bgLight} hover:shadow-xs hover:border-slate-300`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border ${quad.border} ${quad.textCol}`}>
                  Cadran {quad.id}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">Cliquez pour explorer</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">{quad.title}</h3>
              <p className="text-xs text-slate-600 mb-3">{quad.subtitle}</p>

              {/* Sample Biases */}
              <div className="flex flex-wrap gap-1 mb-3">
                {quad.keyBiases.map((b, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {b}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-700">
                <strong className="block text-slate-900 font-semibold mb-0.5">🧠 Application dans votre capital :</strong>
                <p className="text-[11px] leading-relaxed text-slate-600">{quad.application}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cognitive Signature Synthesis */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Synthèse Cognitive & Raisonnement Dominant</span>
          </h2>
          <p className="text-xs text-slate-500">
            Croisement holistique des protocoles expérimentaux, du management opérationnel et de la médiation humaine
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
          {profile.cognitiveSignature?.summaryText}
        </div>

        {/* Key Strengths */}
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
            Piliers Distinctifs du Profil
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.cognitiveSignature?.keyStrengths?.map((strength, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cognitive Dimension Spectrum */}
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
            Spectre des Capacités Cognitives Fondamentales
          </h3>
          <div className="space-y-3">
            {capacities.map((cap) => {
              const epistemic = getEpistemicLevel(cap);
              return (
                <div key={cap.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🧠</span>
                      <strong className="text-xs font-bold text-slate-900">{cap.name}</strong>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${epistemic.badge}`}>
                      Nv. {epistemic.level} · {epistemic.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{cap.description}</p>
                  {epistemic.level >= 4 && (
                    <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 mt-2 flex items-start gap-1.5">
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>Hypothèse cognitive — à confirmer par un échange humain, pas une mesure psychologique.</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Garde-fou épistémique */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 leading-relaxed space-y-1.5">
            <strong className="text-slate-900 block">🛡️ Garde-fou épistémique</strong>
            <p>
              Cognitorium distingue <strong>ce qui est documenté</strong> (faits : expériences, diplômes, données) de <strong>ce qui est interprété</strong> (compétences inférées, capacités candidates, hypothèses de rapprochement). Les indices numériques (RIASEC, transférabilité, scores de compatibilité) sont des <strong>aides à la réflexion</strong>, pas des mesures psychologiques. Le niveau 5 de l'échelle — conclusion psychologique — n'est jamais déduit automatiquement d'un CV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
