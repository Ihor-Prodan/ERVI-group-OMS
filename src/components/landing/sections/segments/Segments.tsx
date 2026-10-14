import React from 'react';
import Icon from '../../Icon';
import './Segments.css';

const segments = [
  { icon: 'sofa', title: 'Nábytok a bytové doplnky' },
  { icon: 'appliance', title: 'Veľké domáce spotrebiče' },
  { icon: 'tools', title: 'DIY, hobby a záhrada' },
  { icon: 'sink', title: 'Sanita a stavebný materiál' },
  { icon: 'cart', title: 'E-shopy s objemným tovarom' },
  { icon: 'building', title: 'Retailové reťazce a franšízy' },
];

const Segments: React.FC = () => {
  return (
    <section className="landing__section landing__section--light">
      <div className="landing__eyebrow">SEGMENTY</div>
      <h2 className="landing__title landing__title--dark">PRE KOHO SME PARTNEROM</h2>
      <div className="landing__subtitle">VOZÍME TOVAR, KTORÝ JE ŤAŽKÝ, OBJEMNÝ AJ KREHKÝ.</div>
      <p className="landing__lead">Od nábytku a veľkých spotrebičov až po sanitu a stavebný materiál.</p>
      <div className="landing__grid landing__grid--3">
        {segments.map((s) => (
          <div className="landing__segment" key={s.title}>
            <div className="landing__badge">
              <Icon name={s.icon} />
            </div>
            <h3>{s.title}</h3>
          </div>
        ))}
      </div>
      <div className="landing__dark-box landing__dark-box--cta">
        <div>
          <div className="landing__dark-box-title">MÁTE TOVAR, S KTORÝM SI BEŽNÁ PREPRAVA NEPORADÍ?</div>
          <p>Ozvite sa nám a pripravíme vám riešenie na mieru.</p>
        </div>
        <a href="mailto:info@ervi-group.com" className="landing__dark-box-email">
          info@ervi-group.com
        </a>
      </div>
    </section>
  );
};

export default Segments;
