export default function PageHeader({ title, children }) {
  return (
    <header className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {children}
    </header>
  );
}
