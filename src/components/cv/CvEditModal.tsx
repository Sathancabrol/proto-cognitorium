import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Award, 
  User, 
  Sliders
} from 'lucide-react';
import { CvState, CvExperienceItem, CvSkillItem, CvFormationItem } from './cvTypes';
import { ROME_CODE_SKILLS } from '../../data/romeData';

interface CvEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvState: CvState;
  onChange: (newState: CvState) => void;
  onRealignTarget: () => void;
}

export const CvEditModal: React.FC<CvEditModalProps> = ({
  isOpen,
  onClose,
  cvState,
  onChange,
  onRealignTarget
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'experiences' | 'skills' | 'formations'>('experiences');

  if (!isOpen) return null;

  // Helpers pour expériences
  const updateExperience = (id: string, updates: Partial<CvExperienceItem>) => {
    const updated = cvState.experiences.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp));
    onChange({ ...cvState, experiences: updated });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cvState.experiences.length) return;
    const list = [...cvState.experiences];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onChange({ ...cvState, experiences: list });
  };

  const deleteExperience = (id: string) => {
    onChange({
      ...cvState,
      experiences: cvState.experiences.filter((exp) => exp.id !== id)
    });
  };

  const addExperience = () => {
    const newExp: CvExperienceItem = {
      id: `exp-custom-${Date.now()}`,
      name: 'Nouvelle expérience professionnelle',
      role: 'Poste / Rôle occupé',
      institutionOrContext: 'Entreprise / Organisme',
      period: '2024',
      description: 'Description synthétique des réalisations et responsabilités.',
      missions: ['Mission principale ou résultat clé obtenu'],
      visible: true,
      isRomePriority: false
    };
    onChange({
      ...cvState,
      experiences: [newExp, ...cvState.experiences]
    });
  };

  const addMissionToExperience = (expId: string) => {
    const exp = cvState.experiences.find((e) => e.id === expId);
    if (!exp) return;
    updateExperience(expId, {
      missions: [...exp.missions, 'Nouvelle action ou réalisation clé']
    });
  };

  const updateMission = (expId: string, missionIndex: number, text: string) => {
    const exp = cvState.experiences.find((e) => e.id === expId);
    if (!exp) return;
    const updatedMissions = [...exp.missions];
    updatedMissions[missionIndex] = text;
    updateExperience(expId, { missions: updatedMissions });
  };

  const removeMission = (expId: string, missionIndex: number) => {
    const exp = cvState.experiences.find((e) => e.id === expId);
    if (!exp) return;
    const updatedMissions = exp.missions.filter((_, i) => i !== missionIndex);
    updateExperience(expId, { missions: updatedMissions });
  };

  // Helpers pour compétences
  const updateSkill = (id: string, updates: Partial<CvSkillItem>) => {
    const updated = cvState.skills.map((s) => (s.id === id ? { ...s, ...updates } : s));
    onChange({ ...cvState, skills: updated });
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cvState.skills.length) return;
    const list = [...cvState.skills];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onChange({ ...cvState, skills: list });
  };

  const deleteSkill = (id: string) => {
    onChange({
      ...cvState,
      skills: cvState.skills.filter((s) => s.id !== id)
    });
  };

  const addCustomSkill = (name = 'Nouvelle compétence') => {
    const newSkill: CvSkillItem = {
      id: `skill-custom-${Date.now()}`,
      name,
      categoryLabel: 'Technique',
      level: 85,
      visible: true,
      isRomeAligned: true,
      verified: true
    };
    onChange({
      ...cvState,
      skills: [newSkill, ...cvState.skills]
    });
  };

  // Compétences ROME disponibles non encore présentes
  const targetRomeSkills = (ROME_CODE_SKILLS[cvState.header.targetCode] || []).filter((reqSkill) => {
    return !cvState.skills.some((s) => s.name.toLowerCase() === reqSkill.toLowerCase());
  });

  // Helpers pour formations
  const updateFormation = (id: string, updates: Partial<CvFormationItem>) => {
    const updated = cvState.formations.map((f) => (f.id === id ? { ...f, ...updates } : f));
    onChange({ ...cvState, formations: updated });
  };

  const moveFormation = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cvState.formations.length) return;
    const list = [...cvState.formations];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onChange({ ...cvState, formations: list });
  };

  const deleteFormation = (id: string) => {
    onChange({
      ...cvState,
      formations: cvState.formations.filter((f) => f.id !== id)
    });
  };

  const addFormation = () => {
    const newFormation: CvFormationItem = {
      id: `form-custom-${Date.now()}`,
      name: 'Diplôme / Certification professionnelle',
      institution: 'Établissement ou organisme de formation',
      period: '2023',
      description: 'Spécialisation et compétences acquises',
      visible: true,
      isRomePriority: false
    };
    onChange({
      ...cvState,
      formations: [newFormation, ...cvState.formations]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Personnalisation manuelle du CV
              </h2>
              <p className="text-xs text-slate-500">
                Ajustez librement chaque élément, réordonnez ou ajoutez des compétences cibles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRealignTarget}
              title="Réordonne automatiquement selon la fiche ROME active"
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Réaligner sur la cible</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-2 pt-2">
          {[
            { id: 'experiences', label: `Expériences (${cvState.experiences.length})`, icon: Briefcase },
            { id: 'skills', label: `Compétences (${cvState.skills.length})`, icon: Award },
            { id: 'formations', label: `Formations (${cvState.formations.length})`, icon: GraduationCap },
            { id: 'info', label: 'Coordonnées & Pitch', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* TAB 1 : INFORMATIONS & PITCH */}
          {activeTab === 'info' && (
            <div className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-800 mb-2">Identité & En-tête du CV</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={cvState.header.personName}
                    onChange={(e) => onChange({ ...cvState, header: { ...cvState.header, personName: e.target.value } })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Titre visé (Poste)</label>
                  <input
                    type="text"
                    value={cvState.header.headline}
                    onChange={(e) => onChange({ ...cvState, header: { ...cvState.header, headline: e.target.value } })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={cvState.header.email}
                    onChange={(e) => onChange({ ...cvState, header: { ...cvState.header, email: e.target.value } })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={cvState.header.phone}
                    onChange={(e) => onChange({ ...cvState, header: { ...cvState.header, phone: e.target.value } })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Localisation</label>
                  <input
                    type="text"
                    value={cvState.header.location}
                    onChange={(e) => onChange({ ...cvState, header: { ...cvState.header, location: e.target.value } })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Lien LinkedIn</label>
                  <input
                    type="text"
                    value={cvState.header.linkedin}
                    onChange={(e) => onChange({ ...cvState, header: { ...cvState.header, linkedin: e.target.value } })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Résumé professionnel / Pitch adapté à la cible
                </label>
                <textarea
                  rows={3}
                  value={cvState.header.summary}
                  onChange={(e) => onChange({ ...cvState, header: { ...cvState.header, summary: e.target.value } })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2 : EXPÉRIENCES */}
          {activeTab === 'experiences' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Expériences & Réalisations de chantier / recherche
                  </h3>
                  <p className="text-xs text-slate-500">
                    Les expériences prioritaires pour la fiche ROME sélectionnée sont marquées par un badge doré et placées en tête.
                  </p>
                </div>
                <button
                  onClick={addExperience}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une expérience</span>
                </button>
              </div>

              <div className="space-y-3">
                {cvState.experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className={`bg-white rounded-2xl border p-4 transition-all shadow-sm ${
                      !exp.visible ? 'opacity-60 bg-slate-50 border-slate-200' : 
                      exp.isRomePriority ? 'border-amber-300 ring-1 ring-amber-200/50' : 'border-slate-200'
                    }`}
                  >
                    {/* Header experience card */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={exp.name}
                          onChange={(e) => updateExperience(exp.id, { name: e.target.value })}
                          className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 rounded"
                        />
                        {exp.isRomePriority && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Prioritaire Cible ROME</span>
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveExperience(idx, 'up')}
                          disabled={idx === 0}
                          title="Monter"
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveExperience(idx, 'down')}
                          disabled={idx === cvState.experiences.length - 1}
                          title="Descendre"
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateExperience(exp.id, { visible: !exp.visible })}
                          title={exp.visible ? 'Masquer dans le CV' : 'Afficher dans le CV'}
                          className={`p-1 rounded ${exp.visible ? 'text-slate-600 hover:bg-slate-100' : 'text-amber-600 bg-amber-50'}`}
                        >
                          {exp.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteExperience(exp.id)}
                          title="Supprimer"
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inputs role, institution, period */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Rôle / Poste</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Entreprise / Institution</label>
                        <input
                          type="text"
                          value={exp.institutionOrContext}
                          onChange={(e) => updateExperience(exp.id, { institutionOrContext: e.target.value })}
                          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Période</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Description générale */}
                    <div className="mb-3">
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Description synthétique</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 leading-relaxed"
                      />
                    </div>

                    {/* Missions / Puces */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                          Missions & Réalisations clés ({exp.missions.length})
                        </label>
                        <button
                          onClick={() => addMissionToExperience(exp.id)}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Ajouter une mission</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 pl-2 border-l-2 border-slate-100">
                        {exp.missions.map((mission, mIdx) => (
                          <div key={mIdx} className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">•</span>
                            <input
                              type="text"
                              value={mission}
                              onChange={(e) => updateMission(exp.id, mIdx, e.target.value)}
                              className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-white"
                            />
                            <button
                              onClick={() => removeMission(exp.id, mIdx)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Supprimer la mission"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3 : COMPÉTENCES */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Suggestion de compétences ROME manquantes */}
              {targetRomeSkills.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Compétences officielles recommandées par la fiche {cvState.header.targetCode} :</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Cliquez sur une compétence pour l'ajouter directement à votre CV :
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {targetRomeSkills.slice(0, 10).map((req, i) => (
                      <button
                        key={i}
                        onClick={() => addCustomSkill(req)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200/80 shadow-xs flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3 text-amber-700" />
                        <span>{req}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Liste des compétences actuelles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    Compétences mobilisées ({cvState.skills.length})
                  </h3>
                  <button
                    onClick={() => addCustomSkill()}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une compétence</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {cvState.skills.map((skill, idx) => (
                    <div
                      key={skill.id}
                      className={`p-3 rounded-xl border bg-white flex items-center justify-between gap-2 shadow-xs transition-all ${
                        !skill.visible ? 'opacity-40 bg-slate-50 border-slate-200' :
                        skill.isRomeAligned ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}</span>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                          className="text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none flex-1 min-w-0"
                        />
                        {skill.isRomeAligned && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-mono font-bold flex-shrink-0">
                            CIBLE
                          </span>
                        )}
                      </div>

                      {/* Contrôles */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => moveSkill(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveSkill(idx, 'down')}
                          disabled={idx === cvState.skills.length - 1}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => updateSkill(skill.id, { visible: !skill.visible })}
                          className={`p-1 rounded ${skill.visible ? 'text-slate-600' : 'text-amber-600'}`}
                        >
                          {skill.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4 : FORMATIONS */}
          {activeTab === 'formations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Formations, Diplômes & Certifications
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mettez en avant les formations clés pour la cible (ex: AFPA TP/VRD pour conducteur de travaux, Master pour ergonome).
                  </p>
                </div>
                <button
                  onClick={addFormation}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une formation</span>
                </button>
              </div>

              <div className="space-y-3">
                {cvState.formations.map((f, idx) => (
                  <div
                    key={f.id}
                    className={`p-4 bg-white rounded-2xl border transition-all ${
                      !f.visible ? 'opacity-40 bg-slate-50' :
                      f.isRomePriority ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-bold text-slate-400">{idx + 1}</span>
                        <input
                          type="text"
                          value={f.name}
                          onChange={(e) => updateFormation(f.id, { name: e.target.value })}
                          className="font-bold text-xs text-slate-900 flex-1 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                        />
                        {f.isRomePriority && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Pertinent cible
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveFormation(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveFormation(idx, 'down')}
                          disabled={idx === cvState.formations.length - 1}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 text-slate-600"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateFormation(f.id, { visible: !f.visible })}
                          className="p-1 rounded text-slate-600 hover:bg-slate-100"
                        >
                          {f.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteFormation(f.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">Organisme / Établissement</label>
                        <input
                          type="text"
                          value={f.institution}
                          onChange={(e) => updateFormation(f.id, { institution: e.target.value })}
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">Période / Année</label>
                        <input
                          type="text"
                          value={f.period}
                          onChange={(e) => updateFormation(f.id, { period: e.target.value })}
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Les modifications sont répercutées en temps réel sur le document.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Valider & Revenir au CV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
