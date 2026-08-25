import React from 'react';
import { BookOpen, FlaskConical, Library } from 'lucide-react';
import { RelatedBundle } from '../../data/savoirsLinks';

export const NodeRelated: React.FC<{
  related: RelatedBundle;
  onOpenPoster?: (id: string) => void;
  onOpenRef?: (id: string) => void;
  tone?: 'light' | 'dark';
}> = ({ related, onOpenPoster, onOpenRef, tone = 'light' }) => {
  const empty = !related.posters.length && !related.works.length && !related.sources.length && !related.citations.length;
  if (empty) return null;
  const chip = tone === 'dark' ? 'bg-white/10 text-amber-100 border-white/10' : 'bg-slate-100 text-slate-800 border-slate-200';
  const title = tone === 'dark' ? 'text-zinc-400' : 'text-slate-400';

  return (
    <div className="space-y-3 pt-2">
      {related.posters.length > 0 && (
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${title}`}>
            <FlaskConical className="w-3 h-3" /> Poster relié
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {related.posters.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => onOpenPoster?.(p.id)} className={`text-[11px] font-semibold px-2 py-1 rounded-lg border ${chip}`}>
                  {p.paradigme}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {(related.works.length > 0 || related.sources.length > 0) && (
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${title}`}>
            <Library className="w-3 h-3" /> Documents de référence
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {related.works.map((w) => (
              <li key={w.id}>
                <button type="button" onClick={() => onOpenRef?.(w.id)} className={`text-[11px] font-semibold px-2 py-1 rounded-lg border ${chip}`}>
                  {w.titre}
                </button>
              </li>
            ))}
            {related.sources.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => onOpenRef?.(s.id)} className={`text-[11px] font-semibold px-2 py-1 rounded-lg border ${chip}`}>
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {related.citations.length > 0 && (
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${title}`}>
            <BookOpen className="w-3 h-3" /> Citations
          </p>
          <ul className="space-y-1">
            {related.citations.map((c) => (
              <li key={c.id} className={tone === 'dark' ? 'text-[11px] text-zinc-300' : 'text-[11px] text-slate-600'}>
                {c.authors} ({c.year}). <em>{c.title}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
