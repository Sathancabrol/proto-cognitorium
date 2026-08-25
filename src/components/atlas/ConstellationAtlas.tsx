import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import nebulaUrl from '../../assets/images/nebula-constellation.jpg';
import { ARCH_TINT, ConstelDef, PerkDef, PerkState, buildConstellations } from './constellationData';

const RING = 78;

function starTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.18, 'rgba(255,250,220,0.95)');
  grd.addColorStop(0.4, 'rgba(160,210,255,0.35)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = 'rgba(255,255,255,0.55)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(8, 64);
  g.lineTo(120, 64);
  g.moveTo(64, 8);
  g.lineTo(64, 120);
  g.stroke();
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
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}> = ({ onSelect }) => {
  const host = useRef<HTMLDivElement>(null);
  const constels = useMemo(() => buildConstellations(), []);
  const [mode, setMode] = useState<'macro' | 'micro'>('macro');
  const [focusIdx, setFocusIdx] = useState(0);
  const [hover, setHover] = useState<PerkDef | null>(null);
  const [active, setActive] = useState<PerkDef | null>(null);
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set());
  const [xp, setXp] = useState(18);
  const api = useRef({
    yaw: 0,
    vel: 0,
    zoom: 0,
    zoomT: 0,
    pitch: -0.08
  });

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 600);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x04060c, 1);
    el.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const nebula = loader.load(nebulaUrl);
    nebula.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(220, 48, 32),
      new THREE.MeshBasicMaterial({ map: nebula, side: THREE.BackSide, color: 0x8899cc })
    );
    scene.add(sky);

    const dustGeo = new THREE.BufferGeometry();
    const dustN = 1400;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      const r = 12 + Math.random() * 90;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      dustPos[i * 3 + 1] = r * Math.cos(ph) * 0.45;
      dustPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xcfe8ff, size: 0.18, transparent: true, opacity: 0.55, depthWrite: false })
    );
    scene.add(dust);

    const glow = starTexture();
    type Hit = { sprite: THREE.Sprite; perk: PerkDef; constel: ConstelDef };
    const hits: Hit[] = [];
    const groups: THREE.Group[] = [];
    const pulses: { mesh: THREE.Mesh; a: THREE.Vector3; b: THREE.Vector3; t: number }[] = [];

    constels.forEach((c) => {
      const g = new THREE.Group();
      const x = Math.sin(c.angle) * RING;
      const z = -Math.cos(c.angle) * RING;
      g.position.set(x, 4, z);
      g.lookAt(0, 2, 0);
      g.userData = { id: c.id, angle: c.angle };

      const perkPos = new Map<string, THREE.Vector3>();
      c.perks.forEach((p) => {
        const spr = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glow,
            color: new THREE.Color(c.color),
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          })
        );
        spr.position.set(p.lx, p.ly, 0);
        const hub = p.id === c.id;
        spr.scale.setScalar(hub ? 7.2 : 3.4);
        spr.userData = { perk: p, constel: c };
        g.add(spr);
        hits.push({ sprite: spr, perk: p, constel: c });
        perkPos.set(p.id, spr.position.clone());
      });

      c.perks.forEach((p) => {
        if (!p.parentId) return;
        const a = perkPos.get(p.parentId);
        const b = perkPos.get(p.id);
        if (!a || !b) return;
        const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
        const line = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({ color: 0x9ad8ff, transparent: true, opacity: 0.28 })
        );
        line.userData = { childId: p.id, parentId: p.parentId };
        g.add(line);
      });

      scene.add(g);
      groups.push(g);
    });

    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let raf = 0;
    let running = true;

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

    const nearestIdx = () => {
      let best = 0;
      let score = 1e9;
      constels.forEach((c, i) => {
        let d = Math.abs(((c.angle - api.current.yaw + Math.PI) % (Math.PI * 2)) - Math.PI);
        if (d < score) {
          score = d;
          best = i;
        }
      });
      return best;
    };

    const applyUnlockVisual = (set: Set<string>) => {
      hits.forEach(({ sprite, perk }) => {
        const st = perkState(perk.id, perk.parentId, set);
        const mat = sprite.material as THREE.SpriteMaterial;
        if (st === 'unlocked') {
          mat.opacity = 1;
          sprite.scale.setScalar(perk.parentId ? 4.2 : 8);
          mat.color.set(0xffe08a);
        } else if (st === 'available') {
          mat.opacity = 0.95;
          mat.color.setHex(0xcfeeff);
        } else {
          mat.opacity = 0.28;
          mat.color.setHex(0x667788);
        }
      });
      groups.forEach((g) => {
        g.children.forEach((ch) => {
          if (ch instanceof THREE.Line) {
            const mat = ch.material as THREE.LineBasicMaterial;
            const unlockedLine = set.has(ch.userData.childId);
            mat.opacity = unlockedLine ? 0.85 : 0.18;
            mat.color.setHex(unlockedLine ? 0x9be7ff : 0x4a6270);
          }
        });
      });
    };

    const spawnPulse = (from: THREE.Vector3, to: THREE.Vector3, parent: THREE.Object3D) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xe0f7ff })
      );
      parent.add(mesh);
      pulses.push({ mesh, a: from.clone(), b: to.clone(), t: 0 });
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = false;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      if (!dragging) {
        ray.setFromCamera(pointer, camera);
        const h = ray.intersectObjects(hits.map((x) => x.sprite), false)[0];
        if (h) {
          const d = h.object.userData as { perk: PerkDef };
          setHover(d.perk);
        } else setHover(null);
      }
      if (!dragging) return;
      const dx = e.clientX - lastX;
      if (Math.abs(dx) > 2) moved = true;
      lastX = e.clientX;
      api.current.vel -= dx * 0.0024;
    };
    const onUp = () => {
      dragging = false;
    };
    const onClick = () => {
      if (moved) return;
      ray.setFromCamera(pointer, camera);
      const objs = hits.map((h) => h.sprite);
      const hit = ray.intersectObjects(objs, false)[0];
      if (!hit) return;
      const data = hit.object.userData as { perk: PerkDef; constel: ConstelDef };
      const idx = constels.findIndex((c) => c.id === data.constel.id);
      if (api.current.zoomT < 0.4) {
        api.current.yaw = data.constel.angle;
        api.current.zoomT = 1;
        setMode('micro');
        setFocusIdx(idx);
        setActive(data.perk);
        onSelect(data.constel.id);
        return;
      }
      setActive(data.perk);
      onSelect(data.perk.id);
      setUnlocked((prev) => {
        const st = perkState(data.perk.id, data.perk.parentId, prev);
        if (st === 'locked') return prev;
        if (prev.has(data.perk.id)) return prev;
        const next = new Set(prev);
        next.add(data.perk.id);
        const parent = hits.find((h) => h.perk.id === data.perk.parentId);
        const self = hits.find((h) => h.perk.id === data.perk.id);
        if (parent && self) {
          spawnPulse(parent.sprite.position, self.sprite.position, parent.sprite.parent!);
        }
        applyUnlockVisual(next);
        setXp((x) => Math.min(100, x + 6));
        return next;
      });
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      api.current.zoomT = THREE.MathUtils.clamp(api.current.zoomT + (e.deltaY > 0 ? -0.12 : 0.12), 0, 1);
      setMode(api.current.zoomT > 0.45 ? 'micro' : 'macro');
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') api.current.vel += 0.045;
      if (e.key === 'ArrowRight') api.current.vel -= 0.045;
      if (e.key === 'Escape' || e.key === 'Backspace') {
        api.current.zoomT = 0;
        setMode('macro');
        setActive(null);
        onSelect(null);
      }
      if (e.key === 'Enter') {
        api.current.zoomT = 1;
        setMode('micro');
      }
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick);
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);

    applyUnlockVisual(new Set());

    const unlockedRef = { current: new Set<string>() };

    const loop = () => {
      if (!running) return;
      const st = api.current;
      st.vel *= 0.92;
      if (st.zoomT < 0.5) st.yaw += st.vel;
      else st.yaw += st.vel * 0.25;
      st.zoom += (st.zoomT - st.zoom) * 0.06;

      const idx = nearestIdx();
      setFocusIdx((cur) => (cur === idx ? cur : idx));
      const C = constels[idx];
      const tint = new THREE.Color(ARCH_TINT[C.archetype]);
      (sky.material as THREE.MeshBasicMaterial).color.lerp(tint, 0.03);

      const lookX = Math.sin(st.yaw) * RING;
      const lookZ = -Math.cos(st.yaw) * RING;
      const camR = THREE.MathUtils.lerp(0.2, RING * 0.62, st.zoom);
      camera.position.set(Math.sin(st.yaw) * camR, 3 + st.zoom * 2, -Math.cos(st.yaw) * camR);
      camera.lookAt(lookX, 4, lookZ);

      sky.rotation.y = st.yaw * 0.18;
      dust.rotation.y = st.yaw * 0.35;
      dust.rotation.x = Math.sin(performance.now() / 6000) * 0.04;

      groups.forEach((g, i) => {
        const far = Math.abs(((constels[i].angle - st.yaw + Math.PI) % (Math.PI * 2)) - Math.PI);
        const fade = st.zoom > 0.45 ? THREE.MathUtils.smoothstep(0.55, 0.15, far) : 1;
        g.traverse((o) => {
          const m = (o as THREE.Mesh).material as THREE.Material | undefined;
          if (m && 'opacity' in m && o instanceof THREE.Sprite) {
            const base = o.userData.perk ? 1 : 1;
            void base;
          }
        });
        g.visible = fade > 0.08;
        g.scale.setScalar(0.92 + (1 - Math.min(far, 1)) * 0.12);
      });

      hits.forEach(({ sprite, perk }) => {
        const pulse = perkState(perk.id, perk.parentId, unlockedRef.current) === 'available'
          ? 1 + Math.sin(performance.now() / 280) * 0.12
          : 1;
        const hub = perk.parentId === null;
        const base = unlockedRef.current.has(perk.id) ? (hub ? 8 : 4.2) : hub ? 7.2 : 3.4;
        sprite.scale.setScalar(base * pulse);
      });

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += 0.03;
        p.mesh.position.lerpVectors(p.a, p.b, Math.min(1, p.t));
        if (p.t >= 1) {
          p.mesh.parent?.remove(p.mesh);
          pulses.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    const syncUnlock = (set: Set<string>) => {
      unlockedRef.current = set;
      applyUnlockVisual(set);
    };
    (el as HTMLDivElement & { __sync?: (s: Set<string>) => void }).__sync = syncUnlock;

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      renderer.dispose();
      glow.dispose();
      nebula.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [constels, onSelect]);

  useEffect(() => {
    const el = host.current as (HTMLDivElement & { __sync?: (s: Set<string>) => void }) | null;
    el?.__sync?.(unlocked);
  }, [unlocked]);

  const focused = constels[focusIdx];
  const shown = hover || active || (focused ? focused.perks[0] : null);
  const progress = xp;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-900/30" style={{ height: 'min(80vh, 780px)', fontFamily: 'Georgia, serif' }}>
      <div ref={host} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[min(94%,860px)] pointer-events-none">
        <div
          className="flex items-center justify-between px-6 py-2 text-white"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6,12,22,0.72), transparent)',
            borderTop: '1px solid rgba(186,230,253,0.4)',
            borderBottom: '1px solid rgba(186,230,253,0.4)'
          }}
        >
          <span className="text-[11px] tracking-[0.3em] uppercase text-cyan-100/80">
            {mode === 'macro' ? 'Voûte' : 'Constellation'}
          </span>
          <span className="text-sm tracking-wide">{focused?.title}</span>
          <span className="text-[11px] tracking-[0.2em] uppercase text-cyan-100/75">
            {focused?.archetype}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="absolute top-[4.6rem] left-4 z-20 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase text-cyan-50"
        style={{ border: '1px solid rgba(186,230,253,0.35)', background: 'rgba(8,16,28,0.45)' }}
        onClick={() => {
          api.current.zoomT = 0;
          setMode('macro');
          setActive(null);
          onSelect(null);
        }}
      >
        ← Voûte céleste
      </button>

      {mode === 'micro' && shown && (
        <div className="absolute inset-x-0 top-[40%] z-20 pointer-events-none text-center px-6">
          <h2 className="text-white text-4xl font-semibold tracking-wide drop-shadow-[0_4px_16px_#000]">
            {shown.label}
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-[15px] text-cyan-50/90 drop-shadow-[0_2px_10px_#000]">
            {shown.desc}
          </p>
        </div>
      )}

      {mode === 'macro' && focused && (
        <div className="absolute inset-x-0 bottom-24 z-20 pointer-events-none text-center">
          <h2 className="text-white text-3xl tracking-wide drop-shadow-[0_4px_16px_#000]">{focused.title}</h2>
          <p className="text-cyan-50/85 text-sm mt-2 max-w-lg mx-auto drop-shadow-[0_2px_8px_#000]">{focused.object}</p>
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(94%,880px)] flex gap-3 text-[11px] tracking-[0.16em] uppercase text-white">
        <div className="flex-1 px-3 py-1.5" style={{ background: 'rgba(8,16,28,0.55)', border: '1px solid rgba(186,230,253,0.25)' }}>
          <div className="flex justify-between mb-1 opacity-85">
            <span>{focused?.title}</span>
            <span>{progress}</span>
          </div>
          <div className="h-1.5 bg-black/40 overflow-hidden">
            <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
          </div>
        </div>
        <div className="flex-1 px-3 py-1.5 opacity-90" style={{ background: 'rgba(8,16,28,0.55)', border: '1px solid rgba(186,230,253,0.25)' }}>
          Glisser : orbite · Molette : zoom · Clic : débloquer
        </div>
      </div>
    </div>
  );
};
