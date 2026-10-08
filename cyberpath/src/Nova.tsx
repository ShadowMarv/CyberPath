import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLS } from './hooks';
const W = 150, H = 190;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k; const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
/** Nova: a small 3D chibi mascot built from Three.js primitives. She stays where you put her, looks at the pointer,
 *  blinks, can be dragged and picked up, and does a happy spin with sparkles when clicked. No text. */
export default function Nova() {
  const [on, setOn] = useLS<boolean>('nova', true); const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => { const f = () => setOn(!on); window.addEventListener('toggle-nova', f); return () => window.removeEventListener('toggle-nova', f); });
  useEffect(() => {
    if (!on || !cv.current) return;
    const el = cv.current; const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const r = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true }); r.setPixelRatio(Math.min(window.devicePixelRatio, 2)); r.setSize(W, H, false);
    const sc = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(34, W / H, 0.1, 50); cam.position.set(0, 2.2, 8.6); cam.lookAt(0, 2.2, 0);
    sc.add(new THREE.AmbientLight(0xffffff, 1.5)); const dl = new THREE.DirectionalLight(0xffffff, 2.2); dl.position.set(3, 5, 6); sc.add(dl);
    const M = (c: number) => new THREE.MeshToonMaterial({ color: c });
    const skin = M(0xf6cfae), hair = M(0x2b2060), hood = M(0x5b3df5), hoodD = M(0x4630c9), dark = M(0x1a1a2e), acc = M(0xa495ff), white = M(0xffffff), lip = M(0xc0505f);
    const pink = new THREE.MeshBasicMaterial({ color: 0xf59aa8, transparent: true, opacity: 0.6, side: THREE.DoubleSide }); const outline = new THREE.MeshBasicMaterial({ color: 0x1a1a2e, side: THREE.BackSide });
    const geos: THREE.BufferGeometry[] = []; const mats: THREE.Material[] = [skin, hair, hood, hoodD, dark, acc, white, lip, pink, outline];
    const grp = (p: THREE.Object3D, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g; };
    const mk = (p: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1, line = false) => { geos.push(geo); const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); p.add(m); if (line) { const o = new THREE.Mesh(geo, outline); o.scale.setScalar(1.06); m.add(o); } return m; };
    const pivot = grp(sc), girl = grp(pivot);
    const legL = grp(girl, -0.28, 0.85), legR = grp(girl, 0.28, 0.85);
    [legL, legR].forEach(l => { mk(l, new THREE.CylinderGeometry(0.15, 0.13, 0.55, 12), dark, 0, -0.28, 0); mk(l, new THREE.SphereGeometry(0.2, 12, 10), white, 0, -0.58, 0.08, 1, 0.6, 1.35, true); });
    const body = grp(girl, 0, 1.3); mk(body, new THREE.CapsuleGeometry(0.48, 0.3, 6, 16), hood, 0, 0, 0, 1, 1, 0.85, true); mk(body, new THREE.TorusGeometry(0.3, 0.09, 8, 20), hoodD, 0, 0.5, 0).rotation.x = Math.PI / 2;
    const armL = grp(girl, -0.58, 1.55), armR = grp(girl, 0.58, 1.55);
    [armL, armR].forEach(a => { mk(a, new THREE.CapsuleGeometry(0.13, 0.3, 4, 10), hood, 0, -0.28, 0, 1, 1, 1, true); mk(a, new THREE.SphereGeometry(0.14, 10, 8), skin, 0, -0.64, 0); });
    const head = grp(girl, 0, 2.75);
    mk(head, new THREE.SphereGeometry(0.95, 32, 24), skin, 0, 0, 0, 1.05, 1, 1, true); mk(head, new THREE.SphereGeometry(1.0, 28, 20), hair, 0, 0.05, -0.2, 1.06, 1.04, 1, true);
    mk(head, new THREE.SphereGeometry(1.0, 28, 12, 0, Math.PI * 2, 0, 0.85), hair, 0, 0.05, 0.02, 1.06, 1, 1.02).rotation.x = 0.3;
    [-1, 1].forEach(s => { mk(head, new THREE.SphereGeometry(0.26, 14, 12), hair, s * 0.8, 0.98, -0.1, 1, 1, 1, true); mk(head, new THREE.SphereGeometry(0.09, 8, 6), acc, s * 0.8, 0.74, 0.0); });
    mk(head, new THREE.TorusGeometry(1.03, 0.07, 8, 32, Math.PI), dark, 0, 0.05, 0);
    [-1, 1].forEach(s => { const c = mk(head, new THREE.CylinderGeometry(0.3, 0.3, 0.22, 20), dark, s * 1.02, -0.02, 0); c.rotation.z = Math.PI / 2; const ring = mk(head, new THREE.CylinderGeometry(0.18, 0.18, 0.25, 16), acc, s * 1.02, -0.02, 0); ring.rotation.z = Math.PI / 2; });
    const eyes = grp(head), eL = grp(eyes, -0.4, -0.05, 0.84), eR = grp(eyes, 0.4, -0.05, 0.84);
    [eL, eR].forEach(e => { mk(e, new THREE.SphereGeometry(0.17, 12, 10), dark, 0, 0, 0, 1, 1.35, 0.5); mk(e, new THREE.SphereGeometry(0.055, 8, 6), white, 0.05, 0.1, 0.07); });
    [-1, 1].forEach(s => { mk(head, new THREE.TorusGeometry(0.26, 0.03, 6, 20), dark, s * 0.4, -0.05, 0.9); const b = mk(head, new THREE.CircleGeometry(0.13, 16), pink, s * 0.62, -0.3, 0.7); b.rotation.y = s * 0.7; });
    mk(head, new THREE.BoxGeometry(0.14, 0.03, 0.03), dark, 0, -0.02, 0.9); mk(head, new THREE.TorusGeometry(0.1, 0.022, 6, 12, Math.PI), lip, 0, -0.38, 0.87).rotation.z = Math.PI;
    const N = 16; const pg = new THREE.BufferGeometry(); const pp = new Float32Array(N * 3); const pv = new Float32Array(N * 3); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    const pm = new THREE.PointsMaterial({ color: 0xffd966, size: 0.22, transparent: true, opacity: 0 }); const pts = new THREE.Points(pg, pm); pts.frustumCulled = false; sc.add(pts); geos.push(pg); mats.push(pm);
    const clampX = (v: number) => cl(v, 0, window.innerWidth - W), clampY = (v: number) => cl(v, 64, window.innerHeight - H);
    let x = 12, y = clampY(window.innerHeight - H - 6), tx = x, ty = y, mx = window.innerWidth / 2, my = window.innerHeight / 2, st = 'idle', until = 1.5, t = 0, ph = 0, dirx = 0, jh = 0, jv = 0, spin = 0, blinkAt = 2, blinkT = 0, pl = 0, last = performance.now(), raf = 0;
    let offx = 0, offy = 0, moved = 0, drag = false;
    const apply = () => { el.style.transform = `translate3d(${x}px,${y}px,0)`; }; apply();
    const burst = () => { for (let i = 0; i < N; i++) { pp[i * 3] = 0; pp[i * 3 + 1] = 3.4; pp[i * 3 + 2] = 0.6; const a = Math.random() * 6.28, s = 1.2 + Math.random() * 1.6; pv[i * 3] = Math.cos(a) * s; pv[i * 3 + 1] = 1.5 + Math.random() * 2; pv[i * 3 + 2] = Math.sin(a) * s * 0.5; } pl = 1; };
    const mv = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const down = (e: PointerEvent) => { drag = true; moved = 0; st = 'drag'; offx = e.clientX - x; offy = e.clientY - y; el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; };
    const dmove = (e: PointerEvent) => { if (!drag) return; const nx = clampX(e.clientX - offx), ny = clampY(e.clientY - offy); moved += Math.abs(nx - x) + Math.abs(ny - y); x = nx; y = ny; apply(); };
    const up = () => { if (!drag) return; drag = false; el.style.cursor = 'grab'; st = 'idle'; until = t + 2.5; if (moved < 6) { jv = 5; spin = Math.PI * 2; burst(); } else jv = 3; if (calm) apply(); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', dmove); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); window.addEventListener('pointermove', mv);
    const rs = () => { x = clampX(x); y = clampY(y); apply(); }; window.addEventListener('resize', rs);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000); last = now; if (document.hidden) return; t += dt;
      const walk = st === 'walk' ? 1 : 0; ph += dt * 9 * walk; const sw = Math.sin(ph) * 0.7 * walk, dr = st === 'drag';
      legL.rotation.x = dr ? Math.sin(t * 7) * 0.3 : sw; legR.rotation.x = dr ? -Math.sin(t * 7) * 0.3 : -sw; armL.rotation.x = -sw * 0.8; armR.rotation.x = sw * 0.8;
      armL.rotation.z = lerp(armL.rotation.z, dr ? -2.4 : -0.12, 0.2); armR.rotation.z = lerp(armR.rotation.z, dr ? 2.4 : 0.12, 0.2);
      jv -= 16 * dt; jh = Math.max(0, jh + jv * dt); if (jh === 0 && jv < 0) jv = 0;
      girl.position.y = jh + (walk ? Math.abs(Math.sin(ph)) * 0.18 : Math.sin(t * 2) * 0.03); body.scale.y = 1 + Math.sin(t * 2) * 0.015;
      if (spin > 0) { const s = Math.min(spin, dt * 11); pivot.rotation.y += s; spin -= s; if (spin <= 0) pivot.rotation.y = 0; }
      girl.rotation.y = lerp(girl.rotation.y, walk && Math.abs(dirx) > 2 ? Math.sign(dirx) * 0.75 : 0, 0.12); girl.rotation.z = walk ? 0 : Math.sin(t * 1.5) * 0.035;
      const lx = cl((mx - (x + W / 2)) / 300, -1, 1), ly = cl(-(my - (y + H / 2 - 30)) / 300, -1, 1);
      head.rotation.y = lerp(head.rotation.y, cl(lx * 0.6 - girl.rotation.y * 0.3, -0.8, 0.8), 0.12); head.rotation.x = lerp(head.rotation.x, cl(-ly * 0.35, -0.35, 0.35), 0.12); eyes.position.x = lx * 0.06; eyes.position.y = ly * 0.04;
      if (t > blinkAt) { blinkT = 0.14; blinkAt = t + 2 + Math.random() * 3.5; } const bs = blinkT > 0 ? 1 - Math.sin(Math.PI * (1 - blinkT / 0.14)) * 0.92 : 1; blinkT -= dt; eL.scale.y = bs; eR.scale.y = bs;
      if (pl > 0) { for (let i = 0; i < N; i++) { pp[i * 3] += pv[i * 3] * dt; pp[i * 3 + 1] += pv[i * 3 + 1] * dt; pp[i * 3 + 2] += pv[i * 3 + 2] * dt; pv[i * 3 + 1] -= 3 * dt; } pg.attributes.position.needsUpdate = true; pm.opacity = Math.max(0, pl); pl -= dt * 1.3; }
      r.render(sc, cam);
    };
    if (calm) r.render(sc, cam); else raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', dmove); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); window.removeEventListener('pointermove', mv); window.removeEventListener('resize', rs); geos.forEach(g => g.dispose()); mats.forEach(m => m.dispose()); r.dispose(); };
  }, [on]);
  return on ? <canvas ref={cv} className="nova3" role="img" aria-label="Nova, a small 3D mascot you can drag around" /> : null;
}
