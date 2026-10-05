import { useEffect, useRef } from 'react';
import * as THREE from 'three';
export default function Globe() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!; let w = el.clientWidth || 600; const h = 320;
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(50, w / h, 0.1, 100); cam.position.z = 4.6;
    const r = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2)); r.setSize(w, h); el.appendChild(r.domElement);
    const col = () => getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#5b3df5';
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 90; i++) { const y = 1 - (i / 89) * 2, d = Math.sqrt(1 - y * y), t = i * 2.399963; pts.push(new THREE.Vector3(Math.cos(t) * d * 1.5, y * 1.5, Math.sin(t) * d * 1.5)); }
    const lp: number[] = []; const ed: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < 90; i++) for (let j = i + 1; j < 90; j++) if (pts[i].distanceTo(pts[j]) < 0.85) { lp.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z); ed.push([pts[i], pts[j]]); }
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
    const pg = new THREE.BufferGeometry().setFromPoints(pts); const cg = new THREE.IcosahedronGeometry(0.7, 1);
    const lm = new THREE.LineBasicMaterial({ color: col(), transparent: true, opacity: 0.35 });
    const pm = new THREE.PointsMaterial({ color: col(), size: 0.07 });
    const cm = new THREE.MeshBasicMaterial({ color: col(), wireframe: true, transparent: true, opacity: 0.5 });
    const g = new THREE.Group(); g.add(new THREE.LineSegments(lg, lm), new THREE.Points(pg, pm), new THREE.Mesh(cg, cm)); const sg = new THREE.SphereGeometry(0.06, 8, 8); const pkm = new THREE.MeshBasicMaterial({ color: '#ff4d4d' });
    const pk = Array.from({ length: 8 }, () => ({ m: new THREE.Mesh(sg, pkm), e: ed[Math.floor(Math.random() * ed.length)], t: Math.random() }));
    pk.forEach(p => g.add(p.m)); scene.add(g);
    let mx = 0, my = 0, raf = 0, n = 0;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mv = (e: PointerEvent) => { const b = el.getBoundingClientRect(); mx = (e.clientX - b.left) / b.width - 0.5; my = (e.clientY - b.top) / b.height - 0.5; };
    const rs = () => { w = el.clientWidth; r.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    el.addEventListener('pointermove', mv); window.addEventListener('resize', rs);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!calm) g.rotation.y += 0.004 + mx * 0.02;
      g.rotation.x += (my * 0.8 - g.rotation.x) * 0.05;
      if (++n % 30 === 0) { const c = col(); lm.color.set(c); pm.color.set(c); cm.color.set(c); }
      pk.forEach(p => { p.t += 0.015; if (p.t >= 1) { p.t = 0; p.e = ed[Math.floor(Math.random() * ed.length)]; } p.m.position.lerpVectors(p.e[0], p.e[1], p.t); });
      r.render(scene, cam);
    };
    loop();
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', mv); window.removeEventListener('resize', rs); [lg, pg, cg, sg, lm, pm, cm, pkm].forEach(x => x.dispose()); r.dispose(); r.domElement.remove(); };
  }, []);
  return <div className="globe" ref={ref} role="img" aria-label="Rotating network sphere. Move the pointer to tilt it." />;
}
