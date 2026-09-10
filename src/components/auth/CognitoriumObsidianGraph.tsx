import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Plus, 
  Wand2, 
  Layers, 
  Eye, 
  EyeOff,
  Info,
  Maximize2,
  Orbit,
  Network,
  CheckCircle2,
  Zap,
  BookOpen,
  Briefcase,
  Cpu,
  Target
} from 'lucide-react';
import { VolantNodeType } from './CognitoriumNodeVolant';
import { ROME_DOMAIN_META } from '../../utils/metiersGraphData';

export interface GhostNodeItem {
  id: string;
  type: 'experience_category' | 'mission' | 'knowledge' | 'skill' | 'capacity' | 'target_job';
  label: string;
  sublabel: string;
  categoryTag?: string;
  domainLetter?: string;
  parentId: string;
  x: number;
  y: number;
  payload: any;
}

interface ObsidianGraphNode {
  id: VolantNodeType | string;
  type: VolantNodeType | 'task';
  label: string;
  sublabel: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  fillColor: string;
  glowColor: string;
  isFilled: boolean;
  synapseRole: string;
  domainLetter?: string;
  matchScore?: number;
}

interface ObsidianGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  color: string;
  isFilled: boolean;
  animatedParticles?: boolean;
  isGhost?: boolean;
}

interface CognitoriumObsidianGraphProps {
  isTemplateDeployed: boolean;
  activeNode: VolantNodeType | null;
  onSelectNode: (nodeType: VolantNodeType) => void;
  onDeployTemplate: () => void;
  onApplyFullPreset: () => void;

  // Données
  personName: string;
  knowledgeName: string;
  experienceRole: string;
  experienceContext: string;
  missions: string[];
  skillsList: { name: string; category: string; mastery: number }[];
  capacityName: string;
  targetJobTitle: string;
  selectedRomeCode: string;

  // Callback d'adoption d'un nœud pré-lié suggéré (grisé)
  onAdoptGhostNode: (ghost: GhostNodeItem) => void;
}

export const CognitoriumObsidianGraph: React.FC<CognitoriumObsidianGraphProps> = ({
  isTemplateDeployed,
  activeNode,
  onSelectNode,
  onDeployTemplate,
  onApplyFullPreset,
  personName,
  knowledgeName,
  experienceRole,
  experienceContext,
  missions,
  skillsList,
  capacityName,
  targetJobTitle,
  selectedRomeCode,
  onAdoptGhostNode
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Vue, Zoom et Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<ObsidianGraphNode | null>(null);
  const [hoveredGhostNode, setHoveredGhostNode] = useState<GhostNodeItem | null>(null);

  // Mode d'affichage du style Graphe des Métiers : 'connectome' ou 'orbital'
  const [viewMode, setViewMode] = useState<'connectome' | 'orbital'>('orbital');

  // Toggle pour afficher ou masquer les nœuds pré-liés suggérés en grisé
  const [showGhostSuggestions, setShowGhostSuggestions] = useState(true);

  // Positions personnalisées des nœuds (déplaçables par l'utilisateur)
  const [customNodePositions, setCustomNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Statuts de remplissage des nœuds
  const isProfileFilled = Boolean(personName.trim());
  const isKnowledgeFilled = Boolean(knowledgeName.trim());
  const isExperienceFilled = Boolean(experienceRole.trim());
  const isSkillsFilled = skillsList.length > 0;
  const isCapacityFilled = Boolean(capacityName.trim());
  const isTargetJobFilled = Boolean(targetJobTitle.trim() || selectedRomeCode.trim());

  // Domaine ROME pour le style Graphe des Métiers
  const targetDomainLetter = selectedRomeCode ? selectedRomeCode.charAt(0).toUpperCase() : 'F';
  const domainMeta = ROME_DOMAIN_META[targetDomainLetter] || { short: 'BTP', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.45)' };

  // Définition spatiale des nœuds principaux
  const baseNodes: ObsidianGraphNode[] = useMemo(() => {
    return [
      {
        id: 'profile',
        type: 'profile',
        label: personName.trim() || 'Nœud Profil',
        sublabel: isProfileFilled ? 'Racine du connectome' : 'Cliquez pour commencer le tissage',
        x: customNodePositions['profile']?.x ?? 500,
        y: customNodePositions['profile']?.y ?? 325,
        radius: 44,
        color: '#00E5CC',
        fillColor: isProfileFilled ? '#042F2E' : '#081726',
        glowColor: 'rgba(0, 229, 204, 0.4)',
        isFilled: isProfileFilled,
        synapseRole: 'Cœur gravitationnel'
      },
      {
        id: 'knowledge',
        type: 'knowledge',
        label: knowledgeName.trim() || 'Savoirs & Théories',
        sublabel: isKnowledgeFilled ? 'Corpus théorique' : 'Discipline fondamentale',
        x: customNodePositions['knowledge']?.x ?? 250,
        y: customNodePositions['knowledge']?.y ?? 190,
        radius: 36,
        color: '#A855F7',
        fillColor: isKnowledgeFilled ? '#2E1065' : '#170B2C',
        glowColor: 'rgba(168, 85, 247, 0.35)',
        isFilled: isKnowledgeFilled,
        synapseRole: 'requires_knowledge'
      },
      {
        id: 'experience',
        type: 'experience',
        label: experienceRole.trim() || 'Expérience Pivot',
        sublabel: experienceContext.trim() || 'Ancrage de terrain',
        x: customNodePositions['experience']?.x ?? 250,
        y: customNodePositions['experience']?.y ?? 460,
        radius: 38,
        color: '#3B82F6',
        fillColor: isExperienceFilled ? '#172554' : '#0B1528',
        glowColor: 'rgba(59, 130, 246, 0.35)',
        isFilled: isExperienceFilled,
        synapseRole: 'composed_of'
      },
      {
        id: 'skill',
        type: 'skill',
        label: skillsList.length > 0 ? `${skillsList.length} Compétence(s)` : 'Compétences',
        sublabel: skillsList.length > 0 ? skillsList[0].name : 'Savoir-faire opératoires',
        x: customNodePositions['skill']?.x ?? 750,
        y: customNodePositions['skill']?.y ?? 470,
        radius: 36,
        color: '#14B8A6',
        fillColor: isSkillsFilled ? '#042F2E' : '#061D1A',
        glowColor: 'rgba(20, 184, 166, 0.35)',
        isFilled: isSkillsFilled,
        synapseRole: 'acquired_in'
      },
      {
        id: 'capacity',
        type: 'capacity',
        label: capacityName.trim() || 'Capacité Cognitive',
        sublabel: isCapacityFilled ? 'Métacognition & Régulation' : 'Adaptabilité émergente',
        x: customNodePositions['capacity']?.x ?? 500,
        y: customNodePositions['capacity']?.y ?? 110,
        radius: 34,
        color: '#10B981',
        fillColor: isCapacityFilled ? '#064E3B' : '#06221A',
        glowColor: 'rgba(168, 85, 129, 0.35)',
        isFilled: isCapacityFilled,
        synapseRole: 'feeds_capacity'
      },
      {
        id: 'target_job',
        type: 'target_job',
        label: targetJobTitle.trim() || 'Métier Cible ROME',
        sublabel: selectedRomeCode ? `${selectedRomeCode} • Horizon ROME` : 'Orientation vocationnelle',
        x: customNodePositions['target_job']?.x ?? 750,
        y: customNodePositions['target_job']?.y ?? 190,
        radius: 38,
        color: domainMeta.color,
        fillColor: isTargetJobFilled ? '#381E08' : '#231204',
        glowColor: domainMeta.glow,
        isFilled: isTargetJobFilled,
        synapseRole: 'unlocks_horizon',
        domainLetter: targetDomainLetter,
        matchScore: isTargetJobFilled ? 94 : 0
      }
    ];
  }, [
    personName,
    knowledgeName,
    experienceRole,
    experienceContext,
    skillsList,
    capacityName,
    targetJobTitle,
    selectedRomeCode,
    isProfileFilled,
    isKnowledgeFilled,
    isExperienceFilled,
    isSkillsFilled,
    isCapacityFilled,
    isTargetJobFilled,
    customNodePositions,
    domainMeta,
    targetDomainLetter
  ]);

  // Nœuds de tâches satellites générés dynamiquement autour de l'expérience
  const taskNodes: ObsidianGraphNode[] = useMemo(() => {
    const expNode = baseNodes.find(n => n.id === 'experience');
    const expX = expNode?.x ?? 250;
    const expY = expNode?.y ?? 460;

    return missions.map((m, idx) => {
      const angle = Math.PI * 0.75 + (idx * 0.35);
      const dist = 95;
      const tx = customNodePositions[`task-${idx}`]?.x ?? (expX + Math.cos(angle) * dist);
      const ty = customNodePositions[`task-${idx}`]?.y ?? (expY + Math.sin(angle) * dist);

      return {
        id: `task-${idx}`,
        type: 'task',
        label: m,
        sublabel: 'Mission de terrain validée',
        x: tx,
        y: ty,
        radius: 17,
        color: '#38BDF8',
        fillColor: '#0C192E',
        glowColor: 'rgba(56, 189, 248, 0.4)',
        isFilled: true,
        synapseRole: 'composed_of'
      };
    });
  }, [missions, baseNodes, customNodePositions]);

  // ==========================================================================
  // NŒUDS PRÉ-LIÉS SUGGÉRÉS (EN GRISÉ / POINTILLÉS)
  // Comme demandé : propose directement des nœuds pré-liés autour des catégories
  // ==========================================================================
  const ghostNodes: GhostNodeItem[] = useMemo(() => {
    if (!showGhostSuggestions) return [];

    const expNode = baseNodes.find(n => n.id === 'experience');
    const expX = expNode?.x ?? 250;
    const expY = expNode?.y ?? 460;

    const knowNode = baseNodes.find(n => n.id === 'knowledge');
    const knowX = knowNode?.x ?? 250;
    const knowY = knowNode?.y ?? 190;

    const skillNode = baseNodes.find(n => n.id === 'skill');
    const skillX = skillNode?.x ?? 750;
    const skillY = skillNode?.y ?? 470;

    const capNode = baseNodes.find(n => n.id === 'capacity');
    const capX = capNode?.x ?? 500;
    const capY = capNode?.y ?? 110;

    const targetNode = baseNodes.find(n => n.id === 'target_job');
    const targetX = targetNode?.x ?? 750;
    const targetY = targetNode?.y ?? 190;

    const list: GhostNodeItem[] = [];

    // 1. Nœuds d'expérience suggérés en grisé (Catégories et Missions pré-liées)
    if (!isExperienceFilled || missions.length < 3) {
      list.push(
        {
          id: 'ghost-exp-vrd',
          type: 'experience_category',
          label: 'Conduite Travaux VRD',
          sublabel: 'Catégorie BTP suggérée',
          categoryTag: 'BTP & Chantier',
          parentId: 'experience',
          x: expX - 110,
          y: expY - 45,
          payload: {
            role: 'Conducteur de travaux VRD & Canalisations',
            typicalContext: 'Entreprise de Travaux Publics',
            suggestedMissions: [
              'Pilotage des sous-traitants & cadence chantier',
              'Contrôle qualité, sécurité et récolement DOE',
              'Gestion des approvisionnements réseaux'
            ]
          }
        },
        {
          id: 'ghost-exp-go',
          type: 'experience_category',
          label: 'Direction Chantier BTP',
          sublabel: 'Catégorie Gros Œuvre',
          categoryTag: 'BTP & Chantier',
          parentId: 'experience',
          x: expX - 95,
          y: expY + 65,
          payload: {
            role: 'Chef de chantier BTP Gros Œuvre',
            typicalContext: 'Major du BTP',
            suggestedMissions: [
              'Organisation quotidienne des compagnons',
              'Suivi du coulage béton et ferraillage',
              'Implantation topographique'
            ]
          }
        },
        {
          id: 'ghost-task-doe',
          type: 'mission',
          label: '+ Contrôle DOE & Qualité',
          sublabel: 'Mission pré-liée suggérée',
          categoryTag: 'Mission Terrain',
          parentId: 'experience',
          x: expX + 15,
          y: expY + 115,
          payload: {
            missionName: 'Contrôle qualité, sécurité et récolement DOE'
          }
        }
      );
    }

    // 2. Nœuds de Savoirs Théoriques suggérés en grisé
    if (!isKnowledgeFilled) {
      list.push(
        {
          id: 'ghost-know-rdm',
          type: 'knowledge',
          label: '+ RDM & Eurocodes',
          sublabel: 'Sciences de l\'ingénieur',
          categoryTag: 'Corpus Théorique',
          parentId: 'knowledge',
          x: knowX - 105,
          y: knowY - 35,
          payload: {
            name: 'Résistance des matériaux (RDM) & Mécanique des structures',
            domain: 'Génie Civil & Mécanique'
          }
        },
        {
          id: 'ghost-know-ergo',
          type: 'knowledge',
          label: '+ Ergonomie Cognitive',
          sublabel: 'Facteurs humains & charge mentale',
          categoryTag: 'Sciences Humaines',
          parentId: 'knowledge',
          x: knowX - 85,
          y: knowY + 65,
          payload: {
            name: 'Ergonomie cognitive & Facteurs humains',
            domain: 'Sciences Cognitives'
          }
        },
        {
          id: 'ghost-know-marches',
          type: 'knowledge',
          label: '+ Droit des Marchés & CCAG',
          sublabel: 'Droit public de la construction',
          categoryTag: 'Droit & Gestion',
          parentId: 'knowledge',
          x: knowX + 10,
          y: knowY - 80,
          payload: {
            name: 'Droit des marchés publics & CCAG Travaux',
            domain: 'Droit Administratif & Construction'
          }
        }
      );
    }

    // 3. Nœuds de Compétences suggérés en grisé
    if (skillsList.length < 3) {
      list.push(
        {
          id: 'ghost-skill-metres',
          type: 'skill',
          label: '+ Métrés & Chiffrage',
          sublabel: 'Compétence technique',
          categoryTag: 'Technique',
          parentId: 'skill',
          x: skillX + 100,
          y: skillY - 35,
          payload: {
            name: 'Métrés & Récolement DOE',
            category: 'skill_tech',
            defaultMastery: 90
          }
        },
        {
          id: 'ghost-skill-coord',
          type: 'skill',
          label: '+ Coordination Cadence',
          sublabel: 'Compétence relationnelle',
          categoryTag: 'Relationnelle',
          parentId: 'skill',
          x: skillX + 85,
          y: skillY + 60,
          payload: {
            name: 'Coordination de cadence & alignement',
            category: 'skill_relational',
            defaultMastery: 88
          }
        },
        {
          id: 'ghost-skill-aleas',
          type: 'skill',
          label: '+ Gestion des Aléas',
          sublabel: 'Compétence transversale',
          categoryTag: 'Transversale',
          parentId: 'skill',
          x: skillX - 20,
          y: skillY + 105,
          payload: {
            name: 'Gestion des aléas & Imprévus en direct',
            category: 'skill_transversal',
            defaultMastery: 88
          }
        }
      );
    }

    // 4. Nœuds de Capacité Cognitive suggérés en grisé
    if (!isCapacityFilled) {
      list.push(
        {
          id: 'ghost-cap-arbitrage',
          type: 'capacity',
          label: '+ Arbitrage sous contrainte',
          sublabel: 'Décision sous incertitude',
          categoryTag: 'Métacognition',
          parentId: 'capacity',
          x: capX - 100,
          y: capY - 25,
          payload: {
            name: 'Arbitrage et décision sous forte incertitude',
            dimension: 'Décision sous Contrainte'
          }
        },
        {
          id: 'ghost-cap-stress',
          type: 'capacity',
          label: '+ Régulation charge mentale',
          sublabel: 'Maîtrise du stress de cadence',
          categoryTag: 'Métacognition',
          parentId: 'capacity',
          x: capX + 100,
          y: capY - 25,
          payload: {
            name: 'Régulation de la charge mentale et du stress de cadence',
            dimension: 'Régulation de la Charge Mentale'
          }
        }
      );
    }

    // 5. Nœuds de Métiers Cibles ROME suggérés en grisé (Style Graphe des Métiers)
    if (!isTargetJobFilled) {
      list.push(
        {
          id: 'ghost-target-f1201',
          type: 'target_job',
          label: '[F1201] Conduite travaux',
          sublabel: 'Fiche ROME BTP • Affinité 94%',
          domainLetter: 'F',
          categoryTag: 'Horizon ROME',
          parentId: 'target_job',
          x: targetX + 105,
          y: targetY - 40,
          payload: {
            code: 'F1201',
            title: 'Conduite de travaux du BTP'
          }
        },
        {
          id: 'ghost-target-f1202',
          type: 'target_job',
          label: '[F1202] Direction chantier',
          sublabel: 'Fiche ROME BTP • Affinité 88%',
          domainLetter: 'F',
          categoryTag: 'Horizon ROME',
          parentId: 'target_job',
          x: targetX + 90,
          y: targetY + 65,
          payload: {
            code: 'F1202',
            title: 'Direction de chantier du BTP'
          }
        },
        {
          id: 'ghost-target-m1805',
          type: 'target_job',
          label: '[M1805] Études & Dév. SI',
          sublabel: 'Fiche ROME Support • Affinité 85%',
          domainLetter: 'M',
          categoryTag: 'Passerelle ROME',
          parentId: 'target_job',
          x: targetX - 25,
          y: targetY - 80,
          payload: {
            code: 'M1805',
            title: 'Études et développement informatique'
          }
        }
      );
    }

    return list;
  }, [
    showGhostSuggestions,
    baseNodes,
    isExperienceFilled,
    missions.length,
    isKnowledgeFilled,
    skillsList.length,
    isCapacityFilled,
    isTargetJobFilled
  ]);

  const allNodes = useMemo(() => [...baseNodes, ...taskNodes], [baseNodes, taskNodes]);

  // Arêtes synaptiques du graphe Obsidian
  const edges: ObsidianGraphEdge[] = useMemo(() => {
    const list: ObsidianGraphEdge[] = [
      // Profil -> Savoirs
      {
        id: 'edge-profile-knowledge',
        source: 'profile',
        target: 'knowledge',
        label: 'requires_knowledge',
        color: isKnowledgeFilled ? '#A855F7' : 'rgba(168, 85, 247, 0.35)',
        isFilled: isKnowledgeFilled,
        animatedParticles: isKnowledgeFilled
      },
      // Profil -> Expérience
      {
        id: 'edge-profile-experience',
        source: 'profile',
        target: 'experience',
        label: 'composed_of',
        color: isExperienceFilled ? '#3B82F6' : 'rgba(59, 130, 246, 0.35)',
        isFilled: isExperienceFilled,
        animatedParticles: isExperienceFilled
      },
      // Expérience -> Compétences
      {
        id: 'edge-experience-skill',
        source: 'experience',
        target: 'skill',
        label: 'acquired_in',
        color: isSkillsFilled ? '#14B8A6' : 'rgba(20, 184, 166, 0.3)',
        isFilled: isSkillsFilled,
        animatedParticles: isSkillsFilled
      },
      // Compétences -> Métier Cible (Transfert & Matching)
      {
        id: 'edge-skill-target',
        source: 'skill',
        target: 'target_job',
        label: 'unlocks_horizon',
        color: isSkillsFilled && isTargetJobFilled ? domainMeta.color : 'rgba(245, 158, 11, 0.3)',
        isFilled: isSkillsFilled && isTargetJobFilled,
        animatedParticles: isSkillsFilled && isTargetJobFilled
      },
      // Profil -> Capacité Cognitive
      {
        id: 'edge-profile-capacity',
        source: 'profile',
        target: 'capacity',
        label: 'feeds_capacity',
        color: isCapacityFilled ? '#10B981' : 'rgba(16, 185, 129, 0.35)',
        isFilled: isCapacityFilled,
        animatedParticles: isCapacityFilled
      },
      // Profil -> Métier Cible
      {
        id: 'edge-profile-target',
        source: 'profile',
        target: 'target_job',
        label: 'visée vocationnelle',
        color: isTargetJobFilled ? domainMeta.color : 'rgba(245, 158, 11, 0.3)',
        isFilled: isTargetJobFilled,
        animatedParticles: isTargetJobFilled
      }
    ];

    // Arêtes pour les tâches satellites reliées à l'expérience
    missions.forEach((_, idx) => {
      list.push({
        id: `edge-exp-task-${idx}`,
        source: 'experience',
        target: `task-${idx}`,
        label: 'mission concrète',
        color: '#38BDF8',
        isFilled: true,
        animatedParticles: true
      });
    });

    return list;
  }, [isKnowledgeFilled, isExperienceFilled, isSkillsFilled, isCapacityFilled, isTargetJobFilled, missions, domainMeta.color]);

  // Arêtes pointillées des nœuds fantômes suggérés
  const ghostEdges = useMemo(() => {
    return ghostNodes.map((ghost) => {
      const parentNode = baseNodes.find(n => n.id === ghost.parentId);
      if (!parentNode) return null;

      return {
        id: `ghost-edge-${ghost.id}`,
        x1: parentNode.x,
        y1: parentNode.y,
        x2: ghost.x,
        y2: ghost.y,
        color: ghost.type === 'knowledge' ? '#A855F7' :
               ghost.type === 'experience_category' || ghost.type === 'mission' ? '#3B82F6' :
               ghost.type === 'skill' ? '#14B8A6' :
               ghost.type === 'capacity' ? '#10B981' : '#F59E0B'
      };
    }).filter(Boolean);
  }, [ghostNodes, baseNodes]);

  // Gestion du Pan & Drag du canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof SVGElement && e.target.dataset.nodeId) {
      setDraggingNodeId(e.target.dataset.nodeId);
      return;
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const svgRect = containerRef.current?.getBoundingClientRect();
      if (svgRect) {
        const svgX = (e.clientX - svgRect.left - pan.x) / zoom;
        const svgY = (e.clientY - svgRect.top - pan.y) / zoom;
        setCustomNodePositions(prev => ({
          ...prev,
          [draggingNodeId]: { x: Math.max(50, Math.min(950, svgX)), y: Math.max(50, Math.min(600, svgY)) }
        }));
      }
      return;
    }

    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingNodeId(null);
  };

  const handleNodeClick = (node: ObsidianGraphNode) => {
    if (node.type === 'task') {
      onSelectNode('experience');
    } else {
      onSelectNode(node.type as VolantNodeType);
    }
  };

  // Clic direct sur un nœud fantôme pré-lié en grisé
  const handleGhostClick = (ghost: GhostNodeItem) => {
    onAdoptGhostNode(ghost);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full bg-[#03050C] overflow-hidden select-none cursor-grab active:cursor-grabbing flex items-center justify-center"
    >
      {/* Halos d'ambiance cosmique Obsidian (Style Graphe des Métiers) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/5 rounded-full blur-[200px] pointer-events-none" />

      {/* SVG Principal du Graphe */}
      <svg
        viewBox="0 0 1000 650"
        className="w-full h-full max-h-[92vh] transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        <defs>
          {/* Grille neuronale Obsidian */}
          <pattern id="obsidian-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.8" fill="rgba(255,255,255,0.07)" />
          </pattern>

          <radialGradient id="obsidian-core-nebula" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5CC" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#03050C" stopOpacity="0" />
          </radialGradient>

          {/* Filtre de lueur intense pour nœuds actifs */}
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1000" height="650" fill="url(#obsidian-grid)" />
        <circle cx="500" cy="325" r="340" fill="url(#obsidian-core-nebula)" />

        {/* ================================================================ */}
        {/* REPRÉSENTATION DU STYLE GRAPHE DES MÉTIERS : ORBITES RADAR */}
        {/* ================================================================ */}
        {isTemplateDeployed && viewMode === 'orbital' && (
          <g className="metiers-orbital-guides opacity-70">
            {/* Lignes de visée en croix */}
            <line x1="120" y1="325" x2="880" y2="325" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="500" y1="60" x2="500" y2="590" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="4 4" strokeWidth="1" />

            {/* Orbite 1 : Expériences & Ancrage Réel */}
            <circle cx="500" cy="325" r="160" fill="none" stroke="rgba(59, 130, 246, 0.22)" strokeDasharray="5 5" strokeWidth="1.2" />
            <text x="500" y="172" textAnchor="middle" fill="#60A5FA" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">
              ORBITE 1 • ANCRAGE & EXPÉRIENCES VÉCUES
            </text>

            {/* Orbite 2 : Savoirs Conceptuels & Compétences */}
            <circle cx="500" cy="325" r="260" fill="none" stroke="rgba(168, 85, 247, 0.22)" strokeDasharray="6 6" strokeWidth="1.2" />
            <text x="500" y="73" textAnchor="middle" fill="#C084FC" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">
              ORBITE 2 • SAVOIRS FONDAMENTAUX & COMPÉTENCES
            </text>

            {/* Orbite 3 : Horizons Métiers ROME */}
            <circle cx="500" cy="325" r="360" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeDasharray="7 7" strokeWidth="1.2" />
            <text x="500" y="640" textAnchor="middle" fill="#FBBF24" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">
              ORBITE 3 • HORIZONS MÉTIERS & PROJECTIONS ROME
            </text>
          </g>
        )}

        {/* ================================================================ */}
        {/* ÉTAT 0 : GRAPHE VIDE AVEC BOUTON CENTRAL « CRÉER MON COMPTE » */}
        {/* ================================================================ */}
        {!isTemplateDeployed && (
          <g className="empty-graph-animation">
            {/* Cercles orbitaux lents en attente */}
            <circle
              cx="500" cy="325" r="190"
              fill="none"
              stroke="rgba(6, 182, 212, 0.18)"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              className="animate-spin"
              style={{ transformOrigin: "500px 325px", animationDuration: "40s" }}
            />
            <circle
              cx="500" cy="325" r="120"
              fill="none"
              stroke="rgba(6, 182, 212, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              className="animate-spin"
              style={{ transformOrigin: "500px 325px", animationDuration: "25s", animationDirection: "reverse" }}
            />
            <circle
              cx="500" cy="325" r="55"
              fill="rgba(6, 182, 212, 0.05)"
              stroke="rgba(6, 182, 212, 0.4)"
              strokeWidth="1.5"
              className="animate-pulse"
            />
          </g>
        )}

        {/* ================================================================ */}
        {/* ÉTAT DÉPLOYÉ : TOUS LES NŒUDS DU CONNECTOME + ARÊTES + NŒUDS GRISÉS */}
        {/* ================================================================ */}
        {isTemplateDeployed && (
          <>
            {/* 1. Synapses Principales / Arêtes */}
            <g className="edges-layer">
              {edges.map((edge) => {
                const srcNode = allNodes.find(n => n.id === edge.source);
                const tgtNode = allNodes.find(n => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const midX = (srcNode.x + tgtNode.x) / 2;
                const midY = (srcNode.y + tgtNode.y) / 2;

                return (
                  <g key={edge.id}>
                    {/* Arête principale */}
                    <line
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={edge.color}
                      strokeWidth={edge.isFilled ? 2.4 : 1.2}
                      strokeDasharray={edge.isFilled ? undefined : "4 4"}
                      strokeOpacity={edge.isFilled ? 0.9 : 0.45}
                    />

                    {/* Étiquette du lien synaptique */}
                    <rect
                      x={midX - 44}
                      y={midY - 8.5}
                      width="88"
                      height="17"
                      rx="8.5"
                      fill="#03050C"
                      stroke={edge.isFilled ? edge.color : "rgba(255,255,255,0.12)"}
                      strokeWidth="0.8"
                      strokeOpacity="0.75"
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      fill={edge.isFilled ? edge.color : "#94A3B8"}
                      fontSize="8.5"
                      fontFamily="monospace"
                      letterSpacing="0.03em"
                    >
                      {edge.label}
                    </text>

                    {/* Particule animée en transit synaptique */}
                    {edge.animatedParticles && (
                      <circle r="3" fill={edge.color}>
                        <animateMotion
                          path={`M ${srcNode.x} ${srcNode.y} L ${tgtNode.x} ${tgtNode.y}`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>

            {/* 2. Arêtes pointillées des Nœuds Fantômes Suggérés (Grisé) */}
            {showGhostSuggestions && (
              <g className="ghost-edges-layer">
                {ghostEdges.map((ge: any) => (
                  <line
                    key={ge.id}
                    x1={ge.x1}
                    y1={ge.y1}
                    x2={ge.x2}
                    y2={ge.y2}
                    stroke="rgba(148, 163, 184, 0.3)"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                ))}
              </g>
            )}

            {/* 3. Nœuds Fantômes Suggérés Pré-liés (EN GRISÉ - CLIQUABLES DIRECTEMENT) */}
            {showGhostSuggestions && (
              <g className="ghost-nodes-layer">
                {ghostNodes.map((ghost) => {
                  const isHovered = hoveredGhostNode?.id === ghost.id;

                  return (
                    <g
                      key={ghost.id}
                      onClick={() => handleGhostClick(ghost)}
                      onMouseEnter={() => setHoveredGhostNode(ghost)}
                      onMouseLeave={() => setHoveredGhostNode(null)}
                      className="cursor-pointer group"
                      style={{ transformOrigin: `${ghost.x}px ${ghost.y}px` }}
                    >
                      {/* Halo au survol du nœud fantôme */}
                      <circle
                        cx={ghost.x}
                        cy={ghost.y}
                        r={26}
                        fill="rgba(148, 163, 184, 0.15)"
                        className={isHovered ? "opacity-100 scale-110" : "opacity-40 group-hover:opacity-80"}
                        transition-all="true"
                      />

                      {/* Anneau pointillé en grisé */}
                      <circle
                        cx={ghost.x}
                        cy={ghost.y}
                        r={22}
                        fill="#0A0F1D"
                        stroke={isHovered ? "#38BDF8" : "rgba(148, 163, 184, 0.45)"}
                        strokeWidth="1.3"
                        strokeDasharray="4 3"
                        className="group-hover:scale-105 transition-all"
                      />

                      {/* Badge icône + ou Domaine ROME */}
                      {ghost.domainLetter ? (
                        <text
                          x={ghost.x}
                          y={ghost.y + 3.5}
                          textAnchor="middle"
                          fill={isHovered ? "#FBBF24" : "#94A3B8"}
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="700"
                        >
                          {ghost.domainLetter}
                        </text>
                      ) : (
                        <text
                          x={ghost.x}
                          y={ghost.y + 4}
                          textAnchor="middle"
                          fill={isHovered ? "#38BDF8" : "#94A3B8"}
                          fontSize="13"
                          fontFamily="sans-serif"
                          fontWeight="700"
                        >
                          +
                        </text>
                      )}

                      {/* Libellé du nœud suggéré en grisé */}
                      <rect
                        x={ghost.x - 55}
                        y={ghost.y + 26}
                        width="110"
                        height="16"
                        rx="8"
                        fill="#03050C"
                        stroke={isHovered ? "#38BDF8" : "rgba(148, 163, 184, 0.3)"}
                        strokeWidth="0.8"
                      />
                      <text
                        x={ghost.x}
                        y={ghost.y + 37.5}
                        textAnchor="middle"
                        fill={isHovered ? "#F8FAFC" : "rgba(203, 213, 225, 0.75)"}
                        fontSize="8.5"
                        fontFamily="sans-serif"
                        fontWeight="600"
                        className="pointer-events-none"
                      >
                        {ghost.label.length > 18 ? ghost.label.slice(0, 16) + '…' : ghost.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* 4. Nœuds Principaux du Connectome */}
            <g className="nodes-layer">
              {allNodes.map((node) => {
                const isActive = activeNode === node.type;

                return (
                  <g
                    key={node.id}
                    data-node-id={node.id}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer group"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  >
                    {/* Halo lumineux réactif (Style Graphe des Métiers) */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + (isActive ? 16 : 9)}
                      fill={node.glowColor}
                      className={isActive ? "animate-pulse" : "opacity-40 group-hover:opacity-100 transition-opacity"}
                    />

                    {/* Arc de compatibilité / matching (Style Graphe des Métiers) */}
                    {node.matchScore && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 5}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="2.5"
                        strokeDasharray={`${(node.matchScore / 100) * 2 * Math.PI * (node.radius + 5)} 300`}
                        className="transition-all duration-500"
                      />
                    )}

                    {/* Anneau extérieur du nœud */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + 3.5}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={isActive ? 2.5 : node.isFilled ? 1.6 : 1}
                      strokeDasharray={node.isFilled ? undefined : "5 4"}
                      className={node.id === 'profile' && !node.isFilled ? "animate-spin" : undefined}
                      style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "25s" }}
                    />

                    {/* Cœur du nœud */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={node.fillColor}
                      stroke={node.color}
                      strokeWidth={node.isFilled ? 2.2 : 1.2}
                      className="group-hover:scale-105 transition-transform"
                    />

                    {/* Badge Grand Domaine ROME pour le métier cible */}
                    {node.domainLetter && (
                      <g transform={`translate(${node.x - 14}, ${node.y - node.radius - 12})`}>
                        <rect width="28" height="15" rx="7.5" fill="#03050C" stroke={node.color} strokeWidth="1" />
                        <text x="14" y="11" textAnchor="middle" fill={node.color} fontSize="8.5" fontFamily="monospace" fontWeight="700">
                          {node.domainLetter}
                        </text>
                      </g>
                    )}

                    {/* Titre du nœud */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill={node.isFilled ? "#F8FAFC" : node.color}
                      fontSize={node.radius > 20 ? "11" : "8.5"}
                      fontFamily="sans-serif"
                      fontWeight="700"
                      className="pointer-events-none"
                    >
                      {node.label.length > 18 ? node.label.slice(0, 16) + '…' : node.label}
                    </text>

                    {/* Sous-titre ou statut sous le nœud */}
                    <text
                      x={node.x}
                      y={node.y + node.radius + 16}
                      textAnchor="middle"
                      fill={node.isFilled ? node.color : "#64748B"}
                      fontSize="9.5"
                      fontFamily="monospace"
                      className="pointer-events-none"
                    >
                      {node.sublabel.length > 24 ? node.sublabel.slice(0, 22) + '…' : node.sublabel}
                    </text>
                  </g>
                );
              })}
            </g>
          </>
        )}
      </svg>

      {/* ==================================================================== */}
      {/* CARTE CENTRALE FLOTTANTE POUR LE GRAPHE VIDE INITIAL */}
      {/* ==================================================================== */}
      {!isTemplateDeployed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-auto z-20">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl max-w-lg space-y-5 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center shadow-xl shadow-cyan-500/20">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                Graphe Initial Vierge • Style Graphe des Métiers
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">
                Tissez votre connectome en direct
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-sans">
                Cliquez sur le bouton ci-dessous pour ouvrir le volant interactif, voir les nœuds et les suggestions pré-liées en grisé apparaître et évoluer en temps réel sous vos yeux.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                id="btn-deploy-empty-graph"
                type="button"
                onClick={onDeployTemplate}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm font-mono transition-all shadow-xl shadow-cyan-500/30 hover:scale-[1.03] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>+ Créer mon compte</span>
              </button>

              <button
                type="button"
                onClick={onApplyFullPreset}
                className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Modèle complet BTP & VRD</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* INFOBULLE / TOOLTIP OBSIDIAN AU SURVOL D'UN NŒUD FANTÔME SUGGÉRÉ */}
      {/* ==================================================================== */}
      {hoveredGhostNode && (
        <div className="absolute bottom-16 right-6 z-30 p-3 rounded-2xl bg-slate-950/95 border border-cyan-500/50 shadow-2xl backdrop-blur-xl max-w-xs space-y-1.5 text-xs animate-in fade-in duration-150 pointer-events-none">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{hoveredGhostNode.label}</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-300 bg-cyan-950/40">
              {hoveredGhostNode.categoryTag || 'Suggéré'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300">{hoveredGhostNode.sublabel}</p>
          <div className="pt-1 text-[10px] font-mono text-cyan-400 flex items-center gap-1 font-semibold">
            <span>✨ Cliquez pour intégrer directement ce nœud au connectome !</span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* INFOBULLE / TOOLTIP AU SURVOL D'UN NŒUD PRINCIPAL */}
      {/* ==================================================================== */}
      {!hoveredGhostNode && hoveredNode && (
        <div className="absolute bottom-16 right-6 z-30 p-3 rounded-2xl bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl max-w-xs space-y-1 text-xs animate-in fade-in duration-150 pointer-events-none">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-100">{hoveredNode.label}</span>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
              style={{ color: hoveredNode.color, borderColor: hoveredNode.color }}
            >
              {hoveredNode.type}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{hoveredNode.sublabel}</p>
          <div className="pt-1 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Synapse : {hoveredNode.synapseRole}</span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* BARRE D'OUTILS SUPÉRIEURE : VUES DU GRAPHE DES MÉTIERS & SUGGESTIONS */}
      {/* ==================================================================== */}
      {isTemplateDeployed && (
        <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
          {/* Toggle pour afficher ou masquer les nœuds pré-liés suggérés en grisé */}
          <button
            type="button"
            onClick={() => setShowGhostSuggestions(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg backdrop-blur-md ${
              showGhostSuggestions
                ? 'bg-slate-900/90 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Afficher/Masquer les nœuds pré-liés suggérés en grisé"
          >
            {showGhostSuggestions ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Nœuds pré-liés ({ghostNodes.length} grisés)</span>
          </button>

          {/* Sélecteur de vue : Connectome / Orbital Métiers */}
          <div className="flex bg-slate-950/90 p-1 rounded-xl border border-slate-800 backdrop-blur-md text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setViewMode('orbital')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'orbital'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Orbit className="w-3 h-3" />
              <span>Orbite Métiers</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('connectome')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'connectome'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3 h-3" />
              <span>Connectome 2D</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* COMMANDES DE ZOOM ET RECENTRAGE DU GRAPHE OBSIDIAN */}
      {/* ==================================================================== */}
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-xl border border-slate-800/90 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          title="Dézoomer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-mono text-slate-400 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={() => setZoom(prev => Math.min(1.8, prev + 0.15))}
          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          title="Zoomer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
            setCustomNodePositions({});
          }}
          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 flex items-center justify-center cursor-pointer transition-colors"
          title="Réinitialiser vue et positions"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
