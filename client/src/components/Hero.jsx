import Icon from './Icon.jsx';
import GlobeStage from './globe/GlobeStage.jsx';
import { company, HERO_THEME } from '../data/site.js';

export default function Hero() {
  return (
    <section id="home" className={`hero ${HERO_THEME === 'light' ? 'hero--light' : ''}`}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__rays" />
        <div className="hero__glow" />
        <div className="hero__grid" />
        <div className="hero__road" />
      </div>

      <GlobeStage />

      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="eyebrow eyebrow--light">
            <span className="dot" /> Trusted Transport Partner · Peravali, NH-216
          </span>
          <h1 className="hero__title">
            Moving Your World…
            <br />
            <em>With Trust.</em>
          </h1>
          <p className="hero__lead">
            <strong>Sri Surya Logistics</strong> delivers full truck loads, containers and interstate cargo with the care
            your business deserves — on time, every time.
          </p>

          <div className="hero__promise">
            {company.promise.map((p) => (
              <span key={p} className="chip">
                <Icon name="check" size={16} strokeWidth={2.6} /> {p}
              </span>
            ))}
          </div>

          <div className="hero__actions">
            <a href={`tel:+91${company.callPhone}`} className="btn btn--gold btn--lg">
              <Icon name="phone" size={18} /> Call Now
            </a>
            <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn--ghost btn--lg">
              <Icon name="whatsapp" size={20} /> WhatsApp Us
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__badges">
          <div className="float-card float-card--a">
            <span className="float-card__icon"><Icon name="shield" size={22} /></span>
            <div>
              <strong>Safe Handling</strong>
              <small>Cargo secured end-to-end</small>
            </div>
          </div>
          <div className="float-card float-card--b">
            <span className="float-card__icon float-card__icon--red"><Icon name="clock" size={22} /></span>
            <div>
              <strong>24 × 7</strong>
              <small>Dispatch support</small>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="marquee__group">
              {['Full Truck Load', 'Container Transport', 'Interstate Cargo', 'Part Load', 'Factory Supply', 'Time-Critical Delivery', 'Safe • Fast • Reliable'].map((t) => (
                <span key={t} className="marquee__item">
                  <Icon name="star" size={14} /> {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
