import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import DownloadIcon from "../../components/DownloadIcon.jsx";
import PlusIcon from "../../components/icons/PlusIcon.jsx";

import PageHeader from "../../components/PageHeader.jsx";
import Table from "../../components/Table.jsx";
import AdvancedFilterModal from "./AdvancedFilterModal.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";

import getEndpoint from "../../constants/apiEndpoints.js";

export default function Inventory() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [payload, setPayload] = useState("");

  const { state } = useLocation();

  const { accessToken, handleLogout } = useContext(AuthProvider);

  useEffect(() => {
    if (state) {
      setPayload(state);
    }
  }, [state]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleModalToggle(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleModalToggle(isVisible) {
    setIsModalVisible(isVisible);
  }

  function handleFilter(payloadBody) {
    setPayload(payloadBody);
  }

  async function handleDownloadData() {
    try {
      let additionalData = "0/0/0/0/0/0/0/0";
      if (payload == "") {
        additionalData = "0/0/0/0/0/0/0/0";
      } else {
        additionalData = payload;
      }

      const fetchUrl = getEndpoint("item", "downloadData", additionalData);

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status == 401) {
        handleLogout();
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const today = new Date().toISOString().slice(0, 10);
      const filename = `inventory_report_${today}.csv`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <PageHeader title="Inventory">
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            onClick={handleDownloadData}
          >
            <DownloadIcon />
            Export
          </button>
          <Link
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            to="/inventory/add-item"
          >
            <PlusIcon cssClass="mr-2 h-4 w-4" />
            Add Item
          </Link>
        </div>
      </PageHeader>
      <Table
        key={payload}
        configKey="item"
        onModalToggle={handleModalToggle}
        apiPayload={payload}
      />
      <AdvancedFilterModal
        isModalVisible={isModalVisible}
        onToggle={handleModalToggle}
        onFilter={handleFilter}
      />
    </>
  );
}
