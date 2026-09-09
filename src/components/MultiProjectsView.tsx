import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target, 
  Calendar, 
  ArrowRight, 
  Check, 
  Trash2, 
  Archive,
  Compass, 
  Sparkles, 
  Award, 
  AlertCircle, 
  TrendingUp, 
  Layers,
  Search,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { 
  CognitiveProfile, 
  ProfessionalProject, 
  ProjectMilestone, 
  ProjectStatus 
} from '../types';
import { searchRomeFiches } from '../utils/romeMatching';
import { RomeFiche } from '../data/romeData';

interface MultiProjectsViewProps {
  profile: CognitiveProfile;
  onUpdateProjects: (projects: ProfessionalProject[]) => void;
  onNavigateTab: (tab: any) => void;
}

const DEFAULT_PROJECTS: ProfessionalProject[] = [
  {
    id: 'proj-1',
    title: 'Ergonome Facteurs Humains & Systèmes Mobilité',
    status: 'en_cours',
    targetRomeCode: 'M1402',
    targetHorizonTitle: 'Conseil en organisation et ergonomie cognitive',
    timeHorizon: 'Horizon 12-18 mois',
    description: 'Valoriser le double diplôme recherche cognitive et conduite d’opérations pour concevoir des postes de travail et systèmes de guidage sans charge mentale superflue.',
    targetSkillIds: ['Analyse de la charge mentale', 'Protocole expérimental', 'Ergonomie physique et cognitive', 'Modélisation comportementale'],
    createdAt: '2026-03-01',
    updatedAt: '2026-09-08',
    milestones: [
      { id: 'm1', title: 'Publication du protocole de navigation spatiale et soutenance', targetDate: '2025-06', completed: true, notes: 'Validé avec mention' },
      { id: 'm2', title: 'Certification TOSA / Outils de modélisation', targetDate: '2025-11', completed: true, notes: 'Niveau Opérationnel 840/1000' },
      { id: 'm3', title: 'Réaliser 2 diagnostics ergonomiques appliqués sur chantiers complexes', targetDate: '2026-10', completed: false },
      { id: 'm4', title: 'Candidature ciblée auprès des cabinets conseil en facteurs humains', targetDate: '2027-02', completed: false }
    ]
  },
  {
    id: 'proj-2',
    title: 'Direction de Travaux & Coordination Grands Chantiers VRD',
    status: 'en_cours',
    targetRomeCode: 'F1202',
    targetHorizonTitle: 'Direction de chantier de BTP',
    timeHorizon: 'Horizon 6-12 mois',
    description: 'Piloter des chantiers de réseaux et télécoms avec une maîtrise rigoureuse de la sécurité, des délais, des métrés et de la relation sous-traitants.',
    targetSkillIds: ['Coordination de chantier', 'Respect des normes DICT / Sécurité', 'Management d’équipe travaux', 'Contrôle budgétaire de chantier'],
    createdAt: '2026-01-15',
    updatedAt: '2026-09-08',
    milestones: [
      { id: 'm2-1', title: 'Obtention habilitations sécurité AIPR Encadrant & SST', targetDate: '2024-09', completed: true },
      { id: 'm2-2', title: 'Suivi budgétaire et planification de 3 opérations simultanées', targetDate: '2026-04', completed: true },
      { id: 'm2-3', title: 'Déploiement d’un protocole zéro accident avec causeries sécurité', targetDate: '2026-12', completed: false }
    ]
  }
];

export const MultiProjectsView: React.FC<MultiProjectsViewProps> = ({
  profile,
  onUpdateProjects,
  onNavigateTab
}) => {
  const allProjects: ProfessionalProject[] = profile.projects && profile.projects.length > 0 
    ? profile.projects 
    : DEFAULT_PROJECTS;

  const [filterArchived, setFilterArchived] = useState(false);
  const activeProjects = allProjects.filter((p) => filterArchived ? p.archived : !p.archived);

  const [activeProjectId, setActiveProjectId] = useState<string>(
    activeProjects[0]?.id || allProjects[0]?.id || ''
  );
  
  // Création d'un projet
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRomeCode, setNewRomeCode] = useState('M1402');
  const [newRomeTitle, setNewRomeTitle] = useState('Conseil en organisation et ergonomie');
  const [romeSearchQuery, setRomeSearchQuery] = useState('');
  const [newHorizon, setNewHorizon] = useState('Horizon 12 mois');
  const [newDesc, setNewDesc] = useState('');

  // Confirmation de suppression
  const [projectToDelete, setProjectToDelete] = useState<ProfessionalProject | null>(null);

  // Nouveau jalon
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  const currentProject = allProjects.find((p) => p.id === activeProjectId) || activeProjects[0] || allProjects[0];

  // Recherche fiches ROME pour la création
  const romeSearchResults = useMemo(() => {
    if (!romeSearchQuery.trim() || romeSearchQuery.length < 2) return [];
    return searchRomeFiches(romeSearchQuery, 6);
  }, [romeSearchQuery]);

  // Compétences du profil
  const profileSkills = (profile.nodes || []).filter(
    (n) => n.category.startsWith('skill_') || n.category === 'capacity_cognitive'
  );

  // Calcul du taux de couverture et diagnostic des compétences du projet courant
  const skillsDiagnostic = useMemo(() => {
    if (!currentProject || !currentProject.targetSkillIds) {
      return { acquired: [], missing: [], coverage: 75 };
    }
    const acquired: string[] = [];
    const missing: string[] = [];

    currentProject.targetSkillIds.forEach((reqSkill) => {
      const isFound = profileSkills.some(
        (s) => s.name.toLowerCase().includes(reqSkill.toLowerCase()) ||
               reqSkill.toLowerCase().includes(s.name.toLowerCase())
      );
      if (isFound) {
        acquired.push(reqSkill);
      } else {
        missing.push(reqSkill);
      }
    });

    const total = currentProject.targetSkillIds.length;
    const coverage = total > 0 ? Math.round((acquired.length / total) * 100) : 100;
    return { acquired, missing, coverage };
  }, [currentProject, profileSkills]);

  const handleToggleMilestone = (milestoneId: string) => {
    if (!currentProject) return;
    const updatedMilestones = currentProject.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const updatedProject = { ...currentProject, milestones: updatedMilestones, updatedAt: new Date().toISOString().split('T')[0] };
    const nextProjects = allProjects.map((p) => (p.id === currentProject.id ? updatedProject : p));
    onUpdateProjects(nextProjects);
  };

  const handleAddMilestone = (title?: string, date?: string) => {
    const finalTitle = (title || newMilestoneTitle).trim();
    if (!finalTitle || !currentProject) return;
    const newM: ProjectMilestone = {
      id: `m-${Date.now()}`,
      title: finalTitle,
      targetDate: date || newMilestoneDate || 'À définir',
      completed: false
    };
    const updatedMilestones = [...currentProject.milestones, newM];
    const updatedProject = { ...currentProject, milestones: updatedMilestones, updatedAt: new Date().toISOString().split('T')[0] };
    const nextProjects = allProjects.map((p) => (p.id === currentProject.id ? updatedProject : p));
    onUpdateProjects(nextProjects);
    if (!title) {
      setNewMilestoneTitle('');
      setNewMilestoneDate('');
    }
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    if (!currentProject) return;
    const updatedMilestones = currentProject.milestones.filter((m) => m.id !== milestoneId);
    const updatedProject = { ...currentProject, milestones: updatedMilestones, updatedAt: new Date().toISOString().split('T')[0] };
    const nextProjects = allProjects.map((p) => (p.id === currentProject.id ? updatedProject : p));
    onUpdateProjects(nextProjects);
  };

  const handleStatusChange = (status: ProjectStatus) => {
    if (!currentProject) return;
    const updatedProject = { ...currentProject, status, updatedAt: new Date().toISOString().split('T')[0] };
    const nextProjects = allProjects.map((p) => (p.id === currentProject.id ? updatedProject : p));
    onUpdateProjects(nextProjects);
  };

  const handleToggleArchive = (project: ProfessionalProject) => {
    const updatedProject = { ...project, archived: !project.archived, updatedAt: new Date().toISOString().split('T')[0] };
    const nextProjects = allProjects.map((p) => (p.id === project.id ? updatedProject : p));
    onUpdateProjects(nextProjects);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    if (allProjects.length <= 1) {
      alert('Vous devez conserver au moins un projet professionnel dans votre portefeuille.');
      setProjectToDelete(null);
      return;
    }
    const nextProjects = allProjects.filter((p) => p.id !== projectToDelete.id);
    onUpdateProjects(nextProjects);
    setActiveProjectId(nextProjects[0].id);
    setProjectToDelete(null);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: ProfessionalProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      status: 'reflexion',
      targetRomeCode: newRomeCode,
      targetHorizonTitle: newRomeTitle,
      timeHorizon: newHorizon,
      description: newDesc.trim() || `Projet professionnel aligné sur la fiche ROME ${newRomeCode}.`,
      targetSkillIds: [
        'Gestion de projet & planification',
        'Analyse fonctionnelle et diagnostics',
        'Communication professionnelle & synthèse'
      ],
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Cartographie des compétences requises', completed: true },
        { id: `m-${Date.now()}-2`, title: 'Formation ou jalon d’immersion terrain', completed: false }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      archived: false
    };

    const nextProjects = [...allProjects, newProj];
    onUpdateProjects(nextProjects);
    setActiveProjectId(newProj.id);
    setIsCreatingProject(false);
    setNewTitle('');
    setNewDesc('');
    setRomeSearchQuery('');
  };

  const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
    reflexion: { label: 'En réflexion', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    en_cours: { label: 'En cours', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    valide: { label: 'Validé / Abouti', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    en_pause: { label: 'En pause', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' }
  };

  return (
    <div id="multi-projects-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-xs font-semibold">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Feuilles de Route & Multi-Projets (MVP-4)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gestionnaire Multi-Projets & Roadmaps Cibles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Pilotez plusieurs horizons de carrière en parallèle. Suivez vos jalons, comparez les compétences cibles et comblez les écarts en 1 clic.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Bascule Projets Actifs / Archivés */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterArchived(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !filterArchived ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Actifs ({allProjects.filter((p) => !p.archived).length})
            </button>
            <button
              onClick={() => setFilterArchived(true)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterArchived ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Archivés ({allProjects.filter((p) => p.archived).length})
            </button>
          </div>

          <button
            onClick={() => setIsCreatingProject(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau projet</span>
          </button>
        </div>
      </div>

      {/* Modal de Création de Projet avec recherche ROME ouverte */}
      {isCreatingProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Créer un Nouveau Projet Professionnel
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingProject(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Intitulé de votre projet / métier visé
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Consultant RSE & Transition Écologique"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Recherche ouverte ROME */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Associer un métier du référentiel ROME France Travail
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Chercher un code ou libellé ROME (ex: M1402, BTP, Santé, IA...)"
                    value={romeSearchQuery}
                    onChange={(e) => setRomeSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Suggestions ROME trouvées */}
                {romeSearchResults.length > 0 && (
                  <div className="mt-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 max-h-36 overflow-y-auto space-y-1">
                    {romeSearchResults.map((fiche) => (
                      <button
                        type="button"
                        key={fiche.code}
                        onClick={() => {
                          setNewRomeCode(fiche.code);
                          setNewRomeTitle(fiche.libelle);
                          setRomeSearchQuery(`${fiche.code} — ${fiche.libelle}`);
                        }}
                        className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-orange-50 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800 truncate">{fiche.libelle}</span>
                        <span className="font-mono text-[10px] text-orange-600 font-bold ml-2">{fiche.code}</span>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-1">
                  Code sélectionné : <strong className="text-orange-700">{newRomeCode}</strong> ({newRomeTitle})
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Horizon temporel prévisionnel
                </label>
                <select
                  value={newHorizon}
                  onChange={(e) => setNewHorizon(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option>Court terme (3-6 mois)</option>
                  <option>Moyen terme (12 mois)</option>
                  <option>Horizon 18-24 mois</option>
                  <option>Long terme (3 ans et plus)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description & Motivation stratégique
                </label>
                <textarea
                  rows={3}
                  placeholder="Qu'est-ce qui motive cette trajectoire et comment mobilise-t-elle vos forces ?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Créer la feuille de route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmation de Suppression */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-2xl bg-red-50 border border-red-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Supprimer le projet ?</h3>
                <p className="text-xs text-slate-500">Cette action est définitive.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Voulez-vous vraiment supprimer le projet <strong>"{projectToDelete.title}"</strong> et l'ensemble de ses jalons ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-xs"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur de Projets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {activeProjects.map((proj, idx) => {
          const isSelected = proj.id === activeProjectId;
          const completedMilestones = proj.milestones.filter((m) => m.completed).length;
          const progress = proj.milestones.length > 0 
            ? Math.round((completedMilestones / proj.milestones.length) * 100) 
            : 0;

          return (
            <div
              key={proj.id}
              onClick={() => setActiveProjectId(proj.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-orange-500 bg-white ring-2 ring-orange-500/20 shadow-md'
                  : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    Projet {idx + 1}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_CONFIG[proj.status].bg} ${STATUS_CONFIG[proj.status].color}`}>
                    {STATUS_CONFIG[proj.status].label}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {proj.title}
                </h3>
                {proj.targetRomeCode && (
                  <span className="text-[11px] font-mono text-slate-400 block">
                    ROME : {proj.targetRomeCode}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Jalons validés</span>
                  <span className="font-bold text-slate-700">{completedMilestones}/{proj.milestones.length} ({progress}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Détail du projet actif */}
      {currentProject && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          {/* Header du projet */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">
                  {currentProject.title}
                </h2>
                <div className="flex items-center gap-1">
                  {(['reflexion', 'en_cours', 'valide', 'en_pause'] as ProjectStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                        currentProject.status === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {STATUS_CONFIG[st].label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                {currentProject.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('horizons')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                title="Consulter le référentiel des compétences pour ce métier"
              >
                <Compass className="w-3.5 h-3.5 text-orange-600" />
                <span>Horizons ROME</span>
              </button>

              <button
                onClick={() => handleToggleArchive(currentProject)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                title={currentProject.archived ? 'Désarchiver le projet' : 'Archiver le projet'}
              >
                <Archive className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentProject.archived ? 'Restaurer' : 'Archiver'}</span>
              </button>

              <button
                onClick={() => setProjectToDelete(currentProject)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Supprimer ce projet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Métriques clés du projet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                Couverture des Compétences
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-orange-950">
                  {skillsDiagnostic.coverage}%
                </span>
                <span className="text-xs text-orange-600 font-semibold">
                  du profil aligné
                </span>
              </div>
              <p className="text-[11px] text-orange-700/80 mt-1">
                {skillsDiagnostic.acquired.length} acquises sur {currentProject.targetSkillIds.length} ciblées.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Horizon Temporel
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <Clock className="w-5 h-5 text-slate-400 mr-1" />
                <span className="text-xl font-bold text-slate-800">
                  {currentProject.timeHorizon || '12-24 mois'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dernière mise à jour : {currentProject.updatedAt}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Jalons Accomplis
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-800">
                  {currentProject.milestones.filter((m) => m.completed).length}
                </span>
                <span className="text-xs text-slate-400">
                  / {currentProject.milestones.length} étapes
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Progression active du plan d’action.
              </p>
            </div>
          </div>

          {/* Module Diagnostic des compétences & Combler l'écart */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Diagnostic d’alignement des compétences requises
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                {skillsDiagnostic.missing.length > 0 ? `${skillsDiagnostic.missing.length} compétence(s) à consolider` : 'Toutes les compétences sont démontrées !'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Compétences acquises */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Démontrées dans votre profil ({skillsDiagnostic.acquired.length})
                </span>
                {skillsDiagnostic.acquired.map((sk) => (
                  <div key={sk} className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between">
                    <span>{sk}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  </div>
                ))}
              </div>

              {/* Compétences manquantes avec bouton Combler */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Écarts à combler ({skillsDiagnostic.missing.length})
                </span>
                {skillsDiagnostic.missing.map((sk) => (
                  <div key={sk} className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900 flex items-center justify-between gap-2">
                    <span className="truncate">{sk}</span>
                    <button
                      type="button"
                      onClick={() => handleAddMilestone(`Formation / Immersion : ${sk}`)}
                      className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[10px] font-bold flex items-center gap-1 flex-shrink-0 transition-colors shadow-2xs"
                      title="Ajouter comme jalon d'apprentissage dans votre feuille de route"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Combler</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des Jalons & Feuille de Route */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span>Feuille de route & Jalons d'étapes</span>
              </h3>
              <span className="text-xs text-slate-400">Cliquez pour valider une étape</span>
            </div>

            <div className="space-y-2">
              {currentProject.milestones.map((m, mIdx) => (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    m.completed
                      ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      className={`flex-shrink-0 transition-transform ${m.completed ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}
                    >
                      {m.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{mIdx + 1}
                        </span>
                        <p className={`text-xs font-semibold ${m.completed ? 'line-through text-emerald-800/70' : 'text-slate-800'}`}>
                          {m.title}
                        </p>
                      </div>
                      {m.notes && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{m.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {m.targetDate && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {m.targetDate}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMilestone(m.id);
                      }}
                      className="text-slate-300 hover:text-red-500 p-1"
                      title="Supprimer ce jalon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ajout rapide d'un jalon */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddMilestone();
              }} 
              className="flex flex-col sm:flex-row gap-2 pt-2"
            >
              <input
                type="text"
                placeholder="Ajouter un jalon (ex: Obtenir la certification CACES / Préparer le portfolio)..."
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Date cible (ex: 2026-12)"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="w-full sm:w-36 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
