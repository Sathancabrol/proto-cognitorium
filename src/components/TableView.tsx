import React, { useState } from 'react';
import { 
  Table2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowUpDown, 
  Eye, 
  RefreshCw, 
  Check, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { CognitiveProfile, AnyCognitiveNode, SkillNode, CapacityNode, HorizonJobNode, KnowledgeNode, VerificationStatus } from '../types';
import { calculateSkillVitality } from '../utils/decay';

interface TableViewProps {
  profile: CognitiveProfile;
  simulationYear: number;
  onSelectNode: (node: AnyCognitiveNode) => void;
  onValidateNode: (nodeId: string) => void;
  onReactivateSkill: (skillId: string) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  profile,
  simulationYear,
  onSelectNode,
  onValidateNode,
  onReactivateSkill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const nodes = profile.nodes;

  // Filtering
  const filteredNodes = nodes.filter((node) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = node.name.toLowerCase().includes(q);
      const matchDesc = node.description?.toLowerCase().includes(q) ?? false;
      if (!matchName && !matchDesc) return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'skills' && !node.category.startsWith('skill_')) return false;
      if (selectedCategory === 'knowledge' && node.category !== 'knowledge') return false;
      if (selectedCategory === 'capacity' && node.category !== 'capacity_cognitive') return false;
      if (selectedCategory === 'horizon' && node.category !== 'horizon_job') return false;
      if (selectedCategory === 'experience' && !['experience', 'formation', 'research_project'].includes(node.category)) return false;
      if (selectedCategory === 'task' && node.category !== 'task') return false;
      if (selectedCategory === 'research' && node.category !== 'research_project') return false;
    }

    // Status filter
    if (selectedStatus !== 'all') {
      const status = node.verificationStatus || 'verified';
      if (selectedStatus === 'verified' && status !== 'verified') return false;
      if (selectedStatus === 'pending' && status !== 'pending' && status !== 'inferred') return false;
    }

    return true;
  });

  return (
    <div id="table-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-cyan-50 text-cyan-600">
              <Table2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Tableau & Matrice de Traçabilité</h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Vue matricielle détaillée : niveau de maîtrise, disponibilité temporelle, traçabilité des preuves et validation humaine.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">Toutes les catégories</option>
            <option value="skills">Compétences</option>
            <option value="knowledge">📚 Savoirs Théoriques & Normes</option>
            <option value="capacity">Cognition</option>
            <option value="horizon">Horizons ROME</option>
            <option value="experience">Expériences & Formations</option>
            <option value="task">Tâches</option>
            <option value="research">Projets de Recherche</option>
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="verified">Vérifiés par l'humain</option>
            <option value="pending">En attente de validation</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Élément & Intitulé</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Maîtrise / Disponibilité</th>
                <th className="py-3.5 px-4">Confiance IA</th>
                <th className="py-3.5 px-4">Statut Humain</th>
                <th className="py-3.5 px-4">Preuves & Sources</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Aucun élément ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredNodes.map((node) => {
                  const isSkill = node.category.startsWith('skill_');
                  const isKnowledge = node.category === 'knowledge';
                  const isCapacity = node.category === 'capacity_cognitive';
                  const isHorizon = node.category === 'horizon_job';
                  const isTask = node.category === 'task';
                  const isExp = node.category === 'experience' || node.category === 'formation' || node.category === 'research_project';

                  const skillNode = isSkill ? (node as SkillNode) : null;
                  const knowledgeNode = isKnowledge ? (node as KnowledgeNode) : null;
                  const horizonNode = isHorizon ? (node as HorizonJobNode) : null;

                  const vitality = skillNode
                    ? calculateSkillVitality(skillNode, simulationYear, skillNode.isReactivated)
                    : null;

                  const status = node.verificationStatus || 'verified';
                  const isPending = status === 'pending' || status === 'inferred';

                  return (
                    <tr key={node.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Name & Desc */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <strong className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                            {node.name}
                          </strong>
                          {horizonNode?.romeCode && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded text-[10px] font-bold">
                              {horizonNode.romeCode}
                            </span>
                          )}
                        </div>
                        {node.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                            {node.description}
                          </p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          isKnowledge ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isSkill && 'Compétence'}
                          {isKnowledge && '📚 Savoir Théorique'}
                          {isCapacity && 'Capacité Méta'}
                          {isHorizon && 'Horizon ROME'}
                          {node.category === 'experience' && 'Expérience'}
                          {node.category === 'formation' && 'Formation'}
                          {node.category === 'research_project' && '🔬 Recherche'}
                          {isTask && '📋 Tâche'}
                        </span>
                      </td>

                      {/* Mastery / Vitality / Score */}
                      <td className="py-3.5 px-4">
                        {skillNode && vitality !== null && (
                          <div className="space-y-1 w-28">
                            <div className="flex items-center justify-between text-[11px] font-semibold">
                              <span>Disp. {vitality}%</span>
                              <span className="text-slate-400">Réf. indicative {skillNode.baseMastery}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  vitality > 75 ? 'bg-emerald-500' : vitality > 40 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${vitality}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {isKnowledge && (
                          <div className="text-[11px] font-semibold text-sky-800 space-y-0.5">
                            <div>{knowledgeNode?.domain || 'Corpus Fondamental'}</div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              Érosion : {knowledgeNode?.decayRate === 'lent' ? '🛡️ Très stable (Lent)' : knowledgeNode?.decayRate || 'Lent'} · Acquis en {knowledgeNode?.acquiredYear || '—'}
                            </div>
                          </div>
                        )}

                        {horizonNode && (
                          <span className="font-bold text-orange-600">
                            Compatibilité {horizonNode.compatibilityLevel || 'à explorer'}
                          </span>
                        )}

                        {isCapacity && (
                          <span className="capitalize font-semibold text-pink-700">
                            {(node as CapacityNode).level || 'avancé'}
                          </span>
                        )}

                        {isExp && (
                          <span className="text-slate-500 font-medium">
                            {(node as any).period || 'Déclaré'}
                          </span>
                        )}

                        {isTask && (
                          <span className="text-indigo-600 font-medium">Tâche documentée</span>
                        )}
                      </td>

                      {/* AI Confidence */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700">
                          {node.confidenceScore ? `${node.confidenceScore}%` : '98%'}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-semibold text-[10px]">
                            <AlertCircle className="w-3 h-3" />
                            <span>En attente</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Vérifié</span>
                          </span>
                        )}
                      </td>

                      {/* Evidence & Provenance */}
                      <td className="py-3.5 px-4">
                        {node.evidence && node.evidence.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>{node.evidence.length} preuve{node.evidence.length > 1 ? 's' : ''}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => onValidateNode(node.id)}
                              title="Valider cette compétence"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {skillNode && (
                            <button
                              onClick={() => onReactivateSkill(skillNode.id)}
                              title="Simuler réactivation"
                              className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onSelectNode(node)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 rounded-lg font-semibold text-[11px] transition-colors"
                          >
                            Inspecter
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
