import { useState, useEffect, useContext } from "react";

import ChevronDownIcon from "./icons/ChevronDownIcon.jsx";
import DropdownModal from "./DropdownModal.jsx";

import { AuthProvider } from "../store/AuthProvider.jsx";
import getEndpoint from "../constants/apiEndpoints.js";

export default function TableFilter({
  dropdownInitialValue,
  dropdownConfigKey,
  isInitialValueAnOption = false,
  isDisabled = false,
  onStateChange = () => {},
  widthSize = "200px",
  id = "",
  customPlaceholderStyle = "",
  apiPayload = "",
}) {
  const [dropdownData, setDropdownData] = useState({
    id: "0",
    value: dropdownInitialValue,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const { accessToken, handleLogout } = useContext(AuthProvider);

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const fetchUrl = getEndpoint(
          dropdownConfigKey,
          "getDropdownData",
          apiPayload,
          ""
        );

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          setDropdownOptions(responseBody.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchDropdownData();
  }, [apiPayload]);

  function handleDropdownChange(dataObject) {
    setIsDropdownOpen((prev) => !prev);
    setDropdownData(dataObject);
    onStateChange(dropdownConfigKey, dataObject);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full"
        style={{ width: widthSize }}
        id={id}
        disabled={isDisabled}
        onClick={(event) => {
          event.target.blur();
          handleDropdownChange(dropdownData);
        }}
      >
        <span
          style={{ pointerEvents: "none" }}
          className={
            dropdownData.value === dropdownInitialValue
              ? customPlaceholderStyle
              : ""
          }
        >
          {isDisabled ? dropdownInitialValue : dropdownData.value}
        </span>
        <ChevronDownIcon />
      </button>
      {isDropdownOpen && (
        <DropdownModal
          dropdownConfigKey={dropdownConfigKey}
          dropdownData={dropdownData}
          dropdownInitialValue={dropdownInitialValue}
          isInitialValueAnOption={isInitialValueAnOption}
          dropdownMenus={dropdownOptions}
          onDropdownChange={handleDropdownChange}
        />
      )}
    </div>
  );
}
