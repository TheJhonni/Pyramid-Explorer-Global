import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Move, X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  GridHelper,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { useI18n } from '@/i18n/I18nContext';
import { buildModelPositions, modelHeight, modelSpan, SiteModel } from '@/utils/model';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  model: SiteModel;
}

const MIN_DISTANCE = 1.2;
const MAX_DISTANCE = 6;
/** Far enough for the whole model to fit, also on a narrow portrait screen. */
const fitDistance = (aspect: number) => (aspect >= 1 ? 2.2 : 2.2 / Math.pow(aspect, 0.85));

const ModelViewer = ({ open, onOpenChange, title, model }: Props) => {
  const { t, lang } = useI18n();
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [touched, setTouched] = useState(false);
  const { sections } = model;
  const m = (v: number) => `${v.toLocaleString(lang)} m`;
  const [base] = sections;
  const baseText = base[0] === base[1] ? m(base[0]) : `${base[0].toLocaleString(lang)} × ${m(base[1])}`;
  const bend = sections.length > 2 ? sections[1] : null;
  const summary = useMemo(
    () =>
      [`${t.base}: ${baseText}`, `${t.height}: ${m(modelHeight(sections))}`, bend ? t.modelBend.replace('{h}', m(bend[2])).replace('{w}', m(bend[0])) : '']
        .filter(Boolean)
        .join(' · '),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sections, lang],
  );

  useEffect(() => {
    if (!open || !host) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'grab';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${t.modelOpen}: ${title}. ${summary}`);
    host.appendChild(canvas);

    // Work in units of the widest side, so every model fills the view the same way.
    const span = modelSpan(sections);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(buildModelPositions(sections).map((v) => v / span), 3));
    geometry.computeVertexNormals();
    const material = new MeshStandardMaterial({ color: 0xd9b77a, roughness: 0.9, flatShading: true, side: DoubleSide });
    const edges = new EdgesGeometry(geometry);
    const lineMaterial = new LineBasicMaterial({ color: 0x3a2a12 });
    const grid = new GridHelper(2, 20, 0x4b5563, 0x1f2937);

    const scene = new Scene();
    scene.background = new Color(0x0b0f19);
    scene.add(new Mesh(geometry, material), new LineSegments(edges, lineMaterial), grid);
    scene.add(new AmbientLight(0xffffff, 0.55));
    const sun = new DirectionalLight(0xffffff, 2.4);
    sun.position.set(2.5, 3, 1);
    scene.add(sun);

    const camera = new PerspectiveCamera(40, 1, 0.01, 50);
    const centerY = modelHeight(sections) / span / 2;
    let yaw = Math.PI / 5;
    let pitch = 0.35;
    let distance = 2.2;
    let zoomed = false;
    let frame = 0;
    const render = () => {
      frame = 0;
      camera.position.set(
        distance * Math.cos(pitch) * Math.sin(yaw),
        centerY + distance * Math.sin(pitch),
        distance * Math.cos(pitch) * Math.cos(yaw),
      );
      camera.lookAt(0, centerY, 0);
      renderer.render(scene, camera);
    };
    const invalidate = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.aspect = host.clientWidth / Math.max(1, host.clientHeight);
      camera.updateProjectionMatrix();
      if (!zoomed) distance = fitDistance(camera.aspect);
      invalidate();
    };
    const rotate = (dx: number, dy: number) => {
      yaw -= dx * 0.008;
      pitch = Math.max(0.02, Math.min(1.45, pitch + dy * 0.008));
      setTouched(true);
      invalidate();
    };
    const zoom = (factor: number) => {
      zoomed = true;
      distance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, distance * factor));
      invalidate();
    };

    const pointers = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    const gap = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      canvas.style.cursor = 'grabbing';
      if (pointers.size === 2) pinch = gap();
    };
    const move = (e: PointerEvent) => {
      const last = pointers.get(e.pointerId);
      if (!last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last.x = e.clientX;
      last.y = e.clientY;
      if (pointers.size === 1) rotate(dx, dy);
      else if (pointers.size === 2) {
        const next = gap();
        if (pinch > 0) zoom(pinch / next);
        pinch = next;
      }
    };
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      pinch = 0;
      if (!pointers.size) canvas.style.cursor = 'grab';
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom(Math.exp(e.deltaY * 0.001));
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') rotate(-25, 0);
      else if (e.key === 'ArrowRight') rotate(25, 0);
      else if (e.key === 'ArrowUp') rotate(0, 25);
      else if (e.key === 'ArrowDown') rotate(0, -25);
      else if (e.key === '+' || e.key === '=') zoom(0.9);
      else if (e.key === '-') zoom(1 / 0.9);
      else return;
      e.preventDefault();
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', key);
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('keydown', key);
      geometry.dispose();
      edges.dispose();
      material.dispose();
      lineMaterial.dispose();
      grid.geometry.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [open, host, sections, summary, t.modelOpen, title]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby="model-note"
          className="fixed inset-0 z-[60] bg-[#0b0f19] text-foreground outline-none">
          <div ref={setHost} className="absolute inset-0" />

          <header className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/75 to-transparent px-4 pb-8 pt-4 pr-16 md:px-8 md:pt-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">{t.modelOpen}</p>
            <DialogPrimitive.Title className="mt-1 text-lg font-semibold leading-tight text-white md:text-2xl">{title}</DialogPrimitive.Title>
            <p className="mt-1 text-xs text-white/85 md:text-sm">{summary}</p>
          </header>

          <DialogPrimitive.Close aria-label={t.close} className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-border bg-card/80 hover:bg-card md:right-6 md:top-5">
            <X size={20} />
          </DialogPrimitive.Close>

          {failed && <p role="alert" className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-white/80">{t.modelFailed}</p>}

          {!failed && !touched && (
            <p className="pointer-events-none absolute inset-x-0 bottom-36 z-10 flex justify-center md:bottom-28">
              <span className="flex items-center gap-2 rounded-full bg-black/75 px-4 py-2 text-sm text-white">
                <Move size={16} /> {t.modelHint}
              </span>
            </p>
          )}

          <footer className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 text-xs text-white/90 md:px-8">
            <p id="model-note">{t.modelNote}</p>
            <ul className="mt-1 space-y-0.5">
              {model.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">
                    {s.title} <ExternalLink size={11} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ModelViewer;
