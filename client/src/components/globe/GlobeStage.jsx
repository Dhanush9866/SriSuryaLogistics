import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';

// Three.js code is split out and only loaded in the browser when needed
const HeroGlobe = lazy(() => import('./HeroGlobe.jsx'));

class SafeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function GlobeStage() {
  const ref = useRef(null);
  const [inView, setInView] = useState(true);
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 1080);

  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth <= 1080);
    window.addEventListener('resize', onResize);
    let io;
    if ('IntersectionObserver' in window && ref.current) {
      io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '100px' });
      io.observe(ref.current);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="hero__globe" role="img" aria-label="Animated globe showing Sri Surya Logistics routes from Peravali to major Indian cities">
      <SafeBoundary>
        <Suspense fallback={null}>
          <HeroGlobe active={inView} compact={compact} />
        </Suspense>
      </SafeBoundary>
    </div>
  );
}
