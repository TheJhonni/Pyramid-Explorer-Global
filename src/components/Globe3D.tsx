import { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { Pyramid } from '@/types/pyramid';
import { getSunPosition } from '@/utils/sunPosition';

interface Globe3DProps {
  pyramids: Pyramid[];
  filteredIds: string[];
  selectedId: string | null;
  flyToKey: number;
  onSelect: (pyramid: Pyramid) => void;
  focusPoint?: { lat: number; lng: number; altitude: number } | null;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

// Phones and touch tablets get a lighter texture, no bump map and a capped pixel ratio.
const isLowPower = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

const Globe3D = ({ pyramids, filteredIds, selectedId, flyToKey, onSelect, focusPoint }: Globe3DProps) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [lowPower] = useState(isLowPower);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const flyTimeoutsRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  // Read through a ref so that switching language does not fly the camera again.
  const pyramidsRef = useRef(pyramids);
  pyramidsRef.current = pyramids;
  const filteredSet = useMemo(() => new Set(filteredIds), [filteredIds]);

  const clearFlyTimeouts = useCallback(() => {
    flyTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    flyTimeoutsRef.current = [];
  }, []);

  const stopCameraAnimation = useCallback(() => {
    clearFlyTimeouts();
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [clearFlyTimeouts]);

  const normalizeLngDelta = useCallback((from: number, to: number) => {
    let delta = to - from;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    return delta;
  }, []);

  const getCurrentPointOfView = useCallback(() => {
    const globe = globeRef.current;
    const pov: { lat?: number; lng?: number; altitude?: number } = globe?.pointOfView?.() ?? {};

    return {
      lat: Number(pov.lat ?? 0),
      lng: Number(pov.lng ?? 0),
      altitude: Number(pov.altitude ?? 2),
    };
  }, []);

  const animatePointOfView = useCallback((target: { lat: number; lng: number; altitude: number }, duration = 1200) => {
    const globe = globeRef.current;
    if (!globe) return;

    stopCameraAnimation();

    const startPov = getCurrentPointOfView();
    const lngDelta = normalizeLngDelta(startPov.lng, target.lng);
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      globe.pointOfView(
        {
          lat: startPov.lat + (target.lat - startPov.lat) * eased,
          lng: startPov.lng + lngDelta * eased,
          altitude: startPov.altitude + (target.altitude - startPov.altitude) * eased,
        },
        0
      );

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
      } else {
        globe.pointOfView(target, 0);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  }, [getCurrentPointOfView, normalizeLngDelta, stopCameraAnimation]);

  const flyToPoint = useCallback((target: { lat: number; lng: number; altitude: number }, duration = 1200, closeUp = false) => {
    const currentPov = getCurrentPointOfView();
    const angularDistance = Math.hypot(
      target.lat - currentPov.lat,
      normalizeLngDelta(currentPov.lng, target.lng)
    );

    const finalTarget = closeUp && angularDistance < 12
      ? { ...target, altitude: Math.min(target.altitude, 0.55) }
      : target;

    const shouldStageFlight = closeUp && angularDistance < 12;
    if (!shouldStageFlight) {
      animatePointOfView(finalTarget, duration);
      return;
    }

    animatePointOfView(
      {
        lat: currentPov.lat,
        lng: currentPov.lng,
        altitude: Math.max(currentPov.altitude, finalTarget.altitude, 1.9),
      },
      260
    );

    const timeoutId = window.setTimeout(() => {
      animatePointOfView(finalTarget, duration);
    }, 280);

    flyTimeoutsRef.current.push(timeoutId);
  }, [animatePointOfView, getCurrentPointOfView, normalizeLngDelta]);

  // Set up lighting based on sun position
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const scene = globe.scene();
    const camera = globe.camera();

    scene.children
      .filter((c: THREE.Object3D) => c instanceof THREE.Light)
      .forEach((l: THREE.Object3D) => scene.remove(l));

    const ambient = new THREE.AmbientLight(0x334455, 0.6);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    scene.add(sunLight);

    const updateSun = () => {
      const sun = getSunPosition();
      const phi = (90 - sun.lat) * (Math.PI / 180);
      const theta = (sun.lng + 180) * (Math.PI / 180);
      const r = 200;
      sunLight.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    updateSun();
    const interval = setInterval(updateSun, 60000);

    camera.position.set(0, 0, 300);
    // Narrow screens need the camera further away to fit the whole globe.
    const narrow = (containerRef.current?.clientWidth ?? window.innerWidth) < 640;
    globe.pointOfView({ lat: 20, lng: 10, altitude: narrow ? 3.6 : 2.2 }, 0);

    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      controls.autoRotateSpeed = 0.3;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minDistance = 120;
      controls.maxDistance = 500;
      controls.addEventListener?.('start', () => {
        controls.autoRotate = false;
        stopCameraAnimation();
      });
    }

    scene.background = new THREE.Color(0x0a0a14);
    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));

    // Stop rendering while the tab is hidden (battery on mobile).
    const onVisibility = () => (document.hidden ? globe.pauseAnimation() : globe.resumeAnimation());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      stopCameraAnimation();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [stopCameraAnimation, lowPower]);

  // Focus on continent
  useEffect(() => {
    if (!focusPoint || !globeRef.current) return;

    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
    }

    flyToPoint(focusPoint, 1000, false);
  }, [focusPoint, flyToPoint]);

  // Fly to selected pyramid (from list or globe click)
  useEffect(() => {
    if (!selectedId || !globeRef.current) return;

    const pyramid = pyramidsRef.current.find((p) => p.id === selectedId);
    if (!pyramid) return;

    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
    }

    flyToPoint(
      {
        lat: Number(pyramid.coordinate.lat),
        lng: Number(pyramid.coordinate.lon),
        altitude: 1.5,
      },
      1200,
      true
    );
  }, [selectedId, flyToKey, flyToPoint]);

  // Custom pyramid geometry
  const pyramidGeom = useMemo(() => new THREE.ConeGeometry(0.8, 2, 4), []);
  
  const goldMat = useMemo(() => new THREE.MeshPhongMaterial({
    color: 0xd4af37,
    emissive: 0x443300,
    shininess: 100,
    specular: 0xffffff,
  }), []);

  const glowMat = useMemo(() => new THREE.MeshPhongMaterial({
    color: 0x22c55e,
    emissive: 0x0a5a2a,
    shininess: 150,
    specular: 0x00ff88,
  }), []);

  const selectedMat = useMemo(() => new THREE.MeshPhongMaterial({
    color: 0x00ffaa,
    emissive: 0x00aa55,
    shininess: 200,
    specular: 0x00ffcc,
  }), []);

  const dimMat = useMemo(() => new THREE.MeshPhongMaterial({
    color: 0x665533,
    emissive: 0x221100,
    shininess: 30,
    opacity: 0.4,
    transparent: true,
  }), []);

  const objectThreeObject = useCallback((d: object) => {
    const pyramid = d as Pyramid;
    const isFiltered = filteredSet.has(pyramid.id);
    const isSelected = pyramid.id === selectedId;
    const hasFilter = filteredIds.length < pyramids.length;
    
    let mat = goldMat;
    if (isSelected) mat = selectedMat;
    else if (isFiltered) mat = glowMat;
    else if (hasFilter) mat = dimMat;

    const mesh = new THREE.Mesh(pyramidGeom, mat);
    const scale = isSelected ? 2.5 : isFiltered ? 1.8 : 1;
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.x = Math.PI; // point upward
    return mesh;
  }, [filteredSet, filteredIds.length, selectedId, pyramids.length, pyramidGeom, goldMat, glowMat, selectedMat, dimMat]);

  const handleObjectClick = useCallback((obj: object) => {
    const pyramid = obj as Pyramid;
    onSelect(pyramid);
  }, [onSelect]);

  // Track the container size so the canvas follows layout changes (rotation, panel toggles).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="globe-container absolute inset-0">
      <Globe
        ref={globeRef}
        globeImageUrl={lowPower ? '/textures/earth-2k.webp' : '/textures/earth-4k.webp'}
        bumpImageUrl={lowPower ? undefined : '/textures/earth-topology.webp'}
        rendererConfig={{ antialias: !lowPower, powerPreference: 'high-performance' }}
        showAtmosphere={true}
        atmosphereColor="#2a5a4a"
        atmosphereAltitude={0.2}
        objectsData={pyramids}
        objectLat={(d: object) => (d as Pyramid).coordinate.lat}
        objectLng={(d: object) => (d as Pyramid).coordinate.lon}
        objectAltitude={0.02}
        objectThreeObject={objectThreeObject}
        onObjectClick={handleObjectClick}
        objectLabel={(d: object) => {
          const p = d as Pyramid;
          return `<div style="background:rgba(0,0,0,0.85);border:1px solid rgba(34,197,94,0.4);padding:8px 12px;border-radius:6px;font-family:Inter,sans-serif;font-size:13px;color:#e0e0e0;max-width:200px;">
            <div style="color:#d4af37;font-weight:600;margin-bottom:2px;">${escapeHtml(p.nome)}</div>
            <div style="font-size:11px;color:#888;font-family:'IBM Plex Mono',monospace;">${escapeHtml(p.paese)} · ${p.coordinate.lat.toFixed(2)}°, ${p.coordinate.lon.toFixed(2)}°</div>
            ${p.osmanagich_focus ? '<div style="margin-top:4px;font-size:10px;color:#22c55e;">★ Focus Osmanagich</div>' : ''}
          </div>`;
        }}
        width={size.width || undefined}
        height={size.height || undefined}
      />
    </div>
  );
};

export default Globe3D;
