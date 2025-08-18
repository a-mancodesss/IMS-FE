export default function CheckIcon({ isSelected }) {
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
      {isSelected && <path d="M20 6 9 17l-5-5" />}
    </svg>
  );
}
