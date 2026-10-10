export function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="#00E599" strokeWidth="2.5" />
      <path
        d="M11 10h6c2.5 0 4.5 1.5 4.5 4s-2 4-4.5 4H11v-8zm0 8v5"
        stroke="#00E599"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="21" r="3" fill="#00E599" />
    </svg>
  );
}
