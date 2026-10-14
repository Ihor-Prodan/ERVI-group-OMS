import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import '../privacypolicy/PrivacyPolicy.css';

const TermsOfService: React.FC = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <Link to="/ervi-group" className="privacy-back">
          <ArrowLeft size={15} /> Späť na hlavnú stránku
        </Link>

        <div className="privacy-header">
          <div className="privacy-header-icon">
            <FileText size={22} />
          </div>
          <div>
            <p className="privacy-eyebrow">ERVI Group</p>
            <h1>Obchodné podmienky</h1>
          </div>
        </div>

        <p>
          Tieto obchodné podmienky upravujú vzájomné práva a povinnosti medzi spoločnosťou ERVI
          Group s.r.o. a objednávateľom pri poskytovaní prepravných a doručovacích služieb
          prostredníctvom tejto webovej aplikácie.
        </p>

        <h2>1. Zmluvné strany</h2>
        <p>
          Poskytovateľom služby je:
          <br />
          <strong>ERVI Group s.r.o.</strong>
          <br />
          IČO: 56 829 175
          <br />
          E-mail: <a href="mailto:info@ervi-group.com">info@ervi-group.com</a>
          <br />
          (ďalej len „<strong>poskytovateľ</strong>“)
        </p>
        <p>
          Objednávateľom je fyzická alebo právnická osoba, ktorá si u poskytovateľa objedná
          prepravu alebo doručenie zásielky prostredníctvom objednávkového formulára, rezervácie
          alebo kontaktného formulára (ďalej len „<strong>objednávateľ</strong>“).
        </p>

        <h2>2. Vznik zmluvného vzťahu</h2>
        <p>Zmluvný vzťah medzi poskytovateľom a objednávateľom vzniká jedným z nasledujúcich spôsobov:</p>
        <ul>
          <li>vyplnením a odoslaním objednávkového formulára na webovej stránke,</li>
          <li>
            vytvorením rezervácie zo strany poskytovateľa na základe telefonického alebo
            osobného dopytu objednávateľa,
          </li>
          <li>
            odoslaním dopytu cez kontaktný formulár, ktorý poskytovateľ následne telefonicky
            alebo e-mailom potvrdí ako záväznú objednávku.
          </li>
        </ul>
        <p>
          Objednávka sa považuje za záväznú okamihom jej potvrdenia poskytovateľom (zmena stavu
          objednávky na „Prijatá“/„Odoslaná“). Poskytovateľ si vyhradzuje právo objednávku
          odmietnuť, najmä ak nie je možné zásielku prepraviť z technických, kapacitných alebo
          právnych dôvodov — o tejto skutočnosti bezodkladne informuje objednávateľa.
        </p>

        <h2>3. Cena a platobné podmienky</h2>
        <p>
          Cena prepravy je stanovená individuálne na základe druhu, hmotnosti a rozmerov zásielky,
          miesta vyzdvihnutia a miesta doručenia. Cena je objednávateľovi oznámená pred potvrdením
          objednávky alebo je dohodnutá telefonicky/e-mailom pri rezervácii.
        </p>
        <p>
          Platba sa realizuje spôsobom dohodnutým medzi poskytovateľom a objednávateľom
          (bankovým prevodom na základe faktúry, prípadne iným dohodnutým spôsobom). Splatnosť
          faktúry je 14 dní od jej vystavenia, pokiaľ nie je dohodnuté inak.
        </p>

        <h2>4. Vyzdvihnutie a doručenie zásielky</h2>
        <p>
          Termín vyzdvihnutia zásielky si objednávateľ zvolí v objednávkovom formulári (konkrétny
          dátum alebo „čo najskôr“), prípadne je dohodnutý telefonicky pri rezervácii. Poskytovateľ
          sa snaží dodržať dohodnutý termín, tento však môže byť ovplyvnený dopravnou situáciou,
          počasím alebo inými okolnosťami vylučujúcimi zodpovednosť.
        </p>
        <p>
          Objednávateľ je povinný poskytnúť pravdivé a úplné údaje o zásielke (hmotnosť, rozmery,
          obsah) a o adrese vyzdvihnutia a doručenia. Za škodu spôsobenú nepravdivými alebo
          neúplnými údajmi zodpovedá objednávateľ.
        </p>
        <p>
          Priebeh objednávky si môže objednávateľ sledovať online v sledovaní zásielky na základe
          pridaného čísla zásielky, prípadne mu je zasielaný e-mailom.
        </p>

        <h2>5. Zrušenie objednávky a odstúpenie od zmluvy</h2>
        <p>
          Objednávateľ môže objednávku bezplatne zrušiť, pokiaľ ešte nebola odovzdaná na prepravu
          (stav „Prijatá“). Po odovzdaní zásielky na prepravu (stav „Odoslaná“) môže byť zrušenie
          spojené s úhradou už vzniknutých nákladov.
        </p>
        <p>
          V súlade so zákonom č. 102/2014 Z. z. nemožno odstúpiť od zmluvy o službách preprav,
          ktorých plnenie sa už s výslovným súhlasom spotrebiteľa začalo pred uplynutím lehoty na
          odstúpenie od zmluvy.
        </p>

        <h2>6. Zodpovednosť za škodu</h2>
        <p>
          Poskytovateľ zodpovedá za škodu na zásielke vzniknutú počas prepravy v rozsahu
          stanovenom platnými právnymi predpismi. Prípadnú škodu je objednávateľ povinný
          nahlásiť bezodkladne po jej zistení, najneskôr však pri prevzatí zásielky, spôsobom
          uvedeným v Reklamačnom poriadku.
        </p>
        <p>
          Poskytovateľ nezodpovedá za škodu spôsobenú vyššou mocou (napr. živelná udalosť,
          dopravná nehoda nezavinená poskytovateľom) ani za škodu vzniknutú v dôsledku nesprávne
          alebo nedostatočne zabalenej zásielky.
        </p>

        <h2>7. Mimosúdne riešenie sporov</h2>
        <p>
          Ak objednávateľ ako spotrebiteľ nie je spokojný so spôsobom, ktorým poskytovateľ
          vybavil jeho reklamáciu, alebo sa domnieva, že poskytovateľ porušil jeho práva, má
          právo obrátiť sa na poskytovateľa so žiadosťou o nápravu. Ak poskytovateľ na žiadosť
          odpovie zamietavo alebo na ňu neodpovie do 30 dní, spotrebiteľ má právo podať návrh na
          začatie alternatívneho riešenia sporu subjektu alternatívneho riešenia sporov podľa
          zákona č. 391/2015 Z. z., ktorým je najmä{' '}
          <strong>Slovenská obchodná inšpekcia</strong> (
          <a href="https://www.soi.sk" target="_blank" rel="noreferrer">
            www.soi.sk
          </a>
          ), alebo prostredníctvom platformy{' '}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>

        <h2>8. Záverečné ustanovenia</h2>
        <p>
          Tieto obchodné podmienky sa riadia právnym poriadkom Slovenskej republiky. Spracovanie
          osobných údajov objednávateľa upravuje samostatný dokument{' '}
          <Link to="/ochrana-osobnych-udajov" className="gdpr-link">
            Ochrana osobných údajov
          </Link>
          . Poskytovateľ si vyhradzuje právo tieto obchodné podmienky kedykoľvek upraviť, zmena sa
          nevzťahuje na už potvrdené objednávky.
        </p>

        <p className="privacy-updated">
          Posledná aktualizácia: <strong>04.10.2026</strong>
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
