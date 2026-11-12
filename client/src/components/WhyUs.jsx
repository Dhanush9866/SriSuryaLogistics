import Icon from './Icon.jsx';
import { pillars, steps } from '../data/site.js';

export default function WhyUs() {
  return (
    <>
      <section id="why-us" className="section why">
        <div className="why__sun" aria-hidden="true" />
        <div className="container">
          <div className="section__head section__head--light reveal">
            <span className="eyebrow eyebrow--light">Our Promise</span>
            <h2 className="section__title">
              Safe <span className="sep">•</span> Fast <span className="sep">•</span> <em>Reliable</em>
            </h2>
            <p className="section__lead">Three words we live by. Three promises we keep on every single trip.</p>
          </div>

          <div className="why__grid">
            {pillars.map((p, i) => (
              <article key={p.title} className="pillar reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <span className="pillar__icon">
                  <Icon name={p.icon} size={34} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="section process">
        <div className="container">
          <div className="section__head reveal">
            <span className="eyebrow">How It Works</span>
            <h2 className="section__title">
              From booking to delivery in <em>four simple steps</em>
            </h2>
          </div>

          <ol className="process__list">
            {steps.map((s, i) => (
              <li key={s.title} className="step reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <span className="step__num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
