import { useState, useEffect } from "react";

import PlusIcon from "../../components/icons/PlusIcon.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import Table from "../../components/Table.jsx";
import AddUserModal from "./AddUserModal.jsx";

export default function Users() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [doTableReRender, setDoTableReRender] = useState(0);

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

  function handleTableRender() {
    setDoTableReRender((prev) => prev + 1);
  }

  return (
    <>
      <PageHeader title="Users">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          type="button"
          onClick={() => handleModalToggle(true)}
        >
          <PlusIcon cssClass="mr-2 h-4 w-4" />
          Add User
        </button>
      </PageHeader>
      <Table key={doTableReRender} configKey="user" />
      <AddUserModal
        key={`${isModalVisible}${123}`}
        isModalVisible={isModalVisible}
        onToggle={handleModalToggle}
        onSuccess={handleTableRender}
      />
    </>
  );
}
