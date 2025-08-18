import { useRef, useState, useEffect, useContext } from "react";

import SearchIcon from "./icons/SearchIcon.jsx";
import FilterIcon from "./icons/FilterIcon.jsx";

import TableFilter from "./TableFilter.jsx";
import TableRow from "./TableRow.jsx";
import NoTableData from "./NoTableData.jsx";
import Pagination from "./Pagination.jsx";

import { AuthProvider } from "../store/AuthProvider.jsx";
import { TABLE_CONFIG } from "../constants/tableConfig.js";
import getEndpoint from "../constants/apiEndpoints.js";
import LoadingIndicator from "./LoadingIndicator.jsx";

const NO_OF_DATA_PER_PAGE = 6;

export default function Table({
  configKey,
  onModalToggle = () => {},
  onDelete = () => {},
  apiPayload = "",
}) {
  const { accessToken, handleLogout } = useContext(AuthProvider);
  const tableConfig = TABLE_CONFIG[configKey];

  const [payloadData, setPayloadData] = useState(apiPayload);
  const [tableData, setTableData] = useState({
    count: 0,
    rows: [],
  });
  const [pagination, setPagination] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownSelect, setDropdownSelect] = useState({
    id: "0",
    value: tableConfig.filterOptions.dropdown.value,
  });

  const [resetKey, setResetKey] = useState(0);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    setPayloadData(apiPayload);
  }, [apiPayload]);

  useEffect(() => {
    async function fetchTableData() {
      try {
        let fetchAction = "getAllData";
        let fetchPayload = payloadData;

        if (fetchPayload !== "") {
          fetchAction = "getFilteredData";
        }
        if (dropdownSelect.id !== "0") {
          fetchAction = "getFilteredData";
          fetchPayload = dropdownSelect.id;
        }
        if (searchTerm !== "") {
          fetchAction = "getSearchedData";
          fetchPayload = searchTerm;
        }

        const fetchUrl = getEndpoint(
          configKey,
          fetchAction,
          fetchPayload,
          pagination
        );

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          setTableData({
            count: responseBody.data[tableConfig.responseMapping.countKey],
            rows: responseBody.data[tableConfig.responseMapping.dataKey],
          });
          setIsLoading(false);
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchTableData();
  }, [configKey, pagination, searchTerm, dropdownSelect, payloadData]);

  useEffect(() => {
    setResetKey((prevKey) => prevKey + 1);
    const searchTimer = setTimeout(() => {
      setPagination(1);
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
    setPagination(1);
  }, [dropdownSelect]);

  // useEffect(() => {
  //   resetFilters();
  // }, [configKey]);

  function resetFilters() {
    if (startDateRef && startDateRef.current) {
      startDateRef.current.value = "";
    }
    if (endDateRef && endDateRef.current) {
      endDateRef.current.value = "";
    }

    setDropdownSelect({
      id: "0",
      value: tableConfig.filterOptions.dropdown.value,
    });
    setSearchTerm("");
    setPagination(1);
    setResetKey((prevKey) => prevKey + 1);
    setPayloadData("");
    setIsSearchDisabled(true);
  }

  function handlePageChange(page) {
    setPagination(page);
  }

  function handleDropdownSelect(identifier, dataObject) {
    setDropdownSelect(dataObject);
  }

  function handleDateFilter() {
    const submittedStartDate = startDateRef.current.value;
    const submittedEndDate = endDateRef.current.value;

    const startDate = new Date(submittedStartDate);
    const endDate = new Date(submittedEndDate);

    if (startDate > endDate) {
      startDateRef.current.value = "";
      endDateRef.current.value = "";
      setIsSearchDisabled(true);
      return;
    }

    setPayloadData(`${startDate}/${endDate}`);
  }

  function handleDateChange() {
    if (
      startDateRef.current.value.length === 10 &&
      endDateRef.current.value.length === 10
    ) {
      setIsSearchDisabled(false);
    } else {
      setIsSearchDisabled(true);
    }
  }

  function renderTableHeader() {
    return (
      <header className="flex flex-col space-y-1.5 p-6 pb-3 bg-primary/5 rounded-t-lg">
        <div className="text-2xl font-semibold leading-none tracking-tight">
          {tableConfig.header.title}
        </div>
        <div className="text-sm text-muted-foreground">
          {tableConfig.header.subtitle}
        </div>
      </header>
    );
  }

  function renderTableFilter() {
    const dropdownFilter = (
      <TableFilter
        key={resetKey}
        dropdownConfigKey={tableConfig.filterOptions.dropdown.endPointKey}
        dropdownInitialValue={tableConfig.filterOptions.dropdown.value}
        onStateChange={handleDropdownSelect}
        isInitialValueAnOption={true}
        widthSize="180px"
      />
    );

    const advancedFilterBtn = (
      <button
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        onClick={() => onModalToggle(true)}
      >
        <FilterIcon />
        Advanced Filter
      </button>
    );

    const searchBar = (
      <div className="relative w-full md:w-auto md:flex-1">
        <SearchIcon customStyle={{ top: "0.75rem" }} />
        <input
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full pl-8"
          placeholder={tableConfig.filterOptions.searchBar.value}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
    );

    return (
      tableConfig.filterOptions.visible && (
        <div
          className={`flex flex-col md:flex-row items-center gap-4 py-4 pb-0 justify-end ${
            configKey !== "activity" ? "pl-[38.5rem]" : "justify-end"
          }`}
        >
          {configKey === "activity" && (
            <section className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="starting-date"
                >
                  Starting Date:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    id="starting-date"
                    type="date"
                    onChange={handleDateChange}
                    ref={startDateRef}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="end-date"
                >
                  End Date:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    id="end-date"
                    type="date"
                    onChange={handleDateChange}
                    ref={endDateRef}
                  />
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-80 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                onClick={handleDateFilter}
                disabled={isSearchDisabled}
              >
                Search
              </button>
            </section>
          )}
          {tableConfig.filterOptions.dropdown.show && dropdownFilter}
          {tableConfig.filterOptions.advancedFilter.show && advancedFilterBtn}
          {tableConfig.filterOptions.searchBar.show && searchBar}
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      )
    );
  }

  function renderTableCaption() {
    return (
      <thead>
        <tr className="bg-primary/5 border-b transition-colors rounded-t-md flex justify-between items-center gap-4 px-4">
          <th className="h-12 font-bold text-sidebar/95 w-16 flex justify-center items-center">
            S.N
          </th>
          {tableConfig.columnHeaders.map((eachColumn) => (
            <th
              key={eachColumn.label}
              className={`h-12 font-bold text-sidebar/95 flex items-center ${eachColumn.additionalStyles}`}
            >
              {eachColumn.label}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  function renderTableData() {
    return (
      <tbody className="[&_tr:last-child]:border-0 ">
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
        ) : tableData.count > 0 ? (
          tableData.rows.map((eachData, index) => (
            <TableRow
              key={eachData[tableConfig.responseMapping.idKey]}
              configKey={configKey}
              serialNo={(pagination - 1) * NO_OF_DATA_PER_PAGE + index + 1}
              rowData={eachData}
              onDelete={onDelete}
            />
          ))
        ) : (
          <NoTableData tableType={tableConfig.noData} />
        )}
      </tbody>
    );
  }

  function renderPagination() {
    return (
      tableData.count > 0 && (
        <Pagination
          totalCount={tableData.count}
          noOfDataPerPage={NO_OF_DATA_PER_PAGE}
          currentPage={pagination}
          handlePageChange={handlePageChange}
        />
      )
    );
  }

  return (
    <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
      {renderTableHeader()}
      <section className="p-6 pt-0">
        {renderTableFilter()}

        <div className="relative w-full rounded-t-md pt-4">
          <table className="w-full text-sm">
            {renderTableCaption()}
            {renderTableData()}
          </table>
        </div>
        {renderPagination()}
      </section>
    </section>
  );
}
