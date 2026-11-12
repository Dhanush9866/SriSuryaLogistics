import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { company, formatPhone, services } from '../data/site.js';

export default function Footer() {
  return (
    <>
      <section className="cta-band">
        <div className="container cta-band__inner reveal">
          <div>
            <h2>Ready to move your goods?</h2>
            <p>One call is all it takes. Safe • Fast • Reliable.</p>
          </div>
          <div className="cta-band__actions">
            <a href={`tel:+91${company.callPhone}`} className="btn btn--navy btn--lg">
              <Icon name="phone" size={18} /> {formatPhone(company.callPhone)}
            </a>
            <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn--white btn--lg">
              <Icon name="whatsapp" size={20} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Logo light />
            <p>{company.tagline}</p>
            <p className="footer__founders">
              {company.founders.map((f) => f.name).join('  ·  ')}
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s.title}>
                  <a href="#services">{s.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              {company.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:+91${p}`}>{formatPhone(p)}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className="footer__mail">{company.email}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Address</h4>
            <p className="footer__addr">
              {company.address.line1}
              <br />
              {company.address.line2}
              <br />
              {company.address.city}
            </p>
          </div>
        </div>
        <div className="container footer__bottom">
          <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <span>Safe • Fast • Reliable</span>
        </div>
      </footer>

      <div className="fab">
        <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer" className="fab__btn fab__btn--wa" aria-label="Chat on WhatsApp">
          <Icon name="whatsapp" size={26} />
        </a>
        <a href={`tel:+91${company.callPhone}`} className="fab__btn fab__btn--call" aria-label="Call Sri Surya Logistics">
          <Icon name="phone" size={22} />
        </a>
      </div>
    </>
  );
}
