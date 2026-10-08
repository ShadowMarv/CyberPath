import { useEffect, useState } from 'react';
export function useLS<T>(k: string, d: T): [T, (v: T) => void] {
  const [v, s] = useState<T>(() => { try { const x = localStorage.getItem(k); return x ? (JSON.parse(x) as T) : d; } catch { return d; } });
  return [v, (n: T) => { s(n); try { localStorage.setItem(k, JSON.stringify(n)); } catch { /* storage unavailable */ } window.dispatchEvent(new Event('ls')); }];
}
export function useHash(): string {
  const [h, s] = useState(location.hash.slice(1));
  useEffect(() => { const f = () => { s(location.hash.slice(1)); window.scrollTo(0, 0); }; window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  return h;
}
export const caesar = (s: string, k: number): string => s.replace(/[a-z]/gi, c => { const b = c < 'a' ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + k) % 26 + b); });
export async function sha(alg: string, t: string): Promise<string> {
  const h = await crypto.subtle.digest(alg, new TextEncoder().encode(t));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export const vig = (s: string, k: string, dec = false): string => { const key = k.replace(/[^a-z]/gi, '').toUpperCase(); if (!key) return s; let j = 0; return s.replace(/[a-z]/gi, c => { const b = c < 'a' ? 65 : 97; const sh = (key.charCodeAt(j++ % key.length) - 65) * (dec ? -1 : 1); return String.fromCharCode((((c.charCodeAt(0) - b + sh) % 26) + 26) % 26 + b); }); };
