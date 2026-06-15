const icons = {
  book: (
    <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Zm0 0A2.5 2.5 0 0 0 2.5 8v13.5A2.5 2.5 0 0 1 5 19h14" />
  ),
  calendar: (
    <>
      <path d="M7 2.5v4M17 2.5v4M4 9h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5Z" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  edit: <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4" />,
  loader: <path d="M12 3a9 9 0 1 1-8.2 5.3" />,
  refresh: <path d="M20 6v5h-5M4 18v-5h5M18.5 9A7 7 0 0 0 6.8 6.2L4 9m16 6-2.8 2.8A7 7 0 0 1 5.5 15" />,
  save: <path d="M5 3h12l2 2v16H5V3Zm3 0v6h8V3M8 17h8" />,
  search: <path d="m20 20-4.8-4.8M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
  sparkles: <path d="m12 3 1.6 5.1L19 10l-5.4 1.9L12 17l-1.6-5.1L5 10l5.4-1.9L12 3ZM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15ZM19 14l.5 1.5L21 16l-1.5.5L19 18l-.5-1.5L17 16l1.5-.5L19 14Z" />,
  trash: <path d="M4 7h16M9 7V4h6v3m-8 0 1 14h8l1-14M10 11v6M14 11v6" />,
  x: <path d="m6 6 12 12M18 6 6 18" />
};

function Icon({ name, size = 18, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export default Icon;
