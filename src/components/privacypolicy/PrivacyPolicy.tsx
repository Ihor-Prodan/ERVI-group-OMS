import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <Link to="/ervi-group" className="privacy-back">
          <ArrowLeft size={15} /> Späť na hlavnú stránku
        </Link>

        <div className="privacy-header">
          <div className="privacy-header-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="privacy-eyebrow">ERVI Group</p>
            <h1>Ochrana osobných údajov</h1>
          </div>
        </div>

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
      <p>
        Pri odoslaní kontaktného formulára spracúvame meno, e-mail, telefónne číslo, názov firmy
        (ak ho uvediete) a text vašej správy — tieto údaje sa uložia ako záznam v našom systéme
        rovnakým spôsobom ako objednávka. Rovnako postupujeme aj pri telefonickej alebo osobnej
        rezervácii prepravy, ktorú na vašu žiadosť zadá priamo náš tím. Pri odoslaní recenzie
        spracúvame meno, názov firmy (ak ho uvediete) a text recenzie — tieto údaje sú po
        schválení zverejnené na webe.
      </p>

      <h2>3. Účel spracovania údajov</h2>
      <p>Osobné údaje sú spracúvané výhradne na účely:</p>
      <ul>
        <li>vytvorenia a spracovania objednávky,</li>
        <li>doručenia zásielky príjemcovi,</li>
        <li>komunikácie so zákazníkom (odosielateľom a príjemcom),</li>
        <li>vybavenia dopytu zaslaného cez kontaktný formulár,</li>
        <li>zverejnenia recenzie na webe, ak s tým súhlasíte.</li>
      </ul>

      <h2>4. Doba uchovávania údajov</h2>
      <p>
        <strong>Objednávky:</strong> Vaše osobné údaje uchovávame len po dobu nevyhnutnú na
        spracovanie a doručenie objednávky, najdlhšie však{' '}
        <strong>3 mesiace od doručenia zásielky príjemcovi</strong>. Po uplynutí tejto doby sú
        všetky osobné údaje automaticky a bezpečne vymazané.
      </p>
      <p>
        <strong>Kontaktný formulár a rezervácie:</strong> Dopyt z kontaktného formulára alebo
        rezervácia zadaná naším tímom sa uloží ako záznam v našom systéme a o jeho prijatí sme
        upozornení e-mailom. Údaje uchovávame len po dobu nevyhnutnú na vybavenie dopytu,
        najdlhšie však <strong>3 mesiace od jeho vybavenia alebo zrušenia</strong>. Po uplynutí
        tejto doby sú automaticky a bezpečne vymazané — rovnako ako pri objednávkach.
      </p>
      <p>
        <strong>Recenzie:</strong> Meno, názov firmy a text recenzie uchovávame bez časového
        obmedzenia, keďže ide o referenciu zverejnenú na našom webe s vaším súhlasom. Recenziu
        môžeme na vašu žiadosť kedykoľvek odstrániť.
      </p>

      <h2>5. Príjemcovia a spracovatelia údajov</h2>
      <p>
        Na spracovanie osobných údajov využívame nasledujúcich externých poskytovateľov služieb
        (sprostredkovateľov), ktorí k údajom pristupujú výhradne v rozsahu potrebnom na
        poskytnutie svojej služby:
      </p>
      <ul>
        <li>
          <strong>Resend</strong> — služba na odosielanie e-mailových notifikácií (potvrdenie a
          doručenie objednávky, správy z kontaktného formulára). V závislosti od typu e-mailu
          môžu jeho obsahom prechádzať údaje ako meno, doručovacia adresa, telefónne číslo alebo
          e-mailová adresa.
        </li>
        <li>
          <strong>Railway</strong> — poskytovateľ hostingu, na ktorom beží naša webová aplikácia
          a databáza. Všetky osobné údaje uvedené v tomto dokumente sú uložené na jeho
          infraštruktúre.
        </li>
      </ul>

      <h2>6. Cookies</h2>
      <p>
        Naša webová aplikácia používa výlučne technicky nevyhnutné cookies potrebné na
        prihlásenie a bezpečné fungovanie aplikácie:
      </p>
      <ul>
        <li>
          <strong>accessToken</strong> — krátkodobý prístupový token na overenie prihlásenia
          (platnosť 2 hodiny),
        </li>
        <li>
          <strong>refreshToken</strong> — token na automatické obnovenie prihlásenia bez
          opätovného zadania hesla (platnosť 3 dni),
        </li>
        <li>
          <strong>csrfToken</strong> — bezpečnostný token na ochranu pred útokmi typu CSRF.
        </li>
      </ul>
      <p>
        Všetky uvedené cookies sú nevyhnutné na fungovanie prihláseného účtu a nepoužívajú sa na
        marketingové ani analytické účely. Nepoužívame cookies tretích strán ani nástroje na
        sledovanie návštevnosti (napr. Google Analytics), preto si ich používanie nevyžaduje váš
        súhlas.
      </p>

      <h2>7. Vaše práva</h2>
      <p>Máte právo na:</p>
      <ul>
        <li>prístup k svojim osobným údajom,</li>
        <li>opravu alebo vymazanie údajov,</li>
        <li>obmedzenie spracovania,</li>
        <li>námietku proti spracovaniu,</li>
        <li>prenesenie údajov k inému prevádzkovateľovi.</li>
      </ul>

      <h2>8. Kontakt pre ochranu údajov</h2>
      <p>
        V prípade otázok ohľadom spracovania Vašich údajov nás kontaktujte na adrese:
        <a href="mailto:info@ervi-group.com">info@ervi-group.com</a>
      </p>

      <p className="privacy-updated">
        Posledná aktualizácia: <strong>04.10.2026</strong>
      </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
