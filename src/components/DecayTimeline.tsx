import React, { useState } from 'react';
import { SkillNode, AnyCognitiveNode } from '../types';
import { calculateSkillVitality, getVitalityStatus } from '../utils/decay';
import { Clock, RefreshCw, Flame, AlertTriangle, Sparkles, TrendingUp, Info, HelpCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DecayTimelineProps {
  nodes: AnyCognitiveNode[];
  simulationYear: number;
  onYearChange: (year: number) => void;
  onReactivateSkill: (skillId: string) => void;
  onSelectNode: (node: AnyCognitiveNode) => void;
}

export const DecayTimeline: React.FC<DecayTimelineProps> = ({
  nodes,
  simulationYear,
  onYearChange,
  onReactivateSkill,
  onSelectNode
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'decaying' | 'dormant'>('all');

  const skillNodes = nodes.filter((n) => n.category.startsWith('skill_')) as SkillNode[];

  // Russian skill specific highlight (the user's flagship decay example)
  const russianSkill = skillNodes.find((s) => s.id === 'skill-russe' || s.name.toLowerCase().includes('russe'));

  const processedSkills = skillNodes.map((s) => {
    const vitality = calculateSkillVitality(s, simulationYear, s.isReactivated);
    const status = getVitalityStatus(vitality);
    return {
      ...s,
      currentVitality: vitality,
      status
    };
  });

  const filteredSkills = processedSkills.filter((s) => {
    if (selectedFilter === 'active') return s.currentVitality >= 80;
    if (selectedFilter === 'decaying') return s.currentVitality >= 55 && s.currentVitality < 80;
    if (selectedFilter === 'dormant') return s.currentVitality < 55;
    return true;
  });

  const handleReactivate = (skillId: string) => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    onReactivateSkill(skillId);
  };

  return (
    <div id="cognitorium-decay-engine" className="space-y-6">
      {/* Flagship Concept Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Moteur Temporel de Vitalité & Décroissance (Decay)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Le capital cognitif n'est pas un inventaire figé.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Une compétence <span className="text-white font-medium">apparaît → progresse → est pratiquée → entre en sommeil</span> lorsqu'elle n'est plus sollicitée. Cependant, grâce à la <strong className="text-blue-300">mémoire cristallisée</strong>, une compétence dormante n'est jamais perdue : sa réactivation est <strong>5x plus rapide</strong> qu'un primo-apprentissage.
          </p>

          {/* Interactive Timeline Scrubber */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>2016 (Origines)</span>
              <span className="text-base font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30">
                Année simulée : {simulationYear}
              </span>
              <span>2030 (Projection)</span>
            </div>

            <input
              id="timeline-year-slider"
              type="range"
              min={2016}
              max={2030}
              step={1}
              value={simulationYear}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>2016 (Russe B1)</span>
              <span>2017 (Russe B2)</span>
              <span>2020 (VRD Chantier)</span>
              <span className="text-blue-300 font-semibold">2026 (Présent)</span>
              <span>2028 (Futur)</span>
              <span>2030</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Case Study: The Russian Example */}
      {russianSkill && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇷🇺</span>
                <h3 className="text-base font-bold text-slate-900">
                  Cas d'école : {russianSkill.name}
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  getVitalityStatus(calculateSkillVitality(russianSkill, simulationYear, russianSkill.isReactivated)).badgeColor
                }`}>
                  {calculateSkillVitality(russianSkill, simulationYear, russianSkill.isReactivated)}% vitalité
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl">
                Appris en 2016 → Niveau B2 (80%) en 2017 → Non pratiqué depuis 2018. En {simulationYear}, la vitalité calculée est à{' '}
                <strong>{calculateSkillVitality(russianSkill, simulationYear, russianSkill.isReactivated)}%</strong> (~B1 résiduel).
              </p>
            </div>

            <button
              id="reactivate-russian-btn"
              onClick={() => handleReactivate(russianSkill.id)}
              className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Simuler une réactivation (Immersion 2 semaines)</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs for Skills */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            id="filter-vitality-all"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toutes les compétences ({processedSkills.length})
          </button>
          <button
            id="filter-vitality-active"
            onClick={() => setSelectedFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'active' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Actives ({processedSkills.filter((s) => s.currentVitality >= 80).length})
          </button>
          <button
            id="filter-vitality-decaying"
            onClick={() => setSelectedFilter('decaying')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'decaying' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En veille ({processedSkills.filter((s) => s.currentVitality >= 55 && s.currentVitality < 80).length})
          </button>
          <button
            id="filter-vitality-dormant"
            onClick={() => setSelectedFilter('dormant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'dormant' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dormantes ({processedSkills.filter((s) => s.currentVitality < 55).length})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Demi-vie moyenne : <strong className="text-slate-700">5.4 ans</strong>
        </div>
      </div>

      {/* Grid of Skills with Vitality Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          return (
            <div
              key={skill.id}
              onClick={() => onSelectNode(skill)}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {skill.category === 'skill_tech' && 'Technique'}
                      {skill.category === 'skill_transversal' && 'Transverse'}
                      {skill.category === 'skill_relational' && 'Humain'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{skill.name}</h4>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${skill.status.badgeColor}`}>
                    {skill.currentVitality}%
                  </span>
                </div>

                {/* Meter Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${skill.currentVitality}%`,
                        backgroundColor: skill.status.colorHex
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Acquis en {skill.acquiredYear}</span>
                    <span>Pratiqué en {skill.lastPracticedYear}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{skill.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Transférabilité: <strong className="text-blue-600">{skill.transferabilityScore}/10</strong>
                </span>

                {skill.currentVitality < 85 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReactivate(skill.id);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Réactiver</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Optimal
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
