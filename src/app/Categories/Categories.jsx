import { useState, useEffect, useContext } from "react";

import PageHeader from "../../components/PageHeader.jsx";
import PlusIcon from "../../components/icons/PlusIcon.jsx";
import Table from "../../components/Table.jsx";
import AddCategoryModal from "./AddCategoryModal.jsx";
import DeleteModal from "../../components/DeleteModal.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

export default function Categories() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isDeletePossible, setIsDeletePossible] = useState({
    id: "0",
    totalItems: 0,
    possible: true,
    message: "Are you sure you want to delete this category?",
  });
  const [doTableReRender, setDoTableReRender] = useState(0);

  const { accessToken, handleLogout } = useContext(AuthProvider);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleModalToggle(false);
        handleDeleteToggle(false);
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

  function handleDeleteToggle(isVisible) {
    setIsDeleteVisible(isVisible);

    if (!isVisible) {
      setIsDeletePossible({
        totalItems: 0,
        possible: true,
        message: "Are you sure you want to delete this category?",
      });
    }
  }

  function handleTableRender() {
    setDoTableReRender((prev) => prev + 1);
  }

  function handleDeleteData(deleteData) {
    setIsDeleteVisible(true);
    setIsDeletePossible((prev) => ({
      ...prev,
      totalItems: deleteData.totalItems,
      id: deleteData._id,
    }));
  }

  function handleConfirmDelete() {
    if (!(isDeletePossible.totalItems === 0)) {
      setIsDeletePossible((prev) => ({
        ...prev,
        possible: false,
        message: "The category must be empty before deletion.",
      }));
      return;
    }

    async function deleteCategoryData() {
      try {
        const fetchUrl = getEndpoint(
          "category",
          "deleteData",
          isDeletePossible.id
        );

        const response = await fetch(fetchUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          handleDeleteToggle(false);
          handleTableRender();
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    deleteCategoryData();
  }

  return (
    <>
      <PageHeader title="Categories">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          type="button"
          onClick={() => handleModalToggle(true)}
        >
          <PlusIcon cssClass="mr-2 h-4 w-4" />
          Add Category
        </button>
      </PageHeader>
      <Table
        key={doTableReRender}
        configKey="category"
        onDelete={handleDeleteData}
      />
      <AddCategoryModal
        key={`${isModalVisible}${123}`}
        isModalVisible={isModalVisible}
        onToggle={handleModalToggle}
        onSuccess={handleTableRender}
      />
      <DeleteModal
        title="Delete Category"
        isModalVisible={isDeleteVisible}
        onToggle={handleDeleteToggle}
        confirmDelete={handleConfirmDelete}
        message={isDeletePossible.message}
        canDelete={isDeletePossible.possible}
      />
    </>
  );
}
