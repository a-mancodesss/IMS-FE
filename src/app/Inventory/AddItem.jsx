import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PlusIcon from "../../components/icons/PlusIcon.jsx";
import TableFilter from "../../components/TableFilter.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import { currencyFormatter } from "../../utils/formatter.js";
import getEndpoint from "../../constants/apiEndpoints.js";

export default function AddItem() {
  const navigate = useNavigate();
  const { accessToken, handleLogout } = useContext(AuthProvider);
  const todayDate = new Date().toISOString().split("T")[0];

  const [dropdownInfo, setDropdownInfo] = useState({
    category: "0",
    subCategory: "0",
    floor: "0",
    room: "0",
    item: "0",
  });

  const [costValues, setCostValues] = useState({
    unitCost: 0,
    count: 1,
    totalCost: 0,
  });

  const [isEmpty, setIsEmpty] = useState({
    itemName: false,
    itemDateAcquired: false,
    category: false,
    subCategory: false,
    floor: false,
    room: false,
    item: false,
    unitCost: false,
    count: false,
  });

  const itemNameRef = useRef(null);
  const itemDescriptionRef = useRef(null);
  const itemMakeModelNoRef = useRef(null);
  const itemDateAcquiredRef = useRef(null);

  useEffect(() => {
    setDropdownInfo((prev) => ({
      ...prev,
      room: "0",
    }));
  }, [dropdownInfo.floor]);

  useEffect(() => {
    setDropdownInfo((prev) => ({
      ...prev,
      subCategory: "0",
    }));
  }, [dropdownInfo.category]);

  async function handleSubmit(event) {
    event.preventDefault();

    const submittedItemName = itemNameRef.current.value;
    const submittedItemDescription = itemDescriptionRef.current.value;
    const submittedItemMakeModelNo = itemMakeModelNoRef.current.value;
    const submittedItemDateAcquired = itemDateAcquiredRef.current.value;

    const submittedItemSourceId =
      dropdownInfo.item === "0" ? "1357" : dropdownInfo.item;

    const isEmptyCheck = {
      itemName: submittedItemName.length === 0,
      itemDateAcquired: submittedItemDateAcquired.length === 0,
      category: dropdownInfo.category === "0",
      subCategory: dropdownInfo.subCategory === "0",
      floor: dropdownInfo.floor === "0",
      room: dropdownInfo.room === "0",
      item: false,
      unitCost: +costValues.unitCost <= 0,
      count: +costValues.count <= 0,
    };
    setIsEmpty(isEmptyCheck);

    if (
      isEmptyCheck.itemName ||
      isEmptyCheck.itemDateAcquired ||
      isEmptyCheck.category ||
      isEmptyCheck.subCategory ||
      isEmptyCheck.floor ||
      isEmptyCheck.room ||
      isEmptyCheck.unitCost ||
      isEmptyCheck.count
    ) {
      return;
    }

    try {
      const payloadBody = {
        item_name: submittedItemName,
        item_description: submittedItemDescription,
        item_make_or_model_no: submittedItemMakeModelNo,
        item_category_id: dropdownInfo.category,
        item_subCategory_id: dropdownInfo.subCategory,
        item_floor_id: dropdownInfo.floor,
        item_room_id: dropdownInfo.room,
        item_acquired_date: submittedItemDateAcquired,
        item_source: submittedItemSourceId,
        item_cost: +costValues.unitCost,
        item_create_count: +costValues.count,
        item_status: "1234",
      };

      const fetchUrl = getEndpoint("item", "addData");

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadBody),
      });

      if (response.ok) {
      } else {
        const errorDetails = await response.json();
        console.log("Conflict error details:", errorDetails);
      }

      if (response.status == 401) {
        handleLogout();
      }

      navigate("/inventory");
    } catch (error) {
      console.log(error);
    }
  }

  function calculateTotalCost(identifier, value) {
    const updatedData = {
      ...costValues,
      [identifier]: value,
    };

    const sum = +updatedData.count * +updatedData.unitCost;

    setCostValues((prevValues) => ({
      ...prevValues,
      [identifier]: value,
      totalCost: sum,
    }));

    setIsEmpty((prevState) => ({
      ...prevState,
      [identifier]: false,
    }));
  }

  function handleDropdownChange(identifier, payload) {
    setDropdownInfo((prev) => ({
      ...prev,
      [identifier]: payload.id,
    }));

    setIsEmpty((prevState) => ({
      ...prevState,
      [identifier]: false,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <header className="flex flex-col space-y-1.5 p-6 bg-primary/5 rounded-t-lg">
            <div className="text-2xl font-semibold leading-none tracking-tight">
              Add New Item
            </div>
            <div className="text-sm text-muted-foreground">
              Enter the basic information about this item
            </div>
          </header>

          <aside className="p-6 pb-3">
            <div className="grid">
              <section className="grid grid-cols-2 grid-rows-2 gap-x-4">
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="item-name"
                  >
                    Item Name: <span className="text-[#ff6365]">*</span>
                  </label>
                  <div className="h-2"></div>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="e.g. Dell XPS 15 Laptop"
                    id="item-name"
                    ref={itemNameRef}
                    onChange={() =>
                      setIsEmpty((prevState) => ({
                        ...prevState,
                        itemName: false,
                      }))
                    }
                  />
                  <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
                    {isEmpty.itemName ? "Please enter item name" : ""}
                  </div>
                </div>
                <div className="row-span-2">
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="item-description"
                    >
                      Description:
                    </label>
                    <div className="h-2"></div>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-[8.55rem] min-h-[8.55rem] max-h-[8.55rem] resize-none"
                      placeholder="Enter a detailed description of the item"
                      id="item-description"
                      ref={itemDescriptionRef}
                    ></textarea>
                    <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="item-make-or-model-no"
                    >
                      Make/Model No:
                    </label>
                    <div className="h-2"></div>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="e.g. RDC7000"
                      id="item-make-or-model-no"
                      ref={itemMakeModelNoRef}
                    />
                    <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2"></div>
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="item-acquired-date"
                    >
                      Date Acquired: <span className="text-[#ff6365]">*</span>
                    </label>
                    <div className="h-2"></div>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="item-acquired-date"
                      type="date"
                      defaultValue={todayDate}
                      ref={itemDateAcquiredRef}
                      onChange={() =>
                        setIsEmpty((prevState) => ({
                          ...prevState,
                          itemDateAcquired: false,
                        }))
                      }
                    />
                    <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
                      {isEmpty.itemDateAcquired
                        ? "Please enter acquired date"
                        : ""}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-4 gap-x-8">
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="item-category"
                  >
                    Category: <span className="text-[#ff6365]">*</span>
                  </label>
                  <div className="h-2"></div>
                  <TableFilter
                    dropdownInitialValue="Select category"
                    dropdownConfigKey="category"
                    onStateChange={handleDropdownChange}
                    widthSize="100%"
                    customPlaceholderStyle="text-muted-foreground"
                    id="item-category"
                  />
                  <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
                    {isEmpty.category ? "Please select a category" : ""}
                  </div>
                </div>
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="item-sub-category"
                  >
                    Sub Category: <span className="text-[#ff6365]">*</span>
                  </label>
                  <div className="h-2"></div>
                  <TableFilter
                    key={dropdownInfo.category}
                    dropdownInitialValue="Select sub-category"
                    dropdownConfigKey={
                      dropdownInfo.category !== "0" ? "subCategory" : ""
                    }
                    widthSize="100%"
                    onStateChange={handleDropdownChange}
                    isDisabled={dropdownInfo.category === "0"}
                    customPlaceholderStyle="text-muted-foreground"
                    id="item-sub-category"
                    apiPayload={dropdownInfo.category}
                  />
                  <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
                    {isEmpty.subCategory ? "Please select a sub-category" : ""}
                  </div>
                </div>

                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="item-floor"
                  >
                    Floor: <span className="text-[#ff6365]">*</span>
                  </label>
                  <div className="h-2"></div>
                  <TableFilter
                    dropdownInitialValue="Select floor"
                    dropdownConfigKey="floor"
                    onStateChange={handleDropdownChange}
                    widthSize="100%"
                    customPlaceholderStyle="text-muted-foreground"
                    id="item-floor"
                  />
                  <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
                    {isEmpty.floor ? "Please select a floor" : ""}
                  </div>
                </div>
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="item-room"
                  >
                    Room: <span className="text-[#ff6365]">*</span>
                  </label>
                  <div className="h-2"></div>
                  <TableFilter
                    key={dropdownInfo.floor}
                    dropdownInitialValue="Select room"
                    dropdownConfigKey="room"
                    widthSize="100%"
                    onStateChange={handleDropdownChange}
                    isDisabled={dropdownInfo.floor === "0"}
                    customPlaceholderStyle="text-muted-foreground"
                    id="item-room"
                    apiPayload={dropdownInfo.floor}
                  />
                  <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
                    {isEmpty.room ? "Please select a room" : ""}
                  </div>
                </div>
              </section>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="item-source"
                  >
                    Source: <span className="text-[#ff6365]">*</span>
                  </label>
                  <div className="h-2"></div>
                  <TableFilter
                    dropdownInitialValue="Purchase"
                    dropdownConfigKey="item"
                    onStateChange={handleDropdownChange}
                    widthSize="100%"
                    id="item-source"
                  />
                  <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2"></div>
                </div>
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="item-unit-cost"
                  >
                    Unit Cost (Rs.): <span className="text-[#ff6365]">*</span>
                  </label>
                  <div className="h-2"></div>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm no-spinner"
                    placeholder="e.g. 1200"
                    id="item-unit-cost"
                    type="number"
                    onChange={(event) =>
                      calculateTotalCost("unitCost", event.target.value)
                    }
                  />
                  <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
                    {isEmpty.unitCost ? "Please enter a valid cost" : ""}
                  </div>
                </div>
                <div>
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="item-count"
                  >
                    Count: <span className="text-[#ff6365]">*</span>
                  </label>
                  <div className="h-2"></div>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm no-spinner"
                    defaultValue={costValues.count}
                    id="item-count"
                    onChange={(event) =>
                      calculateTotalCost("count", event.target.value)
                    }
                  />
                  <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
                    {isEmpty.count ? "Please enter a valid count" : ""}
                  </div>
                </div>
              </section>
            </div>
          </aside>

          <footer className="items-center p-6 grid grid-cols-6 gap-2 pt-2 border-t bg-primary/5">
            <div className="grid gap-6 col-span-4">
              <div className="rounded-md border p-4 mt-2 bg-muted/20">
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium">Total Cost:</span>
                  <span className="text-sm font-bold">
                    Rs. {currencyFormatter(costValues.totalCost)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex col-span-1 col-start-6 gap-4 h-full">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 mt-2 h-16 text-base [&_svg]:size-5"
                type="submit"
              >
                <PlusIcon />
                <span>Add Item</span>
              </button>
            </div>
          </footer>
        </section>
      </div>
    </form>
  );
}
