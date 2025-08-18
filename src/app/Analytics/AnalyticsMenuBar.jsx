import PieChartIcon from "../../components/icons/PieChartIcon.jsx";
import TextFileIcon from "../../components/icons/TextFileIcon.jsx";
import AnalyticsMenu from "./AnalyticsMenu.jsx";

export default function AnalyticsMenuBar({ activeTabTitle, handleTabChange }) {
  return (
    <aside className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      <AnalyticsMenu
        title="Condition Breakdown"
        activeTabTitle={activeTabTitle}
        onTabChange={handleTabChange}
      >
        <PieChartIcon />
        Condition Breakdown
      </AnalyticsMenu>

      <AnalyticsMenu
        title="Acquisition Source"
        activeTabTitle={activeTabTitle}
        onTabChange={handleTabChange}
      >
        <TextFileIcon cssClass="h-4 w-4" />
        Acquisition Source
      </AnalyticsMenu>
    </aside>
  );
}
