import React, { useEffect, useMemo, useRef, useState } from 'react';

const btn = 'px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20';
const primary = 'px-4 py-2 rounded-xl bg-amber-400 text-slate-900 text-xs font-bold';

function median(xs: number[]) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

export const StroopDemo: React.FC = () => {
  const palette = [
    { word: 'ROUGE', ink: '#ef4444', name: 'rouge' },
    { word: 'BLEU', ink: '#3b82f6', name: 'bleu' },
    { word: 'VERT', ink: '#22c55e', name: 'vert' },
    { word: 'JAUNE', ink: '#eab308', name: 'jaune' }
  ];
  const makeTrial = (kind: 'congruent' | 'incongruent' | 'neutre') => {
    const ink = palette[Math.floor(Math.random() * palette.length)];
    if (kind === 'neutre') return { word: 'XXXX', color: ink.ink, name: ink.name, kind };
    if (kind === 'congruent') return { word: ink.word, color: ink.ink, name: ink.name, kind };
    const other = palette.filter((p) => p.name !== ink.name)[Math.floor(Math.random() * 3)];
    return { word: other.word, color: ink.ink, name: ink.name, kind };
  };
  const [trial, setTrial] = useState(() => makeTrial('congruent'));
  const [t0, setT0] = useState(() => performance.now());
  const [log, setLog] = useState<{ kind: string; ms: number; ok: boolean }[]>([]);

  const stats = useMemo(() => {
    const by = (k: string) => log.filter((x) => x.kind === k && x.ok).map((x) => x.ms);
    const c = median(by('congruent'));
    const i = median(by('incongruent'));
    const err = log.length ? Math.round((100 * log.filter((x) => !x.ok).length) / log.length) : 0;
    return { c, i, score: i && c ? i - c : 0, n: log.length, err };
  }, [log]);

  const next = (kind?: 'congruent' | 'incongruent' | 'neutre') => {
    const k = kind ?? (['congruent', 'incongruent', 'neutre'] as const)[Math.floor(Math.random() * 3)];
    setTrial(makeTrial(k));
    setT0(performance.now());
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">
        Nomme la <strong className="text-white">couleur d’encre</strong>. VI : congruence (congruent / incongruent / neutre).
      </p>
      <div className="rounded-2xl bg-black/50 py-10 text-center">
        <div className="text-5xl font-black tracking-widest" style={{ color: trial.color }}>
          {trial.word}
        </div>
        <div className="text-[10px] text-slate-500 mt-3">{trial.kind}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {palette.map((p) => (
          <button
            key={p.name}
            type="button"
            className={btn}
            onClick={() => {
              setLog((prev) => [...prev, { kind: trial.kind, ms: Math.round(performance.now() - t0), ok: p.name === trial.name }]);
              next();
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
      {stats.n > 0 && (
        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
          <div className="rounded-xl bg-white/5 p-2">n={stats.n}</div>
          <div className="rounded-xl bg-white/5 p-2">RT cong. {stats.c} ms</div>
          <div className="rounded-xl bg-white/5 p-2">RT inc. {stats.i} ms</div>
          <div className="rounded-xl bg-white/5 p-2 text-amber-300">Stroop {stats.score} ms · err {stats.err}%</div>
        </div>
      )}
    </div>
  );
};

export const GorillaDemo: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'free' | null>(null);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [passes, setPasses] = useState(0);
  const [seen, setSeen] = useState<boolean | null>(null);
  const [gorillaOn, setGorillaOn] = useState(false);
  const [done, setDone] = useState(false);
  const targetPasses = 8;

  useEffect(() => {
    if (!running) return;
    const pass = window.setInterval(() => setPasses((p) => p + 1), 700);
    const gOn = window.setTimeout(() => setGorillaOn(true), 2200);
    const gOff = window.setTimeout(() => setGorillaOn(false), 4200);
    const end = window.setTimeout(() => {
      setRunning(false);
      setDone(true);
    }, 6500);
    return () => {
      clearInterval(pass);
      clearTimeout(gOn);
      clearTimeout(gOff);
      clearTimeout(end);
    };
  }, [running]);

  if (!mode) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-400">Consigne attentionnelle (VI, inter-sujets). Choisis avant de lancer — une seule fois si tu es naïf.</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={primary} onClick={() => { setMode('focus'); setRunning(true); }}>
            Compter les passes blanches
          </button>
          <button type="button" className={btn} onClick={() => { setMode('free'); setRunning(true); }}>
            Observer librement
          </button>
        </div>
      </div>
    );
  }

  if (done && seen === null) {
    return (
      <div className="space-y-3">
        {mode === 'focus' && (
          <p className="text-xs text-slate-300">Combien de passes as-tu comptées ? (réel ≈ {Math.min(passes, targetPasses)})</p>
        )}
        {mode === 'focus' && (
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-24 bg-white/10 rounded-lg px-2 py-1 text-sm" />
        )}
        <p className="text-sm font-semibold">As-tu remarqué quelque chose d’inhabituel ?</p>
        <div className="flex gap-2">
          <button type="button" className={primary} onClick={() => setSeen(true)}>Oui</button>
          <button type="button" className={btn} onClick={() => setSeen(false)}>Non</button>
        </div>
      </div>
    );
  }

  if (seen !== null) {
    return (
      <div className="space-y-2 text-xs text-slate-300">
        <p>
          Un « gorille » (forme sombre) a traversé la scène. Tu as répondu : <strong>{seen ? 'oui' : 'non'}</strong>.
        </p>
        <p className="text-slate-400">
          En condition focalisée, une part notable des observateurs naïfs ne le détecte pas. Connaître le paradigme annule l’effet.
        </p>
        <button type="button" className={btn} onClick={() => { setMode(null); setSeen(null); setDone(false); setPasses(0); setGorillaOn(false); }}>
          Rejouer (plus naïf)
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-48 rounded-2xl bg-emerald-950 overflow-hidden border border-white/10">
      <div className="absolute inset-0 flex items-center justify-between px-8">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-8 h-8 rounded-full bg-white animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
        ))}
      </div>
      {gorillaOn && (
        <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-600 animate-[pulse_0.6s_linear_infinite]" style={{ left: '40%' }} />
      )}
      <div className="absolute bottom-2 left-3 text-[10px] text-white/70">
        {mode === 'focus' ? `Passes : clique mentalement · t=${passes}` : 'Observation libre'}
      </div>
    </div>
  );
};

export const ChangeDemo: React.FC = () => {
  const [showB, setShowB] = useState(false);
  const [flash, setFlash] = useState(false);
  const [found, setFound] = useState(false);
  const [t0] = useState(() => performance.now());
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setFlash(true);
      window.setTimeout(() => {
        setFlash(false);
        setShowB((v) => !v);
      }, 100);
    };
    const id = window.setInterval(tick, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Clique l’élément qui change (A/B + flash 100 ms). Un seul détail mute.</p>
      <button
        type="button"
        className="relative w-full h-44 rounded-2xl bg-sky-900 overflow-hidden text-left"
        onClick={() => {
          if (found) return;
          setFound(true);
          setMs(Math.round(performance.now() - t0));
        }}
      >
        {flash && <div className="absolute inset-0 bg-white z-10" />}
        <div className="absolute left-6 top-8 w-16 h-10 bg-amber-700 rounded-sm" />
        <div className="absolute left-28 top-10 w-20 h-8 bg-slate-400 rounded-sm" />
        <div className={`absolute right-10 top-6 w-8 h-8 rounded-full transition-colors ${showB ? 'bg-rose-400' : 'bg-yellow-300'}`} />
        <div className="absolute bottom-4 left-10 right-10 h-3 bg-emerald-700/80 rounded-full" />
        <div className="absolute bottom-8 right-16 w-10 h-14 bg-slate-700" />
      </button>
      {found ? (
        <p className="text-xs text-emerald-300">Le soleil / lune (disque à droite) changeait de couleur. Détection en {ms} ms d’observation.</p>
      ) : (
        <p className="text-[11px] text-slate-500">Les changements périphériques après interruption sont souvent lents à détecter.</p>
      )}
    </div>
  );
};

const LETTERS = 'ABCDEFGHJKLMNPRSTUVXYZ';
function randLetters(n: number) {
  return Array.from({ length: n }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]);
}

export const SperlingDemo: React.FC = () => {
  const [delay, setDelay] = useState(0);
  const [mode, setMode] = useState<'total' | 'partiel'>('partiel');
  const [phase, setPhase] = useState<'idle' | 'show' | 'cue' | 'recall'>('idle');
  const [grid, setGrid] = useState<string[][]>([[], [], []]);
  const [row, setRow] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState<number | null>(null);

  const start = () => {
    const g = [randLetters(4), randLetters(4), randLetters(4)];
    const r = Math.floor(Math.random() * 3);
    setGrid(g);
    setRow(r);
    setAnswer('');
    setScore(null);
    setPhase('show');
    window.setTimeout(() => {
      setPhase('cue');
      window.setTimeout(() => setPhase('recall'), delay);
    }, 80);
  };

  const target = mode === 'total' ? grid.flat().join('') : (grid[row] || []).join('');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-[11px]">
        <button type="button" className={mode === 'total' ? primary : btn} onClick={() => setMode('total')}>Rapport total</button>
        <button type="button" className={mode === 'partiel' ? primary : btn} onClick={() => setMode('partiel')}>Rapport partiel</button>
        <label className="flex items-center gap-2 text-slate-400">
          Délai indice {delay} ms
          <input type="range" min={0} max={1000} step={150} value={delay} onChange={(e) => setDelay(Number(e.target.value))} />
        </label>
      </div>
      <div className="h-36 rounded-2xl bg-black/60 flex items-center justify-center">
        {phase === 'show' && (
          <div className="grid grid-rows-3 gap-2 font-mono text-2xl tracking-[0.4em] text-white">
            {grid.map((r, i) => (
              <div key={i}>{r.join(' ')}</div>
            ))}
          </div>
        )}
        {phase === 'cue' && mode === 'partiel' && (
          <div className="text-amber-300 text-sm font-bold">Ligne {row + 1}</div>
        )}
        {phase === 'cue' && mode === 'total' && <div className="text-slate-500 text-xs">…</div>}
        {phase === 'idle' && <span className="text-xs text-slate-500">Matrice ~80 ms</span>}
        {phase === 'recall' && <span className="text-xs text-slate-400">Saisis les lettres</span>}
      </div>
      {phase === 'recall' ? (
        <div className="flex gap-2">
          <input value={answer} onChange={(e) => setAnswer(e.target.value.toUpperCase())} className="flex-1 bg-white/10 rounded-xl px-3 py-2 font-mono text-sm" placeholder={mode === 'total' ? '12 lettres' : '4 lettres de la ligne'} />
          <button
            type="button"
            className={primary}
            onClick={() => {
              const a = answer.replace(/\s/g, '');
              let ok = 0;
              for (let i = 0; i < Math.min(a.length, target.length); i++) if (a[i] === target[i]) ok++;
              setScore(ok);
              setPhase('idle');
            }}
          >
            Valider
          </button>
        </div>
      ) : (
        <button type="button" className={primary} onClick={start}>Lancer un essai</button>
      )}
      {score != null && (
        <p className="text-xs text-slate-300">
          {score}/{target.length} correct(s). Cible : {target}. L’avantage du rapport partiel chute quand le délai augmente.
        </p>
      )}
    </div>
  );
};

export const SternbergDemo: React.FC = () => {
  const [size, setSize] = useState(2);
  const [phase, setPhase] = useState<'mem' | 'probe' | 'idle'>('idle');
  const [setItems, setSetItems] = useState<number[]>([]);
  const [probe, setProbe] = useState(0);
  const [present, setPresent] = useState(true);
  const t0 = useRef(0);
  const [log, setLog] = useState<{ size: number; present: boolean; ms: number; ok: boolean }[]>([]);

  const launch = (n: number) => {
    const items = Array.from({ length: n }, () => Math.floor(Math.random() * 9) + 1);
    const isP = Math.random() < 0.5;
    const p = isP ? items[Math.floor(Math.random() * n)] : ((items[0] + 3) % 9) + 1;
    setSize(n);
    setSetItems(items);
    setPresent(isP);
    setProbe(p);
    setPhase('mem');
    window.setTimeout(() => {
      setPhase('probe');
      t0.current = performance.now();
    }, 1200);
  };

  const answer = (yes: boolean) => {
    const ms = Math.round(performance.now() - t0.current);
    setLog((prev) => [...prev, { size, present, ms, ok: yes === present }]);
    setPhase('idle');
  };

  const bySize = [2, 4, 6].map((n) => ({
    n,
    rt: median(log.filter((x) => x.size === n && x.ok).map((x) => x.ms))
  }));

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Mémorise l’ensemble, puis présent / absent.</p>
      {phase === 'idle' && (
        <div className="flex gap-2">
          {[2, 4, 6].map((n) => (
            <button key={n} type="button" className={btn} onClick={() => launch(n)}>
              Charge {n}
            </button>
          ))}
        </div>
      )}
      {phase === 'mem' && (
        <div className="h-24 rounded-2xl bg-black/50 flex items-center justify-center text-3xl font-mono tracking-[0.4em]">
          {setItems.join(' ')}
        </div>
      )}
      {phase === 'probe' && (
        <div className="space-y-3">
          <div className="h-24 rounded-2xl bg-black/50 flex items-center justify-center text-5xl font-mono">{probe}</div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={primary} onClick={() => answer(true)}>Présent</button>
            <button type="button" className={btn} onClick={() => answer(false)}>Absent</button>
          </div>
        </div>
      )}
      {log.length > 0 && (
        <div className="flex items-end gap-2 h-24">
          {bySize.map((b) => (
            <div key={b.n} className="flex-1 flex flex-col items-center justify-end">
              <div className="w-full bg-cyan-400/80 rounded-t" style={{ height: `${Math.min(100, b.rt / 12)}%` }} />
              <span className="text-[10px] text-slate-400 mt-1">{b.n} · {b.rt || '—'} ms</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SERIAL_WORDS = ['navire', 'forêt', 'piano', 'nuage', 'pierre', 'lampe', 'rivière', 'miroir', 'fenêtre', 'jardin', 'silence', 'orange', 'vallée', 'crayon', 'horizon'];
const SERIAL_LURES = ['océan', 'métal', 'tableau', 'souris', 'neige'];

export const SerialDemo: React.FC = () => {
  const [i, setI] = useState(-1);
  const [recalled, setRecalled] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const running = i >= 0 && i < SERIAL_WORDS.length;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setI((v) => v + 1), 1200);
    return () => clearTimeout(t);
  }, [running, i]);

  useEffect(() => {
    if (i === SERIAL_WORDS.length) setDone(true);
  }, [i]);

  const curve = SERIAL_WORDS.map((w, idx) => ({ idx, hit: recalled.includes(w) }));

  return (
    <div className="space-y-3">
      {i < 0 && <button type="button" className={primary} onClick={() => { setI(0); setRecalled([]); setDone(false); }}>Démarrer la liste</button>}
      {running && (
        <div className="h-28 rounded-2xl bg-black/50 flex items-center justify-center text-3xl font-bold">{SERIAL_WORDS[i]}</div>
      )}
      {done && (
        <>
          <p className="text-xs text-slate-400">Clique les mots dont tu te souviens (rappel libre).</p>
          <div className="flex flex-wrap gap-1.5">
            {[...SERIAL_WORDS, ...SERIAL_LURES].sort().map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setRecalled((r) => (r.includes(w) ? r.filter((x) => x !== w) : [...r, w]))}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${recalled.includes(w) ? 'bg-amber-400 text-slate-900' : 'bg-white/10'}`}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-0.5 h-20">
            {curve.map((c) => (
              <div key={c.idx} className={`flex-1 rounded-t ${c.hit ? 'bg-amber-400' : 'bg-white/10'}`} style={{ height: c.hit ? '100%' : '18%' }} title={`${c.idx + 1}`} />
            ))}
          </div>
          <p className="text-[11px] text-slate-400">Courbe en U attendue : primauté (début) et récence (fin).</p>
        </>
      )}
    </div>
  );
};

export const LoftusDemo: React.FC = () => {
  const [verb] = useState(() => (Math.random() < 0.5 ? 'heurté' : 'percuté'));
  const [speed, setSpeed] = useState(40);
  const [glass, setGlass] = useState<boolean | null>(null);
  const intense = verb === 'percuté';

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">
        Scène unique (adaptation pédagogique). Formulation assignée aléatoirement — tu ne vois qu’une version.
      </p>
      <div className="rounded-2xl bg-black/40 p-4 text-sm leading-relaxed text-slate-200">
        Deux voitures se rencontrent à une intersection urbaine. Personne n’est blessé. Le récit ne mentionne pas de verre brisé.
      </div>
      <p className="text-sm">
        À quelle vitesse allaient les voitures quand elles se sont <strong className="text-amber-300">{verb}es</strong> ?
      </p>
      <label className="text-xs text-slate-400 block">
        {speed} km/h
        <input type="range" min={10} max={120} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
      </label>
      <p className="text-sm">As-tu vu du verre brisé ?</p>
      <div className="flex gap-2">
        <button type="button" className={glass === true ? primary : btn} onClick={() => setGlass(true)}>Oui</button>
        <button type="button" className={glass === false ? primary : btn} onClick={() => setGlass(false)}>Non</button>
      </div>
      {glass !== null && (
        <p className="text-xs text-slate-300">
          Formulation {intense ? 'intense (percuté)' : 'neutre (heurté)'}. Classiquement, le verbe intense augmente l’estimation de vitesse
          et parfois le faux rappel d’un détail. Ici le verre n’était pas dans la scène.
          {glass ? ' Tu as rapporté un détail non présenté.' : ' Tu n’as pas ajouté ce détail.'}
        </p>
      )}
    </div>
  );
};

export const RotationDemo: React.FC = () => {
  const angles = [0, 60, 120, 180];
  const [angle, setAngle] = useState(60);
  const [mirror, setMirror] = useState(false);
  const t0 = useRef(performance.now());
  const [log, setLog] = useState<{ angle: number; ms: number; ok: boolean }[]>([]);

  const next = () => {
    setAngle(angles[Math.floor(Math.random() * angles.length)]);
    setMirror(Math.random() < 0.5);
    t0.current = performance.now();
  };

  const slope = useMemo(() => {
    const ok = log.filter((x) => x.ok);
    if (ok.length < 2) return null;
    return median(ok.map((x) => x.ms));
  }, [log]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Même lettre tournée, ou miroir ? (adaptation 2D de Shepard & Metzler)</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-32 rounded-2xl bg-black/50 flex items-center justify-center text-6xl font-black">R</div>
        <div className="h-32 rounded-2xl bg-black/50 flex items-center justify-center text-6xl font-black" style={{ transform: `rotate(${angle}deg) scaleX(${mirror ? -1 : 1})` }}>
          R
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={primary}
          onClick={() => {
            setLog((p) => [...p, { angle, ms: Math.round(performance.now() - t0.current), ok: !mirror }]);
            next();
          }}
        >
          Même (tourné)
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            setLog((p) => [...p, { angle, ms: Math.round(performance.now() - t0.current), ok: mirror }]);
            next();
          }}
        >
          Miroir
        </button>
      </div>
      <p className="text-[11px] text-slate-400">
        Angle actuel {angle}° · essais {log.length}
        {slope != null ? ` · RT médian correct ${slope} ms` : ''}
      </p>
    </div>
  );
};

export const WasonDemo: React.FC = () => {
  const [picked, setPicked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const cards = [
    { id: 'A', label: 'A', role: 'P' },
    { id: 'D', label: 'D', role: 'non-P' },
    { id: '4', label: '4', role: 'Q' },
    { id: '7', label: '7', role: 'non-Q' }
  ];
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const correct = picked.includes('A') && picked.includes('7') && picked.length === 2;

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-200">
        Règle : <em>si voyelle, alors nombre pair</em>. Quelles cartes retourner pour tester la règle ?
      </p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(c.id)}
            className={`h-24 rounded-2xl font-black text-2xl ${picked.includes(c.id) ? 'bg-amber-400 text-slate-900' : 'bg-white/10'}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <button type="button" className={primary} onClick={() => setDone(true)}>Valider</button>
      {done && (
        <p className="text-xs text-slate-300">
          Solution logique : <strong>A (P)</strong> et <strong>7 (non-Q)</strong>. Q (4) ne peut pas falsifier ; non-P (D) est irrelevant.
          {correct ? ' Choix correct.' : ` Tu as choisi ${picked.join(', ') || 'aucune'} — profil confirmatoire fréquent (P et Q).`}
        </p>
      )}
    </div>
  );
};

export const FramingDemo: React.FC = () => {
  const [frame] = useState<'gain' | 'perte'>(() => (Math.random() < 0.5 ? 'gain' : 'perte'));
  const [choice, setChoice] = useState<'certain' | 'risque' | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">Cadrage assigné : {frame} (inter-sujets)</p>
      {frame === 'gain' ? (
        <p className="text-sm text-slate-200">
          600 personnes concernées. Programme A : <strong>200 personnes sauvées</strong> à coup sûr. Programme B : 1/3 de chance que 600 soient sauvées, 2/3 que personne ne le soit.
        </p>
      ) : (
        <p className="text-sm text-slate-200">
          600 personnes concernées. Programme A : <strong>400 personnes mourront</strong> à coup sûr. Programme B : 1/3 de chance que personne ne meure, 2/3 que 600 meurent.
        </p>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className={choice === 'certain' ? primary : btn} onClick={() => setChoice('certain')}>Programme A (certain)</button>
        <button type="button" className={choice === 'risque' ? primary : btn} onClick={() => setChoice('risque')}>Programme B (risqué)</button>
      </div>
      {choice && (
        <p className="text-xs text-slate-300">
          Structure identique. Classiquement le cadrage gain → certain, le cadrage perte → risqué. Ton choix : {choice}.
        </p>
      )}
    </div>
  );
};

const JOL_ITEMS = [
  { q: 'Combien de fiches ROME taguées dans Cognitorium ?', options: ['191', '911', '1911', '19111'], a: 2 },
  { q: 'Flavell (1979) introduit surtout…', options: ['le Big Five', 'le monitoring métacognitif', 'la prospect theory', 'le n-back'], a: 1 },
  { q: 'Wason : cartes logiquement pertinentes ?', options: ['P et Q', 'P et non-Q', 'non-P et Q', 'toutes'], a: 1 },
  { q: 'La récence diminue surtout si…', options: ['liste plus belle', 'délai distracteur', 'mots longs', 'silence'], a: 1 },
  { q: 'Stroop mesure principalement…', options: ['un QI', 'une interférence automatique', 'la personnalité', 'un diagnostic'], a: 1 },
  { q: 'Koriat relie la confiance à…', options: ['un trait fixe', 'l’utilisation d’indices', 'le QI verbal', 'l’obéissance'], a: 1 }
];

export const JolDemo: React.FC = () => {
  const [i, setI] = useState(0);
  const [conf, setConf] = useState(60);
  const [fb, setFb] = useState(true);
  const [flash, setFlash] = useState<string | null>(null);
  const [log, setLog] = useState<{ ok: boolean; conf: number }[]>([]);
  const done = i >= JOL_ITEMS.length;
  const item = JOL_ITEMS[Math.min(i, JOL_ITEMS.length - 1)];
  const acc = log.length ? Math.round((100 * log.filter((x) => x.ok).length) / log.length) : 0;
  const meanC = log.length ? Math.round(log.reduce((s, x) => s + x.conf, 0) / log.length) : 0;
  const bias = meanC - acc;

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-[11px] text-slate-400">
        <input type="checkbox" checked={fb} onChange={(e) => setFb(e.target.checked)} />
        Feedback immédiat
      </label>
      {!done ? (
        <>
          {flash && <p className="text-[11px] text-amber-300">{flash}</p>}
          <p className="text-sm font-semibold">{item.q}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.options.map((o, idx) => (
              <button
                key={o}
                type="button"
                className={btn}
                onClick={() => {
                  const ok = idx === item.a;
                  setLog((p) => [...p, { ok, conf }]);
                  if (fb) setFlash(ok ? 'Correct' : `Incorrect — ${item.options[item.a]}`);
                  else setFlash(null);
                  setI((v) => v + 1);
                  setConf(60);
                }}
              >
                {o}
              </button>
            ))}
          </div>
          <label className="text-[11px] text-slate-400 block">
            Confiance {conf}%
            <input type="range" min={0} max={100} value={conf} onChange={(e) => setConf(Number(e.target.value))} className="w-full" />
          </label>
        </>
      ) : (
        <div className="rounded-2xl bg-white/5 p-4 text-xs space-y-1">
          <p>Exactitude {acc}% · confiance moyenne {meanC}%</p>
          <p className="text-amber-300 font-bold">Biais (confiance − exactitude) = {bias} pts</p>
          <p className="text-slate-400">{bias > 12 ? 'Surconfiance' : bias < -12 ? 'Sous-confiance' : 'Calibration proche'}</p>
          <button type="button" className={btn} onClick={() => { setI(0); setLog([]); }}>Recommencer</button>
        </div>
      )}
    </div>
  );
};

export const NbackDemo: React.FC = () => {
  const [n, setN] = useState<1 | 2>(2);
  const [seq, setSeq] = useState<string[]>([]);
  const [idx, setIdx] = useState(-1);
  const [hits, setHits] = useState(0);
  const [fa, setFa] = useState(0);
  const [miss, setMiss] = useState(0);
  const [running, setRunning] = useState(false);
  const clicked = useRef(false);

  useEffect(() => {
    if (!running || idx < 0 || idx >= seq.length) return;
    clicked.current = false;
    const t = window.setTimeout(() => {
      const target = idx >= n && seq[idx] === seq[idx - n];
      if (target && !clicked.current) setMiss((m) => m + 1);
      if (idx + 1 >= seq.length) setRunning(false);
      else setIdx((v) => v + 1);
    }, 1400);
    return () => clearTimeout(t);
  }, [running, idx, n, seq]);

  const start = (level: 1 | 2) => {
    const letters = 'BCDFGHKLMNPRST';
    const s = Array.from({ length: 16 }, () => letters[Math.floor(Math.random() * letters.length)]);
    for (let i = level; i < s.length; i += 3) s[i] = s[i - level];
    setN(level);
    setSeq(s);
    setHits(0);
    setFa(0);
    setMiss(0);
    setRunning(true);
    setIdx(0);
  };

  const letter = seq[idx] || '';
  const isTarget = idx >= n && seq[idx] === seq[idx - n];

  return (
    <div className="space-y-3">
      {!running && idx < 0 && (
        <div className="flex gap-2">
          <button type="button" className={btn} onClick={() => start(1)}>1-back</button>
          <button type="button" className={primary} onClick={() => start(2)}>2-back</button>
        </div>
      )}
      {running && (
        <>
          <div className="h-28 rounded-2xl bg-black/50 flex items-center justify-center text-5xl font-black">{letter}</div>
          <button
            type="button"
            className={primary}
            onClick={() => {
              if (clicked.current) return;
              clicked.current = true;
              if (isTarget) setHits((h) => h + 1);
              else setFa((f) => f + 1);
            }}
          >
            Cible (même qu’il y a {n})
          </button>
        </>
      )}
      {!running && idx >= 0 && (
        <p className="text-xs text-slate-300">
          n={n} · hits {hits} · fausses alarmes {fa} · manques {miss}. La charge croît avec n — ce n’est pas un QI.
        </p>
      )}
    </div>
  );
};

export const BisectionDemo: React.FC = () => {
  const shortMs = 400;
  const longMs = 1600;
  const probes = [400, 600, 800, 1000, 1200, 1600];
  const [phase, setPhase] = useState<'idle' | 'play' | 'ask'>('idle');
  const [ms, setMs] = useState(800);
  const [log, setLog] = useState<{ ms: number; long: boolean }[]>([]);

  const play = (dur: number) => {
    setMs(dur);
    setPhase('play');
    window.setTimeout(() => setPhase('ask'), dur);
  };

  const pLong = (dur: number) => {
    const xs = log.filter((x) => x.ms === dur);
    if (!xs.length) return null;
    return Math.round((100 * xs.filter((x) => x.long).length) / xs.length);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">
        Ancres : court {shortMs} ms · long {longMs} ms. Classe ensuite la sonde. Pas de chronomètre à l’écran.
      </p>
      {phase === 'idle' && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => play(shortMs)}>
            Ancre courte
          </button>
          <button type="button" className={btn} onClick={() => play(longMs)}>
            Ancre longue
          </button>
          <button
            type="button"
            className={primary}
            onClick={() => play(probes[Math.floor(Math.random() * probes.length)])}
          >
            Sonde
          </button>
        </div>
      )}
      {phase === 'play' && (
        <div className="h-28 rounded-2xl bg-amber-400/90 flex items-center justify-center text-slate-900 text-sm font-bold">
          Intervalle…
        </div>
      )}
      {phase === 'ask' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={btn}
            onClick={() => {
              setLog((p) => [...p, { ms, long: false }]);
              setPhase('idle');
            }}
          >
            Court
          </button>
          <button
            type="button"
            className={primary}
            onClick={() => {
              setLog((p) => [...p, { ms, long: true }]);
              setPhase('idle');
            }}
          >
            Long
          </button>
        </div>
      )}
      {log.length > 0 && (
        <div className="flex items-end gap-1 h-16">
          {probes.map((d) => (
            <div key={d} className="flex-1 flex flex-col items-center justify-end">
              <div className="w-full bg-amber-400/80 rounded-t" style={{ height: `${pLong(d) ?? 8}%` }} />
              <span className="text-[9px] text-slate-500 mt-1">{d}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ReproductionDemo: React.FC = () => {
  const targets = [600, 1200, 2000];
  const [phase, setPhase] = useState<'idle' | 'show' | 'ready'>('idle');
  const [target, setTarget] = useState(1200);
  const [holding, setHolding] = useState(false);
  const t0 = useRef(0);
  const [log, setLog] = useState<{ target: number; produced: number }[]>([]);

  const start = (t: number) => {
    setTarget(t);
    setPhase('show');
    window.setTimeout(() => setPhase('ready'), t);
  };

  const producedLast = log[log.length - 1];

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Observe la durée, puis maintiens pour la reproduire — sans compter si tu peux.</p>
      {phase === 'idle' && (
        <div className="flex gap-2">
          {targets.map((t) => (
            <button key={t} type="button" className={btn} onClick={() => start(t)}>
              Cible ~{t} ms
            </button>
          ))}
        </div>
      )}
      {phase === 'show' && (
        <div className="h-24 rounded-2xl bg-cyan-400/80 flex items-center justify-center text-slate-900 text-xs font-bold">
          Encode la durée
        </div>
      )}
      {phase === 'ready' && (
        <button
          type="button"
          className={`${primary} w-full h-24`}
          onMouseDown={() => {
            setHolding(true);
            t0.current = performance.now();
          }}
          onMouseUp={() => {
            if (!holding) return;
            const produced = Math.round(performance.now() - t0.current);
            setLog((p) => [...p, { target, produced }]);
            setHolding(false);
            setPhase('idle');
          }}
          onMouseLeave={() => {
            if (!holding) return;
            const produced = Math.round(performance.now() - t0.current);
            setLog((p) => [...p, { target, produced }]);
            setHolding(false);
            setPhase('idle');
          }}
        >
          {holding ? 'Reproduis…' : 'Maintiens pour reproduire'}
        </button>
      )}
      {producedLast && (
        <p className="text-xs text-slate-300">
          Cible {producedLast.target} ms · produit {producedLast.produced} ms · erreur {producedLast.produced - producedLast.target} ms
        </p>
      )}
    </div>
  );
};

export const TojDemo: React.FC = () => {
  const soas = [-120, -60, 0, 60, 120];
  const [phase, setPhase] = useState<'idle' | 'flash' | 'ask'>('idle');
  const [soa, setSoa] = useState(0);
  const [leftFirst, setLeftFirst] = useState(true);
  const [showL, setShowL] = useState(false);
  const [showR, setShowR] = useState(false);
  const [log, setLog] = useState<{ soa: number; saidLeft: boolean }[]>([]);

  const launch = () => {
    const s = soas[Math.floor(Math.random() * soas.length)];
    setSoa(s);
    setPhase('flash');
    setShowL(false);
    setShowR(false);
    const leftOn = s <= 0 ? 40 : 40 + s;
    const rightOn = s >= 0 ? 40 : 40 - s;
    window.setTimeout(() => setShowL(true), leftOn);
    window.setTimeout(() => setShowR(true), rightOn);
    window.setTimeout(() => {
      setShowL(false);
      setShowR(false);
      setPhase('ask');
    }, 420);
  };

  const pLeft = (s: number) => {
    const xs = log.filter((x) => x.soa === s);
    if (!xs.length) return null;
    return Math.round((100 * xs.filter((x) => x.saidLeft).length) / xs.length);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Deux flashs. Lequel le premier ? SOA pédagogique (pas un seuil labo).</p>
      {phase === 'idle' && (
        <button type="button" className={primary} onClick={launch}>
          Essai TOJ
        </button>
      )}
      {phase !== 'ask' && (
        <div className="h-28 rounded-2xl bg-black/50 flex items-center justify-around">
          <div className={`w-16 h-16 rounded-full ${showL ? 'bg-amber-300' : 'bg-white/10'}`} />
          <div className={`w-16 h-16 rounded-full ${showR ? 'bg-cyan-300' : 'bg-white/10'}`} />
        </div>
      )}
      {phase === 'ask' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={btn}
            onClick={() => {
              setLog((p) => [...p, { soa, saidLeft: true }]);
              setLeftFirst(true);
              setPhase('idle');
            }}
          >
            Gauche d’abord
          </button>
          <button
            type="button"
            className={primary}
            onClick={() => {
              setLog((p) => [...p, { soa, saidLeft: false }]);
              setLeftFirst(false);
              setPhase('idle');
            }}
          >
            Droite d’abord
          </button>
        </div>
      )}
      {log.length > 0 && (
        <p className="text-[11px] text-slate-400">
          Dernier SOA {soa} ms · P(gauche) à 0 ms : {pLeft(0) ?? '—'}% · essais {log.length}
          {leftFirst ? '' : ''}
        </p>
      )}
    </div>
  );
};

export const LAB_DEMOS: Record<string, React.FC> = {
  'COG-ATT-STROOP-001': StroopDemo,
  'COG-ATT-GORILLA-002': GorillaDemo,
  'COG-ATT-CHANGE-003': ChangeDemo,
  'COG-MEM-SPERLING-004': SperlingDemo,
  'COG-MEM-STERNBERG-005': SternbergDemo,
  'COG-MEM-SERIAL-006': SerialDemo,
  'COG-MEM-LOFTUS-007': LoftusDemo,
  'COG-SPA-ROTATION-008': RotationDemo,
  'COG-REA-WASON-009': WasonDemo,
  'COG-DEC-FRAME-010': FramingDemo,
  'COG-META-JOL-011': JolDemo,
  'COG-WM-NBACK-012': NbackDemo,
  'COG-TIME-BISECT-013': BisectionDemo,
  'COG-TIME-REPRO-014': ReproductionDemo,
  'COG-TIME-TOJ-015': TojDemo
};
