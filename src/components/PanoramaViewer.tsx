import { useEffect, useState } from 'react';
import { ExternalLink, Move, X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useI18n } from '@/i18n/I18nContext';
import { CommonsPhoto, fetchCommonsPhotos } from '@/utils/commonsPhotos';
import { clampFov, directionOf, maxPitch, SitePanorama, startFov, stripHalfHeight, wrapU } from '@/utils/panorama';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  panorama: SitePanorama;
}

type Status = 'loading' | 'ready' | 'failed';

const PANORAMA_WIDTH = 3840;

const PanoramaViewer = ({ open, onOpenChange, title, subtitle, panorama }: Props) => {
  const { t } = useI18n();
  // A state ref, because the dialog portal attaches its content after the first effect has run.
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [credit, setCredit] = useState<CommonsPhoto | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open || !host) return;
    let disposed = false;
    let teardown = () => {};
    setStatus('loading');

    (async () => {
      const [photo] = await fetchCommonsPhotos([panorama.file], PANORAMA_WIDTH);
      if (!photo) throw new Error('Panorama unavailable');
      if (disposed) return;
      setCredit(photo);

      const THREE = await import('three');
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      const texture = await loader.loadAsync(photo.url);
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;

      const { kind } = panorama;
      const halfHeight = stripHalfHeight(texture.image.width, texture.image.height);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      host.appendChild(renderer.domElement);
      const canvas = renderer.domElement;
      canvas.style.display = 'block';
      canvas.style.touchAction = 'none';
      canvas.style.cursor = 'grab';

      const geometry =
        kind === 'sphere'
          ? new THREE.SphereGeometry(10, 64, 40)
          : new THREE.CylinderGeometry(1, 1, halfHeight * 2, 96, 1, true);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x05070d);
      scene.add(new THREE.Mesh(geometry, material));
      const camera = new THREE.PerspectiveCamera(startFov(kind, halfHeight), 1, 0.01, 40);

      let u = panorama.start;
      let pitch = 0;
      let frame = 0;
      const target = new THREE.Vector3();
      const render = () => {
        frame = 0;
        const [x, z] = directionOf(kind, u);
        const limit = maxPitch(kind, halfHeight, camera.fov);
        pitch = Math.max(-limit, Math.min(limit, pitch));
        const p = (pitch * Math.PI) / 180;
        target.set(x * Math.cos(p), Math.sin(p), z * Math.cos(p));
        camera.lookAt(target);
        renderer.render(scene, camera);
      };
      const invalidate = () => {
        if (!frame) frame = requestAnimationFrame(render);
      };
      const resize = () => {
        renderer.setSize(host.clientWidth, host.clientHeight);
        camera.aspect = host.clientWidth / Math.max(1, host.clientHeight);
        camera.updateProjectionMatrix();
        invalidate();
      };
      const setFov = (fov: number) => {
        camera.fov = clampFov(fov, kind, halfHeight);
        camera.updateProjectionMatrix();
        invalidate();
      };
      const turn = (dx: number, dy: number) => {
        // The image follows the finger, at a speed that matches the current zoom.
        const perPixel = camera.fov / Math.max(1, host.clientHeight);
        u = wrapU(u - (dx * perPixel) / 360);
        pitch += dy * perPixel;
        setTouched(true);
        invalidate();
      };

      const pointers = new Map<number, { x: number; y: number }>();
      let pinch = 0;
      const distance = () => {
        const [a, b] = [...pointers.values()];
        return Math.hypot(a.x - b.x, a.y - b.y);
      };
      const down = (e: PointerEvent) => {
        canvas.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        canvas.style.cursor = 'grabbing';
        if (pointers.size === 2) pinch = distance();
      };
      const move = (e: PointerEvent) => {
        const last = pointers.get(e.pointerId);
        if (!last) return;
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        last.x = e.clientX;
        last.y = e.clientY;
        if (pointers.size === 1) turn(dx, dy);
        else if (pointers.size === 2) {
          const next = distance();
          if (pinch > 0) setFov(camera.fov * (pinch / next));
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
        setFov(camera.fov * Math.exp(e.deltaY * 0.001));
      };
      const key = (e: KeyboardEvent) => {
        const step = 40;
        if (e.key === 'ArrowLeft') turn(step, 0);
        else if (e.key === 'ArrowRight') turn(-step, 0);
        else if (e.key === 'ArrowUp') turn(0, step);
        else if (e.key === 'ArrowDown') turn(0, -step);
        else if (e.key === '+' || e.key === '=') setFov(camera.fov * 0.9);
        else if (e.key === '-') setFov(camera.fov / 0.9);
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
      setStatus('ready');

      teardown = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener('keydown', key);
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
        canvas.remove();
      };
    })().catch(() => {
      if (!disposed) setStatus('failed');
    });

    return () => {
      disposed = true;
      teardown();
    };
  }, [open, panorama, host]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content aria-describedby={undefined} className="fixed inset-0 z-[60] bg-[#05070d] text-foreground outline-none">
          <div ref={setHost} className="absolute inset-0" />

          <header className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 to-transparent px-4 pb-8 pt-4 pr-16 md:px-8 md:pt-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">{subtitle}</p>
            <DialogPrimitive.Title className="mt-1 text-lg font-semibold leading-tight text-white md:text-2xl">{title}</DialogPrimitive.Title>
          </header>

          <DialogPrimitive.Close aria-label={t.close} className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-border bg-card/80 hover:bg-card md:right-6 md:top-5">
            <X size={20} />
          </DialogPrimitive.Close>

          {status === 'loading' && <p role="status" className="absolute inset-0 grid place-items-center text-sm text-white/80">{t.panoramaLoading}</p>}
          {status === 'failed' && <p role="alert" className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-white/80">{t.panoramaFailed}</p>}

          {status === 'ready' && !touched && (
            <p className="pointer-events-none absolute inset-x-0 bottom-20 z-10 flex justify-center">
              <span className="flex items-center gap-2 rounded-full bg-black/75 px-4 py-2 text-sm text-white">
                <Move size={16} /> {t.panoramaHint}
              </span>
            </p>
          )}

          {credit && (
            <footer className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 text-xs text-white/90 md:px-8">
              <p className="pointer-events-auto">
                {credit.author} ·{' '}
                {credit.licenseUrl ? (
                  <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{credit.license}</a>
                ) : (
                  credit.license
                )}{' '}
                ·{' '}
                <a href={credit.page} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">
                  Wikimedia Commons <ExternalLink size={11} />
                </a>
              </p>
            </footer>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default PanoramaViewer;
