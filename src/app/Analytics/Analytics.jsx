import { useState, useEffect, useContext } from "react";

import PageHeader from "../../components/PageHeader.jsx";
import AnalyticsCardRow from "./AnalyticsCardRow.jsx";
import AnalyticsMenuBar from "./AnalyticsMenuBar.jsx";
import ItemConditionTab from "./ItemConditionTab.jsx";
import AcquisitionTab from "./AcquisitionTab.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

export default function Analytics() {
  const [activeTabTitle, setActiveTabTitle] = useState("Condition Breakdown");
  const [inventoryStats, setInventoryStats] = useState({});
  const { accessToken, handleLogout } = useContext(AuthProvider);

  useEffect(() => {
    async function fetchInventoryStatusData() {
      try {
        const fetchUrl = getEndpoint("dashboard", "getInventoryStats");

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          setInventoryStats(responseBody.data);
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchInventoryStatusData();
  }, []);

  function handleTabChange(title) {
    setActiveTabTitle(title);
  }

  return (
    <>
      <PageHeader title="Analytics"></PageHeader>
      <AnalyticsCardRow inventoryStats={inventoryStats} />

      <section className="space-y-4">
        <AnalyticsMenuBar
          activeTabTitle={activeTabTitle}
          handleTabChange={handleTabChange}
        />
        <ItemConditionTab
          key={`${activeTabTitle}${Math.random()}`}
          hidden={activeTabTitle !== "Condition Breakdown"}
          inventoryStats={inventoryStats}
        />
        <AcquisitionTab
          key={`${activeTabTitle}${Math.random()}`}
          hidden={activeTabTitle !== "Acquisition Source"}
        />
      </section>
    </>
  );
}
