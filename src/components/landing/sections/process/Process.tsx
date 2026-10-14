import React from 'react';
import Icon from '../../Icon';
import './Process.css';

const processSteps = [
  { n: '01', title: 'Úvodná konzultácia', desc: 'Prejdeme si sortiment, objemy a oblasti rozvozu.' },
  { n: '02', title: 'Návrh a cenová ponuka', desc: 'Navrhneme trasy, procesy a transparentný cenník.' },
  { n: '03', title: 'Technologické napojenie', desc: 'Prepojíme váš e-shop či ERP a otestujeme tok dát.' },
  { n: '04', title: 'Skúšobný rozvoz', desc: 'Odvezieme prvé objednávky a doladíme celý proces.' },
  { n: '05', title: 'Plná prevádzka', desc: 'Denne rozvážame, riešime vratky a reportujeme.' },
];

const Process: React.FC = () => {
  return (
    <section id="proces" className="landing__section landing__section--light">
      <div className="landing__eyebrow">PROCES</div>
      <h2 className="landing__title landing__title--dark">AKO SPOLUPRÁCA PREBIEHA</h2>
      <div className="landing__subtitle">PÄŤ KROKOV OD PRVÉHO HOVORU PO PRVÝ ROZVOZ.</div>
      <p className="landing__lead">Celý nábeh zvládneme bez toho, aby ste museli zastaviť predaj.</p>
      <div className="landing__timeline">
        {processSteps.map((s) => (
          <div className="landing__timeline-item" key={s.n}>
            <div className="landing__timeline-marker">{s.n}</div>
            <div className="landing__timeline-content">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="landing__dark-box">
        <div className="landing__dark-box-title">ČO OD VÁS POTREBUJEME NA ŠTART</div>
        <div className="landing__dark-box-items">
          <span>
            <Icon name="check" /> Prehľad sortimentu a objemov
          </span>
          <span>
            <Icon name="check" /> Prístup k e-shopu alebo ERP
          </span>
          <span>
            <Icon name="check" /> Kontaktnú osobu za vašu stranu
          </span>
        </div>
      </div>
    </section>
  );
};

export default Process;
