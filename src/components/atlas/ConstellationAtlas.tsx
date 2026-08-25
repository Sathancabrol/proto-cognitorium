import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import nebulaUrl from '../../assets/images/nebula-constellation.jpg';
import { ARCH_TINT, PerkDef, PerkState, buildConstellations } from './constellationData';

function starTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.2, 'rgba(255,250,220,0.9)');
  grd.addColorStop(0.45, 'rgba(160,210,255,0.3)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function perkState(id: string, parentId: string | null, unlocked: Set<string>): PerkState {
  if (unlocked.has(id)) return 'unlocked';
  if (!parentId || unlocked.has(parentId)) return 'available';
  return 'locked';
}

export const ConstellationAtlas: React.FC<{
  branchId: string;
  onSelect: (id: string | null) => void;
  onExit: () => void;
}> = ({ branchId, onSelect, onExit }) => {
  const host = useRef<HTMLDivElement>(null);
  const constel = useMemo(
    () => buildConstellations().find((c) => c.id === branchId) ?? buildConstellations()[0],
    [branchId]
  );
  const byId = useMemo(() => Object.fromEntries(constel.perks.map((p) => [p.id, p])), [constel]);
  const [focusId, setFocusId] = useState(constel.id);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(() => new Set<string>([constel.id]));
  const [labels, setLabels] = useState<{ id: string; x: number; y: number; label: string }[]>([]);
  const api = useRef({ rotY: 0, rotX: 0, velY: 0, velX: 0 });

  const focus = byId[focusId] || constel.perks[0];
  const shown = (hoverId && byId[hoverId]) || focus;
  const crumbs: PerkDef[] = [];
  {
    let p: PerkDef | undefined = focus;
    while (p) {
      crumbs.unshift(p);
      p = p.parentId ? byId[p.parentId] : undefined;
    }
  }
  const nextSteps = constel.perks.filter((p) => p.parentId === focusId);

  useEffect(() => {
    setFocusId(constel.id);
    setUnlocked(new Set([constel.id]));
    onSelect(constel.id);
  }, [constel.id]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
    camera.position.set(0, 0, 52);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050814, 1);
    el.appendChild(renderer.domElement);

    const nebula = new THREE.TextureLoader().load(nebulaUrl);
    nebula.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(120, 32, 24),
      new THREE.MeshBasicMaterial({
        map: nebula,
        side: THREE.BackSide,
        color: new THREE.Color(ARCH_TINT[constel.archetype]),
        transparent: true,
        opacity: 0.55
      })
    );
    scene.add(sky);

    const root = new THREE.Group();
    scene.add(root);
    const glow = starTexture();
    const sprites = new Map<string, THREE.Sprite>();
    const lines: THREE.Line[] = [];

    constel.perks.forEach((p) => {
      const spr = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          color: new THREE.Color(constel.color),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      spr.position.set(p.lx, p.ly, 0);
      spr.scale.setScalar(p.parentId ? 3.2 : 6.5);
      spr.userData = { perk: p };
      root.add(spr);
      sprites.set(p.id, spr);
    });
    constel.perks.forEach((p) => {
      if (!p.parentId) return;
      const a = sprites.get(p.parentId);
      const b = sprites.get(p.id);
      if (!a || !b) return;
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([a.position, b.position]),
        new THREE.LineBasicMaterial({ color: 0x9ad8ff, transparent: true, opacity: 0.35 })
      );
      line.userData = { childId: p.id };
      root.add(line);
      lines.push(line);
    });

    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let running = true;
    const unlockedRef = { current: new Set<string>([constel.id]) };

    const paint = () => {
      sprites.forEach((spr, id) => {
        const p = byId[id];
        const st = perkState(id, p.parentId, unlockedRef.current);
        const mat = spr.material as THREE.SpriteMaterial;
        if (st === 'unlocked') {
          mat.opacity = 1;
          mat.color.set(0xffe08a);
        } else if (st === 'available') {
          mat.opacity = 1;
          mat.color.setHex(0xdbeafe);
        } else {
          mat.opacity = 0.22;
          mat.color.setHex(0x64748b);
        }
      });
      lines.forEach((ln) => {
        const mat = ln.material as THREE.LineBasicMaterial;
        const on = unlockedRef.current.has(ln.userData.childId);
        mat.opacity = on ? 0.9 : 0.2;
      });
    };
    paint();

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = false;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
        api.current.velY -= dx * 0.003;
        api.current.velX -= dy * 0.002;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const onUp = () => {
      dragging = false;
    };
    const onClick = () => {
      if (moved) return;
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects([...sprites.values()], false)[0];
      if (!hit) return;
      const perk = (hit.object.userData as { perk: PerkDef }).perk;
      const st = perkState(perk.id, perk.parentId, unlockedRef.current);
      if (st === 'locked') return;
      setFocusId(perk.id);
      onSelect(perk.id);
      if (!unlockedRef.current.has(perk.id)) {
        const next = new Set(unlockedRef.current);
        next.add(perk.id);
        unlockedRef.current = next;
        setUnlocked(next);
        paint();
      }
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick);

    const loop = () => {
      if (!running) return;
      api.current.velY *= 0.9;
      api.current.velX *= 0.9;
      api.current.rotY = THREE.MathUtils.clamp(api.current.rotY + api.current.velY, -0.45, 0.45);
      api.current.rotX = THREE.MathUtils.clamp(api.current.rotX + api.current.velX, -0.22, 0.22);
      root.rotation.y = api.current.rotY;
      root.rotation.x = api.current.rotX;
      sky.rotation.y += 0.00035;

      sprites.forEach((spr, id) => {
        const p = byId[id];
        const avail = perkState(id, p.parentId, unlockedRef.current) === 'available';
        const pulse = avail ? 1 + Math.sin(performance.now() / 260) * 0.1 : 1;
        spr.scale.setScalar((p.parentId ? 3.2 : 6.5) * pulse);
      });

      const rect = el.getBoundingClientRect();
      const nextLabels: { id: string; x: number; y: number; label: string }[] = [];
      constel.perks.forEach((p) => {
        const st = perkState(p.id, p.parentId, unlockedRef.current);
        if (st === 'locked') return;
        const spr = sprites.get(p.id);
        if (!spr) return;
        const v = spr.getWorldPosition(new THREE.Vector3()).project(camera);
        nextLabels.push({
          id: p.id,
          x: (v.x * 0.5 + 0.5) * rect.width,
          y: (-v.y * 0.5 + 0.5) * rect.height,
          label: p.label
        });
      });
      setLabels(nextLabels);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    (el as HTMLDivElement & { __sync?: (s: Set<string>) => void }).__sync = (s) => {
      unlockedRef.current = s;
      paint();
    };

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick);
      renderer.dispose();
      glow.dispose();
      nebula.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [constel, byId, onSelect]);

  const back = () => {
    if (focus.parentId) {
      setFocusId(focus.parentId);
      onSelect(focus.parentId);
    } else {
      onExit();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800" style={{ height: 'min(78vh, 740px)', fontFamily: 'Georgia, serif' }}>
      <div ref={host} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {labels.map((l) => (
        <button
          key={l.id}
          type="button"
          className="absolute -translate-x-1/2 text-white text-[11px] font-semibold tracking-wide drop-shadow-[0_2px_8px_#000] whitespace-nowrap pointer-events-none"
          style={{
            left: l.x,
            top: l.y + 14,
            opacity: l.id === focusId ? 1 : 0.85,
            fontSize: l.id === focusId ? 14 : 11
          }}
        >
          {l.label}
        </button>
      ))}

      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={back}
          className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-50"
          style={{ background: 'rgba(8,16,28,0.7)', border: '1px solid rgba(186,230,253,0.35)' }}
        >
          ← {focus.parentId ? 'Étape précédente' : 'Choisir une branche'}
        </button>
        <nav className="flex flex-wrap items-center gap-1 text-[11px] text-cyan-50/90">
          {crumbs.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setFocusId(c.id);
                onSelect(c.id);
              }}
              className={`px-2 py-1 rounded ${c.id === focusId ? 'bg-white/20 font-bold' : 'bg-black/30'}`}
            >
              {i === 0 ? constel.title : c.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="absolute inset-x-0 top-[38%] z-10 pointer-events-none text-center px-6">
        <h2 className="text-white text-3xl font-semibold tracking-wide drop-shadow-[0_4px_16px_#000]">{shown.label}</h2>
        <p className="mt-2 max-w-lg mx-auto text-sm text-cyan-50/90 drop-shadow-[0_2px_8px_#000]">{shown.desc}</p>
      </div>

      {nextSteps.length > 0 && (
        <div className="absolute bottom-16 right-3 z-20 max-w-xs space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-cyan-100/70 mb-1">Prochaines étapes</div>
          {nextSteps.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                const st = perkState(s.id, s.parentId, unlocked);
                if (st === 'locked') return;
                setFocusId(s.id);
                onSelect(s.id);
                setUnlocked((u) => new Set(u).add(s.id));
              }}
              className="block w-full text-left px-3 py-1.5 text-xs text-white rounded-lg bg-black/45 border border-white/15 hover:bg-black/65"
            >
              → {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="absolute bottom-3 left-3 text-[10px] tracking-widest uppercase text-cyan-100/70">
        {constel.title} · clic une étoile · glisser = regarder · pas de 360° libre
      </div>
    </div>
  );
};
