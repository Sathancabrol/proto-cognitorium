import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Briefcase, 
  GraduationCap, 
  Brain, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Target, 
  Search, 
  Edit3, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Compass,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { CognitiveProfile, CvTemplateType } from '../types';
import { searchRomeFiches } from '../utils/romeMatching';
import { ROME_FICHES, ROME_CODE_SKILLS, RomeFiche } from '../data/romeData';
import { CvState, CvExperienceItem, CvSkillItem, CvFormationItem } from './cv/cvTypes';
import { buildAlignedCvState, realignExistingCvState } from './cv/cvAlignment';
import { CvEditModal } from './cv/CvEditModal';

interface TargetedCvViewProps {
  profile: CognitiveProfile;
}

const POPULAR_TARGETS: { code: string; title: string; hint: string }[] = [
  { 
    code: 'F1201', 
    title: 'Conducteur / Conductrice de travaux du bâtiment & VRD',
    hint: 'Priorise SOBECA, COLAS, métrés, sécurité SST/AIPR et management de chantier'
  },
  { 
    code: 'M1402', 
    title: 'Ergonome Facteurs Humains & Mobilités',
    hint: 'Priorise SNCF, CATIE, eye-tracking, méthodologie scientifique et analyse des flux'
  },
  { 
    code: 'K2102', 
    title: 'Coordinateur / Ingénieur Pédagogique',
    hint: 'Priorise UM3 Tuteur, ingénierie de formation et transmission de méthodes'
  },
  { 
    code: 'M1508', 
    title: 'Conseiller en Évolution Professionnelle & Bilans',
    hint: 'Priorise bilans cognitifs, cartographie des compétences et orientation'
  },
  { 
    code: 'H1502', 
    title: 'Management Qualité Sécurité Environnement (QSE)',
    hint: 'Priorise prévention des risques, conformité terrain et culture sécurité'
  }
];

export const TargetedCvView: React.FC<TargetedCvViewProps> = ({ profile }) => {
  const [template, setTemplate] = useState<CvTemplateType>('moderne');
  const [targetCode, setTargetCode] = useState<string>('F1201');
  const [targetTitle, setTargetTitle] = useState<string>('Conducteur / Conductrice de travaux du bâtiment & VRD');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // État éditable complet du CV
  const [cvState, setCvState] = useState<CvState>(() => 
    buildAlignedCvState(profile, 'F1201', 'Conducteur / Conductrice de travaux du bâtiment & VRD')
  );

  // Modal d'édition globale
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Mode d'édition directe sur le document
  const [isInlineEditMode, setIsInlineEditMode] = useState(false);
  // Volet des compétences recommandées par la fiche ROME
  const [isRomeSuggestionsOpen, setIsRomeSuggestionsOpen] = useState(false);

  // Options de visibilité globales
  const [includeCognitive, setIncludeCognitive] = useState(true);
  const [includeContact, setIncludeContact] = useState(true);
  const [includeFormations, setIncludeFormations] = useState(true);
  const [onlyVerifiedSkills, setOnlyVerifiedSkills] = useState(false);

  const [copiedText, setCopiedText] = useState(false);

  // Recherche fiches ROME en temps réel
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    return searchRomeFiches(searchQuery, 8);
  }, [searchQuery]);

  // Compétences officielles ROME pour la fiche sélectionnée
  const officialRomeSkills = useMemo(() => {
    return ROME_CODE_SKILLS[targetCode] || [];
  }, [targetCode]);

  // Compétences ROME non encore présentes dans le CV
  const availableRomeRecommendations = useMemo(() => {
    const existingNames = new Set(cvState.skills.map((s) => s.name.toLowerCase()));
    return officialRomeSkills.filter((req) => !existingNames.has(req.toLowerCase()));
  }, [officialRomeSkills, cvState.skills]);

  // Sélection d'une nouvelle fiche ROME cible
  const handleSelectRomeTarget = (code: string, title: string) => {
    setTargetCode(code);
    setTargetTitle(title);
    setSearchQuery('');
    setIsSearchOpen(false);

    // Réaligne le CV sur la nouvelle cible tout en conservant les modifications manuelles de textes
    const realigned = realignExistingCvState(cvState, profile, code, title);
    setCvState(realigned);
  };

  // Réalignement explicite
  const handleRealignCurrentTarget = () => {
    const realigned = realignExistingCvState(cvState, profile, targetCode, targetTitle);
    setCvState(realigned);
  };

  // Réinitialiser tout à zéro
  const handleResetToDefault = () => {
    if (window.confirm("Réinitialiser le CV aux informations d'origine du profil pour cette cible ?")) {
      setCvState(buildAlignedCvState(profile, targetCode, targetTitle));
    }
  };

  // Ajout direct d'une compétence recommandée ROME
  const handleAddRomeSkill = (skillName: string) => {
    const newSkill: CvSkillItem = {
      id: `skill-rome-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: skillName,
      categoryLabel: 'Compétence ROME officielle',
      level: 90,
      visible: true,
      isRomeAligned: true,
      verified: true,
      matchReason: `Issu de la fiche ROME ${targetCode}`
    };
    setCvState((prev) => ({
      ...prev,
      skills: [newSkill, ...prev.skills]
    }));
  };

  // Helpers d'édition rapide inline
  const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return list;
    const copy = [...list];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    return copy;
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    setCvState((prev) => ({
      ...prev,
      experiences: moveItem(prev.experiences, index, direction)
    }));
  };

  const handleToggleExperienceVisibility = (id: string) => {
    setCvState((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e))
    }));
  };

  const handleMoveSkill = (index: number, direction: 'up' | 'down') => {
    setCvState((prev) => ({
      ...prev,
      skills: moveItem(prev.skills, index, direction)
    }));
  };

  const handleToggleSkillVisibility = (id: string) => {
    setCvState((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    }));
  };

  // Format texte brut ATS optimisé
  const generateAtsText = () => {
    let txt = '';
    txt += `${cvState.header.personName.toUpperCase()}\n`;
    txt += `${cvState.header.headline}\n`;
    if (includeContact) {
      txt += `Email: ${cvState.header.email} | Téléphone: ${cvState.header.phone} | Localisation: ${cvState.header.location}\n`;
      if (cvState.header.linkedin) txt += `LinkedIn: ${cvState.header.linkedin}\n`;
    }
    txt += `\n`;

    if (cvState.header.summary) {
      txt += `--- PROFIL PROFESSIONNEL (CIBLE ROME : ${targetCode} - ${targetTitle}) ---\n`;
      txt += `${cvState.header.summary}\n\n`;
    }

    txt += `--- COMPÉTENCES CLÉS PRIORITAIRES ---\n`;
    cvState.skills
      .filter((s) => s.visible && (!onlyVerifiedSkills || s.verified))
      .forEach((s) => {
        const match = s.isRomeAligned ? ' [ALIGNÉ CIBLE ROME]' : '';
        const verified = s.verified ? ' (Vérifiée)' : '';
        txt += `* ${s.name}${verified}${match}\n`;
      });
    txt += `\n`;

    if (includeCognitive && cvState.capacities.filter((c) => c.visible).length > 0) {
      txt += `--- CAPACITÉS COGNITIVES & TRANSVERSALES ---\n`;
      cvState.capacities
        .filter((c) => c.visible)
        .forEach((c) => {
          txt += `* ${c.name}\n`;
        });
      txt += `\n`;
    }

    txt += `--- EXPÉRIENCES PROFESSIONNELLES ---\n`;
    cvState.experiences
      .filter((exp) => exp.visible)
      .forEach((exp) => {
        const priorityTag = exp.isRomePriority ? ' [EXPÉRIENCE CIBLE]' : '';
        txt += `${exp.name.toUpperCase()} — ${exp.institutionOrContext} (${exp.period})${priorityTag}\n`;
        if (exp.role) txt += `Poste : ${exp.role}\n`;
        if (exp.description) txt += `${exp.description}\n`;
        if (exp.missions && exp.missions.length > 0) {
          exp.missions.forEach((m) => {
            txt += `  - ${m}\n`;
          });
        }
        txt += `\n`;
      });

    if (includeFormations && cvState.formations.filter((f) => f.visible).length > 0) {
      txt += `--- FORMATIONS & DIPLÔMES ---\n`;
      cvState.formations
        .filter((f) => f.visible)
        .forEach((f) => {
          txt += `* ${f.name} — ${f.institution} (${f.period})\n`;
        });
    }

    return txt;
  };

  const handleCopyAts = () => {
    const text = generateAtsText();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Liste filtrée pour l'affichage
  const visibleExperiences = cvState.experiences.filter((e) => e.visible);
  const visibleSkills = cvState.skills.filter((s) => s.visible && (!onlyVerifiedSkills || s.verified));
  const visibleFormations = cvState.formations.filter((f) => f.visible);
  const visibleCapacities = cvState.capacities.filter((c) => c.visible);

  return (
    <div id="cognitorium-targeted-cv-view" className="space-y-6 pb-12">
      {/* Modal d'édition globale */}
      <CvEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cvState={cvState}
        onChange={setCvState}
        onRealignTarget={handleRealignCurrentTarget}
      />

      {/* ===================================================================== */}
      {/* PANNEAU DE CONFIGURATION DU CV CIBLÉ (Masqué à l'impression)          */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6 print:hidden">
        {/* Ligne 1 : Titre & Actions Exports */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Générateur de CV Ciblé & Personnalisable</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Moteur ROME Dynamique
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Les compétences et expériences sont priorisées selon le métier visé. Vous pouvez modifier manuellement chaque élément.
              </p>
            </div>
          </div>

          {/* Boutons d'action principaux */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Personnaliser le contenu</span>
            </button>

            <button
              onClick={() => setIsInlineEditMode(!isInlineEditMode)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isInlineEditMode 
                  ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isInlineEditMode ? 'Quitter mode direct' : 'Mode direct'}</span>
            </button>

            <button
              onClick={handleCopyAts}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copié !' : 'Copier ATS'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-slate-900/10 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
          </div>
        </div>

        {/* Ligne 2 : Choix du Métier Cible ROME (Dynamique & Réactif) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Métier Cible ROME (1 911 fiches France Travail)</span>
            </span>

            <button
              onClick={handleRealignCurrentTarget}
              title="Réorganise automatiquement les expériences et compétences selon la fiche sélectionnée"
              className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Réaligner automatiquement selon la cible</span>
            </button>
          </div>

          {/* Suggestions populaires */}
          <div className="flex flex-wrap gap-2">
            {POPULAR_TARGETS.map((t) => {
              const isSelected = targetCode === t.code;
              return (
                <button
                  key={t.code}
                  onClick={() => handleSelectRomeTarget(t.code, t.title)}
                  title={t.hint}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono text-[11px] opacity-80">{t.code}</span>
                  <span>{t.title}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}

            {/* Bouton recherche fiches ROME complètes */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Autre fiche ROME...</span>
              </button>

              {isSearchOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-30 space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Chercher parmi 1 911 fiches (ex: travaux, ergonome, qse...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {searchResults.map((f) => (
                      <button
                        key={f.code}
                        onClick={() => handleSelectRomeTarget(f.code, f.libelle)}
                        className="w-full text-left p-2 rounded-xl hover:bg-blue-50 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <span className="font-mono font-bold text-blue-600 mr-2">{f.code}</span>
                          <span className="text-slate-900">{f.libelle}</span>
                        </div>
                      </button>
                    ))}
                    {searchQuery.length >= 2 && searchResults.length === 0 && (
                      <p className="text-xs text-slate-400 p-2 text-center">Aucune fiche trouvée</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bandeau explicatif du ciblage actuel */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-900">
              <span className="font-mono font-black bg-blue-600 text-white px-2 py-0.5 rounded text-[11px]">
                {targetCode}
              </span>
              <span className="font-bold">{targetTitle}</span>
              <span className="text-blue-700 hidden sm:inline">•</span>
              <span className="text-blue-700">
                {cvState.experiences.filter((e) => e.isRomePriority).length} expérience(s) et {cvState.skills.filter((s) => s.isRomeAligned).length} compétence(s) prioritaires
              </span>
            </div>

            {availableRomeRecommendations.length > 0 && (
              <button
                onClick={() => setIsRomeSuggestionsOpen(!isRomeSuggestionsOpen)}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 self-start sm:self-auto"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Voir les {availableRomeRecommendations.length} compétences recommandées</span>
              </button>
            )}
          </div>

          {/* Volet accordéon des compétences recommandées ROME */}
          {isRomeSuggestionsOpen && availableRomeRecommendations.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Compétences officielles de la fiche {targetCode} à ajouter en 1 clic :</span>
                </span>
                <button
                  onClick={() => setIsRomeSuggestionsOpen(false)}
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950"
                >
                  Fermer
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableRomeRecommendations.slice(0, 8).map((sk, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddRomeSkill(sk)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-950 text-xs font-semibold border border-amber-300 shadow-xs flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3 h-3 text-amber-600" />
                    <span>{sk}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ligne 3 : Gabarits & Filtres */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          {/* Gabarit */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Gabarit :</span>
            {[
              { id: 'moderne', label: 'Moderne (2 colonnes)' },
              { id: 'classique', label: 'Classique (Sobre)' },
              { id: 'ats', label: 'ATS (Pur texte structuré)' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id as CvTemplateType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  template === t.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Filtres de contenu */}
          <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeContact}
                onChange={(e) => setIncludeContact(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Coordonnées</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFormations}
                onChange={(e) => setIncludeFormations(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Formations</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCognitive}
                onChange={(e) => setIncludeCognitive(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Capacités cognitives</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerifiedSkills}
                onChange={(e) => setOnlyVerifiedSkills(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Uniquement vérifiées</span>
            </label>

            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alerte discrète si le mode direct est actif */}
      {isInlineEditMode && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 print:hidden animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Mode direct actif : vous pouvez monter/descendre les blocs, masquer des expériences ou cliquer sur les textes pour éditer.</span>
          </div>
          <button
            onClick={() => setIsInlineEditMode(false)}
            className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg text-amber-950 font-bold"
          >
            Terminer
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* RENDU IMPRIMABLE DU CV                                                */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 sm:p-12 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        
        {/* ===================== MODE 1 : ATS FORMAT ===================== */}
        {template === 'ats' && (
          <div className="font-mono text-xs sm:text-sm text-slate-900 space-y-6 leading-relaxed">
            <div className="border-b-2 border-slate-900 pb-3">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                {cvState.header.personName}
              </h1>
              <p className="font-bold text-slate-800 mt-1">{cvState.header.headline}</p>
              {includeContact && (
                <p className="text-slate-600 text-xs mt-1">
                  Email: {cvState.header.email} | Téléphone: {cvState.header.phone} | {cvState.header.location}
                  {cvState.header.linkedin && ` | ${cvState.header.linkedin}`}
                </p>
              )}
            </div>

            {cvState.header.summary && (
              <div className="cv-avoid-break">
                <h2 className="font-bold uppercase tracking-wider text-xs text-slate-500 border-b border-slate-300 pb-1 mb-2">
                  Résumé Professionnel (Cible : {targetCode} - {targetTitle})
                </h2>
                <p className="text-xs text-slate-800 leading-normal">{cvState.header.summary}</p>
              </div>
            )}

            <div className="cv-avoid-break">
              <h2 className="font-bold uppercase tracking-wider text-xs text-slate-500 border-b border-slate-300 pb-1 mb-2">
                Compétences Clés (Priorité {targetCode})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {visibleSkills.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-xs">
                    <span>•</span>
                    <span className={s.isRomeAligned ? 'font-bold text-emerald-800 bg-emerald-50 px-1 rounded' : 'text-slate-800'}>
                      {s.name}
                    </span>
                    {s.isRomeAligned && <span className="text-[10px] text-emerald-600 font-bold">[CIBLÉE ROME]</span>}
                  </div>
                ))}
              </div>
            </div>

            {includeCognitive && visibleCapacities.length > 0 && (
              <div className="cv-avoid-break">
                <h2 className="font-bold uppercase tracking-wider text-xs text-slate-500 border-b border-slate-300 pb-1 mb-2">
                  Capacités Cognitives & Raisonnement
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {visibleCapacities.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 text-xs">
                      <span>•</span>
                      <span className="text-slate-800">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="cv-avoid-break">
              <h2 className="font-bold uppercase tracking-wider text-xs text-slate-500 border-b border-slate-300 pb-1 mb-2">
                Expériences Professionnelles & Réalisations de Terrain
              </h2>
              <div className="space-y-4">
                {visibleExperiences.map((exp) => (
                  <div key={exp.id} className="cv-avoid-break space-y-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-xs text-slate-900 uppercase">
                        {exp.name} {exp.isRomePriority && '[EXPÉRIENCE PRIORITAIRE]'}
                      </h3>
                      <span className="text-[11px] text-slate-600">{exp.period}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {exp.role} — {exp.institutionOrContext}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-slate-700 leading-normal">{exp.description}</p>
                    )}
                    {exp.missions && exp.missions.length > 0 && (
                      <div className="space-y-0.5 pt-1">
                        {exp.missions.map((m, i) => (
                          <p key={i} className="text-xs text-slate-600 pl-3">
                            - {m}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {includeFormations && visibleFormations.length > 0 && (
              <div className="cv-avoid-break">
                <h2 className="font-bold uppercase tracking-wider text-xs text-slate-500 border-b border-slate-300 pb-1 mb-2">
                  Formations & Certifications
                </h2>
                <div className="space-y-2">
                  {visibleFormations.map((f) => (
                    <div key={f.id} className="text-xs text-slate-800">
                      <span className="font-bold">• {f.name}</span> — {f.institution} ({f.period})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== MODE 2 : MODERNE ===================== */}
        {template === 'moderne' && (
          <div className="space-y-8">
            {/* Header Moderne */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="space-y-1 flex-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {cvState.header.personName}
                </h1>
                <p className="text-base font-bold text-blue-600">{cvState.header.headline}</p>
                {includeContact && (
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {cvState.header.email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {cvState.header.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {cvState.header.location}
                    </span>
                    {cvState.header.linkedin && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                          {cvState.header.linkedin}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-right max-w-xs self-start sm:self-auto cv-avoid-break flex-shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  Profil ciblé ROME
                </span>
                <span className="text-xs font-black text-blue-950 block mt-0.5">
                  {targetCode} — {targetTitle}
                </span>
              </div>
            </div>

            {/* Accroche / Objectif */}
            {cvState.header.summary && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 cv-avoid-break">
                <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                  "{cvState.header.summary}"
                </p>
              </div>
            )}

            {/* Layout 2 colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Colonne Gauche (Compétences & Savoirs) */}
              <div className="md:col-span-5 space-y-6">
                <div className="cv-avoid-break">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Compétences Ciblées</span>
                    </h3>
                    {isInlineEditMode && (
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                      >
                        + Ajouter
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {visibleSkills.map((s, idx) => (
                      <div
                        key={s.id}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 border transition-all ${
                          s.isRomeAligned
                            ? 'bg-emerald-50/80 border-emerald-300/80 text-emerald-900 font-bold'
                            : 'bg-slate-50 border-slate-200/60 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{s.name}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {s.isRomeAligned && (
                            <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] rounded font-mono font-bold">
                              CIBLE
                            </span>
                          )}
                          {isInlineEditMode && (
                            <div className="flex items-center gap-0.5 print:hidden">
                              <button
                                onClick={() => handleMoveSkill(idx, 'up')}
                                disabled={idx === 0}
                                className="p-0.5 hover:bg-black/5 rounded disabled:opacity-20"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveSkill(idx, 'down')}
                                disabled={idx === visibleSkills.length - 1}
                                className="p-0.5 hover:bg-black/5 rounded disabled:opacity-20"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleToggleSkillVisibility(s.id)}
                                className="p-0.5 hover:bg-black/5 rounded text-slate-500"
                              >
                                <EyeOff className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {includeCognitive && visibleCapacities.length > 0 && (
                  <div className="cv-avoid-break">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Capacités Cognitives</span>
                    </h3>
                    <div className="space-y-1.5">
                      {visibleCapacities.map((c) => (
                        <div key={c.id} className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {includeFormations && visibleFormations.length > 0 && (
                  <div className="cv-avoid-break">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      <span>Formations & Diplômes</span>
                    </h3>
                    <div className="space-y-3">
                      {visibleFormations.map((f) => (
                        <div key={f.id} className={`border-l-2 pl-3 py-0.5 ${f.isRomePriority ? 'border-amber-400' : 'border-slate-200'}`}>
                          <p className="text-xs font-bold text-slate-900">{f.name}</p>
                          <p className="text-[11px] text-slate-500">{f.institution} • {f.period}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Colonne Droite (Expériences professionnelles) */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>Parcours & Réalisations Clés</span>
                    </h3>
                    {isInlineEditMode && (
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                      >
                        + Ajouter une expérience
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {visibleExperiences.map((exp, idx) => (
                      <div 
                        key={exp.id} 
                        className={`cv-avoid-break relative pl-5 border-l-2 space-y-2 ${
                          exp.isRomePriority ? 'border-amber-400' : 'border-blue-500/40'
                        }`}
                      >
                        <span className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white ${
                          exp.isRomePriority ? 'bg-amber-500 ring-amber-100' : 'bg-blue-600'
                        }`} />
                        
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900">{exp.name}</h4>
                              {exp.isRomePriority && (
                                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-black rounded uppercase">
                                  Priorité cible
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-blue-700">
                              {exp.role} • {exp.institutionOrContext}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-slate-400">{exp.period}</span>
                            {isInlineEditMode && (
                              <div className="flex items-center gap-0.5 ml-1 print:hidden">
                                <button
                                  onClick={() => handleMoveExperience(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-20"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveExperience(idx, 'down')}
                                  disabled={idx === visibleExperiences.length - 1}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-20"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleToggleExperienceVisibility(exp.id)}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                >
                                  <EyeOff className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {exp.description && (
                          <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                        )}

                        {exp.missions && exp.missions.length > 0 && (
                          <div className="space-y-1 pt-1">
                            {exp.missions.map((m, mIdx) => (
                              <div key={mIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span className="leading-normal">{m}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== MODE 3 : CLASSIQUE ===================== */}
        {template === 'classique' && (
          <div className="space-y-6 font-serif text-slate-900">
            <div className="text-center pb-6 border-b border-slate-300 space-y-1">
              <h1 className="text-3xl font-bold uppercase tracking-wider font-sans">
                {cvState.header.personName}
              </h1>
              <p className="text-sm italic text-slate-700">{cvState.header.headline}</p>
              {includeContact && (
                <p className="text-xs text-slate-500 font-sans">
                  {cvState.header.email} • {cvState.header.phone} • {cvState.header.location}
                  {cvState.header.linkedin && ` • ${cvState.header.linkedin}`}
                </p>
              )}
            </div>

            {cvState.header.summary && (
              <div className="cv-avoid-break space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1 font-sans">
                  Profil & Objectif ({targetTitle})
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed italic">{cvState.header.summary}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1 font-sans">
                Expériences Professionnelles & Réalisations
              </h3>
              {visibleExperiences.map((exp) => (
                <div key={exp.id} className="cv-avoid-break space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{exp.name}</h4>
                    <span className="text-[11px] text-slate-500 italic">{exp.period}</span>
                  </div>
                  <p className="text-xs font-sans text-slate-600 font-semibold">
                    {exp.role} — {exp.institutionOrContext}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.missions && exp.missions.length > 0 && (
                    <div className="space-y-0.5 pt-1 pl-2">
                      {exp.missions.map((m, mIdx) => (
                        <p key={mIdx} className="text-xs text-slate-700">
                          - {m}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="cv-avoid-break space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1 font-sans">
                Compétences Clés
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {visibleSkills.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span>—</span>
                    <span className={s.isRomeAligned ? 'font-bold text-slate-900' : 'text-slate-700'}>
                      {s.name}
                    </span>
                    {s.isRomeAligned && <span className="text-[9px] font-sans text-slate-500">[Cible]</span>}
                  </div>
                ))}
              </div>
            </div>

            {includeFormations && visibleFormations.length > 0 && (
              <div className="cv-avoid-break space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1 font-sans">
                  Diplômes & Formations
                </h3>
                {visibleFormations.map((f) => (
                  <div key={f.id} className="text-xs text-slate-800 flex items-baseline justify-between">
                    <span><strong>{f.name}</strong> — {f.institution}</span>
                    <span className="text-slate-500 italic">{f.period}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
