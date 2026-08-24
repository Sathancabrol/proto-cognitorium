import React from 'react';
import { AnyCognitiveNode, GraphEdge, SkillNode, ExperienceNode, MissionNode, CapacityNode, HorizonJobNode } from '../types';
import { calculateSkillVitality, getVitalityStatus } from '../utils/decay';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Flame, 
  RefreshCw, 
  FileCheck, 
  AlertCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NodeInspectorModalProps {
  node: AnyCognitiveNode | null;
  allNodes: AnyCognitiveNode[];
  edges: GraphEdge[];
  simulationYear: number;
  onClose: () => void;
  onSelectNodeById: (id: string) => void;
  onReactivateSkill: (skillId: string) => void;
  onValidateNode?: (nodeId: string) => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  allNodes,
  edges,
  simulationYear,
  onClose,
  onSelectNodeById,
  onReactivateSkill,
  onValidateNode
}) => {
  if (!node) return null;

  // Find upstream sources and downstream destinations
  const upstreamNodeIds = edges.filter((e) => e.target === node.id).map((e) => e.source);
  const downstreamNodeIds = edges.filter((e) => e.source === node.id).map((e) => e.target);

  const upstreamNodes = allNodes.filter((n) => upstreamNodeIds.includes(n.id));
  const downstreamNodes = allNodes.filter((n) => downstreamNodeIds.includes(n.id));

  const isSkill = node.category.startsWith('skill_');
  const skillNode = isSkill ? (node as SkillNode) : null;
  const vitality = skillNode
    ? calculateSkillVitality(skillNode, simulationYear, skillNode.isReactivated)
    : 100;
  const vitalityStatus = isSkill ? getVitalityStatus(vitality) : null;

  const isPending = node.verificationStatus === 'pending' || node.verificationStatus === 'inferred';

  const handleReactivateClick = () => {
    if (!skillNode) return;
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onReactivateSkill(skillNode.id);
  };

  const handleValidateClick = () => {
    if (!onValidateNode) return;
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
    onValidateNode(node.id);
  };

  return (
    <div id="node-inspector-drawer" className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
        <div className="flex-1 pr-4">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              {node.category === 'experience' && '🏗️ Expérience de Terrain'}
              {node.category === 'formation' && '🎓 Formation / Diplôme'}
              {node.category === 'research_project' && '🔬 Projet de Recherche Universitaire'}
              {node.category === 'mission' && '📋 Mission & Actions'}
              {node.category === 'skill_tech' && '⚙️ Compétence Technique'}
              {node.category === 'skill_transversal' && '🔄 Compétence Transversale'}
              {node.category === 'skill_relational' && '🤝 Compétence Humaine'}
              {node.category === 'capacity_cognitive' && '🧠 Capacité Cognitive Méta'}
              {node.category === 'knowledge' && '📚 Savoir & Réglementation'}
              {node.category === 'horizon_job' && '🧭 Horizon Professionnel'}
            </span>

            {/* Inference Type Badge */}
            {node.inferenceType && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                node.inferenceType === 'explicite'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : node.inferenceType === 'inference_forte'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {node.inferenceType === 'explicite' && '📄 Explicite (CV/Diplôme)'}
                {node.inferenceType === 'inference_forte' && '⚡ Inférence Forte'}
                {node.inferenceType === 'inference_a_valider' && '❓ Inférence à Valider'}
              </span>
            )}

            {/* Verification Status Badge */}
            {isPending ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>En attente de validation</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Vérifié ({node.confidenceScore || 95}%)</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-snug">{node.name}</h2>
        </div>
        <button
          id="close-inspector-btn"
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Pending Validation Alert & Action */}
        {isPending && onValidateNode && (
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 text-xs">
            <div className="text-amber-900">
              <strong className="block font-bold">Inférence IA (Confiance : {node.confidenceScore || 85}%)</strong>
              <span className="text-[11px] text-amber-800">Confirmez cet élément pour l'ancrer définitivement.</span>
            </div>
            <button
              onClick={handleValidateClick}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Valider</span>
            </button>
          </div>
        )}

        {/* Vitality Bar (If Skill) */}
        {isSkill && skillNode && vitalityStatus && (
          <div className="p-4 rounded-2xl border bg-slate-50/90 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase text-slate-700">Disponibilité Cognitive Estimée</span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${vitalityStatus.badgeColor}`}>
                {vitalityStatus.label} ({vitality}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${vitality}%`,
                  backgroundColor: vitalityStatus.colorHex
                }}
              />
            </div>

            <p className="text-xs text-slate-600 mb-3">{vitalityStatus.stateDescription}</p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-200/70">
              <div>
                <span className="text-slate-400 block text-[10px]">Référence indicative</span>
                <span className="font-semibold text-slate-800">{skillNode.baseMastery}% ({skillNode.acquiredYear})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Dernière pratique</span>
                <span className="font-semibold text-slate-800">{skillNode.lastPracticedYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Transférabilité</span>
                <span className="font-semibold text-blue-600">{skillNode.transferabilityScore}/10</span>
              </div>
            </div>

            {/* Reactivation Trigger */}
            {vitality < 85 && (
              <button
                id="btn-reactivate-skill"
                onClick={handleReactivateClick}
                className="mt-3 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simuler une réactivation (Pratique / Projet)</span>
              </button>
            )}
          </div>
        )}

        {/* Quantitative Metrics Badge if present */}
        {node.metrics && (
          <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex flex-wrap items-center gap-3 text-xs text-indigo-950">
            <span className="font-bold text-[11px] uppercase tracking-wider text-indigo-800 flex items-center gap-1">
              📊 Volumétrie & Métriques :
            </span>
            {node.metrics.summaryVolume && (
              <span className="font-semibold px-2.5 py-1 bg-white rounded-xl shadow-xs border border-indigo-200">
                {node.metrics.summaryVolume}
              </span>
            )}
            {node.metrics.participantsCount && (
              <span className="px-2 py-0.5 bg-indigo-100/70 rounded-lg font-medium">
                👥 {node.metrics.participantsCount} participants
              </span>
            )}
            {node.metrics.classesCount && (
              <span className="px-2 py-0.5 bg-indigo-100/70 rounded-lg font-medium">
                🎓 {node.metrics.classesCount} classes encadrées
              </span>
            )}
            {node.metrics.teamsCount && (
              <span className="px-2 py-0.5 bg-indigo-100/70 rounded-lg font-medium">
                🏗️ {node.metrics.teamsCount} équipes supervisées
              </span>
            )}
          </div>
        )}

        {/* Node Description */}
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Description & Contexte</h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            {node.description}
          </p>
        </div>

        {/* Emergent Insight for Capacities */}
        {node.category === 'capacity_cognitive' && (node as CapacityNode).emergentInsight && (
          <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-950 space-y-1">
            <span className="font-bold uppercase tracking-wider text-purple-800 text-[10px] block">
              💡 Insight Émergent & Transférabilité
            </span>
            <p className="leading-relaxed">{(node as CapacityNode).emergentInsight}</p>
          </div>
        )}

        {/* Evidence & Provenance Section */}
        {node.evidence && node.evidence.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Traçabilité & Preuves de Maîtrise ({node.evidence.length})</span>
            </h3>
            <div className="space-y-1.5">
              {node.evidence.map((ev, idx) => (
                <div key={idx} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-blue-950">
                    <span>{ev.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-bold uppercase">
                      {ev.source}
                    </span>
                  </div>
                  {ev.volumeMetric && (
                    <span className="text-[11px] text-blue-700 font-semibold block">
                      📈 Volume : {ev.volumeMetric}
                    </span>
                  )}
                  {ev.detail && (
                    <p className="text-[11px] text-blue-800 italic">« {ev.detail} »</p>
                  )}
                  {ev.sourceDocument && (
                    <span className="text-[10px] text-blue-700 block">
                      Document : {ev.sourceDocument}{ev.sourcePage ? ` · p. ${ev.sourcePage}` : ''}
                    </span>
                  )}
                  {ev.date && (
                    <span className="text-[10px] text-slate-400 block">Date / Période : {ev.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mission-level actions keep the chain Experience → Mission → Skill inspectable. */}
        {node.category === 'mission' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Actions documentées</h3>
            <div className="space-y-1.5">
              {(node as MissionNode).actions.map((action) => (
                <div key={action} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 bg-indigo-50 border border-indigo-100 rounded-xl p-2.5">
              <strong>Contexte :</strong> {(node as MissionNode).context}
            </p>
          </div>
        )}

        {/* Specific Details for Experience, Formation & Research */}
        {(node.category === 'experience' || node.category === 'formation' || node.category === 'research_project') && (
          <div className="space-y-4">
            {(node as ExperienceNode).missions && (node as ExperienceNode).missions.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  {node.category === 'research_project' ? 'Actions & Protocoles Conduits' : 'Missions Opérationnelles'}
                </h3>
                <ul className="space-y-1.5">
                  {(node as ExperienceNode).missions.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(node as ExperienceNode).cognitiveEfforts && (node as ExperienceNode).cognitiveEfforts.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Efforts & Gymnastique Cognitive</h3>
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1.5">
                  {(node as ExperienceNode).cognitiveEfforts.map((effort, idx) => (
                    <div key={idx} className="text-xs text-blue-900 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <span>{effort}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Specific Details for SubSkills */}
        {isSkill && skillNode?.subSkills && skillNode.subSkills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Sous-compétences Décomposées</h3>
            <div className="flex flex-wrap gap-1.5">
              {skillNode.subSkills.map((sub, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Specific Details for Horizon Job */}
        {node.category === 'horizon_job' && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-2xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase text-orange-800">
                  Compatibilité Estimée : {(node as HorizonJobNode).compatibilityLevel || 'Élevée'}
                </span>
                <span className="text-sm font-bold text-orange-600">Indice heuristique — non psychométrique</span>
              </div>
              <p className="text-xs text-orange-950 leading-relaxed">
                {(node as HorizonJobNode).rationale}
              </p>
            </div>

            {(node as HorizonJobNode).explainabilityFactors?.evidenceConvergence && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
                <span className="font-bold text-emerald-900 text-[11px] block">
                  🎯 Preuves Convergentes du Parcours :
                </span>
                {(node as HorizonJobNode).explainabilityFactors?.evidenceConvergence?.map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-emerald-800 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Compétences Déjà Possédées</h3>
              <div className="flex flex-wrap gap-1.5">
                {(node as HorizonJobNode).matchingSkills?.map((ms, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {ms}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Passerelle : Compétences Manquantes (Delta)</h3>
              <div className="space-y-2">
                {(node as HorizonJobNode).missingSkills?.map((missing, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs">
                    <div className="flex items-center justify-between font-semibold text-amber-900 mb-1">
                      <span>{missing.name}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded">
                        {missing.importance}
                      </span>
                    </div>
                    <p className="text-amber-800 text-[11px]">
                      💡 <strong className="font-medium">Pont d'apprentissage :</strong> {missing.learningBridge}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Genealogical Traceability: Upstream Sources */}
        {upstreamNodes.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Provenance / Origine ({upstreamNodes.length})
            </h3>
            <div className="space-y-1.5">
              {upstreamNodes.map((un) => (
                <button
                  key={un.id}
                  onClick={() => onSelectNodeById(un.id)}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {un.category === 'experience' ? '🏗️' : un.category.startsWith('skill_') ? '⚙️' : '🧠'}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                      {un.name}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Downstream Unlocks & Capacities */}
        {downstreamNodes.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Alimente & Débloque ({downstreamNodes.length})
            </h3>
            <div className="space-y-1.5">
              {downstreamNodes.map((dn) => (
                <button
                  key={dn.id}
                  onClick={() => onSelectNodeById(dn.id)}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {dn.category === 'horizon_job' ? '🧭' : dn.category === 'capacity_cognitive' ? '🧠' : '⚙️'}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                      {dn.name}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
