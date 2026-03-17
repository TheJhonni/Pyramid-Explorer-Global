import { useRef, useEffect, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { Pyramid } from '@/types/pyramid';
import { getSunPosition } from '@/utils/sunPosition';

interface Globe3DProps {
  pyramids: Pyramid[];
  filteredIds: string[];
  selectedId: string | null;
  onSelect: (pyramid: Pyramid) => void;
  focusPoint?: { lat: number; lng: number; altitude: number } | null;
}

const Globe3D = ({ pyramids, filteredIds, selectedId, onSelect, focusPoint }: Globe3DProps) => {
  const globeRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up lighting based on sun position
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const scene = globe.scene();
    const camera = globe.camera();
    
    // Remove default lights
    scene.children
      .filter((c: THREE.Object3D) => c instanceof THREE.Light)
      .forEach((l: THREE.Object3D) => scene.remove(l));

    // Ambient light (dim)
    const ambient = new THREE.AmbientLight(0x334455, 0.6);
    scene.add(ambient);

    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    scene.add(sunLight);

    // Update sun position
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
    const interval = setInterval(updateSun, 60000); // every minute

    // Camera initial position
    camera.position.set(0, 0, 300);
    
    // Controls
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minDistance = 120;
      controls.maxDistance = 500;
    }

    // Background
    scene.background = new THREE.Color(0x0a0a14);

    return () => clearInterval(interval);
  }, []);

  // Focus on continent
  useEffect(() => {
    if (focusPoint && globeRef.current) {
      globeRef.current.pointOfView(focusPoint, 1000);
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = false;
      }
    }
  }, [focusPoint]);

  // Fly to selected pyramid (from list or globe click)
  useEffect(() => {
    if (selectedId && globeRef.current) {
      const pyramid = pyramids.find(p => p.id === selectedId);
      if (pyramid) {
        globeRef.current.pointOfView(
          { lat: pyramid.coordinate.lat, lng: pyramid.coordinate.lon, altitude: 1.5 },
          800
        );
        const controls = globeRef.current.controls();
        if (controls) controls.autoRotate = false;
      }
    }
  }, [selectedId, pyramids]);

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
    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: pyramid.coordinate.lat, lng: pyramid.coordinate.lon, altitude: 1.5 },
        800
      );
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = false;
    }
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
