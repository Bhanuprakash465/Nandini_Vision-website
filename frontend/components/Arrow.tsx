export function Arrow({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <path d="M3 12h17M14 6l6 6-6 6" strokeLinecap="square" />
    </svg>
  );
}
