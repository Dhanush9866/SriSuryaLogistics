import Icon from './Icon.jsx';
import JourneyMap from './journey/JourneyMap.jsx';
import { company } from '../data/site.js';

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container about__inner">
        <div className="about__media reveal">
          <div className="about__frame">
            <JourneyMap />
          </div>
          <div className="about__badge">
            <Icon name="globe" size={26} />
            <span>
              Based on <strong>NH-216</strong>
              <br />
              Peravali
            </span>
          </div>
        </div>

        <div className="about__copy reveal">
          <span className="eyebrow">About Us</span>
          <h2 className="section__title">
            Built on trust, <em>driven by commitment</em>
          </h2>
          <p>
            Sri Surya Logistics is a transport company founded with one simple belief — every consignment carries
            someone’s business, someone’s hard work. That’s why we treat every load like our own.
          </p>
          <p>
            Located right on NH-216 at Peravali, we’re perfectly placed to connect local industries, factories and
            traders to markets across the country with speed and care.
          </p>

          <ul className="about__checks">
            {['Well-maintained trucks & containers', 'Experienced, verified drivers', 'Transparent, fair pricing', 'Direct line to the owner'].map((t) => (
              <li key={t}>
                <Icon name="check" size={18} strokeWidth={2.6} /> {t}
              </li>
            ))}
          </ul>

          <div className="founders">
            {company.founders.map((f) => (
              <div key={f.name} className="founder">
                <span className="founder__avatar">{f.initials}</span>
                <div>
                  <strong>{f.name}</strong>
                  <small>{f.role}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
