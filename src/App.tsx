import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { NetworkGraph } from './components/NetworkGraph';
import { DecayTimeline } from './components/DecayTimeline';
import { HorizonsBridge } from './components/HorizonsBridge';
import { CognitiveSignature } from './components/CognitiveSignature';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { ExperienceDistillerModal } from './components/ExperienceDistillerModal';
import { INITIAL_COGNITORIUM_PROFILE } from './data/initialData';
import { CognitiveProfile, AnyCognitiveNode, GraphEdge, SkillNode, HorizonJobNode } from './types';

const STORAGE_KEY = 'cognitorium_active_profile_v3_nathan';

export default function App() {
  const [profile, setProfile] = useState<CognitiveProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Erreur chargement profil sauvegardé:", e);
    }
    return INITIAL_COGNITORIUM_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('network');
  const [simulationYear, setSimulationYear] = useState<number>(2026);
  const [selectedNode, setSelectedNode] = useState<AnyCognitiveNode | null>(null);
  const [isDistillerOpen, setIsDistillerOpen] = useState<boolean>(false);

  // Persist profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Impossible de persister le profil:", e);
    }
  }, [profile]);

  const handleSelectNode = (node: AnyCognitiveNode | null) => {
    setSelectedNode(node);
  };

  const handleSelectNodeById = (nodeId: string) => {
    const found = profile.nodes.find((n) => n.id === nodeId);
    if (found) {
      setSelectedNode(found);
    }
  };

  const handleReactivateSkill = (skillId: string) => {
    setProfile((prev) => {
      const updatedNodes = prev.nodes.map((node) => {
        if (node.id === skillId && node.category.startsWith('skill_')) {
          const skill = node as SkillNode;
          return {
            ...skill,
            lastPracticedYear: simulationYear,
            isReactivated: true
          };
        }
        return node;
      });

      return {
        ...prev,
        nodes: updatedNodes
      };
    });

    if (selectedNode && selectedNode.id === skillId) {
      setSelectedNode((prev: any) => ({
        ...prev,
        lastPracticedYear: simulationYear,
        isReactivated: true
      }));
    }
  };

  const handleAddHorizon = (newHorizon: HorizonJobNode) => {
    setProfile((prev) => {
      // Check if already present
      if (prev.nodes.some((n) => n.name.toLowerCase() === newHorizon.name.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        nodes: [...prev.nodes, newHorizon]
      };
    });
  };

  const handleDistillComplete = (newNodes: AnyCognitiveNode[], newEdges: GraphEdge[]) => {
    setProfile((prev) => ({
      ...prev,
      nodes: [...prev.nodes, ...newNodes],
      edges: [...prev.edges, ...newEdges]
    }));
  };

  const handleResetToDemo = () => {
    if (window.confirm("Réinitialiser avec le profil complet (Chantier VRD, Russe B2/B1, SIG & Horizons) ?")) {
      setProfile(INITIAL_COGNITORIUM_PROFILE);
      setSimulationYear(2026);
      setSelectedNode(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        simulationYear={simulationYear}
        onOpenDistiller={() => setIsDistillerOpen(true)}
        onResetToDemo={handleResetToDemo}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: DYNAMIC NETWORK GRAPH */}
        {activeTab === 'network' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Cartographie Dynamique du Réseau Cognitif
                </h1>
                <p className="text-xs text-slate-500">
                  Traçabilité continue : Expériences & Projets → Compétences décomposées → Capacités cognitives méta → Horizons accessibles
                </p>
              </div>

              <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{profile.nodes.length} nœuds interconnectés</span>
                <span className="text-slate-300">•</span>
                <span>{profile.edges.length} passerelles actives</span>
              </div>
            </div>

            <NetworkGraph
              nodes={profile.nodes}
              edges={profile.edges}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={handleSelectNode}
              simulationYear={simulationYear}
              onAddExperienceClick={() => setIsDistillerOpen(true)}
            />
          </div>
        )}

        {/* VIEW 2: DECAY TIMELINE & REACTIVATION */}
        {activeTab === 'decay' && (
          <DecayTimeline
            nodes={profile.nodes}
            simulationYear={simulationYear}
            onYearChange={setSimulationYear}
            onReactivateSkill={handleReactivateSkill}
            onSelectNode={setSelectedNode}
          />
        )}

        {/* VIEW 3: HORIZONS & BRIDGES EXPLORER */}
        {activeTab === 'horizons' && (
          <HorizonsBridge
            nodes={profile.nodes}
            onSelectNode={setSelectedNode}
            onAddHorizon={handleAddHorizon}
          />
        )}

        {/* VIEW 4: COGNITIVE SIGNATURE & PASSPORT */}
        {activeTab === 'signature' && (
          <CognitiveSignature
            profile={profile}
            simulationYear={simulationYear}
          />
        )}
      </main>

      {/* Slide-out Node Inspector Drawer */}
      <NodeInspectorModal
        node={selectedNode}
        allNodes={profile.nodes}
        edges={profile.edges}
        simulationYear={simulationYear}
        onClose={() => setSelectedNode(null)}
        onSelectNodeById={handleSelectNodeById}
        onReactivateSkill={handleReactivateSkill}
      />

      {/* AI Experience Distiller Modal */}
      <ExperienceDistillerModal
        isOpen={isDistillerOpen}
        onClose={() => setIsDistillerOpen(false)}
        onDistillComplete={handleDistillComplete}
      />
    </div>
  );
}
