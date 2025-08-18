import PackageIcon from "../../components/icons/PackageIcon.jsx";
import TextFileIcon from "../../components/icons/TextFileIcon.jsx";
import CircleCheckIcon from "../../components/icons/CircleCheckIcon.jsx";
import AlertIcon from "../../components/icons/AlertIcon.jsx";

import OverviewCard from "../Dashboard/OverviewCard.jsx";

import { INVENTORY_STATS_RESPONSE_MAPPING } from "../../constants/tableConfig.js";
import { currencyFormatter } from "../../utils/formatter.js";

export default function AnalyticsCardRow({ inventoryStats }) {
  const totalValue = inventoryStats[
    INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.totalInventoryValue
  ]
    ? currencyFormatter(
        inventoryStats[
          INVENTORY_STATS_RESPONSE_MAPPING.responseMapping.totalInventoryValue
        ]
      )
    : 0;

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
        title="Total Value"
        overviewNum={`Rs. ${totalValue}`}
        overviewInfo={""}
      >
        <TextFileIcon />
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
        title="Needs Attention"
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
