import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../Icon';
import logo from '../../../../assets/LOGO-white.png';
import contactPhoto from '../../../../assets/contact-warehouse.jpg';
import { sendContactMessage } from '../../../API/API';
import CustomCheckbox from '../../../../UI-elements/checkBox/CustomCheckBox';
import './Contact.css';

const Contact: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '',
    gdpr: false,
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactNotice, setContactNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleContactChange = (field: keyof typeof contactForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (contactForm.honeypot.trim() !== '') {
      return;
    }

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactNotice({ type: 'error', text: 'Vyplňte meno, email a správu.' });
      return;
    }

    if (!contactForm.gdpr) {
      setContactNotice({ type: 'error', text: 'Musíte súhlasiť so spracovaním osobných údajov.' });
      return;
    }

    setContactLoading(true);
    setContactNotice(null);

    try {
      await sendContactMessage(contactForm);
      setContactNotice({ type: 'success', text: 'Správa bola odoslaná. Ozveme sa vám čo najskôr.' });
      setContactForm({ name: '', company: '', email: '', phone: '', message: '', honeypot: '', gdpr: false });
    } catch (err: any) {
      setContactNotice({ type: 'error', text: err.message || 'Správu sa nepodarilo odoslať.' });
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <section
      id="kontakt"
      className="landing__section landing__section--dark landing__section--photo landing__contact"
      style={{
        backgroundImage: `linear-gradient(to right, #0f172a 0%, #0f172a 52%, rgba(15, 23, 42, 0.85) 62%, rgba(15, 23, 42, 0.25) 82%, rgba(15, 23, 42, 0) 100%), url(${contactPhoto})`,
      }}
    >
      <div className="landing__contact-grid">
        <div className="landing__contact-intro">
          <div className="landing__logo">
            <img src={logo} alt="ERVI Group" />
          </div>
          <div className="landing__eyebrow">KONTAKT</div>
          <h2 className="landing__title">
            NAPÍŠTE NÁM <br />
            <span className="landing__title-accent">A OZVEME SA VÁM</span>
          </h2>
          <p className="landing__lead landing__lead--dark">
            Vyplňte formulár a nezáväzne prejdeme váš sortiment, objemy a oblasti rozvozu.
          </p>
          <div className="landing__contact-items">
            <a href="mailto:info@ervi-group.com" className="landing__contact-item">
              <span className="landing__badge">
                <Icon name="mail" />
              </span>
              info@ervi-group.com
            </a>
            <div className="landing__contact-item">
              <span className="landing__badge">
                <Icon name="pin" />
              </span>
              Trnavská cesta 18263/112A, 821 01 Bratislava
            </div>
          </div>
        </div>

        <form className="landing__contact-form" onSubmit={handleContactSubmit}>
          <div className="landing__form-row">
            <input
              type="text"
              placeholder="Meno a priezvisko *"
              value={contactForm.name}
              onChange={handleContactChange('name')}
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={contactForm.email}
              onChange={handleContactChange('email')}
              required
            />
          </div>
          <div className="landing__form-row">
            <input
              type="text"
              placeholder="Názov firmy"
              value={contactForm.company}
              onChange={handleContactChange('company')}
            />
            <input
              type="text"
              placeholder="Telefón"
              value={contactForm.phone}
              onChange={handleContactChange('phone')}
            />
          </div>
          <textarea
            placeholder="Vaša správa *"
            rows={4}
            value={contactForm.message}
            onChange={handleContactChange('message')}
            required
          />
          <input
            type="text"
            name="website"
            value={contactForm.honeypot}
            onChange={handleContactChange('honeypot')}
            tabIndex={-1}
            autoComplete="off"
            className="landing__form-honeypot"
          />

          <CustomCheckbox
            label={
              <>
                Súhlasím so spracovaním mojich osobných údajov (meno, email, telefón, správa) za
                účelom vybavenia môjho dopytu, podľa{' '}
                <Link to="/ochrana-osobnych-udajov" className="gdpr-link" target="_blank">
                  zásad ochrany osobných údajov
                </Link>
                .
              </>
            }
            checked={contactForm.gdpr}
            onChange={(checked) => setContactForm((prev) => ({ ...prev, gdpr: checked }))}
          />

          {contactNotice && (
            <div className={`landing__form-notice landing__form-notice--${contactNotice.type}`}>
              {contactNotice.text}
            </div>
          )}

          <button type="submit" className="landing__cta" disabled={contactLoading}>
            {contactLoading ? 'Odosielam...' : 'Odoslať správu'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
