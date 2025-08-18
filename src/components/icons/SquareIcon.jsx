export default function SquareIcon({ isSelected }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      {isSelected && <path d="m9 12 2 2 4-4" />}
    </svg>
  );
}
