import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './journey.css';

// Stylised (not to scale) trips from Peravali. Coordinates are in the SVG viewBox 0 0 600 400.
const START = { x: 92, y: 300 };
const TRIPS = [
  { city: 'Hyderabad', d: 'M92 300 C 170 285, 175 205, 255 195 S 395 165, 478 102', end: { x: 478, y: 102 } },
  { city: 'Chennai', d: 'M92 300 C 165 322, 235 270, 305 272 S 430 312, 512 262', end: { x: 512, y: 262 } },
  { city: 'Kolkata', d: 'M92 300 C 118 225, 205 190, 280 150 S 420 78, 508 66', end: { x: 508, y: 66 } },
  { city: 'Bengaluru', d: 'M92 300 C 185 340, 262 352, 332 322 S 446 286, 520 318', end: { x: 520, y: 318 } },
];
const T_DRIVE = 5.6; // seconds driving
const T_ARRIVE = 2.0; // seconds celebrating at destination
const T_TRIP = 0.5 + T_DRIVE + T_ARRIVE;
const CHECKPOINTS = [0.33, 0.66];

const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

function TruckIcon() {
  // side-view mini truck, facing +x, centred on its rear axle area
  return (
    <g className="jm-truck__body">
      <rect x="-26" y="-13" width="30" height="15" rx="2" fill="#c3141a" />
      <rect x="-24" y="-10.5" width="26" height="2" rx="1" fill="#ffd45c" opacity="0.9" />
      <path d="M5 -10 h7.5 a3 3 0 0 1 3 2.2 l2.2 6 v4.3 h-12.7 z" fill="#ff6a13" />
      <path d="M7.5 -8 h4.6 l1.9 4.4 h-6.5 z" fill="#0b1527" />
      <rect x="-27" y="2" width="45" height="2.6" rx="1.3" fill="#1a1d24" />
      <circle cx="-19" cy="6" r="3.4" fill="#0d0e10" />
      <circle cx="-11" cy="6" r="3.4" fill="#0d0e10" />
      <circle cx="11" cy="6" r="3.4" fill="#0d0e10" />
      <circle cx="-19" cy="6" r="1.3" fill="#c3c9d2" />
      <circle cx="-11" cy="6" r="1.3" fill="#c3c9d2" />
      <circle cx="11" cy="6" r="1.3" fill="#c3c9d2" />
      <rect x="17" y="-3" width="2.4" height="2" rx="0.6" fill="#fff4d6" />
    </g>
  );
}

export default function JourneyMap() {
  const root = useRef(null);
  const planRef = useRef(null);
  const liveRef = useRef(null);
  const glowRef = useRef(null);
  const [cps, setCps] = useState([]);
  const truckRef = useRef(null);
  const [trip, setTrip] = useState(0);
  const [stage, setStage] = useState(0); // 0 picked up, 1 on the way, 2 delivered
  const [passed, setPassed] = useState([false, false]);
  const [arrived, setArrived] = useState(false);
  const visible = useRef(true);

  // pause when off-screen
  useEffect(() => {
    if (!('IntersectionObserver' in window) || !root.current) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { rootMargin: '100px' });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf;
    let elapsed = 0;
    let last = performance.now();
    let tripIdx = 0;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const state = { stage: -1, p0: false, p1: false, arr: false, trip: 0 };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible.current) elapsed += dt;
      if (elapsed >= T_TRIP) {
        elapsed = 0;
        tripIdx = (tripIdx + 1) % TRIPS.length;
      }
      if (state.trip !== tripIdx) {
        state.trip = tripIdx;
        setTrip(tripIdx);
      }
      const live = liveRef.current;
      const plan = planRef.current;
      if (live && plan && truckRef.current) {
        // the path elements update after React re-renders a new trip; read the current length each frame
        const L = plan.getTotalLength();
        const k = reduce ? 1 : easeInOut(Math.min(Math.max((elapsed - 0.5) / T_DRIVE, 0), 1));
        [live, glowRef.current].forEach((el) => {
          if (!el) return;
          el.style.strokeDasharray = `${L}`;
          el.style.strokeDashoffset = `${L * (1 - k)}`;
        });
        const len = k * L;
        const p = plan.getPointAtLength(len);
        const q = plan.getPointAtLength(Math.min(len + 1.5, L));
        const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
        truckRef.current.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${ang}) translate(0 -6)`);

        const st = k >= 1 ? 2 : k > 0.02 ? 1 : 0;
        if (st !== state.stage) {
          state.stage = st;
          setStage(st);
        }
        const c0 = k >= CHECKPOINTS[0], c1 = k >= CHECKPOINTS[1];
        if (c0 !== state.p0 || c1 !== state.p1) {
          state.p0 = c0;
          state.p1 = c1;
          setPassed([c0, c1]);
        }
        const arr = k >= 1;
        if (arr !== state.arr) {
          state.arr = arr;
          setArrived(arr);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // checkpoint positions for the current route (measured after the new path renders)
  useLayoutEffect(() => {
    const pl = planRef.current;
    if (!pl) return;
    const L = pl.getTotalLength();
    setCps(CHECKPOINTS.map((f) => pl.getPointAtLength(L * f)));
  }, [trip]);

  const t = TRIPS[trip];

  return (
    <div className="jm" ref={root} role="img" aria-label={`Animated journey of a Sri Surya Logistics truck from Peravali to ${t.city}`}>
      <div className="jm__head">
        <span className="jm__live">
          <i /> Live journey
        </span>
        <span className="jm__trip" key={t.city}>
          Peravali <em>→</em> {t.city}
        </span>
      </div>

      <svg className="jm__map" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="jm-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="rgba(140,170,255,0.22)" />
          </pattern>
          <linearGradient id="jm-gold" x1="0" x2="1">
            <stop offset="0" stopColor="#ffe08a" />
            <stop offset="1" stopColor="#f39c12" />
          </linearGradient>
          <filter id="jm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="600" height="400" fill="url(#jm-dots)" />
        {/* faint background roads */}
        <g className="jm__roads">
          <path d="M-10 120 C 120 140, 260 60, 610 90" />
          <path d="M-10 230 C 140 200, 330 260, 610 210" />
          <path d="M150 -10 C 170 120, 120 260, 190 410" />
          <path d="M400 -10 C 380 140, 460 260, 420 410" />
        </g>

        {/* radar rings around HQ */}
        {[0, 1, 2].map((i) => (
          <circle key={i} className="jm__radar" cx={START.x} cy={START.y} r="10" style={{ animationDelay: `${i * 1}s` }} />
        ))}

        {/* planned route (dashed) + live progress */}
        <path key={`plan-${trip}`} ref={planRef} className="jm__plan" d={t.d} />
        <path key={`glow-${trip}`} ref={glowRef} className="jm__live-glow" d={t.d} />
        <path key={`live-${trip}`} ref={liveRef} className="jm__live-path" d={t.d} filter="url(#jm-glow)" />

        {/* checkpoints */}
        {cps.map((c, i) => (
          <g key={`cp-${trip}-${i}`} className={`jm__cp ${passed[i] ? 'is-passed' : ''}`} transform={`translate(${c.x} ${c.y})`}>
            <circle r="7" className="jm__cp-ring" />
            <circle r="3.5" className="jm__cp-dot" />
          </g>
        ))}

        {/* HQ */}
        <g transform={`translate(${START.x} ${START.y})`}>
          <circle r="9" fill="#e5232a" stroke="#fff" strokeWidth="3" />
          <text className="jm__label jm__label--hq" x="0" y="30" textAnchor="middle">
            Peravali HQ
          </text>
        </g>

        {/* destination */}
        <g key={`dest-${trip}`} className={`jm__dest ${arrived ? 'is-arrived' : ''}`} transform={`translate(${t.end.x} ${t.end.y})`}>
          <circle className="jm__burst" r="10" />
          <circle r="8" fill="url(#jm-gold)" stroke="#fff" strokeWidth="2.5" />
          <text className="jm__label" x="0" y={t.end.y < 120 ? 30 : -18} textAnchor="middle">
            {t.city}
          </text>
        </g>

        {/* truck */}
        <g ref={truckRef} className="jm-truck">
          <ellipse cx="-4" cy="11" rx="26" ry="3.5" fill="rgba(0,0,0,0.35)" />
          <TruckIcon />
        </g>
      </svg>

      <ol className="jm__steps">
        <li className={stage >= 0 ? 'is-done' : ''}>
          <b>{stage >= 1 ? '✓' : '1'}</b>
          <span>
            Picked up<small>Peravali</small>
          </span>
        </li>
        <li className={stage === 1 ? 'is-active' : stage > 1 ? 'is-done' : ''}>
          <b>{stage > 1 ? '✓' : '2'}</b>
          <span>
            On the way<small>NH-216</small>
          </span>
        </li>
        <li className={stage === 2 ? 'is-done is-final' : ''}>
          <b>{stage === 2 ? '✓' : '3'}</b>
          <span>
            Delivered<small>{t.city}</small>
          </span>
        </li>
      </ol>
    </div>
  );
}
