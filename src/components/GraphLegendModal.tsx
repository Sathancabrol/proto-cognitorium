import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  HelpCircle, 
  Layers, 
  Share2, 
  Compass, 
  Clock, 
  Sparkles, 
  Network, 
  Lock, 
  Unlock, 
  Rotate3d, 
  Eye, 
  MousePointer, 
  Move, 
  ZoomIn, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight,
  BookOpen,
  ArrowRight,
  Zap,
  Activity,
  Flame,
  Info,
  Gamepad2,
  Map,
  Flag,
  Star,
  Target,
  Shield,
  Crosshair,
  Award,
  Crown
} from 'lucide-react';

interface GraphLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LegendTab = 'overview' | 'nodes' | 'edges' | 'navigation' | 'timeline' | 'benchmark' | 'faq';

interface NodeCategoryDoc {
  key: string;
  title: string;
  badge: string;
  color: string;
  glow: string;
  level: string;
  zDepth: string;
  description: string;
  examples: string[];
  epistemicType: string;
  visualDetails: string;
}

const NODE_CATEGORIES_DOC: NodeCategoryDoc[] = [
  {
    key: 'formation',
    title: 'Formations & Diplômes',
    badge: '🎓 Diplôme / Certificat',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.45)',
    level: 'Niveau 0 (Socle Académique)',
    zDepth: 'Arrière-plan 3D (Z = -160)',
    description: 'Ancres institutionnelles certifiées (universités, grandes écoles, certifications d\'État). Elles constituent le point de départ formel et la date d\'ancrage primaire du savoir.',
    examples: ['Master Informatique & IA', 'Diplôme d\'Ingénieur', 'Doctorat en Sciences'],
    epistemicType: 'Fait certifié (Preuve documentaire directe, diplôme)',
    visualDetails: 'Bulle violette lumineuse, glyphe 🎓, halo large, taille imposante liée au nombre de modules dérivés.'
  },
  {
    key: 'experience',
    title: 'Expériences Professionnelles & Recherche',
    badge: '🏢 Poste / 🔬 Recherche',
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.45)',
    level: 'Niveau 1 (Terrain & Pratique)',
    zDepth: 'Plan intermédiaire arrière (Z = -80)',
    description: 'Contrats réels, postes occupés en entreprise, missions de conseil indépendantes ou projets de recherche expérimentale en laboratoire.',
    examples: ['Lead Tech Architect', 'Développeur Full Stack', 'Chercheur en Neuro-cognition'],
    epistemicType: 'Fait certifié (Contrat de travail, livrables clients, publications)',
    visualDetails: 'Bulle bleue électrique, glyphes dynamiques selon le rôle (💼 direction, 🏗️ architecture, 🔬 recherche, 🚀 freelance).'
  },
  {
    key: 'task',
    title: 'Missions & Tâches Opérationnelles',
    badge: '🎯 Action & Mission',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.45)',
    level: 'Niveau 2 (Actions concrètes)',
    zDepth: 'Plan central neutre (Z = 0)',
    description: 'Décomposition atomique d\'une expérience en actions et réalisations tangibles. C\'est le pivot qui prouve factuellement la maîtrise de compétences.',
    examples: ['Conception du moteur d\'indexation', 'Migration Kubernetes Cloud', 'Animation des sprints agiles'],
    epistemicType: 'Fait attesté ou Inférence directe tirée des réalisations',
    visualDetails: 'Bulle indigo, glyphes (🎯 action ciblée, 🏆 défi majeur, 🔍 diagnostic, ⚡ coordination).'
  },
  {
    key: 'skill_tech',
    title: 'Compétences Techniques (Hard Skills)',
    badge: '⚙️ Savoir-Faire Technique',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.45)',
    level: 'Niveau 3 (Compétence)',
    zDepth: 'Plan avant (Z = +80)',
    description: 'Maîtrise d\'outils, de langages informatiques, de frameworks, d\'architectures logicielles ou de protocoles techniques spécialisés.',
    examples: ['React / TypeScript', 'Python & PyTorch', 'Architecture Cloud & DevOps', 'Cybersécurité OWASP'],
    epistemicType: 'Prouvée par les tâches et soumise à la courbe d\'oubli temporelle',
    visualDetails: 'Bulle cyan avec anneau de vitalité circulaire (indiquant le pourcentage de fraîcheur mémorielle) et glyphes spécialisés (🧠 IA, 🎨 UI, ⚙️ Backend, ☁️ Cloud, 🛡️ Sécu).'
  },
  {
    key: 'skill_transversal',
    title: 'Compétences Transversales & Méthodes',
    badge: '📋 Méthode & Organisation',
    color: '#14b8a6',
    glow: 'rgba(20, 184, 166, 0.45)',
    level: 'Niveau 3 (Compétence)',
    zDepth: 'Plan avant (Z = +80)',
    description: 'Méthodes de travail agiles, capacités de résolution de problèmes complexes, pilotage de roadmap et optimisation de processus.',
    examples: ['Méthodologie Scrum / Kanban', 'Résolution de problèmes complexes', 'Pilotage de projet stratégique'],
    epistemicType: 'Inférence robuste consolidée sur plusieurs expériences',
    visualDetails: 'Bulle vert émeraude, anneau de vitalité à décroissance lente (haute transférabilité).'
  },
  {
    key: 'skill_relational',
    title: 'Compétences Relationnelles (Soft Skills)',
    badge: '💬 Humain & Relationnel',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    level: 'Niveau 3 (Compétence)',
    zDepth: 'Plan avant (Z = +80)',
    description: 'Communication interpersonnelle, leadership d\'équipe, transmission pédagogique, mentorat, négociation et posture collaborative.',
    examples: ['Leadership & Mentorat', 'Communication bienveillante', 'Transmission & Pédagogie'],
    epistemicType: 'Inférence comportementale et validation par les pairs',
    visualDetails: 'Bulle vert menthe, glyphes (👑 leadership, 💬 communication, 💡 pédagogie, 🤝 empathie).'
  },
  {
    key: 'knowledge',
    title: 'Savoirs Fondamentaux & Théoriques',
    badge: '📚 Corpus & Normes',
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.45)',
    level: 'Niveau 0-1 (Corpus théorique)',
    zDepth: 'Arrière-plan 3D (Z = -140)',
    description: 'Concepts théoriques, réglementations juridiques, normes industrielles (ISO, RGPD) et savoirs académiques sous-jacents aux compétences.',
    examples: ['Théorie des graphes', 'Réglementation RGPD', 'Normes d\'accessibilité WCAG'],
    epistemicType: 'Fait académique stable',
    visualDetails: 'Bulle bleu ciel profond, glyphe 📚, très faible érosion temporelle.'
  },
  {
    key: 'capacity_cognitive',
    title: 'Capacités Cognitives Émergentes',
    badge: '🧠 Cognition & Métacognition',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.45)',
    level: 'Niveau 4 (Méta-Capacités)',
    zDepth: 'Premier plan 3D (Z = +160)',
    description: 'Propriétés émergentes d\'ordre supérieur issues de la convergence de plusieurs compétences. Révèlent la signature intellectuelle du profil.',
    examples: ['Pensée Systémique & Architecturale', 'Raisonnement Hypothético-Déductif', 'Médiation Cognitive & Vulgarisation'],
    epistemicType: 'Inférence IA avancée et modélisation cognitive',
    visualDetails: 'Bulle rose néon éclatante, glyphes (🧠 cerveau, 📐 géométrie, 🌐 réseau, 💡 intuition).'
  },
  {
    key: 'horizon_job',
    title: 'Horizons Métiers & Matching ROME',
    badge: '🧭 Métier Cible France Travail',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.45)',
    level: 'Niveau 4 (Projection Avenir)',
    zDepth: 'Premier plan 3D (Z = +160)',
    description: 'Postes cibles et passerelles d\'orientation calculés par le moteur de matching ROME (Répertoire Opérationnel des Métiers et des Emplois de France Travail).',
    examples: ['Architecte Cloud & Big Data (M1802)', 'Directeur de Projet R&D (M1803)', 'Ingénieur en Cognition & IA (M1805)'],
    epistemicType: 'Hypothèse projective & Score de compatibilité probabiliste (0 à 100%)',
    visualDetails: 'Bulle ambre/dorée scintillante, glyphes (🚀 forte opportunité, ⭐ déjà exercé, 🔭 en perspective), pourcentage de compatibilité affiché.'
  }
];

interface EdgeDoc {
  type: string;
  label: string;
  sourceToTarget: string;
  color: string;
  style: string;
  description: string;
}

const EDGE_TYPES_DOC: EdgeDoc[] = [
  {
    type: 'acquired_in',
    label: 'Acquisition Fondatrice',
    sourceToTarget: 'Formation / Diplôme ➔ Compétence / Savoir',
    color: '#a855f7',
    style: 'Ligne violette continue avec flèche directionnelle',
    description: 'Indique qu\'une compétence ou un savoir théorique a été acquis dans le cadre d\'une formation certifiante.'
  },
  {
    type: 'composed_of',
    label: 'Décomposition de Mission',
    sourceToTarget: 'Expérience ➔ Tâche / Action',
    color: '#3b82f6',
    style: 'Ligne bleue solide, lien court et rigide',
    description: 'Relie un poste ou contrat aux tâches opérationnelles qui le constituent concrètement.'
  },
  {
    type: 'demonstrates_skill',
    label: 'Démonstration Opérationnelle',
    sourceToTarget: 'Tâche / Action ➔ Compétence',
    color: '#06b6d4',
    style: 'Ligne cyan lumineuse avec pulsation',
    description: 'Prouve sur le terrain que l\'accomplissement de la mission a mobilisé et validé une compétence.'
  },
  {
    type: 'feeds_capacity',
    label: 'Alimentation Cognitive',
    sourceToTarget: 'Compétence ➔ Capacité Cognitive',
    color: '#ec4899',
    style: 'Ligne rose néon fluide',
    description: 'Alimente l\'émergence d\'une capacité cognitive globale à partir d\'un faisceau de compétences associées.'
  },
  {
    type: 'unlocks_horizon',
    label: 'Déblocage de Passerelle Métier',
    sourceToTarget: 'Capacité / Compétence ➔ Horizon Métier ROME',
    color: '#f59e0b',
    style: 'Ligne ambre pointillée ou continue selon le score',
    description: 'Relie le profil aux fiches métiers ROME dont il remplit les prérequis et compétences clés.'
  },
  {
    type: 'requires_knowledge',
    label: 'Prérequis Théorique',
    sourceToTarget: 'Compétence ➔ Savoir Fondamental',
    color: '#0284c7',
    style: 'Ligne bleu ciel',
    description: 'Associe un savoir théorique nécessaire à l\'exercice d\'une compétence technique.'
  },
  {
    type: 'synergy_with',
    label: 'Synergie Inter-Compétences',
    sourceToTarget: 'Compétence A ⟷ Compétence B',
    color: '#10b981',
    style: 'Ligne bidirectionnelle émeraude',
    description: 'Met en évidence une fertilisation croisée entre deux domaines de compétences différents.'
  }
];

export const GraphLegendModal: React.FC<GraphLegendModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<LegendTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return NODE_CATEGORIES_DOC;
    const q = searchQuery.toLowerCase();
    return NODE_CATEGORIES_DOC.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.examples.some((e) => e.toLowerCase().includes(q)) ||
        c.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredEdges = useMemo(() => {
    if (!searchQuery.trim()) return EDGE_TYPES_DOC;
    const q = searchQuery.toLowerCase();
    return EDGE_TYPES_DOC.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.sourceToTarget.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="graph-legend-dialog"
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#14151a] border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-200 font-sans"
      >
        {/* TOP HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800 bg-[#1a1b22]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Légende & Guide Complet du Graphe</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Cognitorium v5.0
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Maîtrisez la navigation 3D, les strates cognitives, les liaisons sémantiques et la timeline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Chercher une notion, couleur, règle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-zinc-900/90 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-44 sm:w-60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title="Fermer la légende (Échap)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-[#121317] border-b border-zinc-800/80 overflow-x-auto select-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40 ring-1 ring-purple-400/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Vision Globale</span>
          </button>

          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'nodes'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Strates & Nœuds ({NODE_CATEGORIES_DOC.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('edges')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'edges'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40 ring-1 ring-blue-400/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>3. Liens & Relations ({EDGE_TYPES_DOC.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('navigation')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'navigation'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>4. Navigation 3D & Contrôles</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'timeline'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40 ring-1 ring-amber-400/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>5. Mon Parcours</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'benchmark'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40 ring-1 ring-violet-400/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>6. Benchmark Cartes Jeux Vidéo & UX</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'faq'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-950/40 ring-1 ring-pink-400/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>7. FAQ Utilisateur</span>
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: VISION GLOBALE & PHILOSOPHIE */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 border border-purple-500/30 rounded-2xl p-5 text-zinc-200">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-purple-500/20 text-purple-300 rounded-xl shrink-0 mt-0.5">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">
                      Le Modèle Cognitorium : De la Preuve Réelle à la Projection de Carrière
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Contrairement aux CV statiques qui listent des déclarations invérifiables, le <strong className="text-white">Cognitorium</strong> modélise votre capital cognitif sous forme d'un <strong className="text-purple-300">graphe sémantique dynamique et traçable</strong>. Chaque compétence est étayée par des réalisations concrètes, soumise à une courbe d'érosion temporelle biologique, et projetée vers les référentiels officiels de métiers (ROME France Travail).
                    </p>
                  </div>
                </div>
              </div>

              {/* The 5 Layers Step-by-step */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Les 5 Niveaux de Traçabilité Cognitive
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-purple-500/30 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-purple-400 mb-1">NIVEAU 0</div>
                      <h5 className="text-xs font-bold text-white mb-1.5">Formations & Savoirs</h5>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Diplômes certifiés, cours académiques, corpus théoriques fondamentaux.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-purple-300 font-mono">
                      Z = -160 (Fondation)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-blue-500/30 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-blue-400 mb-1">NIVEAU 1</div>
                      <h5 className="text-xs font-bold text-white mb-1.5">Expériences & Projets</h5>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Postes en entreprise, missions de conseil, protocoles de recherche.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-blue-300 font-mono">
                      Z = -80 (Terrain)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-indigo-400 mb-1">NIVEAU 2</div>
                      <h5 className="text-xs font-bold text-white mb-1.5">Missions & Tâches</h5>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Actions atomiques réalisées, défis résolus, livrables concrets produits.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-indigo-300 font-mono">
                      Z = 0 (Opérationnel)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-cyan-500/30 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-cyan-400 mb-1">NIVEAU 3</div>
                      <h5 className="text-xs font-bold text-white mb-1.5">Compétences Prouvées</h5>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Hard skills, soft skills transverses, compétences relationnelles avec vitalité active.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-cyan-300 font-mono">
                      Z = +80 (Savoir-faire)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-amber-500/30 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-amber-400 mb-1">NIVEAU 4</div>
                      <h5 className="text-xs font-bold text-white mb-1.5">Cognition & Horizons</h5>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Capacités d'abstraction émergentes et opportunités de matching métiers ROME.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-amber-300 font-mono">
                      Z = +160 (Futur & Avenir)
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#1a1b22] border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Auditabilité & Preuves</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Chaque nœud du graphe dispose d'un score de confiance (0-100%) et peut être vérifié ou rejeté par l'utilisateur humain dans le Centre de Validation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1a1b22] border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs">
                    <Activity className="w-4 h-4" />
                    <span>Courbe d'Oubli d'Ebbinghaus</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Les compétences non pratiquées subissent une demi-vie cognitive naturelle. Un clic sur « Réactiver » restaure leur vitalité opérationnelle à 100%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1a1b22] border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs">
                    <Compass className="w-4 h-4" />
                    <span>Passerelles ROME France Travail</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Le moteur compare votre empreinte cognitive avec les 532 fiches métiers ROME pour calculer des scores de compatibilité et identifier les compétences passerelles à acquérir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STRATES & NŒUDS */}
          {activeTab === 'nodes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{filteredCategories.length} catégories de nœuds indexées</span>
                <span className="text-[11px] text-purple-400 font-medium">Cliquez sur un nœud dans le graphe pour inspecter son détail</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.key}
                    className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Node Header Pill */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md ring-2 ring-white/20"
                            style={{ backgroundColor: cat.color }}
                          />
                          <h4 className="text-xs font-bold text-white">{cat.title}</h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700">
                          {cat.level}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {cat.description}
                      </p>

                      {/* Visual & 3D attributes */}
                      <div className="bg-zinc-900/90 rounded-xl p-2.5 text-[11px] space-y-1.5 border border-zinc-800 mb-3">
                        <div className="text-zinc-400">
                          <strong className="text-zinc-300">Rendu visuel :</strong> {cat.visualDetails}
                        </div>
                        <div className="text-zinc-400">
                          <strong className="text-zinc-300">Position 3D :</strong> <span className="font-mono text-purple-300">{cat.zDepth}</span>
                        </div>
                        <div className="text-zinc-400">
                          <strong className="text-zinc-300">Statut de preuve :</strong> <span className="text-emerald-300">{cat.epistemicType}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Exemples concrets :
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.examples.map((ex, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded-md border border-zinc-700"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Memory Vitality Gauge Explanation */}
              <div className="mt-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Comprendre l'Anneau de Vitalité Mémorielle (Compétences)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                    <strong className="block text-emerald-200">80% - 100% (Verte)</strong>
                    Compétence fraîche, activement pratiquée ou récemment réactivée.
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300">
                    <strong className="block text-cyan-200">60% - 79% (Cyan)</strong>
                    Compétence solide, bonne rémanence cognitive.
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300">
                    <strong className="block text-amber-200">40% - 59% (Ambre)</strong>
                    Érosion modérée, remise à niveau légère recommandée.
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300">
                    <strong className="block text-rose-200">&lt; 40% (Rouge / Sablier)</strong>
                    Compétence dormante, nécessite une réactivation explicite.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIENS & RELATIONS SÉMANTIQUES */}
          {activeTab === 'edges' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 leading-relaxed">
                Les liens du graphe ne sont pas de simples lignes géométriques : ce sont des <strong className="text-white">relations causales sémantiques</strong> orientées. Dans la simulation physique, chaque relation possède une raideur de ressort et une distance cible adaptée à son intensité conceptuelle.
              </div>

              <div className="space-y-3">
                {filteredEdges.map((edge) => (
                  <div
                    key={edge.type}
                    className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 hover:border-zinc-700 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: edge.color }}
                        />
                        <h4 className="text-xs font-bold text-white">{edge.label}</h4>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                          edge.type = "{edge.type}"
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-purple-300 bg-purple-950/50 border border-purple-500/30 px-2.5 py-0.5 rounded-lg">
                        {edge.sourceToTarget}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                      {edge.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <strong className="text-zinc-300">Style visuel :</strong>
                      <span>{edge.style}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NAVIGATION 3D & CONTRÔLES */}
          {activeTab === 'navigation' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-gradient-to-r from-emerald-950/40 to-cyan-950/30 border border-emerald-500/30 rounded-2xl p-4 text-zinc-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl shrink-0">
                    <Rotate3d className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Guide des Contrôles & Navigation Spatiale 3D / 2D
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Déplacez-vous librement dans l'espace 3D à 360°, inspectez les clusters en profondeur ou passez en vue plane 2D.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaction Matrix Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0 mt-0.5">
                    <Rotate3d className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">Rotation Orbitale 3D (360°)</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-200">Clic gauche maintenu + glisser</strong> sur le fond : fait pivoter la caméra en azimut (horizontal) et en élévation (vertical).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0 mt-0.5">
                    <Move className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">Translation & Panoramique (Pan)</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-200">Clic droit ou Shift + Clic gauche + glisser</strong> : déplace la caméra latéralement sur les axes X et Y sans changer l'angle.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">Zoom & Plongée en Profondeur</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-200">Molette de souris ou pincement trackpad</strong> : rapproche ou éloigne la caméra dans la profondeur du volume 3D.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                    <MousePointer className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">Sélection & Focus Direct</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-200">Clic sur une bulle</strong> : isole instantanément ses connexions directes, met en valeur les liens et ouvre le tiroir d'inspection.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">Survol Instantané (Hover)</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-200">Passer la souris sur un nœud</strong> : illumine le sous-graphe connecté et affiche une carte d'identité en bas à gauche.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 shrink-0 mt-0.5">
                    <Unlock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">Verrouillage de la Physique (Lock)</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-200">Bouton Lock / En mouvement</strong> : fige les positions à tout moment pour une lecture statique ou active le flottement fluide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Camera Presets Quick Guide */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-xs font-bold text-white mb-2.5">
                  Préréglages de Caméra 3D Recommandés
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-[#14151a] rounded-xl border border-zinc-800">
                    <strong className="text-purple-300 block mb-1">🔮 Vue Isométrique</strong>
                    Perspective équilibrée révélant les 5 strates en profondeur étagée.
                  </div>
                  <div className="p-2.5 bg-[#14151a] rounded-xl border border-zinc-800">
                    <strong className="text-blue-300 block mb-1">👁️ Vue de Face</strong>
                    Vue frontale classique pour comparer les largeurs de clusters.
                  </div>
                  <div className="p-2.5 bg-[#14151a] rounded-xl border border-zinc-800">
                    <strong className="text-cyan-300 block mb-1">📐 Vue du Dessus (Top)</strong>
                    Cartographie globale en plan 2D vue d'en haut.
                  </div>
                  <div className="p-2.5 bg-[#14151a] rounded-xl border border-zinc-800">
                    <strong className="text-emerald-300 block mb-1">🔄 Rotation Auto</strong>
                    Fait tourner lentement le graphe sur lui-même pour une vue d'ensemble vivante.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MON PARCOURS (TIMELINE CHRONOLOGIQUE) */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-yellow-950/40 border border-amber-500/30 rounded-2xl p-5 text-zinc-200">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-amber-500/20 text-amber-300 rounded-xl shrink-0 mt-0.5">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">
                      Mode Temporel « Mon Parcours » : L'Apparition Chronologique Réelle
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Ce mode rejoue l'histoire vivante de votre apprentissage d'année en année (de 2013 à 2026). Les éléments s'affichent selon leur <strong className="text-amber-300">date d'implantation réelle</strong> : d'abord le diplôme fondateur, puis les missions et modules, puis les compétences acquises, et enfin les capacités cognitives et horizons métiers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Sequence flow */}
              <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Séquence d'Émergence Temporelle</span>
                </h4>
                
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[11px]">1. Fondation</span>
                    <span>Les diplômes et formations initiales apparaissent en premier dans le graphe.</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[11px]">2. Expériences</span>
                    <span>Les postes et contrats de travail se connectent aux diplômes.</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[11px]">3. Missions</span>
                    <span>Les tâches opérationnelles se déploient au sein de chaque expérience.</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[11px]">4. Compétences</span>
                    <span>Les compétences techniques et humaines s'allument au fur et à mesure de leur validation.</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">5. Horizons</span>
                    <span>À pleine maturité, les capacités d'ordre supérieur débloquent les métiers cibles ROME.</span>
                  </div>
                </div>
              </div>

              {/* Timeline Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
                  <strong className="text-white block mb-1">▶️ Lecture & Pause</strong>
                  Lance l'animation chronologique automatique avec vitesse réglable (1x, 2x, 4x).
                </div>
                <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
                  <strong className="text-white block mb-1">🎚️ Curseur d'Année</strong>
                  Faites glisser pour vous positionner précisément à une année donnée de votre parcours.
                </div>
                <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
                  <strong className="text-white block mb-1">👁️ Mode Fantôme</strong>
                  Affiche les nœuds futurs sous forme d'ombres discrètes ou les masque totalement.
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BENCHMARK CARTOGRAPHIE JEUX VIDÉO & UX */}
          {activeTab === 'benchmark' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-zinc-200">
              
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-violet-950/50 via-purple-950/40 to-indigo-950/40 border border-violet-500/40 rounded-2xl p-5 text-zinc-200 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-violet-500/20 text-violet-300 rounded-xl shrink-0 mt-0.5 ring-1 ring-violet-400/30">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-violet-500/30 text-violet-200 text-[10px] font-bold tracking-wider uppercase rounded-full">
                        Analyse Benchmark UX / UI
                      </span>
                      <span className="text-xs text-violet-300 font-mono font-medium">Standards Cartographiques Jeux Vidéo & Open-World</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5">
                      La Légende de Carte dans le Jeu Vidéo : Principes Fondateurs & Transposition Cognitive
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      La légende d'une carte de jeu vidéo est un outil d'interface utilisateur (UI) essentiel regroupant la signalétique, les codes couleurs et les icônes permettant de s'orienter et de planifier ses objectifs. Le <strong className="text-violet-300">Cognitorium</strong> synthétise les 3 grands archétypes du jeu vidéo (Hybride Évolutif, Minimaliste Diégétique, Exhaustif Guidé) pour transformer la visualisation des compétences en une cartographie vivante, motivante et sans surcharge mentale.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. COMPARATIF DES 3 GRANDS MODÈLES */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-violet-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
                    1. Benchmark Comparatif : Les 3 Grands Modèles Cartographiques
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                  
                  {/* Modèle 1: Hybride Évolutif */}
                  <div className="p-4 rounded-2xl bg-[#1a1b22] border border-emerald-500/40 ring-1 ring-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-bl-lg">
                      Recommandé (Golden Standard)
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase font-mono">
                          Modèle 1 (Standard Cœur)
                        </span>
                        <span className="text-[11px] text-zinc-400 font-semibold">Aventure & Exploration Libre</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                        <span>🌿 Modèle Hybride Évolutif</span>
                      </h5>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                        L'équilibre parfait : carte initiale avec voile d'exploration qui se dévoile progressivement au zoom, légende contextuelle épurée couplée à une boîte à tampons personnalisables.
                      </p>
                    </div>
                    <div className="space-y-1.5 pt-3 border-t border-zinc-800 text-[11px]">
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>Points forts :</span>
                        <span className="font-semibold text-right">Progressivité, confort & personnalisation</span>
                      </div>
                      <div className="flex items-center justify-between text-cyan-400">
                        <span>Adoption :</span>
                        <span className="font-semibold text-right">Moteur par défaut du Cognitorium</span>
                      </div>
                    </div>
                  </div>

                  {/* Modèle 2: Minimaliste / Diégétique */}
                  <div className="p-4 rounded-2xl bg-[#1a1b22] border border-amber-500/30 hover:border-amber-500/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase font-mono">
                          Modèle 2
                        </span>
                        <span className="text-[11px] text-zinc-400 font-semibold">Purisme & Immersion Totale</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                        <span>✨ Modèle Minimaliste Diégétique</span>
                      </h5>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                        Privilégie l'immersion absolue en éliminant les indicateurs d'interface parasites. Seul le <em>Fil d'Ariane</em> d'or et les nœuds structurants guident le regard vers la cible.
                      </p>
                    </div>
                    <div className="space-y-1.5 pt-3 border-t border-zinc-800 text-[11px]">
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>Points forts :</span>
                        <span className="font-semibold text-right">Immersion maximale, trajectoire épurée</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-400">
                        <span>Filtrage :</span>
                        <span className="font-semibold text-right">Bruit visuel supprimé à 85%</span>
                      </div>
                    </div>
                  </div>

                  {/* Modèle 3: Maximaliste Guidé */}
                  <div className="p-4 rounded-2xl bg-[#1a1b22] border border-purple-500/30 hover:border-purple-500/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase font-mono">
                          Modèle 3
                        </span>
                        <span className="text-[11px] text-zinc-400 font-semibold">Atlas & Radar Intégral</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                        <span>🗺️ Modèle Exhaustif Guidé</span>
                      </h5>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                        Repose sur l'omniprésence des données : affichage permanent de tous les libellés, jauges de vitalité 360°, points d'intérêt POI et métriques de matching ROME.
                      </p>
                    </div>
                    <div className="space-y-1.5 pt-3 border-t border-zinc-800 text-[11px]">
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>Points forts :</span>
                        <span className="font-semibold text-right">Contrôle absolu, aucun élément masqué</span>
                      </div>
                      <div className="flex items-center justify-between text-indigo-400">
                        <span>Usage :</span>
                        <span className="font-semibold text-right">Audit analytique exhaustif</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Tableau Synthétique de Benchmark */}
                <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#14151a]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 font-semibold">
                        <th className="p-3">Critère d'évaluation</th>
                        <th className="p-3 text-emerald-300 bg-emerald-950/20">Modèle Hybride Évolutif (Cognitorium)</th>
                        <th className="p-3">Modèle Minimaliste Diégétique</th>
                        <th className="p-3">Modèle Exhaustif Guidé</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      <tr>
                        <td className="p-3 font-semibold text-white">Charge cognitive</td>
                        <td className="p-3 text-emerald-300 font-semibold bg-emerald-950/10">🟢 Équilibrée et progressive</td>
                        <td className="p-3 text-amber-300">🟡 Ultra-légère sur l'écran</td>
                        <td className="p-3 text-red-300">🛑 Élevée (densité d'indicateurs)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">Immersion visuelle</td>
                        <td className="p-3 text-emerald-300 font-semibold bg-emerald-950/10">🟢 Très bonne & personnalisable</td>
                        <td className="p-3 text-emerald-300">👑 Exceptionnelle (le fil d'or guide)</td>
                        <td className="p-3 text-amber-300">🟡 Analytique (interface permanente)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">Accessibilité</td>
                        <td className="p-3 text-emerald-300 font-semibold bg-emerald-950/10">🟢 Accessible à tous les profils</td>
                        <td className="p-3 text-amber-300">🟡 Centrée sur la trajectoire clé</td>
                        <td className="p-3 text-emerald-300">👑 Exhaustive (tout est explicite)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">Fonctionnalités & Effets</td>
                        <td className="p-3 text-emerald-300 bg-emerald-950/10">Voile doux + Boîte à tampons + Zoom sémantique</td>
                        <td className="p-3 text-zinc-400">Fil d'Ariane lumineux d'or + Topologie pure</td>
                        <td className="p-3 text-zinc-400">Tous libellés + Jauges 360° + POI permanents</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. GRAMMAIRE VISUELLE & SYMBOLES UNIVERSELS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
                    2. La Signalétique Universelle des Cartes de Jeux Vidéo
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  <div className="p-3.5 rounded-xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 font-bold font-mono text-sm shrink-0">
                      ! ⚠️
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">Donneur de Quête (Quest Giver)</strong>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Doré pour la trame narrative critique / bleu pour le secondaire. Transposé aux <strong className="text-zinc-200">Expériences & Diplômes fondateurs</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 font-bold font-mono text-sm shrink-0">
                      ? 🔍
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">Point d'Intérêt Secret (POI)</strong>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Lieu et savoir à explorer. Transposé aux <strong className="text-zinc-200">Capacités Émergentes et Savoirs à auditer</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold font-mono text-sm shrink-0">
                      🧭 🧭
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">Boussole & Point Cardinal (HUD)</strong>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Indique le cap et oriente le déplacement sans ouvrir la carte. Transposé au <strong className="text-zinc-200">Radar de cap vers les Métiers ROME</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 font-bold font-mono text-sm shrink-0">
                      🗼 👁️
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">Tour de Guet & Voile d'Exploration</strong>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Mécanique d'exploration : dissipe le voile brumeux et révèle les nœuds consolidés de la zone explorée.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono text-sm shrink-0">
                      ⚡ 🌀
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">Voyage Rapide & Sanctuaires</strong>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Points de téléportation et feux de camp. Transposé au <strong className="text-zinc-200">Focus instantané de cluster en 1 clic</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1a1b22] border border-zinc-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300 font-bold font-mono text-sm shrink-0">
                      ⚔️ ⚒️
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">Économie & Forges de Talents</strong>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Épée et enclume pour forger et fabriquer. Transposé aux <strong className="text-zinc-200">Compétences Techniques & Formations de montée en niveau</strong>.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. CODES COULEURS & TYPOLOGIE DES QUÊTES */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
                    3. Codes Couleurs et Typologie Universelle des Quêtes
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50" />
                      <strong className="text-amber-300 font-bold">Doré / Jaune</strong>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed mb-2">
                      <strong>Objectifs Principaux & Trame Critique</strong> : L'épopée fondatrice et les grandes ambitions.
                    </p>
                    <span className="text-[10px] text-amber-200/70 font-mono block bg-amber-900/30 px-2 py-0.5 rounded">
                      Cognitorium : Diplômes, Métiers Cibles ROME
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-400 shadow-md shadow-blue-400/50" />
                      <strong className="text-blue-300 font-bold">Bleu / Vert</strong>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed mb-2">
                      <strong>Quêtes Secondaires & Missions de Terrain</strong> : Expériences professionnelles et réalisations.
                    </p>
                    <span className="text-[10px] text-blue-200/70 font-mono block bg-blue-900/30 px-2 py-0.5 rounded">
                      Cognitorium : Expériences de terrain, Soft Skills
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-400 shadow-md shadow-rose-400/50" />
                      <strong className="text-rose-300 font-bold">Rouge / Rose</strong>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed mb-2">
                      <strong>Défis Majeurs & Épreuves Critiques</strong> : Forteresses et capacités de haut niveau.
                    </p>
                    <span className="text-[10px] text-rose-200/70 font-mono block bg-rose-900/30 px-2 py-0.5 rounded">
                      Cognitorium : Capacités d'ordre supérieur, Décroissance
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3 h-3 rounded-full bg-purple-400 shadow-md shadow-purple-400/50" />
                      <strong className="text-purple-300 font-bold">Violet / Cyan</strong>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed mb-2">
                      <strong>Savoirs Rares & Certifications d'Élite</strong> : Compétences pointues et savoir-faire.
                    </p>
                    <span className="text-[10px] text-purple-200/70 font-mono block bg-purple-900/30 px-2 py-0.5 rounded">
                      Cognitorium : Hard Skills d'excellence & Certifications
                    </span>
                  </div>

                </div>
              </div>

              {/* 4. BOÎTE À TAMPONS PERSONNALISABLES */}
              <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>La Boîte à Tampons Interactive (Marquage Libre d'Aventure)</span>
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-mono font-bold">
                    Disponible sur le Graphe
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Dans les grands systèmes cartographiques d'exploration, le joueur appose librement des tampons pour concevoir sa propre légende. Sur le graphe du Cognitorium, vous pouvez activer la palette de tampons (volet droit) et cliquer sur n'importe quel nœud :
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                    <div className="text-base mb-1">🚩</div>
                    <strong className="text-white text-[11px] block">Quête Prioritaire</strong>
                    <span className="text-[10px] text-zinc-500">Objectif immédiat</span>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                    <div className="text-base mb-1">⭐</div>
                    <strong className="text-white text-[11px] block">Chef-d'œuvre</strong>
                    <span className="text-[10px] text-zinc-500">Fierté & Masterpiece</span>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                    <div className="text-base mb-1">⚡</div>
                    <strong className="text-white text-[11px] block">En Entraînement</strong>
                    <span className="text-[10px] text-zinc-500">Montée en niveau</span>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                    <div className="text-base mb-1">🎯</div>
                    <strong className="text-white text-[11px] block">Cible ROME</strong>
                    <span className="text-[10px] text-zinc-500">Reconversion / Visée</span>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                    <div className="text-base mb-1">🛡️</div>
                    <strong className="text-white text-[11px] block">Pilier Fondamental</strong>
                    <span className="text-[10px] text-zinc-500">Socle inébranlable</span>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                    <div className="text-base mb-1">❓</div>
                    <strong className="text-white text-[11px] block">Point Secret</strong>
                    <span className="text-[10px] text-zinc-500">À auditer / explorer</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: FAQ UTILISATEUR COMPLÈTE */}
          {activeTab === 'faq' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-3">
                
                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800">
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <span>Pourquoi certaines bulles sont-elles plus volumineuses que d'autres ?</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    La taille d'une bulle est directement proportionnelle à son <strong className="text-white">degré de centralité</strong> (le nombre de connexions qu'elle entretient avec le reste du graphe). Une formation fondatrice ayant généré 12 compétences et missions sera plus imposante qu'une compétence isolée.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800">
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>Comment réactiver une compétence en déclin mémoriel ?</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Cliquez sur la compétence dans le graphe pour ouvrir sa fiche détaillée, puis cliquez sur le bouton <strong className="text-emerald-300">« Réactiver la compétence »</strong>. Sa vitalité repassera immédiatement à 100% pour l'année en cours avec un badge éclair ⚡.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800">
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>D'où proviennent les codes ROME et les pourcentages de matching ?</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Le Cognitorium intègre l'ensemble de la nomenclature officielle ROME 4.0 de France Travail (plus de 532 métiers). L'algorithme compare les compétences prouvées de votre profil avec le référentiel des savoir-faire indispensables pour chaque fiche métier.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800">
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Comment ajouter une nouvelle expérience ou un diplôme ?</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Utilisez le bouton <strong className="text-purple-300">« + Distiller une expérience »</strong> présent en haut de l'écran. Vous pouvez décrire un projet ou copier-coller une offre : le moteur décomposera automatiquement la mission en tâches, compétences et passerelles.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800">
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>Quelle est la différence entre le mode 3D, le mode 2D et Mon Parcours ?</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Le <strong className="text-white">mode 3D</strong> permet une navigation spatiale complète à 360° avec étagement des strates cognitives en profondeur Z. Le <strong className="text-white">mode 2D</strong> offre une vue réseau plane fluide façon Obsidian. <strong className="text-white">Mon Parcours</strong> rejoue la chronologie d'acquisition temporelle.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1b22] border border-zinc-800">
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-pink-400" />
                    <span>Que faire si je suis perdu ou si le graphe est trop loin ?</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Cliquez sur le bouton <strong className="text-white">Recentrer la vue (icône flèche circulaire)</strong> en bas à droite : la caméra se repositionnera immédiatement au centre avec le cadrage optimal.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* BOTTOM FOOTER */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-[#17181f] text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Moteur d'inférence certifié conforme ROME France Travail</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-md shadow-purple-950/50"
          >
            Fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
};
