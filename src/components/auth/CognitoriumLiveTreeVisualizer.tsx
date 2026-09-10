import React, { useState, useMemo } from 'react';
import { 
  AnyCognitiveNode, 
  GraphEdge, 
  NodeCategory 
} from '../../types';
import { 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  GitBranch, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

interface CognitoriumLiveTreeVisualizerProps {
  nodes: AnyCognitiveNode[];
  edges: GraphEdge[];
  highlightNodeId?: string | null;
  onNodeClick?: (node: AnyCognitiveNode) => void;
  title?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  profile: { bg: '#06B6D4', border: '#22D3EE', glow: 'rgba(6, 182, 212, 0.4)', text: '#083344' },
  experience: { bg: '#3B82F6', border: '#60A5FA', glow: 'rgba(59, 130, 246, 0.4)', text: '#172554' },
  formation: { bg: '#6366F1', border: '#818CF8', glow: 'rgba(99, 102, 241, 0.4)', text: '#1E1B4B' },
  task: { bg: '#64748B', border: '#94A3B8', glow: 'rgba(100, 116, 139, 0.3)', text: '#0F172A' },
  skill_tech: { bg: '#00E5CC', border: '#5EEAD4', glow: 'rgba(0, 229, 204, 0.5)', text: '#042F2E' },
  skill_relational: { bg: '#A855F7', border: '#C084FC', glow: 'rgba(168, 85, 247, 0.4)', text: '#3B0764' },
  skill_transversal: { bg: '#F59E0B', border: '#FBBF24', glow: 'rgba(245, 158, 11, 0.4)', text: '#451A03' },
  capacity_cognitive: { bg: '#10B981', border: '#34D399', glow: 'rgba(16, 185, 129, 0.4)', text: '#022C22' },
  horizon_job: { bg: '#EAB308', border: '#FDE047', glow: 'rgba(234, 179, 8, 0.5)', text: '#422006' },
  knowledge: { bg: '#EC4899', border: '#F472B6', glow: 'rgba(236, 72, 153, 0.4)', text: '#500724' }
};

export const CognitoriumLiveTreeVisualizer: React.FC<CognitoriumLiveTreeVisualizerProps> = ({
  nodes,
  edges,
  highlightNodeId,
  onNodeClick,
  title = "Connectome Cognitif en Temps Réel"
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<AnyCognitiveNode | null>(null);

  // Positionnement automatique radial / hiérarchique dynamique
  const layoutNodes = useMemo(() => {
    const width = 600;
    const height = 460;
    const centerX = width / 2;
    const centerY = height / 2;

    // Regrouper les nœuds par rôle
    const profileNode = nodes.find(n => n.id === 'user-root' || n.category === 'profile' as any);
    const expNodes = nodes.filter(n => n.category === 'experience' || n.category === 'formation');
    const taskNodes = nodes.filter(n => n.category === 'task');
    const skillNodes = nodes.filter(n => n.category.startsWith('skill_'));
    const capacityNodes = nodes.filter(n => n.category === 'capacity_cognitive');
    const horizonNodes = nodes.filter(n => n.category === 'horizon_job');

    const positions: Record<string, { x: number; y: number; r: number }> = {};

    // 1. Racine Profil au centre
    if (profileNode) {
      positions[profileNode.id] = { x: centerX, y: centerY, r: 26 };
    }

    // 2. Expériences autour à gauche / bas
    expNodes.forEach((exp, idx) => {
      const angle = Math.PI * 0.75 + (idx * 0.4);
      const dist = profileNode ? 120 : 80;
      positions[exp.id] = {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        r: 18
      };
    });

    // 3. Tâches reliées aux expériences
    taskNodes.forEach((task, idx) => {
      const angle = Math.PI * 0.9 + (idx * 0.35);
      const dist = profileNode ? 190 : 150;
      positions[task.id] = {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        r: 12
      };
    });

    // 4. Compétences rayonnant vers le haut / droite
    skillNodes.forEach((skill, idx) => {
      const total = Math.max(1, skillNodes.length);
      const startAngle = -Math.PI * 0.4;
      const endAngle = Math.PI * 0.35;
      const angle = startAngle + (idx / Math.max(1, total - 1)) * (endAngle - startAngle);
      const dist = (profileNode ? 135 : 100) + (idx % 2 === 0 ? 0 : 35);
      positions[skill.id] = {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        r: 15
      };
    });

    // 5. Capacités cognitives au sommet
    capacityNodes.forEach((cap, idx) => {
      const angle = -Math.PI * 0.5 + (idx - (capacityNodes.length - 1) / 2) * 0.35;
      const dist = profileNode ? 195 : 150;
      positions[cap.id] = {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        r: 16
      };
    });

    // 6. Horizon Job (Métier cible)
    horizonNodes.forEach((hor, idx) => {
      const angle = -Math.PI * 0.15 + (idx * 0.3);
      const dist = profileNode ? 180 : 120;
      positions[hor.id] = {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        r: 20
      };
    });

    return positions;
  }, [nodes]);

  const handleNodeSelect = (node: AnyCognitiveNode) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#070913] border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none">
      {/* Halos d'ambiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-600/10 rounded-full blur-[70px] pointer-events-none" />

      {/* Header du visualiseur */}
      <div className="relative z-10 px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
            {title}
          </span>
        </div>

        {/* Compteurs dynamiques */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            {nodes.length} Nœuds
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300">
            {edges.length} Connexions
          </span>

          {/* Contrôles zoom */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoom(z => Math.max(0.7, z - 0.15))}
              className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
              title="Zoom arrière"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
              title="Réinitialiser le zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(z => Math.min(1.4, z + 0.15))}
              className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
              title="Zoom avant"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Surface SVG Interactive */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox="0 0 600 460"
          className="w-full h-full max-h-[420px] transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Grille neuronale en arrière plan */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="0.8" fill="rgba(255,255,255,0.06)" />
            </pattern>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5CC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          <rect width="600" height="460" fill="url(#grid)" />

          {/* État Vierge : Aucun nœud encore renseigné */}
          {nodes.length === 0 && (
            <g className="empty-state">
              {/* Cercles d'attente d'initialisation */}
              <circle
                cx="300"
                cy="230"
                r="60"
                fill="none"
                stroke="rgba(6, 182, 212, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                className="animate-spin"
                style={{ transformOrigin: "300px 230px", animationDuration: "18s" }}
              />
              <circle
                cx="300"
                cy="230"
                r="38"
                fill="rgba(6, 182, 212, 0.05)"
                stroke="rgba(6, 182, 212, 0.4)"
                strokeWidth="2"
              />
              <circle
                cx="300"
                cy="230"
                r="10"
                fill="rgba(6, 182, 212, 0.2)"
                className="animate-ping"
              />
              <text
                x="300"
                y="226"
                textAnchor="middle"
                fill="#22D3EE"
                fontSize="18"
                className="select-none"
              >
                ✦
              </text>

              <text
                x="300"
                y="325"
                textAnchor="middle"
                fill="#E2E8F0"
                fontSize="14"
                fontFamily="sans-serif"
                fontWeight="700"
                className="select-none"
              >
                Connectome en attente
              </text>
              <text
                x="300"
                y="348"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
                fontFamily="sans-serif"
                className="select-none"
              >
                Saisissez votre prénom ou choisissez un métier cible
              </text>
              <text
                x="300"
                y="366"
                textAnchor="middle"
                fill="#06B6D4"
                fontSize="10.5"
                fontFamily="monospace"
                className="select-none"
              >
                Le premier nœud apparaîtra ici en temps réel
              </text>
            </g>
          )}

          {/* Arêtes / Synapses */}
          <g className="edges">
            {edges.map(edge => {
              const src = layoutNodes[edge.source];
              const tgt = layoutNodes[edge.target];
              if (!src || !tgt) return null;

              const isHighlighted = edge.source === highlightNodeId || edge.target === highlightNodeId;

              return (
                <g key={edge.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isHighlighted ? "#00E5CC" : "rgba(100, 116, 139, 0.35)"}
                    strokeWidth={isHighlighted ? 2.5 : 1.4}
                    strokeDasharray={edge.type === 'composed_of' ? '3 3' : undefined}
                    className="transition-all duration-300"
                  />
                  {/* Particule d'énergie pulsante le long de l'arête */}
                  <circle
                    r="2"
                    fill="#00E5CC"
                    className="animate-ping"
                    style={{
                      cx: (src.x + tgt.x) / 2,
                      cy: (src.y + tgt.y) / 2,
                      opacity: 0.7
                    }}
                  />
                </g>
              );
            })}
          </g>

          {/* Nœuds interactifs */}
          <g className="nodes">
            {nodes.map(node => {
              const pos = layoutNodes[node.id];
              if (!pos) return null;

              const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.skill_tech;
              const isSelected = selectedNode?.id === node.id || highlightNodeId === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-transform duration-200 hover:scale-110"
                  onClick={() => handleNodeSelect(node)}
                >
                  {/* Halo de sélection */}
                  {isSelected && (
                    <circle
                      r={pos.r + 8}
                      fill="none"
                      stroke={colors.border}
                      strokeWidth="2"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Corps du nœud */}
                  <circle
                    r={pos.r}
                    fill={colors.bg}
                    stroke={colors.border}
                    strokeWidth="2"
                    style={{
                      filter: `drop-shadow(0 0 10px ${colors.glow})`
                    }}
                  />

                  {/* Symbole ou centre */}
                  <circle r={pos.r * 0.35} fill={colors.text} />

                  {/* Libellé sous le nœud */}
                  <text
                    y={pos.r + 13}
                    textAnchor="middle"
                    fill="#E2E8F0"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="600"
                    className="pointer-events-none drop-shadow-md select-none"
                  >
                    {node.name.length > 20 ? node.name.slice(0, 18) + '…' : node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Fiche d'information du nœud sélectionné en bas */}
      <div className="relative z-10 px-5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        {selectedNode ? (
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[selectedNode.category]?.border || '#00E5CC' }} />
            <span className="font-bold truncate max-w-[280px]">{selectedNode.name}</span>
            <span className="text-[10px] text-slate-400">({selectedNode.category})</span>
          </div>
        ) : nodes.length === 0 ? (
          <div className="text-[11px] text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Connectome vierge • Tapez votre nom ou choisissez un métier pour débuter</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cliquez sur un nœud pour observer ses ramifications</span>
          </div>
        )}

        <div className="text-[10px] text-slate-500">
          Modèle Zéro Hallucination
        </div>
      </div>
    </div>
  );
};
