import { Link, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon.jsx";
import PlusIcon from "../../components/icons/PlusIcon.jsx";
import DeleteIcon from "../../components/icons/DeleteIcon.jsx";

import LoadingIndicator from "../../components/LoadingIndicator.jsx";
import AddSubCategoryModal from "./AddSubCategoryModal.jsx";
import DeleteModal from "../../components/DeleteModal.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

export default function SubCategories() {
  const { accessToken, handleLogout } = useContext(AuthProvider);

  const { state } = useLocation();
  const { categoryId } = useParams();

  const category = state?.rowData;

  if (!category) {
  }

  const [subCategoryData, setSubCategoryData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isDeletePossible, setIsDeletePossible] = useState({
    id: "0",
    totalItems: 0,
    possible: true,
    message: "Are you sure you want to delete this sub-category?",
  });
  const [doTableReRender, setDoTableReRender] = useState(0);

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

  useEffect(() => {
    async function fetchSubCategoryData() {
      try {
        const fetchUrl = getEndpoint("subCategory", "getAllData", categoryId);

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          setSubCategoryData(responseBody.data.subCategories);
          setIsLoading(false);
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchSubCategoryData();
  }, [doTableReRender]);

  function handleModalToggle(isVisible) {
    setIsModalVisible(isVisible);
  }

  function handleDeleteToggle(isVisible) {
    setIsDeleteVisible(isVisible);

    if (!isVisible) {
      setIsDeletePossible({
        totalItems: 0,
        possible: true,
        message: "Are you sure you want to delete this sub-category?",
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
        message: "The sub-category must be empty before deletion.",
      }));
      return;
    }

    async function deleteSubCategoryData() {
      try {
        const payload = `${categoryId}/${isDeletePossible.id}`;

        const fetchUrl = getEndpoint("subCategory", "deleteData", payload);

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

    deleteSubCategoryData();
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
            to="/categories"
          >
            <ArrowLeftIcon />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            {category.categoryName}
          </h2>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          type="button"
          onClick={() => handleModalToggle(true)}
        >
          <PlusIcon cssClass="mr-2 h-4 w-4" />
          Add Sub-category
        </button>
      </header>
      <section>
        <div className="relative w-full rounded-lg border bg-card text-card-foreground shadow-sm mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary/5 border-b transition-colors flex justify-between items-center gap-4 px-4 rounded-t-md">
                <th className="h-12 font-bold text-sidebar/95 flex justify-center items-center w-16">
                  S.N
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-start w-60 items-center">
                  Name
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-center w-[11.5rem] items-center">
                  Sub-Category Symbol
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex items-center justify-center w-24">
                  Total Items
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-center w-24 items-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td
                    className="p-4 h-24 text-center text-muted-foreground flex flex-col justify-center items-center gap-2 my-2"
                    colSpan="10"
                  >
                    Loading data...
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : subCategoryData.length !== 0 ? (
                subCategoryData.map((subCategory, index) => {
                  return (
                    <tr
                      className="border-b transition-colors text-slate-600 flex justify-between items-center gap-4 p-4 h-[4.5rem]"
                      key={index}
                    >
                      <td className="text-center w-16">{index + 1}.</td>
                      <td className="text-left w-60">
                        {subCategory.subCategoryName}
                      </td>
                      <td className="text-center w-[11.5rem]">
                        {subCategory.subCategoryAbbreviation}
                      </td>
                      <td className="text-center w-24">
                        {subCategory.totalItems}
                      </td>
                      <td>
                        <div className="flex justify-center items-center gap-2 w-24">
                          <button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 h-9 w-9 border border-[#fe2b42] text-[#fe2b42] hover:bg-[#fde6e8]"
                            type="button"
                            onClick={() => handleDeleteData(subCategory)}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 h-24 text-center" colSpan="10">
                    No sub-category in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <AddSubCategoryModal
        key={`${isModalVisible}${123}`}
        isModalVisible={isModalVisible}
        categoryId={categoryId}
        onToggle={handleModalToggle}
        onSuccess={handleTableRender}
      />
      <DeleteModal
        title="Delete Sub Category"
        isModalVisible={isDeleteVisible}
        onToggle={handleDeleteToggle}
        confirmDelete={handleConfirmDelete}
        message={isDeletePossible.message}
        canDelete={isDeletePossible.possible}
      />
    </>
  );
}
