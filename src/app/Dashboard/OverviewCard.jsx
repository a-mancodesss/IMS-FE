import { Link } from "react-router-dom";

import LoadingIndicator from "../../components/LoadingIndicator.jsx";

export default function OverviewCard({
  title,
  path = "#",
  dataPackage = "",
  overviewNum,
  overviewInfo,
  children,
}) {
  return (
    <Link
      className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer"
      to={path}
      state={dataPackage}
    >
      <header className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 mb-2 bg-primary/5 rounded-t-lg">
        <div className="tracking-tight text-sm font-medium">{title}</div>
        {children}
      </header>
      <div className="p-6 pt-0">
        {overviewNum === undefined ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="text-2xl font-bold">{overviewNum}</div>
            <p className="text-xs text-muted-foreground">{overviewInfo}</p>
          </>
        )}
      </div>
    </Link>
  );
}
