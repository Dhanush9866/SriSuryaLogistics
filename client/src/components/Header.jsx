import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { company, formatPhone, HERO_THEME } from '../data/site.js';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#process', label: 'How It Works' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <span className="topbar__addr">
            <Icon name="pin" size={14} /> NH-216 Road, Peravali – 534328
            <a href={`mailto:${company.email}`} className="topbar__mail">
              <Icon name="mail" size={14} /> {company.email}
            </a>
          </span>
          <span className="topbar__phones">
            {company.phones.map((p) => (
              <a key={p} href={`tel:+91${p}`}>
                <Icon name="phone" size={13} /> {formatPhone(p)}
              </a>
            ))}
          </span>
        </div>
      </div>

      <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${HERO_THEME === 'light' ? 'nav--on-light' : ''}`}>
        <div className="container nav__inner">
          <Logo light={!scrolled && HERO_THEME !== 'light'} />
          <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Main">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href={`tel:+91${company.callPhone}`} className="btn btn--gold nav__cta" onClick={() => setOpen(false)}>
              <Icon name="phone" size={17} /> Call Now
            </a>
          </nav>
          <button className="nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
            <Icon name={open ? 'close' : 'menu'} size={26} />
          </button>
        </div>
      </header>
    </>
  );
}
