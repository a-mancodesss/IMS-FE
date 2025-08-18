import PackageIcon from "../../components/icons/PackageIcon.jsx";
import CircleCheckIcon from "../../components/icons/CircleCheckIcon.jsx";
import PenNibIcon from "../../components/icons/PenNibIcon.jsx";
import AlertIcon from "../../components/icons/AlertIcon.jsx";

import OverviewCard from "./OverviewCard.jsx";

import { INVENTORY_STATS_RESPONSE_MAPPING } from "../../constants/tableConfig.js";

export default function OverviewRow({ inventoryStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Total Items"
        path="/inventory"
        overviewNum={
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.totalItems
          ]
        }
        overviewInfo={`${
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.totalItems
          ] -
            inventoryStats[
              INVENTORY_STATS_RESPONSE_MAPPING.responseMapping
                .totalItemsTillLastMonth
            ] >=
          0
            ? "+"
            : ""
        }${
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.totalItems
          ] -
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping
              .totalItemsTillLastMonth
          ]
        } from last month`}
      >
        <PackageIcon cssClass="h-4 w-4 text-primary" />
      </OverviewCard>

      <OverviewCard
        title="Working Items"
        path="/inventory"
        dataPackage="0/0/1234/0/0/0"
        overviewNum={
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.workingItems
          ]
        }
        overviewInfo={`${(
          (inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.workingItems
          ] *
            100) /
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.totalItems
          ]
        ).toFixed(2)}% of total inventory`}
      >
        <CircleCheckIcon />
      </OverviewCard>

      <OverviewCard
        title="Repairable Items"
        path="/inventory"
        dataPackage="0/0/3456/0/0/0"
        overviewNum={
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.repairableItems
          ]
        }
        overviewInfo={`${(
          (inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.repairableItems
          ] *
            100) /
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.totalItems
          ]
        ).toFixed(2)}% of total inventory`}
      >
        <PenNibIcon />
      </OverviewCard>

      <OverviewCard
        title="Not-working Items"
        path="/inventory"
        dataPackage="0/0/5678/0/0/0"
        overviewNum={
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.notWorkingItems
          ]
        }
        overviewInfo={`${(
          (inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.notWorkingItems
          ] *
            100) /
          inventoryStats[
            INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.totalItems
          ]
        ).toFixed(2)}% of total inventory`}
      >
        <AlertIcon />
      </OverviewCard>
    </div>
  );
}
