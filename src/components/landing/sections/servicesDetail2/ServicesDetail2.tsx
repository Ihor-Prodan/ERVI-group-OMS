import React from 'react';
import Icon from '../../Icon';

const servicesDetail2 = [
  {
    icon: 'undo',
    title: 'Reverzná logistika',
    desc: 'Vrátený a reklamovaný tovar zvezieme od zákazníka späť, skontrolujeme ho a kusy v poriadku pripravíme na ďalší predaj.',
    items: [
      'Zvoz vratiek priamo od zákazníka',
      'Kontrola stavu a fotodokumentácia',
      'Demontáž a odvoz starého tovaru',
      'Rýchly návrat tovaru do predaja',
    ],
  },
  {
    icon: 'network',
    title: 'Technologické prepojenie',
    desc: 'Napojíme sa priamo na váš e-shop, ERP alebo skladový systém. Objednávky sa načítavajú automaticky v reálnom čase.',
    items: [
      'Automatický príjem objednávok',
      'Tracking zásielok pre zákazníka',
      'Potvrdenie doručenia a montáže',
      'Bez ručného prepisovania a chýb',
    ],
  },
  {
    icon: 'warehouse',
    title: 'Skladovanie a cross-dock',
    desc: 'Doplnková služba k rozvozu. Menšie skladové kapacity na krátkodobé uskladnenie, prekládku a prípravu tovaru.',
    items: [
      'Krátkodobé uskladnenie tovaru',
      'Cross-dock a prekládka zásielok',
      'Kompletizácia pred rozvozom',
      'Prehľad o stave zásob',
    ],
  },
];

const ServicesDetail2: React.FC = () => {
  return (
    <section className="landing__section landing__section--light">
      <div className="landing__eyebrow">SLUŽBY 04 — 06</div>
      <h2 className="landing__title landing__title--dark">VRATKY, TECHNOLÓGIE A SKLADOVANIE</h2>
      <div className="landing__subtitle">TRI SLUŽBY, KTORÉ NA PREPRAVU NADVÄZUJÚ.</div>
      <p className="landing__lead">
        Čo sa deje po doručení, ako sa napojíme na vaše systémy a kde tovar čaká pred rozvozom.
      </p>
      <div className="landing__grid landing__grid--3">
        {servicesDetail2.map((s) => (
          <div className="landing__card landing__card--list" key={s.title}>
            <div className="landing__badge">
              <Icon name={s.icon} />
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <ul>
              {s.items.map((it) => (
                <li key={it}>
                  <Icon name="check" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesDetail2;
