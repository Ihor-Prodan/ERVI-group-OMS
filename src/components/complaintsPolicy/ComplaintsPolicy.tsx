import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowLeft } from 'lucide-react';
import '../privacypolicy/PrivacyPolicy.css';

const ComplaintsPolicy: React.FC = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <Link to="/ervi-group" className="privacy-back">
          <ArrowLeft size={15} /> Späť na hlavnú stránku
        </Link>

        <div className="privacy-header">
          <div className="privacy-header-icon">
            <ClipboardList size={22} />
          </div>
          <div>
            <p className="privacy-eyebrow">ERVI Group</p>
            <h1>Reklamačný poriadok</h1>
          </div>
        </div>

        <p>
          Tento reklamačný poriadok upravuje postup pri uplatnení reklamácie v súvislosti so
          službami prepravy a doručenia zásielok poskytovanými spoločnosťou{' '}
          <strong>ERVI Group s.r.o.</strong>, IČO: 56 829 175 (ďalej len „poskytovateľ“), a je
          neoddeliteľnou súčasťou{' '}
          <Link to="/obchodne-podmienky" className="gdpr-link">
            Obchodných podmienok
          </Link>
          .
        </p>

        <h2>1. Rozsah reklamácie</h2>
        <p>Objednávateľ môže reklamovať najmä:</p>
        <ul>
          <li>poškodenie zásielky počas prepravy,</li>
          <li>stratu zásielky,</li>
          <li>nedodržanie dohodnutého termínu doručenia,</li>
          <li>nesprávne doručenie zásielky inému príjemcovi,</li>
          <li>nesprávne vyúčtovanie ceny prepravy.</li>
        </ul>

        <h2>2. Spôsob a lehota na uplatnenie reklamácie</h2>
        <p>
          Reklamáciu je potrebné uplatniť bezodkladne po zistení dôvodu reklamácie, najneskôr
          však do <strong>7 dní</strong> od doručenia zásielky (pri poškodení alebo nesprávnom
          doručení), resp. do 30 dní od dohodnutého termínu doručenia (pri strate zásielky).
        </p>
        <p>Reklamáciu môže objednávateľ podať:</p>
        <ul>
          <li>
            e-mailom na adresu{' '}
            <a href="mailto:info@ervi-group.com">info@ervi-group.com</a>,
          </li>
          <li>telefonicky na čísle uvedenom v päte webovej stránky.</li>
        </ul>
        <p>Reklamácia by mala obsahovať:</p>
        <ul>
          <li>číslo objednávky/zásielky,</li>
          <li>popis vady alebo problému,</li>
          <li>fotodokumentáciu poškodenia (ak je to relevantné),</li>
          <li>kontaktné údaje objednávateľa.</li>
        </ul>

        <h2>3. Vybavenie reklamácie</h2>
        <p>
          Poskytovateľ potvrdí prijatie reklamácie bez zbytočného odkladu a reklamáciu vybaví,
          vrátane odstránenia vady, najneskôr do <strong>30 dní</strong> od jej uplatnenia. O
          výsledku reklamačného konania bude objednávateľ informovaný e-mailom alebo telefonicky.
        </p>
        <p>
          Ak je reklamácia uznaná ako oprávnená, poskytovateľ podľa povahy prípadu zabezpečí
          nápravu, primeranú zľavu z ceny prepravy alebo náhradu škody v rozsahu stanovenom
          platnými právnymi predpismi a dohodnutými podmienkami prepravy.
        </p>

        <h2>4. Vylúčenie zo zodpovednosti</h2>
        <p>Poskytovateľ nezodpovedá za vady spôsobené najmä:</p>
        <ul>
          <li>nesprávnym alebo nedostatočným zabalením zásielky objednávateľom,</li>
          <li>uvedením nepravdivých alebo neúplných údajov o obsahu či adrese zásielky,</li>
          <li>vyššou mocou (živelná udalosť, dopravné obmedzenia a podobne),</li>
          <li>bežným opotrebením alebo vlastnosťami prepravovaného tovaru.</li>
        </ul>

        <h2>5. Alternatívne riešenie sporov</h2>
        <p>
          Ak objednávateľ ako spotrebiteľ nie je spokojný so spôsobom vybavenia reklamácie, má
          právo obrátiť sa na{' '}
          <strong>Slovenskú obchodnú inšpekciu</strong>
          <br />
          Inšpektorát SOI pre Bratislavský kraj
          <br />
          Bajkalská 21/A, P. O. BOX č. 5, 820 07 Bratislava 27
          <br />
          <a href="https://www.soi.sk" target="_blank" rel="noreferrer">
            www.soi.sk
          </a>
          , alebo prostredníctvom platformy{' '}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>

        <h2>6. Kontakt</h2>
        <p>
          Reklamácie a otázky k tomuto poriadku prijímame na adrese:{' '}
          <a href="mailto:info@ervi-group.com">info@ervi-group.com</a>
        </p>

        <p className="privacy-updated">
          Posledná aktualizácia: <strong>04.10.2026</strong>
        </p>
      </div>
    </div>
  );
};

export default ComplaintsPolicy;
