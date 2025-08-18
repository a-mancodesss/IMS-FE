import { useState, useRef } from "react";
import ReactDOM from "react-dom";

import TableFilter from "../../components/TableFilter.jsx";

export default function AdvancedFilterModal({
  isModalVisible,
  onToggle,
  onFilter,
}) {
  const [dropdownInfo, setDropdownInfo] = useState({
    floor: "0",
    room: "0",
    category: "0",
    subCategory: "0",
    item: "0",
    status: "0",
  });
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  function handleStartDateChange(event) {
    const dateValue = event.target.value;

    if (dateValue && dateValue.length === 10) {
      setTimeout(() => {
        endDateRef.current?.focus();
      }, 300);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let submittedStartDate = startDateRef.current.value;
    let submittedEndDate = endDateRef.current.value;

    submittedStartDate = submittedStartDate === "" ? "0" : submittedStartDate;
    submittedEndDate = submittedEndDate === "" ? "0" : submittedEndDate;

    const payloadBody = `${dropdownInfo.category}/${dropdownInfo.subCategory}/${dropdownInfo.room}/${dropdownInfo.floor}/${dropdownInfo.status}/${dropdownInfo.item}/${submittedStartDate}/${submittedEndDate}`;

    onFilter(payloadBody);
    onToggle(false);
  }

  function handleDropdownChange(identifier, payload) {
    setDropdownInfo((prev) => ({
      ...prev,
      [identifier]: payload.id,
    }));
  }

  if (!isModalVisible) {
    return null;
  }

  return ReactDOM.createPortal(
    <section className="fixed top-0 left-0 flex items-center justify-center bg-black/40 w-full h-full z-[1000] transition-all duration-400 ease-in-out">
      <div className="fixed left-[50%] top-[50%] grid w-[40rem] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="text-2xl font-semibold leading-none tracking-tight text-center">
          Advanced Filter
        </div>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="item-filter-floor"
              >
                Floor:
              </label>
              <TableFilter
                dropdownInitialValue="All floors"
                dropdownConfigKey="floor"
                isInitialValueAnOption={true}
                onStateChange={handleDropdownChange}
                widthSize="100%"
                id="item-filter-floor"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="item-filter-room"
              >
                Room:
              </label>
              <TableFilter
                key={dropdownInfo.floor}
                dropdownInitialValue="All rooms"
                dropdownConfigKey="room"
                isInitialValueAnOption={true}
                onStateChange={handleDropdownChange}
                isDisabled={dropdownInfo.floor === "0"}
                widthSize="100%"
                id="item-filter-room"
                apiPayload={dropdownInfo.floor}
              />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="item-filter-category"
              >
                Category:
              </label>
              <TableFilter
                dropdownInitialValue="All categories"
                dropdownConfigKey="category"
                isInitialValueAnOption={true}
                onStateChange={handleDropdownChange}
                widthSize="100%"
                id="item-filter-category"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="item-filter-sub-category"
              >
                Sub Category:
              </label>
              <TableFilter
                key={dropdownInfo.category}
                dropdownInitialValue="All sub-categories"
                dropdownConfigKey="subCategory"
                isInitialValueAnOption={true}
                onStateChange={handleDropdownChange}
                isDisabled={dropdownInfo.category === "0"}
                widthSize="100%"
                id="item-filter-sub-category"
                apiPayload={dropdownInfo.category}
              />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="item-filter-source"
              >
                Item Source:
              </label>
              <TableFilter
                dropdownInitialValue="All sources"
                dropdownConfigKey="item"
                isInitialValueAnOption={true}
                onStateChange={handleDropdownChange}
                widthSize="100%"
                id="item-filter-source"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="item-filter-status"
              >
                Item Status:
              </label>
              <TableFilter
                dropdownInitialValue="All status"
                dropdownConfigKey="status"
                isInitialValueAnOption={true}
                onStateChange={handleDropdownChange}
                widthSize="100%"
                id="item-filter-status"
              />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="starting-date"
              >
                Starting Date:
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="starting-date"
                  type="date"
                  onChange={handleStartDateChange}
                  ref={startDateRef}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="end-date"
              >
                End Date:
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="end-date"
                  type="date"
                  ref={endDateRef}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
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
              Filter
            </button>
          </div>
        </form>
      </div>
    </section>,
    document.getElementById("modal-root")
  );
}
