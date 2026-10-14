import React from 'react';
import Icon from '../../Icon';
import specializationPhoto from '../../../../assets/oversized-cargo.jpg';
import './Specialization.css';

const comparisonBad = [
  'Zásielky do 30 kg a rozmerov balíkovej siete',
  'Termín doručenia určuje prepravca',
  'Doručenie k dverám alebo pred bránu',
  'Montáž ani inštalácia nie sú v ponuke',
];

const comparisonGood = [
  'Kusy nad 30 kg, palety a nadrozmerný tovar',
  'Doručenie v dohodnutom časovom okne',
  'Doručenie až na miesto určenia v byte',
  'Výnos, vybalenie, montáž a odvoz obalov',
];

const Specialization: React.FC = () => {
  return (
    <section
      id="paletova-preprava"
      className="landing__section landing__section--photo"
      style={{
        backgroundImage: `linear-gradient(to right, #0f172a 0%, #0f172a 52%, rgba(15, 23, 42, 0.85) 62%, rgba(15, 23, 42, 0.25) 82%, rgba(15, 23, 42, 0) 100%), url(${specializationPhoto})`,
      }}
    >
      <div className="landing__eyebrow">PALETOVÁ PREPRAVA</div>
      <h2 className="landing__title">TOVAR, KTORÝ SA NEZMESTÍ DO BALÍKA</h2>
      <div className="landing__subtitle">PALETY A NADROZMERNÝ TOVAR BEZ OBMEDZENÍ HMOTNOSTI</div>
      <div className="landing__callout">
        Väčšina prepravcov končí pri balíku do 30 kg. <strong>My tam len začíname.</strong>
      </div>
      <div className="landing__compare">
        <div className="landing__compare-col landing__compare-col--bad">
          <div className="landing__compare-heading">BEŽNÁ BALÍKOVÁ PREPRAVA</div>
          <ul>
            {comparisonBad.map((it) => (
              <li key={it}>
                <Icon name="cross" />
                {it}
              </li>
            ))}
          </ul>
        </div>
        <div className="landing__compare-col landing__compare-col--good">
          <div className="landing__compare-heading">ERVI GROUP</div>
          <ul>
            {comparisonGood.map((it) => (
              <li key={it}>
                <Icon name="check" />
                <strong>{it}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="landing__tagline">ČO BEŽNÝ KURIÉR ODMIETNE, JE PRE NÁS BEŽNÝ PRACOVNÝ DEŇ.</div>
    </section>
  );
};

export default Specialization;
