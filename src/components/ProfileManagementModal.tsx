import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  FileCheck, 
  ShieldCheck, 
  Sparkles, 
  X, 
  AlertCircle, 
  Calculator, 
  Database,
  CheckCircle2,
  HardDrive,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { CognitiveProfile } from '../types';
import { INITIAL_COGNITORIUM_PROFILE } from '../data/initialData';

interface ProfileManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CognitiveProfile;
  onImportProfile: (importedProfile: CognitiveProfile) => void;
}

export const ProfileManagementModal: React.FC<ProfileManagementModalProps> = ({
  isOpen,
  onClose,
  profile,
  onImportProfile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // État de prévisualisation pour confirmation d'import
  const [pendingImportProfile, setPendingImportProfile] = useState<CognitiveProfile | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  // Export JSON (.cognitorium)
  const handleExportJson = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = profile.personName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `cognitorium_backup_${safeName}_${dateStr}.cognitorium`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Lecture du fichier sélectionné
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as CognitiveProfile;

        // Validation minimale
        if (!parsed.id || !parsed.personName || !Array.isArray(parsed.nodes)) {
          throw new Error('Le fichier sélectionné ne respecte pas la structure d’un profil Cognitorium valide.');
        }

        // On active la prévisualisation pour confirmation
        setPendingImportProfile(parsed);
      } catch (err: any) {
        setImportError(err.message || 'Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
    // Reset de l'input pour permettre de re-sélectionner le même fichier si besoin
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImportProfile) return;
    onImportProfile(pendingImportProfile);
    setImportSuccess(`Profil "${pendingImportProfile.personName}" importé avec succès (${pendingImportProfile.nodes.length} nœuds) !`);
    setPendingImportProfile(null);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleConfirmReset = () => {
    onImportProfile(INITIAL_COGNITORIUM_PROFILE);
    setImportSuccess(`Le profil a été réinitialisé à son état d’origine (${INITIAL_COGNITORIUM_PROFILE.personName}).`);
    setShowResetConfirm(false);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Calcul métriques du profil actif
  const totalNodes = profile.nodes?.length || 0;
  const verifiedNodes = (profile.nodes || []).filter((n) => n.verificationStatus === 'verified').length;
  const verifiedPercentage = totalNodes > 0 ? Math.round((verifiedNodes / totalNodes) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="profile-management-modal"
        className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Gestion & Sauvegarde du Profil
              </h2>
              <p className="text-xs text-slate-400">
                Souveraineté des données, import/export sécurisé et explicabilité du scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps déroulant */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Messages de feedback */}
          {importError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {importSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {/* Boîte de confirmation d'écrasement lors d'un import */}
          {pendingImportProfile && (
            <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Confirmation d'importation de sauvegarde</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                Vous êtes sur le point de charger le profil de <strong>{pendingImportProfile.personName}</strong> ({pendingImportProfile.nodes?.length || 0} nœuds, {pendingImportProfile.projects?.length || 0} projets). Cette opération remplacera les données de votre session actuelle.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setPendingImportProfile(null)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-amber-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Confirmer et charger ce profil
                </button>
              </div>
            </div>
          )}

          {/* Boîte de confirmation de réinitialisation usine */}
          {showResetConfirm && (
            <div className="p-5 bg-red-50 border-2 border-red-300 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Réinitialiser aux valeurs d’origine ?</span>
              </div>
              <p className="text-xs text-red-950 leading-relaxed">
                Toutes vos modifications de session (nouveaux nœuds, évaluations, projets) seront réinitialisées pour charger le profil de référence d'origine Nathan Cabrol.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-red-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
                >
                  Réinitialiser le profil
                </button>
              </div>
            </div>
          )}

          {/* Section 1 : Export & Import */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Carte Export */}
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                  <Download className="w-4 h-4" />
                  <span>Sauvegarder mon profil</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Export .cognitorium
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Téléchargez l'intégralité de vos nœuds, preuves, projets et évaluations dans un fichier portable.
                </p>
              </div>

              <button
                onClick={handleExportJson}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger la sauvegarde</span>
              </button>
            </div>

            {/* Carte Import */}
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                  <Upload className="w-4 h-4" />
                  <span>Restaurer une sauvegarde</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Importer un fichier
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Chargez un fichier <code className="font-mono text-[11px] bg-slate-200/80 px-1 rounded">.cognitorium</code> ou <code className="font-mono text-[11px] bg-slate-200/80 px-1 rounded">.json</code> pour restaurer vos données.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json,.cognitorium"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Sélectionner un fichier</span>
              </button>
            </div>
          </div>

          {/* Section 2 : Explicabilité de la formule de confiance */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Transparence du Scoring & Échelle de Preuve
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-50 text-violet-700 font-bold">
                Décision n°1 / Spécification officielle
              </span>
            </div>

            <div className="p-3 bg-violet-50/50 border border-violet-100 rounded-xl text-xs font-mono text-violet-900 text-center">
              Score = Niveau Estimé × Indice de Confiance
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Pour éviter toute fausse précision ou surévaluation algorithmique, chaque compétence est pondérée selon la nature vérifiable de ses sources :
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block">Diplôme d’État</span>
                <span className="text-emerald-600 font-mono font-bold">Pondération 0,9</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block">Projet Professionnel</span>
                <span className="text-blue-600 font-mono font-bold">Pondération 0,8</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block">Expérience Terrain</span>
                <span className="text-blue-600 font-mono font-bold">Pondération 0,7</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block">Certification / TOSA</span>
                <span className="text-amber-600 font-mono font-bold">Pondération 0,6</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block">Auto-déclaration</span>
                <span className="text-slate-500 font-mono font-bold">Pondération 0,3</span>
              </div>
              <div className="p-2 rounded-xl bg-red-50 border border-red-100">
                <span className="font-bold text-red-900 block">Sans preuve vérifiée</span>
                <span className="text-red-600 font-mono font-bold">Plafond : 40 pts (0,2)</span>
              </div>
            </div>
          </div>

          {/* Section 3 : État du profil actif & Réinitialisation */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <HardDrive className="w-4 h-4 text-slate-400" />
              <span>Profil actif : <strong>{profile.personName}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-bold">{verifiedPercentage}% vérifiés</span>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 transition-colors font-medium self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser aux valeurs d'origine</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
