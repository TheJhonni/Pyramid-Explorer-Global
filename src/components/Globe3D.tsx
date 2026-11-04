import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pyramid } from '@/types/pyramid';
import { latLonToUnit } from '@/utils/geo';
import { MOBILE_SHEET_SHARE } from '@/utils/layout';
import {
  BACKGROUND_FRAGMENT, BACKGROUND_VERTEX, CLOUD_FRAGMENT, HALO_FRAGMENT, HALO_VERTEX, PIN_FRAGMENT, PIN_VERTEX,
  PLANET_FRAGMENT, PLANET_UNIFORMS_GLSL, SNOISE, STAR_FRAGMENT, STAR_VERTEX,
} from './planetShaders';

interface Globe3DProps {
  pyramids: Pyramid[];
  filteredIds: string[];
  selectedId: string | null;
  flyToKey: number;
  onSelect: (pyramid: Pyramid) => void;
  focusPoint?: { lat: number; lng: number; altitude: number } | null;
  detailsOpen?: boolean;
  onReady: () => void;
  onUnavailable: () => void;
}

const ASSETS = import.meta.env.VITE_PLANET_ASSETS ?? 'https://yccumtqwgl01awwe.public.blob.vercel-storage.com';
const RADIUS = 1.95;
const SITE_DISTANCE = 4.3;
const PIN_LIFT = 1.012;
const DEFAULT_VIEW = { lat: 20, lon: 15 };

const isLowPower = () => window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const loadTexture = (loader: THREE.TextureLoader, name: string, srgb: boolean) =>
  loader.loadAsync(`${ASSETS}/${name}`).then((texture) => {
    texture.flipY = false;
    if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

/** Splits each triangle in four, so the outline stays round when zoomed in. */
function buildPlanetGeometry(buffer: ArrayBuffer) {
  const [vertexCount, indexCount] = new Uint32Array(buffer, 0, 2);
  const srcPos = new Float32Array(buffer, 8, vertexCount * 3);
  const srcUv = new Float32Array(buffer, 8 + vertexCount * 12, vertexCount * 2);
  const srcIndex = new Uint16Array(buffer, 8 + vertexCount * 20, indexCount);

  const pos: number[] = Array.from(srcPos);
  const uv: number[] = Array.from(srcUv);
  const index: number[] = [];
  const mids = new Map<string, number>();
  const mid = (a: number, b: number) => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    const known = mids.get(key);
    if (known !== undefined) return known;
    const x = pos[a * 3] + pos[b * 3];
    const y = pos[a * 3 + 1] + pos[b * 3 + 1];
    const z = pos[a * 3 + 2] + pos[b * 3 + 2];
    const length = Math.hypot(x, y, z);
    pos.push(x / length, y / length, z / length);
    uv.push((uv[a * 2] + uv[b * 2]) / 2, (uv[a * 2 + 1] + uv[b * 2 + 1]) / 2);
    const id = pos.length / 3 - 1;
    mids.set(key, id);
    return id;
  };
  for (let i = 0; i < srcIndex.length; i += 3) {
    const [a, b, c] = [srcIndex[i], srcIndex[i + 1], srcIndex[i + 2]];
    const [ab, bc, ca] = [mid(a, b), mid(b, c), mid(c, a)];
    index.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  // Unit sphere: each position is also its normal.
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(pos, 3));
  geometry.setIndex(index);
  return geometry;
}

const usesSoftwareRendering = (renderer: THREE.WebGLRenderer) => {
  const gl = renderer.getContext();
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  return /swiftshader|llvmpipe|software|basic render/i.test(name);
};

const toVector = (lat: number, lon: number, scale = 1) => {
  const v = latLonToUnit(lat, lon);
  return new THREE.Vector3(v.x, v.y, v.z).multiplyScalar(scale);
};

interface Engine {
  pins: { attr: THREE.BufferAttribute; positions: THREE.Vector3[] } | null;
  flyTo: (lat: number, lon: number, distance: number) => void;
  setPins: (sites: Pyramid[]) => void;
  setPanelOffset: (x: number, y: number) => void;
  pick: (clientX: number, clientY: number, radius: number) => number[];
  invalidate: () => void;
}

const Globe3D = ({
  pyramids, filteredIds, selectedId, flyToKey, onSelect, focusPoint, detailsOpen, onReady, onUnavailable,
}: Globe3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const pyramidsRef = useRef(pyramids);
  pyramidsRef.current = pyramids;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onUnavailableRef = useRef(onUnavailable);
  onUnavailableRef.current = onUnavailable;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  const flyKeyRef = useRef(flyToKey);

  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<{ x: number; y: number; ids: number[] } | null>(null);
  const [choice, setChoice] = useState<{ x: number; y: number; ids: number[] } | null>(null);

  const filteredSet = useMemo(() => new Set(filteredIds), [filteredIds]);

  // The scene is built once. Language and filter changes only update what they touch.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const lowPower = isLowPower();
    const reduced = prefersReducedMotion();
    const defines: Record<string, string> = lowPower ? { LOW_POWER: '1' } : {};
    let disposed = false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !lowPower, powerPreference: 'high-performance' });
    } catch {
      onUnavailableRef.current();
      return;
    }
    // The scene's colours were tuned for output without gamma correction.
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', '3D globe');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    const fitDistance = () => {
      const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
      const verticalFit = (RADIUS * 2 * 1.2) / (2 * Math.tan(THREE.MathUtils.degToRad(20)));
      return Math.max(8, verticalFit / Math.min(aspect, 1));
    };
    camera.position.copy(toVector(DEFAULT_VIEW.lat, DEFAULT_VIEW.lon, fitDistance()));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.7;
    controls.maxDistance = 18;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = !reduced;
    controls.addEventListener('change', () => engineRef.current?.invalidate());
    controls.autoRotateSpeed = 0.25;

    scene.add(new THREE.AmbientLight(0xffffff, 1.8 * Math.PI));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI);
    sun.position.set(0, 10, 2);
    scene.add(sun);

    const clock = { planet: { value: 0 }, cloud: { value: 0 }, star: { value: 0 }, pin: { value: 0 } };
    const px = { value: 1 };

    const background = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        defines,
        uniforms: { iTime: { value: 0 } },
        vertexShader: BACKGROUND_VERTEX,
        fragmentShader: BACKGROUND_FRAGMENT,
        depthTest: false,
        depthWrite: false,
      }),
    );
    background.frustumCulled = false;
    background.renderOrder = -10;
    scene.add(background);

    // Stars
    const starCount = lowPower ? 500 : 1400;
    const starPos = new Float32Array(starCount * 3);
    const starSeed = new Float32Array(starCount);
    const starBright = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      starPos.set([90 * r * Math.cos(th), 90 * u, 90 * r * Math.sin(th)], i * 3);
      starSeed[i] = Math.random() * Math.PI * 2;
      starBright[i] = 0.35 + Math.random() * 0.65;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeometry.setAttribute('seed', new THREE.BufferAttribute(starSeed, 1));
    starGeometry.setAttribute('bright', new THREE.BufferAttribute(starBright, 1));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.ShaderMaterial({
        uniforms: { uTime: clock.star, uPx: px },
        vertexShader: STAR_VERTEX,
        fragmentShader: STAR_FRAGMENT,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    stars.frustumCulled = false;
    scene.add(stars);

    const root = new THREE.Group();
    scene.add(root);

    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: { uGlow: { value: new THREE.Vector3(0.2275, 0.4235, 1) }, uIntensity: { value: 3.35 } },
        vertexShader: HALO_VERTEX,
        fragmentShader: HALO_FRAGMENT,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    halo.scale.setScalar(RADIUS * 2.3);
    halo.visible = false;
    root.add(halo);

    // Pins
    const pinGeometry = new THREE.BufferGeometry();
    const pinMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: clock.pin, uPx: px },
      vertexShader: PIN_VERTEX,
      fragmentShader: PIN_FRAGMENT,
      transparent: true,
      depthWrite: false,
    });
    const pinPoints = new THREE.Points(pinGeometry, pinMaterial);
    pinPoints.frustumCulled = false;
    pinPoints.renderOrder = 5;
    pinPoints.visible = false;
    root.add(pinPoints);

    const clouds: { mesh: THREE.Mesh; spin: number }[] = [];
    const disposables: { dispose: () => void }[] = [];

    // How much the device can take. Without a GPU, or on a struggling one, the globe drops detail
    // and finally draws only when something changes, so the page stays responsive.
    let quality = usesSoftwareRendering(renderer) ? 2 : 0;
    let renderUntil = 0;
    let slowSum = 0;
    let slowFrames = 0;
    let panelOffset = { x: 0, y: 0 };
    const projected = new THREE.Vector3();
    const toCamera = new THREE.Vector3();
    const engine: Engine = {
      pins: null,
      flyTo: () => undefined,
      invalidate: () => {
        renderUntil = performance.now() + 400;
      },
      setPanelOffset: (x, y) => {
        panelOffset = { x, y };
        const { clientWidth: w, clientHeight: h } = container;
        if (x || y) camera.setViewOffset(w, h, x, y, w, h);
        else camera.clearViewOffset();
      },
      setPins: (sites) => {
        const positions = sites.map((s) => toVector(s.coordinate.lat, s.coordinate.lon, RADIUS * PIN_LIFT));
        const flat = new Float32Array(sites.length * 3);
        positions.forEach((p, i) => flat.set([p.x, p.y, p.z], i * 3));
        pinGeometry.setAttribute('position', new THREE.BufferAttribute(flat, 3));
        const seeds = new Float32Array(sites.length).map(() => Math.random());
        pinGeometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
        const attr = new THREE.BufferAttribute(new Float32Array(sites.length).fill(1), 1);
        pinGeometry.setAttribute('state', attr);
        engine.pins = { attr, positions };
        engine.invalidate();
      },
      pick: (clientX, clientY, radius) => {
        if (!engine.pins) return [];
        const rect = container.getBoundingClientRect();
        const found: { i: number; d: number }[] = [];
        engine.pins.positions.forEach((p, i) => {
          toCamera.copy(camera.position).sub(p).normalize();
          if (toCamera.dot(projected.copy(p).normalize()) < 0.15) return;
          projected.copy(p).project(camera);
          const x = rect.left + ((projected.x + 1) / 2) * rect.width;
          const y = rect.top + ((1 - projected.y) / 2) * rect.height;
          const d = Math.hypot(x - clientX, y - clientY);
          if (d <= radius) found.push({ i, d });
        });
        return found.sort((a, b) => a.d - b.d).map((f) => f.i);
      },
    };

    let flight: { from: THREE.Vector3; to: THREE.Vector3; fromD: number; toD: number; start: number; ms: number } | null = null;
    engine.flyTo = (lat, lon, distance) => {
      controls.autoRotate = false;
      const to = toVector(lat, lon);
      if (reduced) {
        camera.position.copy(to).multiplyScalar(distance);
        return;
      }
      flight = {
        from: camera.position.clone().normalize(),
        to,
        fromD: camera.position.length(),
        toD: distance,
        start: performance.now(),
        ms: 1500,
      };
    };
    engineRef.current = engine;
    controls.addEventListener('start', () => {
      flight = null;
      controls.autoRotate = false;
    });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      engine.setPanelOffset(panelOffset.x, panelOffset.y);
      camera.updateProjectionMatrix();
      px.value = (h * renderer.getPixelRatio()) / 900;
      engine.invalidate();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    // Assets
    const loader = new THREE.TextureLoader();
    const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), lowPower ? 2 : 8);
    Promise.all([
      fetch(`${ASSETS}/planet.bin`).then((r) => {
        if (!r.ok) throw new Error(`planet.bin ${r.status}`);
        return r.arrayBuffer();
      }),
      loadTexture(loader, lowPower ? 'earth-2k.webp' : 'earth-4k.webp', true),
      loadTexture(loader, lowPower ? 'lights-1k.webp' : 'lights-2k.webp', true),
      loader.loadAsync(`${ASSETS}/${lowPower ? 'clouds-512.webp' : 'clouds-1k.webp'}`),
    ])
      .then(([bin, day, lights, cloudTexture]) => {
        if (disposed) {
          [day, lights, cloudTexture].forEach((t) => t.dispose());
          return;
        }
        day.anisotropy = anisotropy;
        cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
        cloudTexture.repeat.set(5, 5);
        cloudTexture.colorSpace = THREE.SRGBColorSpace;
        disposables.push(day, lights, cloudTexture);

        const planetMaterial = new THREE.MeshStandardMaterial({ map: day, metalness: 0, roughness: 1 });
        planetMaterial.defines = { ...planetMaterial.defines, ...defines };
        planetMaterial.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, {
            time: clock.planet,
            rimColor: { value: new THREE.Vector3(0.757, 0.98, 1) },
            rimPower: { value: 2.4 },
            nightBlendTexture: { value: lights },
            nightLights: { value: 10 },
            terrainDepth: { value: 0.33 },
            terrainShade: { value: 1.3 },
            oceanGlint: { value: 0.45 },
            oceanDeep: { value: 0.12 },
            oceanFlow: { value: 3 },
            oceanFlowSpeed: { value: 0.8 },
            oceanFlowScale: { value: 2.1 },
          });
          shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec2 vCustomUv;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCustomUv = uv;');
          shader.fragmentShader = `${PLANET_UNIFORMS_GLSL}\n${lowPower ? '' : SNOISE}\n${shader.fragmentShader}`.replace(
            '#include <dithering_fragment>',
            PLANET_FRAGMENT,
          );
        };
        const planetGeometry = buildPlanetGeometry(bin);
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.scale.setScalar(RADIUS);
        root.add(planet);
        disposables.push(planetGeometry, planetMaterial);

        const layers = lowPower
          ? [{ height: 1.03, opacity: 0.6, spin: 0.08, phase: 0 }]
          : [
              { height: 1.005, opacity: 0.6, spin: 0.06, phase: 0 },
              { height: 1.03, opacity: 0.5, spin: 0.14, phase: 13 },
              { height: 1.075, opacity: 0.5, spin: 0.1, phase: 27 },
            ];
        layers.forEach((layer, i) => {
          const geometry = new THREE.SphereGeometry(RADIUS * layer.height, lowPower ? 40 : 64, lowPower ? 40 : 64);
          const material = new THREE.MeshStandardMaterial({ map: cloudTexture, transparent: true, depthWrite: false });
          material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, {
              uTime: clock.cloud,
              uOpacity: { value: layer.opacity },
              uPhase: { value: layer.phase },
            });
            shader.vertexShader = shader.vertexShader
              .replace('#include <common>', '#include <common>\nvarying vec2 vCloudUv;')
              .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCloudUv = uv;');
            shader.fragmentShader = `uniform float uTime; uniform float uOpacity; uniform float uPhase; varying vec2 vCloudUv;\n${SNOISE}\n${shader.fragmentShader}`.replace(
              '#include <dithering_fragment>',
              CLOUD_FRAGMENT,
            );
          };
          const mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.y = i * 2.2;
          mesh.renderOrder = 2;
          root.add(mesh);
          clouds.push({ mesh, spin: layer.spin });
          disposables.push(geometry, material);
        });

        applyQuality();
        // Compiling shaders off the main thread where the browser allows it avoids a long freeze.
        return renderer.compileAsync(scene, camera).then(() => {
          if (disposed) return;
          halo.visible = true;
          pinPoints.visible = true;
          setReady(true);
          onReadyRef.current();
          engine.invalidate();
        });
      })
      .catch(() => {
        if (!disposed) onUnavailableRef.current();
      });

    const applyQuality = () => {
      clouds.forEach((c, i) => {
        c.mesh.visible = quality === 0 || i === 0;
      });
      stars.visible = quality < 2;
      if (quality > 0 && renderer.getPixelRatio() > 1) {
        renderer.setPixelRatio(1);
        resize();
      }
      if (quality === 2) controls.autoRotate = false;
      engine.invalidate();
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (document.hidden) {
        last = now;
        return;
      }
      const elapsed = now - last;
      const dt = Math.min(0.05, elapsed / 1000);
      last = now;
      if (halo.visible && quality < 2) {
        slowSum += elapsed;
        slowFrames += 1;
        if (slowFrames === 40) {
          const average = slowSum / slowFrames;
          slowSum = 0;
          slowFrames = 0;
          if (average > 45) {
            quality = average > 90 ? 2 : quality + 1;
            applyQuality();
          }
        }
      }
      clock.planet.value += dt / 12;
      clock.cloud.value += dt / 20;
      clock.star.value += dt;
      clock.pin.value += dt;
      (background.material as THREE.ShaderMaterial).uniforms.iTime.value = now / 1000;
      clouds.forEach((c) => {
        c.mesh.rotation.y += dt * c.spin;
      });
      if (flight) {
        const t = Math.min(1, (now - flight.start) / flight.ms);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // Rises a little mid-flight on long hops, so it reads as a journey around the globe.
        const hop = Math.sin(Math.PI * t) * flight.from.angleTo(flight.to) * 0.5;
        const q = new THREE.Quaternion().setFromUnitVectors(flight.from, flight.to);
        const direction = flight.from.clone().applyQuaternion(new THREE.Quaternion().slerp(q, e));
        camera.position.copy(direction).multiplyScalar(THREE.MathUtils.lerp(flight.fromD, flight.toD, e) + hop);
        if (t >= 1) flight = null;
      }
      controls.update();
      // At the lowest quality, draw only while something is changing.
      if (quality === 2 && !flight && now > renderUntil) return;
      halo.quaternion.copy(camera.quaternion);
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    const onLost = (event: Event) => {
      event.preventDefault();
      onUnavailableRef.current();
    };
    renderer.domElement.addEventListener('webglcontextlost', onLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      disposables.forEach((d) => d.dispose());
      [background, halo].forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      starGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      pinGeometry.dispose();
      pinMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      engineRef.current = null;
    };
  }, []);

  // Pins follow the dataset order, which does not change with language or filters.
  const pinIds = useMemo(() => pyramids.map((p) => p.id).join(','), [pyramids]);
  useEffect(() => {
    engineRef.current?.setPins(pyramidsRef.current);
  }, [pinIds]);

  useEffect(() => {
    const pins = engineRef.current?.pins;
    if (!pins) return;
    pyramids.forEach((p, i) => {
      pins.attr.setX(i, p.id === selectedId ? 2 : filteredSet.has(p.id) ? 1 : 0);
    });
    pins.attr.needsUpdate = true;
    engineRef.current?.invalidate();
  }, [pyramids, filteredSet, selectedId, ready]);

  useEffect(() => {
    if (!focusPoint) return;
    engineRef.current?.flyTo(focusPoint.lat, focusPoint.lng, RADIUS * (1 + focusPoint.altitude));
  }, [focusPoint]);

  // Fly to a site when it is selected, and again when the same one is picked from the list.
  useEffect(() => {
    if (!selectedId) return;
    const site = pyramidsRef.current.find((p) => p.id === selectedId);
    if (site) engineRef.current?.flyTo(site.coordinate.lat, site.coordinate.lon, SITE_DISTANCE);
    flyKeyRef.current = flyToKey;
  }, [selectedId, flyToKey]);

  // Keep the site visible beside the panel on wide screens, and above the sheet on phones.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (!detailsOpen) {
      engine.setPanelOffset(0, 0);
    } else if (window.matchMedia('(min-width: 768px)').matches) {
      engine.setPanelOffset(240, 0);
    } else {
      engine.setPanelOffset(0, (window.innerHeight * MOBILE_SHEET_SHARE) / 2);
    }
  }, [detailsOpen]);

  const down = useRef<{ x: number; y: number; touch: boolean } | null>(null);

  const siteAt = (i: number) => pyramidsRef.current[i];

  return (
    <div
      ref={containerRef}
      className="globe-container absolute inset-0 touch-none"
      onPointerDown={(e) => {
        down.current = { x: e.clientX, y: e.clientY, touch: e.pointerType !== 'mouse' };
        setChoice(null);
      }}
      onPointerUp={(e) => {
        const start = down.current;
        down.current = null;
        if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) return;
        const hits = engineRef.current?.pick(e.clientX, e.clientY, start.touch ? 24 : 14) ?? [];
        if (hits.length === 1) onSelectRef.current(siteAt(hits[0]));
        else if (hits.length > 1) {
          const rect = containerRef.current!.getBoundingClientRect();
          setChoice({ x: e.clientX - rect.left, y: e.clientY - rect.top, ids: hits.slice(0, 15) });
        }
        setHover(null);
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || e.buttons) return;
        const hits = engineRef.current?.pick(e.clientX, e.clientY, 14) ?? [];
        const rect = containerRef.current!.getBoundingClientRect();
        setHover(hits.length ? { x: e.clientX - rect.left, y: e.clientY - rect.top, ids: hits.slice(0, 4) } : null);
        (e.currentTarget as HTMLDivElement).style.cursor = hits.length ? 'pointer' : 'grab';
      }}
      onPointerLeave={() => setHover(null)}
    >
      {hover && !choice && (
        <div
          className="pointer-events-none absolute z-10 max-w-[240px] rounded-md border border-border bg-black/85 px-3 py-2 text-xs"
          style={{ left: hover.x + 14, top: hover.y + 14 }}
        >
          {hover.ids.map((i) => (
            <p key={i} className="truncate">
              <span className="text-pyramid-gold font-medium">{siteAt(i).nome}</span>
              <span className="text-muted-foreground"> · {siteAt(i).paese}</span>
            </p>
          ))}
        </div>
      )}
      {choice && (
        <ul
          className="absolute z-20 max-h-56 w-60 max-w-[80%] overflow-y-auto rounded-md border border-border bg-card/95 shadow-xl backdrop-blur-sm"
          style={{ left: Math.min(choice.x, (containerRef.current?.clientWidth ?? 300) - 250), top: Math.min(choice.y, (containerRef.current?.clientHeight ?? 300) - 230) }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          {choice.ids.map((i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  setChoice(null);
                  onSelectRef.current(siteAt(i));
                }}
                className="w-full truncate px-3 py-2.5 text-left text-xs hover:bg-secondary/60"
              >
                {siteAt(i).nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Globe3D;
