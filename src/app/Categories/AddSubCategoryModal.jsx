import { useRef, useState, useContext } from "react";
import ReactDOM from "react-dom";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

export default function AddSubCategoryModal({
  isModalVisible,
  categoryId,
  onToggle,
  onSuccess,
}) {
  const { accessToken, handleLogout } = useContext(AuthProvider);

  const subCategoryNameRef = useRef(null);
  const subCategorySymbolRef = useRef(null);

  const [isEmpty, setIsEmpty] = useState({
    subCategoryName: false,
    subCategorySymbol: false,
  });

  function handleSubmit(event) {
    event.preventDefault();

    const enteredSubCategoryName = subCategoryNameRef.current.value;
    const enteredSubCategorySymbol = subCategorySymbolRef.current.value;

    const isEmptyCheck = {
      subCategoryName: enteredSubCategoryName.length === 0,
      subCategorySymbol: enteredSubCategorySymbol.length === 0,
    };
    setIsEmpty(isEmptyCheck);

    if (enteredSubCategorySymbol.length !== 3) {
      return;
    }

    async function postSubCategoryData() {
      try {
        const fetchUrl = getEndpoint("subCategory", "addData", categoryId);

        const response = await fetch(fetchUrl, {
          method: "POST",

          body: JSON.stringify({
            subCategory_name: enteredSubCategoryName,
            subCategory_abbr: enteredSubCategorySymbol,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          onToggle(false);
          onSuccess();
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (!isEmptyCheck.subCategoryName && !isEmptyCheck.subCategorySymbol) {
      postSubCategoryData();
    }
  }

  function handleSymbolLimit(event) {
    const symbolData = event.target.value;
    let finalSymbol =
      symbolData.length > 3 ? symbolData.slice(0, 3) : symbolData;

    event.target.value = finalSymbol.toUpperCase();

    setIsEmpty((prevState) => ({
      ...prevState,
      subCategorySymbol: false,
    }));
  }

  if (!isModalVisible) {
    return null;
  }

  return ReactDOM.createPortal(
    <section className="fixed top-0 left-0 flex items-center justify-center bg-black/80 w-full h-full z-[1000] transition-all duration-400 ease-in-out">
      <div className="fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg sm:max-w-[525px]">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left bg-primary/5 p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            Add New Sub Category
          </h2>
          <p className="text-sm text-muted-foreground">
            Create a new sub-category
          </p>
        </div>
        <form className="grid" onSubmit={handleSubmit}>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="sub-category-name"
            >
              Sub Category Name: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={subCategoryNameRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="e.g. Table"
                id="sub-category-name"
                onChange={() =>
                  setIsEmpty((prevState) => ({
                    ...prevState,
                    subCategoryName: false,
                  }))
                }
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.subCategoryName ? "Please enter sub-category name" : ""}
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="sub-category-symbol"
            >
              Sub Category Symbol: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={subCategorySymbolRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="e.g. TBL"
                id="sub-category-symbol"
                onChange={handleSymbolLimit}
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.subCategorySymbol
                ? "Please enter sub-category symbol"
                : ""}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-[5.25rem] h-10 px-4 py-2"
              type="button"
              onClick={() => onToggle(false)}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 w-[5.25rem] h-10 px-4 py-2"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </section>,
    document.getElementById("modal-root")
  );
}
