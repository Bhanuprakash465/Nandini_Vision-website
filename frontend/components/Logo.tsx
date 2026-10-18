export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M6 10 L14 10 L26 34 L26 10 L32 10 L32 38 L24 38 L12 14 L12 38 L6 38 Z" fill="currentColor" />
      <path
        d="M30 10 L36 10 L42 30 L42 10 L47 10 L47 38 L41 38 L34 16 L34 38 L30 38 Z"
        fill="var(--color-cobalt-light)"
        transform="translate(-4,0)"
      />
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
    </svg>
  );
}
