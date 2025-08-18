import { useState, useEffect, useContext } from "react";

import PageHeader from "../../components/PageHeader.jsx";
import OverviewRow from "./OverviewRow.jsx";
import InventoryOverview from "./InventoryOverview.jsx";
import RecentActivity from "./RecentActivity.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

export default function DashBoard() {
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

  return (
    <>
      <PageHeader title="Dashboard" />
      <section className="space-y-4">
        <section className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
          <OverviewRow inventoryStats={inventoryStats} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <InventoryOverview inventoryStats={inventoryStats} />
            <RecentActivity />
          </div>
        </section>
      </section>
    </>
  );
}
