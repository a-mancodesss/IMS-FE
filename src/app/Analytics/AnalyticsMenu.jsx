export default function AnalyticsMenu({
  title,
  activeTabTitle,
  onTabChange,
  children,
}) {
  return (
    <button
      type="button"
      data-state={activeTabTitle === title ? "active" : "inactive"}
      className="justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex items-center gap-2"
      onClick={() => onTabChange(title)}
    >
      {children}
    </button>
  );
}
