const paths = {
  sparkles: ["M12 3l1.9 5.7L20 11l-6.1 2.3L12 19l-1.9-5.7L4 11l6.1-2.3L12 3z", "M19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8L19 3z"],
  home: ["M3 10.5L12 3l9 7.5", "M5 9.5V21h14V9.5", "M9 21v-7h6v7"],
  phone: ["M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z", "M11 18h2"],
  wifi: ["M2.5 8.5a15 15 0 0119 0", "M5.5 12a10 10 0 0113 0", "M8.5 15.5a5 5 0 017 0", "M12 19h.01"],
  receipt: ["M6 2h12v20l-3-2-3 2-3-2-3 2V2z", "M9 7h6", "M9 11h6", "M9 15h4"],
  devices: ["M3 5h13v12H3z", "M8 21h4", "M10 17v4", "M19 9h3v12h-3z"],
  headset: ["M4 14v-3a8 8 0 1116 0v3", "M4 13h3v6H4z", "M17 13h3v6h-3z", "M20 19a4 4 0 01-4 4h-3"],
  menu: ["M3 6h18", "M3 12h18", "M3 18h18"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  reset: ["M20 11a8 8 0 10-2.4 5.7", "M20 4v7h-7"],
  shield: ["M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5l8-3z", "M9 12l2 2 4-4"],
  signal: ["M3 20v-3", "M8 20v-7", "M13 20V9", "M18 20V5", "M22 20V2"],
  suitcase: ["M4 7h16v14H4z", "M8 7V4a2 2 0 012-2h4a2 2 0 012 2v3", "M4 12h16"],
  send: ["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"],
  chevron: ["M9 18l6-6-6-6"],
  check: ["M5 12l4 4L19 6"],
  alert: ["M12 3L2 21h20L12 3z", "M12 9v4", "M12 17h.01"],
  bell: ["M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M10 21h4"],
  lock: ["M5 10h14v11H5z", "M8 10V7a4 4 0 018 0v3", "M12 15v2"],
  clock: ["M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 6v6l4 2"],
  download: ["M12 3v12", "M7 10l5 5 5-5", "M4 17v4h16v-4"],
  globe: ["M12 22a10 10 0 100-20 10 10 0 000 20z", "M2 12h20", "M12 2c2.5 2.7 4 6.3 4 10s-1.5 7.3-4 10c-2.5-2.7-4-6.3-4-10s1.5-7.3 4-10z"],
  calendar: ["M4 5h16v16H4z", "M8 3v4", "M16 3v4", "M4 10h16"],
  user: ["M20 21a8 8 0 00-16 0", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
  arrowUp: ["M12 19V5", "M5 12l7-7 7 7"],
  chart: ["M3 3v18h18", "M7 14l4-4 4 3 5-7"],
};

export default function Icon({ name, size = 20, className = "", strokeWidth = 1.7 }) {
  const iconPaths = paths[name] ?? paths.sparkles;

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      className={className}
    >
      {iconPaths.map((item) => (
        <path key={item} d={item} />
      ))}
    </svg>
  );
}
