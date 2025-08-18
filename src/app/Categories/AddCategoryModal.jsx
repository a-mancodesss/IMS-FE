import { useRef, useState, useContext } from "react";
import ReactDOM from "react-dom";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

export default function AddCategoryModal({
  isModalVisible,
  onToggle,
  onSuccess,
}) {
  const { accessToken, handleLogout } = useContext(AuthProvider);
  const categoryNameRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const enteredCategoryName = categoryNameRef.current.value;

    const isEmptyCheck = enteredCategoryName.length === 0;
    setIsEmpty(isEmptyCheck);

    async function postCategoryData() {
      try {
        const fetchUrl = getEndpoint("category", "addData");

        const response = await fetch(fetchUrl, {
          method: "POST",

          body: JSON.stringify({
            category_name: enteredCategoryName,
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

    if (!isEmptyCheck) {
      postCategoryData();
    }
  }

  if (!isModalVisible) {
    return null;
  }

  return ReactDOM.createPortal(
    <section className="fixed top-0 left-0 flex items-center justify-center bg-black/80 w-full h-full z-[1000] transition-all duration-400 ease-in-out">
      <div className="fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg sm:max-w-[525px]">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left bg-primary/5 p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            Add New Category
          </h2>
          <p className="text-sm text-muted-foreground">Create a new category</p>
        </div>
        <form className="grid" onSubmit={handleSubmit}>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="category-name"
            >
              Category Name: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={categoryNameRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="e.g. Furniture"
                id="category-name"
                onChange={() => setIsEmpty(false)}
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty ? "Please enter category name" : ""}
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
