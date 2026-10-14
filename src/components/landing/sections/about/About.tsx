import React from 'react';
import Icon from '../../Icon';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="o-nas" className="landing__section landing__section--light landing__section--visible">
      <div className="landing__eyebrow">ERVI · PREDSTAVENIE</div>
      <h2 className="landing__title landing__title--dark">NIEČO MÁLO O NÁS</h2>
      <div className="landing__callout">
        Prepravný partner so sídlom v Bratislave. Špecializujeme sa na{' '}
        <strong>rýchlu a spoľahlivú prepravu veľkého a nadrozmerného tovaru.</strong>
      </div>
      <p className="landing__paragraph">
        Zatiaľčo väčšina prepravcov končí pri balíkoch do 30 kg,{' '}
        <strong>my sme vozový park, tím aj procesy stavali na rozvoze veľkého tovaru</strong>:
        nábytok, spotrebiče, záhradnú techniku, sanitu či materiál. Vrátane výnosu do bytu a
        odbornej montáže. Skladovanie ponúkame ako doplnkovú službu.
      </p>
      <div className="landing__stat-row">
        <div className="landing__stat-card">
          <Icon name="pin" />
          <h3>SLOVENSKO</h3>
          <span>PÔSOBÍME NA CELOM SLOVENSKU</span>
        </div>
        <div className="landing__stat-card">
          <Icon name="truck" />
          <h3>ROZVOZ</h3>
          <span>NAŠA HLAVNÁ SLUŽBA</span>
        </div>
        <div className="landing__stat-card">
          <Icon name="sofa" />
          <h3>VEĽKÝ TOVAR</h3>
          <span>NAŠA ŠPECIALIZÁCIA</span>
        </div>
      </div>
      <div className="landing__tagline landing__tagline--dark">
        RÝCHLA PREPRAVA, VÝNOS AJ MONTÁŽ — JEDEN PARTNER.
      </div>
    </section>
  );
};

export default About;
