import React from 'react';
import Icon from '../../Icon';
import './ServicesDetail1.css';

const servicesDetail1 = [
  {
    icon: 'truck',
    title: 'Rozvoz veľkého tovaru pre e-shopy (B2C)',
    desc: 'Prevezmeme celý proces doručenia: naloženie, prepravu a odovzdanie tovaru až ku koncovému zákazníkovi vrátane objemných a ťažkých zásielok, ktoré bežní kuriéri odmietajú. Súčasťou je výnos do bytu aj montáž.',
    tag: 'Aj tovar, ktorý bežní kuriéri odmietajú',
  },
  {
    icon: 'clock',
    title: 'Expresné doručenie',
    desc: 'Keď zákazník nemôže čakať. Doručenie v skrátenom termíne pre urgentné B2B závozy aj pre prémiový servis e-shopu. Termín dohodneme dopredu a zákazníka o ňom informujeme.',
    tag: 'Doručenie v dohodnutom časovom okne',
  },
  {
    icon: 'shop',
    title: 'Zásobovanie kamenných predajní (B2B/B2C)',
    desc: 'Pravidelné aj jednorazové závozy tovaru na pobočky, do predajní a na výdajné miesta. Konsolidujeme dodávky, prispôsobíme sa časovým oknám predajne a doručíme paletové aj kusové zásielky.',
    tag: 'Závozy podľa časových okien predajne',
  },
];

const ServicesDetail1: React.FC = () => {
  return (
    <section id="home-delivery" className="landing__section landing__section--light">
      <div className="landing__eyebrow">HOME DELIVERY</div>
      <h2 className="landing__title landing__title--dark">ROZVOZ, DORUČENIE A ZÁSOBOVANIE</h2>
      <div className="landing__subtitle">TRI SLUŽBY ZAMERANÉ NA PREPRAVU</div>
      <p className="landing__lead">
        Rozvoz objednávok e-shopu, urgentné doručenia a pravidelné závozy do predajní.
      </p>
      <div className="landing__rows">
        {servicesDetail1.map((s) => (
          <div className="landing__row" key={s.title}>
            <div className="landing__badge">
              <Icon name={s.icon} />
            </div>
            <div className="landing__row-body">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
            <div className="landing__row-tag">{s.tag}</div>
          </div>
        ))}
      </div>
      <div className="landing__tagline landing__tagline--dark">
        VÝNOS AŽ NA POSCHODIE, VYBALENIE A ODVOZ OBALOV V CENE.
      </div>
    </section>
  );
};

export default ServicesDetail1;
