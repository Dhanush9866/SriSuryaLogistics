/*
 * Hero attraction — premium animated 3D globe.
 * Full planet of fine round dots with rim light, thin gold routes from Peravali (HQ)
 * with light streaks, one highlighted route at a time ("Now serving"), orbit ring + satellite.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { LAND_MASK, MASK_W, MASK_H } from './landMask.js';
import dayUrl from './textures/earth-day.webp';
import nightUrl from './textures/earth-night.webp';
import waterUrl from './textures/earth-water.webp';
import cloudsUrl from './textures/earth-clouds.webp';

/* 'realistic' = real Earth (satellite textures, city lights, clouds) · 'dotted' = stylised dot globe */
const GLOBE_STYLE = 'realistic';

const RADIUS = 1.6;
const SUN_DIR = new THREE.Vector3(-0.55, 0.28, 0.8).normalize();
const HQ = { lat: 16.75, lon: 81.73 };
const CITIES = [
  ['Delhi', 28.61, 77.21],
  ['Kolkata', 22.57, 88.36],
  ['Mumbai', 19.07, 72.88],
  ['Chennai', 13.08, 80.27],
  ['Hyderabad', 17.38, 78.48],
  ['Bengaluru', 12.97, 77.59],
  ['Ahmedabad', 23.02, 72.57],
  ['Nagpur', 21.15, 79.09],
];
const CYCLE = 2.8; // seconds per highlighted route
const pointer = { x: 0, y: 0 };
const D2R = THREE.MathUtils.degToRad;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function ll(lat, lon, r = RADIUS) {
  const phi = D2R(90 - lat);
  const th = D2R(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

const maskBits = (() => {
  const bin = atob(LAND_MASK);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
})();
function isLand(lat, lon) {
  const row = Math.min(MASK_H - 1, Math.max(0, Math.floor(90 - lat)));
  const col = ((Math.floor(lon + 180) % MASK_W) + MASK_W) % MASK_W;
  const i = row * MASK_W + col;
  return (maskBits[i >> 3] >> (i & 7)) & 1;
}

/* ---------- planet body: dark sphere with soft light + blue rim ---------- */
function Planet() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `varying vec3 vN; varying vec3 vV;
          void main(){
            float fres = pow(1.0 - max(dot(vN, vV), 0.0), 2.6);
            float light = max(dot(vN, normalize(vec3(-0.5, 0.6, 0.6))), 0.0);
            vec3 base = mix(vec3(0.016, 0.035, 0.12), vec3(0.04, 0.09, 0.30), light * 0.9);
            vec3 col = base + vec3(0.25, 0.45, 1.0) * fres * 0.9;
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    []
  );
  return (
    <mesh material={mat}>
      <sphereGeometry args={[RADIUS * 0.997, 96, 96]} />
    </mesh>
  );
}

/* ---------- realistic Earth: day side, city lights at night, ocean glint, clouds ---------- */
function RealEarth() {
  const [day, night, water, clouds] = useTexture([dayUrl, nightUrl, waterUrl, cloudsUrl]);
  const cloudRef = useRef();
  const [earthMat, cloudMat] = useMemo(() => {
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
    [day, night, water, clouds].forEach((t) => (t.anisotropy = 8));
    const shared = `varying vec2 vUv; varying vec3 vNw; varying vec3 vView;
      void main(){ vUv = uv; vNw = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0);
        vView = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`;
    const e = new THREE.ShaderMaterial({
      uniforms: { dayMap: { value: day }, nightMap: { value: night }, waterMap: { value: water }, sunDir: { value: SUN_DIR } },
      vertexShader: shared,
      fragmentShader: `uniform sampler2D dayMap, nightMap, waterMap; uniform vec3 sunDir;
        varying vec2 vUv; varying vec3 vNw; varying vec3 vView;
        void main(){
          vec3 n = normalize(vNw); vec3 v = normalize(vView);
          float d = dot(n, sunDir);
          float dayK = smoothstep(-0.14, 0.24, d);
          vec3 day = texture2D(dayMap, vUv).rgb;
          day = mix(vec3(dot(day, vec3(0.3, 0.59, 0.11))), day, 0.92);
          vec3 night = texture2D(nightMap, vUv).rgb;
          night = pow(night, vec3(1.35)) * vec3(1.0, 0.74, 0.4) * 2.4;
          float water = texture2D(waterMap, vUv).r;
          vec3 lit = day * (0.16 + 1.0 * max(d, 0.0));
          float spec = pow(max(dot(reflect(-sunDir, n), v), 0.0), 28.0) * water * 0.55;
          vec3 col = mix(night + day * 0.025, lit + vec3(1.0, 0.92, 0.78) * spec, dayK);
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    });
    const c = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { cloudMap: { value: clouds }, sunDir: { value: SUN_DIR } },
      vertexShader: shared,
      fragmentShader: `uniform sampler2D cloudMap; uniform vec3 sunDir; varying vec2 vUv; varying vec3 vNw; varying vec3 vView;
        void main(){
          float d = dot(normalize(vNw), sunDir);
          float k = texture2D(cloudMap, vUv).r;
          float lightK = smoothstep(-0.1, 0.4, d);
          gl_FragColor = vec4(vec3(0.95) * (0.25 + 0.75 * lightK), k * (0.08 + 0.45 * lightK));
          #include <colorspace_fragment>
        }`,
    });
    return [e, c];
  }, [day, night, water, clouds]);
  useFrame((_, dt) => {
    if (cloudRef.current) cloudRef.current.rotation.y += Math.min(dt, 0.05) * 0.012;
  });
  return (
    <group>
      <mesh material={earthMat}>
        <sphereGeometry args={[RADIUS, 128, 128]} />
      </mesh>
      <mesh ref={cloudRef} material={cloudMat}>
        <sphereGeometry args={[RADIUS * 1.008, 96, 96]} />
      </mesh>
    </group>
  );
}

/* ---------- fine round land dots (fade towards the limb) ---------- */
function LandDots() {
  const { gl } = useThree();
  const [geo, mat] = useMemo(() => {
    const pos = [];
    const col = [];
    const blue = new THREE.Color('#6d8fff');
    const gold = new THREE.Color('#ffd45c');
    const c = new THREE.Color();
    for (let lat = -76; lat <= 80; lat += 0.95) {
      const step = 0.95 / Math.max(Math.cos(D2R(lat)), 0.12);
      for (let lon = -180; lon < 180; lon += step) {
        if (!isLand(lat, lon)) continue;
        const v = ll(lat, lon, RADIUS * 1.002);
        pos.push(v.x, v.y, v.z);
        const near = clamp01(1 - Math.hypot(lat - 21, (lon - 80) * 0.95) / 17);
        c.copy(blue).lerp(gold, Math.pow(near, 1.6)).toArray(col, col.length);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uPx: { value: gl.getPixelRatio() } },
      vertexShader: `attribute vec3 aColor; uniform float uPx; varying vec3 vC; varying float vF;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vec3 n = normalize(normalMatrix * normalize(position));
          vF = dot(n, normalize(-mv.xyz));
          vC = aColor;
          gl_PointSize = 2.7 * uPx * (6.2 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `varying vec3 vC; varying float vF;
        void main(){
          vec2 p = gl_PointCoord - 0.5; float d = length(p); if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.15, d) * smoothstep(0.0, 0.4, vF);
          gl_FragColor = vec4(vC, a * 0.95);
        }`,
    });
    return [g, m];
  }, [gl]);
  return <points geometry={geo} material={mat} />;
}

/* ---------- route arcs with travelling light streaks ---------- */
function makeArcMaterial(seed) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uDraw: { value: 0 }, uTime: { value: 0 }, uActive: { value: 0 }, uSeed: { value: seed } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uDraw, uTime, uActive, uSeed; varying vec2 vUv;
      void main(){
        if (vUv.x > uDraw) discard;
        float head = fract(uTime * (0.32 + uActive * 0.18) + uSeed);
        float behind = head - vUv.x;
        float streak = behind >= 0.0 ? exp(-behind * (14.0 - uActive * 6.0)) : 0.0;
        float base = 0.22 + 0.5 * uActive;
        vec3 col = mix(vec3(1.0, 0.72, 0.2), vec3(1.0, 0.95, 0.8), streak);
        gl_FragColor = vec4(col, clamp(base + streak * (0.7 + 0.6 * uActive), 0.0, 1.0));
      }`,
  });
}

function Routes({ clockRef, activeRef }) {
  const routes = useMemo(() => {
    const a = ll(HQ.lat, HQ.lon);
    return CITIES.map(([name, lat, lon], i) => {
      const b = ll(lat, lon);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.setLength(RADIUS + 0.06 + a.distanceTo(b) * 0.6);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      return {
        name,
        end: b,
        geo: new THREE.TubeGeometry(curve, 64, 0.0055, 6, false),
        mat: makeArcMaterial(i * 0.137),
        delay: 1.3 + i * 0.16,
      };
    });
  }, []);
  const ends = useRef([]);

  useFrame((_, dt) => {
    const t = clockRef.current;
    routes.forEach((r, i) => {
      r.mat.uniforms.uDraw.value = easeOut((t - r.delay) / 1.0);
      r.mat.uniforms.uTime.value = t;
      const target = activeRef.current === i ? 1 : 0;
      const u = r.mat.uniforms.uActive;
      u.value += (target - u.value) * Math.min(dt * 4, 1);
      const e = ends.current[i];
      if (e) {
        const s = 1 + u.value * (0.6 + Math.sin(t * 5) * 0.15);
        e.scale.setScalar(s * (r.mat.uniforms.uDraw.value > 0.98 ? 1 : 0.001));
      }
    });
  });

  return (
    <group>
      {routes.map((r, i) => (
        <group key={r.name}>
          <mesh geometry={r.geo} material={r.mat} />
          <mesh ref={(el) => (ends.current[i] = el)} position={r.end.clone().multiplyScalar(1.011)}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshBasicMaterial color="#ffe08a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- HQ marker ---------- */
function HQMarker({ clockRef }) {
  const pos = useMemo(() => ll(HQ.lat, HQ.lon, RADIUS * 1.011), []);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  const ring = useRef();
  useFrame(() => {
    const s = (clockRef.current * 0.55) % 1;
    if (ring.current) {
      ring.current.scale.setScalar(1 + s * 3.2);
      ring.current.material.opacity = (1 - s) * 0.8;
    }
  });
  return (
    <group position={pos} quaternion={quat}>
      <mesh>
        <circleGeometry args={[0.03, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position-z={0.001}>
        <circleGeometry args={[0.021, 32]} />
        <meshBasicMaterial color="#e5232a" />
      </mesh>
      <mesh ref={ring} position-z={0.0005}>
        <ringGeometry args={[0.03, 0.036, 48]} />
        <meshBasicMaterial color="#ff5a5f" transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---------- orbit ring with a satellite ---------- */
function Orbit({ clockRef }) {
  const sat = useRef();
  const glow = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,214,110,0.8)');
    g.addColorStop(1, 'rgba(255,190,60,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  const R1 = RADIUS * 1.32;
  useFrame(() => {
    const a = clockRef.current * 0.35;
    if (sat.current) sat.current.position.set(Math.cos(a) * R1, Math.sin(a) * R1, 0);
  });
  return (
    <group rotation={[1.18, 0.18, -0.32]}>
      <mesh>
        <torusGeometry args={[R1, 0.0028, 8, 220]} />
        <meshBasicMaterial color="#f7b500" transparent opacity={0.45} />
      </mesh>
      <mesh>
        <torusGeometry args={[RADIUS * 1.45, 0.0018, 8, 220]} />
        <meshBasicMaterial color="#8fb0ff" transparent opacity={0.16} />
      </mesh>
      <sprite ref={sat} scale={0.22}>
        <spriteMaterial map={glow} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
}

/* ---------- stars ---------- */
function Stars() {
  const ref = useRef();
  const [geo, mat] = useMemo(() => {
    const p = [];
    for (let i = 0; i < 600; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(12 + Math.random() * 16);
      if (v.z > 2) v.z *= -1;
      p.push(v.x, v.y, v.z);
    }
    const g = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: `void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = 2.0; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(0.75, 0.82, 1.0, smoothstep(0.5, 0.0, d) * 0.7); }`,
    });
    return [g, m];
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += Math.min(dt, 0.05) * 0.008;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ---------- labels ---------- */
function Labels({ active, ready }) {
  return (
    <group>
      <Html position={ll(HQ.lat, HQ.lon, RADIUS * 1.01)} zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`globe-tag globe-tag--hq ${ready ? 'is-on' : ''}`}>
          <i />
          <span>
            <b>Peravali</b> HQ<em className="globe-tag__extra"> · NH-216</em>
          </span>
        </div>
      </Html>
      {CITIES.map(([name, lat, lon], i) => (
        <Html key={name} position={ll(lat, lon, RADIUS * 1.01)} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`globe-tag globe-tag--city ${lat < HQ.lat ? 'globe-tag--below' : ''} ${ready && active === i ? 'is-on' : ''}`}>
            <small>Now serving</small>
            <b>{name}</b>
          </div>
        </Html>
      ))}
    </group>
  );
}

/* ---------- scene ---------- */
function GlobeScene({ compact }) {
  const globe = useRef();
  const world = useRef();
  const t0 = useRef(null);
  const clockRef = useRef(0);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(-1);
  const [ready, setReady] = useState(false);
  const { camera } = useThree();
  const baseQ = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(D2R(18), -D2R(90 + 80), 0, 'XYZ')), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);

  useEffect(() => {
    camera.position.set(0, 0, compact ? 6.4 : 6.0);
    camera.lookAt(0, 0, 0);
  }, [camera, compact]);

  useFrame(({ clock }) => {
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = clock.elapsedTime - t0.current;
    clockRef.current = t;

    const k = easeInOut(clamp01(t / 2.6));
    e.set(0.3 * (1 - k) - pointer.y * 0.1, -2.6 * (1 - k) + Math.sin(t * 0.11) * 0.28 + pointer.x * 0.2, 0);
    globe.current.quaternion.copy(q.setFromEuler(e).multiply(baseQ));
    world.current.scale.setScalar(0.7 + 0.3 * k);
    world.current.position.y = Math.sin(t * 0.6) * 0.03;

    if (!ready && t > 2.6) setReady(true);
    const idx = t > 2.6 ? Math.floor((t - 2.6) / CYCLE) % CITIES.length : -1;
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  });

  return (
    <>
      <Stars />
      <group ref={world}>
        <group ref={globe}>
          {GLOBE_STYLE === 'realistic' ? (
            <RealEarth />
          ) : (
            <>
              <Planet />
              <LandDots />
            </>
          )}
          <Routes clockRef={clockRef} activeRef={activeRef} />
          <HQMarker clockRef={clockRef} />
          <Labels active={active} ready={ready} />
        </group>
        <Orbit clockRef={clockRef} />
      </group>
    </>
  );
}

export default function HeroGlobe({ active = true, compact = false }) {
  useEffect(() => {
    const onMove = (ev) => {
      pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((ev.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 35, near: 0.1, far: 100, position: [0, 0, compact ? 6.4 : 6.0] }}
    >
      <GlobeScene compact={compact} />
    </Canvas>
  );
}
