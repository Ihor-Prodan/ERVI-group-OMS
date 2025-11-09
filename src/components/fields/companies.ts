export interface CompanyOption {
  value: string;
  label: string;
}

export const COMPANY_OPTIONS: CompanyOption[] = [
  { value: '1', label: 'Miele s.r.o. (SK)' },
  { value: '5', label: 'Miele spol. s.r.o. (CZ)' },
  { value: '2', label: 'em-shop.sk' },
  { value: '3', label: 'P & P Stanek s.r.o.' },
  { value: '6', label: 'Ine...' },
];

export const COUNTRY_OPTIONS = [
  { label: 'Slovenská republika', value: 'SK' },
  { label: 'Česká republika', value: 'CZ' },
];

export const companiesMap = [
  {
    id: '5',
    name: 'Miele (CZ)',
    adress: 'Holubice 563',
    psc: '68351',
    city: 'Holubice',
    country: 'Česká republika',
    phone: '+420543553111',
    email: 'info@miele.cz'
  },
  {
    id: '1',
    name: 'Miele (SK)',
    adress: 'Dialničná cesta 10C',
    psc: '90301',
    city: 'Senec',
    country: 'Slovenska republika',
    phone: '+421905446819',
    email: 'info@miele.sk'
  },
  {
    id: '2',
    name: 'em-shop.sk',
    adress: 'Dialničná cesta 10C',
    psc: '90301',
    city: 'Senec',
    country: 'Slovenska republika',
    phone: '+421911503999',
    email: 'info@em-shop.sk'
  },
  {
    id: '3',
    name: 'P & P Stanek s.r.o.',
    adress: 'Kopčianska 92',
    psc: '85101',
    city: 'Bratislava',
    country: 'Slovenska republika',
    phone: '+421918913352',
    email: 'attila.forgon@pottenpannen.sk'
  },
]

export const getCompanyById = (id: string) => {
  return companiesMap.find(c => c.id === id);
}
