import React, { useState } from 'react';
import { 
  ListTree, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Brain, 
  Compass,
  ArrowRight,
  Filter
} from 'lucide-react';
import { CognitiveProfile, AnyCognitiveNode, ExperienceNode, SkillNode, CapacityNode, HorizonJobNode } from '../types';

interface TreeViewProps {
  profile: CognitiveProfile;
  onSelectNode: (node: AnyCognitiveNode) => void;
  simulationYear: number;
}

export const TreeView: React.FC<TreeViewProps> = ({
  profile,
  onSelectNode,
  simulationYear
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'exp-sncf': true,
    'exp-m2-cognition': true,
    'exp-sobeca': true,
    'exp-lea-master': true,
    'exp-thomas-btp-legacy': true
  });

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const experiences = profile.nodes.filter(
    (n) => n.category === 'experience' || n.category === 'formation'
  ) as ExperienceNode[];

  const allSkills = profile.nodes.filter((n) => n.category.startsWith('skill_')) as SkillNode[];
  const allCapacities = profile.nodes.filter((n) => n.category === 'capacity_cognitive') as CapacityNode[];
  const allHorizons = profile.nodes.filter((n) => n.category === 'horizon_job') as HorizonJobNode[];

  // Helper to find connected skills for an experience
  const getSkillsForExperience = (expId: string) => {
    const skillIds = profile.edges
      .filter((e) => e.source === expId && e.type === 'acquired_in')
      .map((e) => e.target);
    return allSkills.filter((s) => skillIds.includes(s.id));
  };

  // Helper to find connected capacities for a skill
  const getCapacitiesForSkill = (skillId: string) => {
    const capIds = profile.edges
      .filter((e) => e.source === skillId && e.type === 'feeds_capacity')
      .map((e) => e.target);
    return allCapacities.filter((c) => capIds.includes(c.id));
  };

  // Helper to find connected horizons for a capacity
  const getHorizonsForCapacity = (capId: string) => {
    const horizonIds = profile.edges
      .filter((e) => e.source === capId && e.type === 'unlocks_horizon')
      .map((e) => e.target);
    return allHorizons.filter((h) => horizonIds.includes(h.id));
  };

  // Filtered experiences
  const filteredExperiences = experiences.filter((exp) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchExp = exp.name.toLowerCase().includes(query) || (exp.description?.toLowerCase().includes(query) ?? false);
    const connectedSkills = getSkillsForExperience(exp.id);
    const matchSkill = connectedSkills.some((s) => s.name.toLowerCase().includes(query));
    return matchExp || matchSkill;
  });

  return (
    <div id="tree-view" className="space-y-6 pb-12">
      {/* Header & Concept Explanation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ListTree className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Arbre Hiérarchique de Décomposition</h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Parcourez la généalogie complète : <strong>Expérience</strong> ➔ <strong>Missions & Tâches</strong> ➔ <strong>Compétences décomposées</strong> ➔ <strong>Capacités cognitives</strong> ➔ <strong>Horizons ROME</strong>.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une mission, compétence..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tree Chain Breakdown Container */}
      <div className="space-y-4">
        {filteredExperiences.map((exp) => {
          const isExpanded = expandedNodes[exp.id] ?? false;
          const skills = getSkillsForExperience(exp.id);

          return (
            <div
              key={exp.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              {/* Level 1: Experience Header */}
              <div
                className="p-5 bg-slate-50/70 hover:bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between cursor-pointer transition-colors"
                onClick={() => toggleExpand(exp.id)}
              >
                <div className="flex items-center gap-3">
                  <button className="p-1 text-slate-400 hover:text-slate-700">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    {exp.category === 'formation' ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{exp.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-semibold">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{exp.institutionOrContext} • {exp.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {skills.length} compétence{skills.length > 1 ? 's' : ''} déduite{skills.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(exp);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Inspecter
                  </button>
                </div>
              </div>

              {/* Collapsible Content: Missions -> Skills -> Capacities -> Horizons */}
              {isExpanded && (
                <div className="p-6 space-y-6 bg-white">
                  {/* LEVEL 2: MISSIONS & ACTIONS OPÉRATIONNELLES */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Étape 1 : Missions & Actions Opérationnelles
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {exp.missions?.map((m, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LEVEL 3: COMPÉTENCES DÉCOMPOSÉES */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Étape 2 : Compétences Techniques & Transversales Décomposées ({skills.length})
                    </span>

                    <div className="space-y-4">
                      {skills.map((skill) => {
                        const capacities = getCapacitiesForSkill(skill.id);

                        return (
                          <div
                            key={skill.id}
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 hover:border-emerald-300 transition-all space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
                                  ⚙️
                                </div>
                                <strong className="text-xs font-bold text-slate-900">{skill.name}</strong>
                                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold">
                                  Maîtrise : {skill.baseMastery}%
                                </span>
                              </div>

                              <button
                                onClick={() => onSelectNode(skill)}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                              >
                                Détails & Vitalité ➔
                              </button>
                            </div>

                            {/* Sub-skills breakdown */}
                            {skill.subSkills && skill.subSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {skill.subSkills.map((sub, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-white text-slate-600 border border-slate-200 rounded-md text-[11px]"
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* LEVEL 4: CAPACITÉS COGNITIVES & HORIZONS ALIMENTÉS */}
                            {capacities.length > 0 && (
                              <div className="pt-2 border-t border-slate-200/60 space-y-2">
                                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                  Alimente les Capacités Cognitives Méta :
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {capacities.map((cap) => {
                                    const horizons = getHorizonsForCapacity(cap.id);

                                    return (
                                      <div
                                        key={cap.id}
                                        className="p-2.5 bg-pink-50/60 border border-pink-100 rounded-xl space-y-1.5"
                                      >
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-bold text-pink-900 flex items-center gap-1.5">
                                            <span>🧠</span> {cap.name}
                                          </span>
                                          <span className="text-[10px] uppercase font-bold text-pink-700 bg-pink-100 px-1.5 py-0.2 rounded">
                                            {cap.level}
                                          </span>
                                        </div>

                                        {/* Connected Horizons */}
                                        {horizons.length > 0 && (
                                          <div className="text-[11px] text-orange-800 space-y-1 pt-1 border-t border-pink-200/40">
                                            <span className="text-[10px] font-semibold text-slate-500 block">
                                              Ouvre vers l'horizon ROME :
                                            </span>
                                            {horizons.map((h) => (
                                              <div
                                                key={h.id}
                                                onClick={() => onSelectNode(h)}
                                                className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-orange-200 hover:border-orange-400 cursor-pointer"
                                              >
                                                <span className="font-semibold text-orange-950 truncate pr-2">
                                                  {h.name}
                                                </span>
                                                <span className="font-bold text-orange-600 shrink-0">
                                                  {h.matchScore}%
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
