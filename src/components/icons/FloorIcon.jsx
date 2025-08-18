export default function FloorIcon({
  cssClass = "h-5 w-5 text-muted-foreground",
}) {
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
      className={cssClass}
    >
      <rect x="3" y="8" width="18" height="4" rx="1"></rect>
      <rect x="3" y="16" width="18" height="4" rx="1"></rect>
      <path d="M3 4h18"></path>
    </svg>
  );
}
