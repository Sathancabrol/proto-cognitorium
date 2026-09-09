import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CognitoriumErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CognitoriumErrorBoundary a intercepté une erreur :", error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="cognitorium-error-boundary" className="min-h-[400px] flex items-center justify-center p-6 bg-slate-900/90 rounded-3xl border border-red-500/30 text-white shadow-2xl m-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                {this.props.fallbackTitle || "Récupération sécurisée du profil"}
              </h3>
              <p className="text-xs text-slate-400">
                Un incident d'affichage temporaire a été intercepté. Vos données sont préservées.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-left overflow-x-auto">
                <p className="text-[11px] font-mono text-red-300">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Réinitialiser la vue</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
