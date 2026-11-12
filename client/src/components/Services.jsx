import Icon from './Icon.jsx';
import { services } from '../data/site.js';

export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="container">
        <div className="section__head reveal">
          <span className="eyebrow">What We Move</span>
          <h2 className="section__title">
            Transport solutions built <em>around your cargo</em>
          </h2>
          <p className="section__lead">
            From a single part load to a fleet of containers — one call to Sri Surya Logistics and it’s handled.
          </p>
        </div>

        <div className="services__grid">
          {services.map((s, i) => (
            <article key={s.title} className="service reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="service__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="service__icon">
                <Icon name={s.icon} size={30} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <a href="#contact" className="service__link">
                Enquire now <Icon name="arrow" size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
