import React from 'react';

const Icon: React.FC<{ name: string }> = ({ name }) => {
  const paths: Record<string, React.ReactNode> = {
    truck: (
      <g transform="translate(-1, -3.3)">
        <rect x="1" y="7" width="13" height="9" rx="1" />
        <path d="M14 10h4l3 3v3h-7z" />
        <circle cx="6" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </g>
    ),
    truck2: (
      <g transform="translate(-0.5, -3.7)">
        <rect x="1" y="8" width="12" height="8" rx="1" />
        <path d="M13 11h4l3 2.5v2.5h-7z" />
        <circle cx="5.5" cy="18" r="1.4" />
        <circle cx="16" cy="18" r="1.4" />
      </g>
    ),
    clock: (
      <>
        <circle cx="10" cy="10" r="8" />
        <path d="M10 5v5l3.5 2" />
      </>
    ),
    shop: (
      <>
        <path d="M2 8l1.5-5h13L18 8" />
        <path d="M2 8v9a1 1 0 001 1h14a1 1 0 001-1V8" />
        <path d="M7 18v-5h6v5" />
      </>
    ),
    undo: <path d="M4 8h9a5 5 0 010 10H8M4 8l4-4M4 8l4 4" />,
    network: (
      <>
        <circle cx="10" cy="4" r="2" />
        <circle cx="4" cy="16" r="2" />
        <circle cx="16" cy="16" r="2" />
        <path d="M10 6v4M10 10l-6 4M10 10l6 4" />
      </>
    ),
    warehouse: (
      <>
        <path d="M2 9l8-5 8 5v9a1 1 0 01-1 1H3a1 1 0 01-1-1z" />
        <path d="M7 19v-6h6v6" />
      </>
    ),
    person: (
      <>
        <circle cx="10" cy="6" r="3.2" />
        <path d="M3 18c0-4 3-6 7-6s7 2 7 6" />
      </>
    ),
    expand: (
      <>
        <path d="M2 7V2h5M18 7V2h-5M2 13v5h5M18 13v5h-5" />
      </>
    ),
    link: <path d="M8 12a4 4 0 004 4h2a4 4 0 000-8h-1M12 8a4 4 0 00-4-4H6a4 4 0 000 8h1" />,
    sofa: (
      <>
        <path d="M3 11V8a2 2 0 012-2h10a2 2 0 012 2v3" />
        <path d="M2 11h16v4a1 1 0 01-1 1H3a1 1 0 01-1-1z" />
        <path d="M3 16v2M17 16v2" />
      </>
    ),
    appliance: (
      <>
        <rect x="4" y="2" width="12" height="16" rx="1" />
        <circle cx="10" cy="11" r="4" />
        <path d="M7 5h.01" />
      </>
    ),
    tools: <path d="M3 17l6-6M13 3l4 4-3 3-4-4zM7 11l-4 4v3h3l4-4" />,
    sink: (
      <>
        <path d="M2 9h16v3a5 5 0 01-5 5H7a5 5 0 01-5-5z" />
        <path d="M6 9V6a2 2 0 012-2h1M10 4v2" />
      </>
    ),
    cart: (
      <>
        <path d="M2 3h2l2 11h9l2-7H5" />
        <circle cx="8" cy="17" r="1.4" />
        <circle cx="14" cy="17" r="1.4" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="2" width="12" height="16" rx="1" />
        <path d="M7 6h1M12 6h1M7 10h1M12 10h1M7 14h1M12 14h1" />
      </>
    ),
    pin: (
      <>
        <path d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z" />
        <circle cx="10" cy="8" r="2" />
      </>
    ),
    mail: (
      <>
        <rect x="2" y="4" width="16" height="12" rx="1.5" />
        <path d="M2.5 5l7.5 6 7.5-6" />
      </>
    ),
    check: <path d="M4 10l4 4 8-8" />,
    cross: <path d="M5 5l10 10M15 5L5 15" />,
  };

  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

export default Icon;
