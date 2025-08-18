import { useEffect, useState, useContext } from "react";

import TableFilter from "../../components/TableFilter.jsx";
import ConditionPieChart from "../../components/ConditionPieChart.jsx";
import ChartLegendPoint from "../../components/ChartLegendPoint.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import { PIE_CHART_RESPONSE_MAPPING } from "../../constants/tableConfig.js";
import LoadingIndicator from "../../components/LoadingIndicator.jsx";
import { API_BASE_URL } from "../../utils/envVars.js";

export default function AcquisitionTab({ hidden }) {
  const [sourceBreakdown, setSourceBreakdown] = useState({
    purchase: 0,
    donation: 0,
  });

  const [categoryId, setCategoryId] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, handleLogout } = useContext(AuthProvider);

  useEffect(() => {
    async function fetchItemSourceData() {
      try {
        const fetchUrl = `${API_BASE_URL}/v1/categories/${categoryId}/item-acquisition-stats`;

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();

          setSourceBreakdown({
            purchase:
              responseBody.data[
                PIE_CHART_RESPONSE_MAPPING.source.purchaseItems
              ] || 0,
            donation:
              responseBody.data[
                PIE_CHART_RESPONSE_MAPPING.source.donationItems
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

    fetchItemSourceData();
  }, [categoryId]);

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
              Acquisition Source
            </div>
            <div className="text-sm text-muted-foreground">
              Distribution of items by purchase or donation
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
          <aside className="space-y-8">
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
                        name: "Purchase",
                        value: sourceBreakdown.purchase,
                        color: "#3b82f6",
                      },
                      {
                        name: "Donation",
                        value: sourceBreakdown.donation,
                        color: "#8b5cf6",
                      },
                    ]}
                    isLabelRequired={false}
                  />
                  <aside className="grid grid-cols-2 gap-8 w-full max-w-md mt-4">
                    <ChartLegendPoint
                      title="Purchase"
                      count={sourceBreakdown.purchase}
                      backgroundColor="rgb(59, 130, 246)"
                    />

                    <ChartLegendPoint
                      title="Donation"
                      count={sourceBreakdown.donation}
                      backgroundColor="rgb(139, 92, 246)"
                    />
                  </aside>
                </article>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
