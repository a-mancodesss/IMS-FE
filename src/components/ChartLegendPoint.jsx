export default function ChartLegendPoint({ title, count, backgroundColor }) {
  return (
    <article className="flex flex-col items-center">
      <div className="text-2xl font-bold">{count}</div>
      <div className="flex items-center gap-2 text-sm">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: `${backgroundColor}` }}
        ></div>
        {title}
      </div>
    </article>
  );
}
