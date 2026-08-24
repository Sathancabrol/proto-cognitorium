import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldAlert, Sparkles, Check, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { AnyCognitiveNode, SkillNode, CapacityNode, HorizonJobNode } from '../types';
import confetti from 'canvas-confetti';

interface ValidationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: AnyCognitiveNode[];
  onValidateNode: (nodeId: string, updatedFields?: Partial<AnyCognitiveNode>) => void;
  onRejectNode: (nodeId: string) => void;
  onValidateAll: () => void;
}

export const ValidationCenterModal: React.FC<ValidationCenterModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onValidateNode,
  onRejectNode,
  onValidateAll
}) => {
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (!isOpen) return null;

  // Filter pending / inferred nodes needing validation
  const pendingNodes = nodes.filter(
    (n) => n.verificationStatus === 'pending' || n.verificationStatus === 'inferred'
  );

  const handleStartEdit = (node: AnyCognitiveNode) => {
    setEditingNodeId(node.id);
    setEditName(node.name);
    setEditDescription(node.description || '');
  };

  const handleSaveEdit = (nodeId: string) => {
    onValidateNode(nodeId, {
      name: editName,
      description: editDescription
    });
    setEditingNodeId(null);
  };

  const handleValidateSingle = (nodeId: string) => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });
    onValidateNode(nodeId);
  };

  const handleValidateAllClick = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 }
    });
    onValidateAll();
    onClose();
  };

  return (
    <div id="validation-center-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Centre de Validation Humaine</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                  {pendingNodes.length} en attente
                </span>
              </div>
              <p className="text-xs text-amber-100">
                L'IA propose, vous validez. Vérifiez la provenance et confirmez les compétences déduites.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {pendingNodes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Toutes les données sont validées !</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Votre capital cognitif est 100% vérifié. Vous pouvez ajouter de nouvelles expériences ou importer un CV à tout moment pour enrichir le graphe.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Retourner à mon Cognitorium
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-amber-50 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Chaque élément inféré par l'IA doit être confirmé avant d'être gravé dans votre passeport cognitif.
                  </span>
                </div>
                <button
                  id="btn-validate-all-pending"
                  onClick={handleValidateAllClick}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all whitespace-nowrap"
                >
                  Tout valider ({pendingNodes.length})
                </button>
              </div>

              <div className="space-y-3">
                {pendingNodes.map((node) => {
                  const isEditing = editingNodeId === node.id;
                  const isSkill = node.category.startsWith('skill_');
                  const isCapacity = node.category === 'capacity_cognitive';
                  const isHorizon = node.category === 'horizon_job';

                  return (
                    <div
                      key={node.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3 shadow-xs"
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                              Intitulé de la compétence / élément
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full p-2 text-xs font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                              Description & Contexte
                            </label>
                            <textarea
                              rows={2}
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingNodeId(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleSaveEdit(node.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Enregistrer & Valider</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                  {isSkill && '⚙️ Compétence'}
                                  {isCapacity && '🧠 Capacité Cognitive Méta'}
                                  {isHorizon && '🧭 Horizon Métier'}
                                  {node.category === 'experience' && '🏗️ Expérience'}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                                  Indice de Confiance IA : {node.confidenceScore || 85}%
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-900">{node.name}</h4>
                              {node.description && (
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{node.description}</p>
                              )}
                            </div>

                            {/* Human Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleStartEdit(node)}
                                title="Modifier avant de valider"
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onRejectNode(node.id)}
                                title="Refuser cette inférence"
                                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleValidateSingle(node.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Confirmer</span>
                              </button>
                            </div>
                          </div>

                          {/* Evidence & Provenance Preview */}
                          {node.evidence && node.evidence.length > 0 && (
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                              <span className="font-semibold text-slate-700 block">Preuves & Origine de l'inférence :</span>
                              {node.evidence.map((ev, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-slate-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                  <span>{ev.label}</span>
                                  {ev.date && <span className="text-slate-400">({ev.date})</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Garantie Cognitorium : Aucun élément n'est imposé sans votre accord.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
