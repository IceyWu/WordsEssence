/** A small metallic paperclip, clipped over the top edge of a sheet. */
export function PaperClip({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="26"
      height="56"
      viewBox="0 0 26 56"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="clip-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9dde2" />
          <stop offset="0.45" stopColor="#9aa1ab" />
          <stop offset="0.55" stopColor="#c4cad1" />
          <stop offset="1" stopColor="#7f868f" />
        </linearGradient>
      </defs>
      <path
        d="M8 50 V14 a5 5 0 0 1 10 0 V44 a8 8 0 0 1 -16 0 V18"
        stroke="url(#clip-metal)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
