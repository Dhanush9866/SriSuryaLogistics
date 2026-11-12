import Icon from './Icon.jsx';
import { company, formatPhone } from '../data/site.js';

const mapQuery = encodeURIComponent('Peravali, Andhra Pradesh 534328');

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section__head reveal">
          <span className="eyebrow">Visit or Call</span>
          <h2 className="section__title">
            We’re right on <em>NH-216, Peravali</em>
          </h2>
        </div>

        <div className="contact__grid">
          <div className="contact__cards">
            <div className="contact-card reveal">
              <span className="contact-card__icon"><Icon name="pin" size={24} /></span>
              <div>
                <h3>Our Office</h3>
                <p>
                  {company.address.line1}
                  <br />
                  {company.address.line2}
                  <br />
                  {company.address.city}
                </p>
                <a className="contact-card__link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address.full)}`} target="_blank" rel="noreferrer">
                  Get directions <Icon name="arrow" size={16} />
                </a>
              </div>
            </div>

            <div className="contact-card reveal">
              <span className="contact-card__icon contact-card__icon--red"><Icon name="phone" size={24} /></span>
              <div>
                <h3>Call Us</h3>
                <ul className="contact-card__phones">
                  {company.phones.map((p) => (
                    <li key={p}>
                      <a href={`tel:+91${p}`}>{formatPhone(p)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="contact-card reveal">
              <span className="contact-card__icon contact-card__icon--gold"><Icon name="mail" size={24} /></span>
              <div>
                <h3>Email Us</h3>
                <p>Send your load details or enquiries.</p>
                <a className="contact-card__email" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </div>
            </div>

            <div className="contact-card reveal">
              <span className="contact-card__icon contact-card__icon--green"><Icon name="whatsapp" size={24} /></span>
              <div>
                <h3>WhatsApp</h3>
                <p>Send load details anytime — we’ll reply fast.</p>
                <a className="contact-card__email" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">
                  {formatPhone(company.whatsapp.slice(2))}
                </a>
                <br />
                <a className="contact-card__link" href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">
                  Chat now <Icon name="arrow" size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="contact__map reveal">
            <iframe
              title="Sri Surya Logistics location – Peravali"
              src={`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
