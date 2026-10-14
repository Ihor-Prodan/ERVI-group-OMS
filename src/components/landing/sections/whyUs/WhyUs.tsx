import React from 'react';
import Icon from '../../Icon';
import fleetPhoto from '../../../../assets/night-van.jpg';
import './WhyUs.css';

const reasons = [
  {
    icon: 'truck',
    title: 'Rozvoz po celom Slovensku',
    desc: 'Vlastný vozový park a plánované trasy. Tovar nečaká v prekladiskách na iného dopravcu.',
  },
  {
    icon: 'truck2',
    title: 'Špecialisti na veľký tovar',
    desc: 'Hmotnosť, rozmery, výnos aj montáž máme zvládnuté ako štandard, nie ako výnimku.',
  },
  {
    icon: 'clock',
    title: 'Doručenie v dohodnutom okne',
    desc: 'Termín dohodneme dopredu a zákazníka o ňom informujeme. Žiadne celodenné čakanie.',
  },
  {
    icon: 'person',
    title: 'Doručenie ako súčasť značky',
    desc: 'Naši vodiči a montéri sú posledný kontakt so zákazníkom a podľa toho vystupujú.',
  },
  {
    icon: 'expand',
    title: 'Flexibilita v sezónnych špičkách',
    desc: 'Kapacitu rozvozu navýšime podľa vašej sezóny bez toho, aby ste najímali vodičov.',
  },
  {
    icon: 'link',
    title: 'Jeden partner namiesto piatich',
    desc: 'Rozvoz, montáž, vratky aj závozy do predajní pod jednou zmluvou a zodpovednosťou.',
  },
];

const WhyUs: React.FC = () => {
  return (
    <section
      id="vyhody"
      className="landing__section landing__section--dark landing__section--photo landing__whyus"
      style={{
        backgroundImage: `linear-gradient(to right, #0f172a 0%, #0f172a 52%, rgba(15, 23, 42, 0.85) 62%, rgba(15, 23, 42, 0.25) 82%, rgba(15, 23, 42, 0) 100%), url(${fleetPhoto})`,
      }}
    >
      <div className="landing__eyebrow">VÝHODY</div>
      <h2 className="landing__title">PREČO SI VYBRAŤ PRÁVE NÁS</h2>
      <div className="landing__subtitle">ŠESŤ DÔVODOV, PREČO SI VYBRAŤ NÁS.</div>
      <p className="landing__lead landing__lead--dark">
        Nie sme najlacnejší prepravca na trhu. Sme partner, ktorý odvezie to, čo ostatní odmietajú.
      </p>
      <div className="landing__grid landing__grid--3">
        {reasons.map((r) => (
          <div className="landing__card landing__card--dark" key={r.title}>
            <div className="landing__badge">
              <Icon name={r.icon} />
            </div>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>
      <div className="landing__tagline landing__tagline--dark">
        JEDEN PARTNER PRE ROZVOZ, PREDAJNE, VRATKY AJ MONTÁŽ.
      </div>
    </section>
  );
};

export default WhyUs;
