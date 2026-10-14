import React from 'react';
import Icon from '../../Icon';

const services = [
  {
    icon: 'truck',
    title: 'Rozvoz pre e-shopy (B2C)',
    desc: 'Doručenie nábytku, spotrebičov a DIY tovaru koncovému zákazníkovi.',
  },
  {
    icon: 'clock',
    title: 'Expresné doručenie',
    desc: 'Skrátené termíny pre urgentné závozy aj prémiový zákaznícky servis.',
  },
  {
    icon: 'shop',
    title: 'Zásobovanie predajní',
    desc: 'Pravidelné aj ad-hoc závozy na pobočky a výdajné miesta.',
  },
  {
    icon: 'undo',
    title: 'Reverzná logistika',
    desc: 'Zvoz, kontrola a triedenie vrátok a reklamácií späť do predaja.',
  },
  {
    icon: 'network',
    title: 'Technologické prepojenie',
    desc: 'Napojenie na e-shop, ERP a skladový systém bez ručného prepisovania.',
  },
  {
    icon: 'warehouse',
    title: 'Skladovanie a cross-dock',
    desc: 'Doplnková služba — krátkodobé uskladnenie a prekládka pred rozvozom.',
  },
];

const Services: React.FC = () => {
  return (
    <section id="sluzby" className="landing__section landing__section--light">
      <div className="landing__eyebrow">ČO ROBÍME</div>
      <h2 className="landing__title landing__title--dark">NAŠE SLUŽBY</h2>
      <div className="landing__subtitle">ŤAŽISKOM JE RÝCHLY ROZVOZ VEĽKÉHO TOVARU.</div>
      <p className="landing__lead">
        Ostatné služby na neho nadväzujú, využite ich samostatne alebo ako celok.
      </p>
      <div className="landing__grid landing__grid--3">
        {services.map((s) => (
          <div className="landing__card" key={s.title}>
            <div className="landing__badge">
              <Icon name={s.icon} />
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
