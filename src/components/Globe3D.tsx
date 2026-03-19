import { useRef, useEffect, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
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

const Globe3D = ({ pyramids, filteredIds, selectedId, flyToKey, onSelect, focusPoint }: Globe3DProps) => {
  const globeRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const flyTimeoutsRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);

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

  const animatePointOfView = useCallback((target: { lat: number; lng: number; altitude: number }, duration = 1200) => {
    const globe = globeRef.current;
    if (!globe) return;

    stopCameraAnimation();

    const start = globe.pointOfView();
    const startPov = {
      lat: Number(start.lat ?? 0),
      lng: Number(start.lng ?? 0),
      altitude: Number(start.altitude ?? 2),
    };

    const normalizeLngDelta = (from: number, to: number) => {
      let delta = to - from;
      while (delta > 180) delta -= 360;
      while (delta < -180) delta += 360;
      return delta;
    };

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
  }, [stopCameraAnimation]);

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

    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
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

    return () => {
      clearInterval(interval);
      stopCameraAnimation();
    };
  }, [stopCameraAnimation]);

  // Focus on continent
  useEffect(() => {
    if (!focusPoint || !globeRef.current) return;

    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
    }

    animatePointOfView(focusPoint, 1000);
  }, [focusPoint, animatePointOfView]);

  // Fly to selected pyramid (from list or globe click)
  useEffect(() => {
    if (!selectedId || !globeRef.current) return;

    const pyramid = pyramids.find((p) => p.id === selectedId);
    if (!pyramid) return;

    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
    }

    animatePointOfView(
      {
        lat: Number(pyramid.coordinate.lat),
        lng: Number(pyramid.coordinate.lon),
        altitude: 1.5,
      },
      1200
    );
  }, [selectedId, flyToKey, pyramids, animatePointOfView]);

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
    const isFiltered = filteredIds.includes(pyramid.id);
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
  }, [filteredIds, selectedId, pyramids.length, pyramidGeom, goldMat, glowMat, selectedMat, dimMat]);

  const handleObjectClick = useCallback((obj: object) => {
    const pyramid = obj as Pyramid;
    onSelect(pyramid);
  }, [onSelect]);

  const handleResize = useCallback(() => {
    if (containerRef.current && globeRef.current) {
      // Globe handles its own resize
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const width = containerRef.current?.clientWidth || window.innerWidth - 320;
  const height = containerRef.current?.clientHeight || window.innerHeight;

  return (
    <div ref={containerRef} className="globe-container absolute inset-0">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
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
            <div style="color:#d4af37;font-weight:600;margin-bottom:2px;">${p.nome}</div>
            <div style="font-size:11px;color:#888;font-family:'IBM Plex Mono',monospace;">${p.paese} · ${p.coordinate.lat.toFixed(2)}°, ${p.coordinate.lon.toFixed(2)}°</div>
            ${p.osmanagich_focus ? '<div style="margin-top:4px;font-size:10px;color:#22c55e;">★ Focus Osmanagich</div>' : ''}
          </div>`;
        }}
        width={width}
        height={height}
      />
    </div>
  );
};

export default Globe3D;
