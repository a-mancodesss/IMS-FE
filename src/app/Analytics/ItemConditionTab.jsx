import { useEffect, useState, useContext } from "react";

import TableFilter from "../../components/TableFilter.jsx";
import ConditionPieChart from "../../components/ConditionPieChart.jsx";
import ChartLegendPoint from "../../components/ChartLegendPoint.jsx";
import LoadingIndicator from "../../components/LoadingIndicator.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import {
  INVENTORY_STATS_RESPONSE_MAPPING,
  PIE_CHART_RESPONSE_MAPPING,
} from "../../constants/tableConfig.js";
import { API_BASE_URL } from "../../utils/envVars.js";

export default function ItemConditionTab({ hidden, inventoryStats }) {
  const [statusBreakdown, setStatusBreakdown] = useState({
    working: 0,
    repairable: 0,
    notWorking: 0,
  });

  const [categoryId, setCategoryId] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, handleLogout } = useContext(AuthProvider);

  useEffect(() => {
    if (!inventoryStats) return;

    if (categoryId === "0") {
      setStatusBreakdown({
        working:
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.workingItems
          ] || 0,
        repairable:
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.repairableItems
          ] || 0,
        notWorking:
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.notWorkingItems
          ] || 0,
      });
      setIsLoading(false);
      return;
    }

    async function fetchItemStatusData() {
      try {
        const fetchUrl = `${API_BASE_URL}/api/v1/categories/${categoryId}/item-status-stats`;

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();

          setStatusBreakdown({
            working:
              responseBody.data[
                PIE_CHART_RESPONSE_MAPPING.status.workingItems
              ] || 0,
            repairable:
              responseBody.data[
                PIE_CHART_RESPONSE_MAPPING.status.repairableItems
              ] || 0,
            notWorking:
              responseBody.data[
                PIE_CHART_RESPONSE_MAPPING.status.notWorkingItems
              ] || 0,
          });

          setIsLoading(false);
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchItemStatusData();
  }, [categoryId, inventoryStats]);

  function handleDropdownChange(identifier, payload) {
    setCategoryId(payload.id);
  }

  if (hidden) {
    return null;
  }

  return (
    <section className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <header className="flex justify-between items-center space-y-1.5 p-6">
          <div className="flex flex-col">
            <div className="text-2xl font-semibold leading-none tracking-tight">
              Item Condition Breakdown
            </div>
            <div className="text-sm text-muted-foreground">
              Current status of items across the department
            </div>
          </div>
          <TableFilter
            dropdownInitialValue="All categories"
            dropdownConfigKey="category"
            isInitialValueAnOption={true}
            onStateChange={handleDropdownChange}
            widthSize="230px"
          />
        </header>
        <div className="p-6 pt-0">
          {isLoading ? (
            <div className="h-[280px] flex justify-center items-center">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <article
                className="flex flex-col items-center"
                style={{ height: "280px" }}
              >
                <ConditionPieChart
                  chartData={[
                    {
                      name: "Working",
                      value: statusBreakdown.working,
                      color: "#4ade80",
                    },
                    {
                      name: "Repairable",
                      value: statusBreakdown.repairable,
                      color: "#facc15",
                    },
                    {
                      name: "Not-working",
                      value: statusBreakdown.notWorking,
                      color: "#f87171",
                    },
                  ]}
                  isLabelRequired={false}
                />
                <aside className="grid grid-cols-3 gap-4 w-full max-w-md mt-4">
                  <ChartLegendPoint
                    title="Working"
                    count={statusBreakdown.working}
                    backgroundColor="rgb(74, 222, 128)"
                  />

                  <ChartLegendPoint
                    title="Repairable"
                    count={statusBreakdown.repairable}
                    backgroundColor="rgb(250, 204, 21)"
                  />
                  <ChartLegendPoint
                    title="Not-working"
                    count={statusBreakdown.notWorking}
                    backgroundColor="rgb(248, 113, 113)"
                  />
                </aside>
              </article>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
