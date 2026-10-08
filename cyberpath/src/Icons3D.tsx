import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
const LB = ['Defend', 'Encrypt', 'Keys', 'Detect'];
/** Four rotating wireframe 3D icons (shield, lock, torus knot, icosahedron). GSAP drives the intro pop and hover scale. */
export default function Icons3D() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!; let w = el.clientWidth || 600; const h = 190;
    const sc = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(40, w / h, 0.1, 50); cam.position.z = 9;
    const r = new THREE.WebGLRenderer({ alpha: true, antialias: true }); r.setPixelRatio(Math.min(window.devicePixelRatio, 2)); r.setSize(w, h); el.appendChild(r.domElement);
    const col = () => getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#5b3df5';
    const mat = new THREE.MeshBasicMaterial({ color: col(), wireframe: true, transparent: true, opacity: 0.85 });
    const sh = new THREE.Shape(); sh.moveTo(0, 1.2); sh.lineTo(1, 0.8); sh.lineTo(1, -0.1); sh.quadraticCurveTo(1, -0.9, 0, -1.3); sh.quadraticCurveTo(-1, -0.9, -1, -0.1); sh.lineTo(-1, 0.8); sh.lineTo(0, 1.2);
    const gs = [new THREE.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: false }), new THREE.BoxGeometry(1.6, 1.2, 0.6), new THREE.TorusGeometry(0.55, 0.12, 8, 24, Math.PI), new THREE.TorusKnotGeometry(0.8, 0.22, 64, 8), new THREE.IcosahedronGeometry(1, 1)];
    gs[0].center();
    const lock = new THREE.Group(); const body = new THREE.Mesh(gs[1], mat); const sk = new THREE.Mesh(gs[2], mat); sk.position.y = 0.6; lock.add(body, sk); lock.position.y = -0.2;
    const objs: THREE.Object3D[] = [new THREE.Mesh(gs[0], mat), lock, new THREE.Mesh(gs[3], mat), new THREE.Mesh(gs[4], mat)]; objs.forEach(o => sc.add(o));
    const place = () => { const vw = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.aspect; objs.forEach((o, i) => { o.position.x = (i - 1.5) * vw / 4; }); }; place();
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; let hov = -1, raf = 0, n = 0;
    if (!calm) { objs.forEach(o => o.scale.set(0, 0, 0)); gsap.to(objs.map(o => o.scale), { x: 1, y: 1, z: 1, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.15, delay: 0.3 }); }
    const mv = (e: PointerEvent) => { const b = el.getBoundingClientRect(); const i = Math.min(3, Math.max(0, Math.floor((e.clientX - b.left) / b.width * 4))); if (i === hov || calm) return; hov = i;
      objs.forEach((o, k) => gsap.to(o.scale, { x: k === i ? 1.3 : 1, y: k === i ? 1.3 : 1, z: k === i ? 1.3 : 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })); };
    const lv = () => { hov = -1; if (!calm) objs.forEach(o => gsap.to(o.scale, { x: 1, y: 1, z: 1, duration: 0.35, overwrite: 'auto' })); };
    const rs = () => { w = el.clientWidth; r.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); place(); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', lv); window.addEventListener('resize', rs);
    const loop = () => { raf = requestAnimationFrame(loop); if (!calm) objs.forEach((o, i) => { o.rotation.y += i === hov ? 0.03 : 0.01; if (i === 2 || i === 3) o.rotation.x += 0.006; }); if (++n % 30 === 0) mat.color.set(col()); r.render(sc, cam); };
    loop();
    return () => { cancelAnimationFrame(raf); gsap.killTweensOf(objs.map(o => o.scale)); el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', lv); window.removeEventListener('resize', rs); [...gs, mat].forEach(x => x.dispose()); r.dispose(); r.domElement.remove(); };
  }, []);
  return <div className="i3"><div ref={ref} role="img" aria-label="Four rotating 3D icons: shield, lock, key knot and network" /><div className="i3l">{LB.map(x => <span key={x}>{x}</span>)}</div></div>;
}
