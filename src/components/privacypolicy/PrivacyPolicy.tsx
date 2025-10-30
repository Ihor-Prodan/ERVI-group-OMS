import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-container">
      <h1>Ochrana osobných údajov</h1>

      <p>
        Vaše súkromie je pre nás dôležité. Tento dokument vysvetľuje, aké osobné údaje
        zhromažďujeme, ako ich používame a aké máte práva v súvislosti s ich spracovaním.
      </p>

      <h2>1. Zodpovedná osoba</h2>
      <p>
        Prevádzkovateľom webovej stránky a spracovateľom osobných údajov je:
        <br />
        <strong>ERVI Group s.r.o.</strong>
        <br />
        IČO: 56 829 175
        <br />
        E-mail: <a href="mailto:info@ervi-group.com">info@ervi-group.com</a>
      </p>

      <h2>2. Aké údaje spracúvame</h2>
      <p>Pri vytváraní a doručovaní objednávok spracúvame nasledujúce osobné údaje:</p>
      <ul>
        <li>E-mail odosielateľa (odosielajúcej osoby)</li>
        <li>E-mail príjemcu (osoby, ktorej sa zásielka doručuje)</li>
        <li>Telefónne číslo odosielateľa</li>
        <li>Telefónne číslo príjemcu</li>
        <li>Meno a priezvisko príjemcu</li>
        <li>Adresa odosielateľa</li>
        <li>Adresa príjemcu</li>
      </ul>

      <h2>3. Účel spracovania údajov</h2>
      <p>Osobné údaje sú spracúvané výhradne na účely:</p>
      <ul>
        <li>vytvorenia a spracovania objednávky,</li>
        <li>doručenia zásielky príjemcovi,</li>
        <li>komunikácie so zákazníkom (odosielateľom a príjemcom).</li>
      </ul>

      <h2>4. Doba uchovávania údajov</h2>
      <p>
        Vaše osobné údaje uchovávame len po dobu nevyhnutnú na spracovanie a doručenie objednávky,
        najdlhšie však <strong>3 mesiace od doručenia zásielky príjemcovi</strong>. Po uplynutí
        tejto doby sú všetky osobné údaje automaticky a bezpečne vymazané.
      </p>

      <h2>5. Vaše práva</h2>
      <p>Máte právo na:</p>
      <ul>
        <li>prístup k svojim osobným údajom,</li>
        <li>opravu alebo vymazanie údajov,</li>
        <li>obmedzenie spracovania,</li>
        <li>námietku proti spracovaniu,</li>
        <li>prenesenie údajov k inému prevádzkovateľovi.</li>
      </ul>

      <h2>6. Kontakt pre ochranu údajov</h2>
      <p>
        V prípade otázok ohľadom spracovania Vašich údajov nás kontaktujte na adrese:
        <a href="mailto:info@ervi-group.com">info@ervi-group.com</a>
      </p>

      <p className="privacy-updated">
        Posledná aktualizácia: <strong>26.10.2025</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
