import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon.jsx";
import SquareIcon from "../../components/icons/SquareIcon.jsx";
import DeleteIcon from "../../components/icons/DeleteIcon.jsx";
import PackageIcon from "../../components/icons/PackageIcon.jsx";
import FloorIcon from "../../components/icons/FloorIcon.jsx";
import RoomIcon from "../../components/icons/RoomIcon.jsx";
import CloseIcon from "../../components/icons/CloseIcon.jsx";
import ClipboardIcon from "../../components/icons/ClipboardIcon.jsx";
import PenNibIcon from "../../components/icons/PenNibIcon.jsx";

import TableFilter from "../../components/TableFilter.jsx";
import DeleteModal from "../../components/DeleteModal.jsx";
import LoadingIndicator from "../../components/LoadingIndicator.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";
import {
  currencyFormatter,
  getDateWithoutTime,
} from "../../utils/formatter.js";

export default function RoomInventory() {
  const { accessToken, handleLogout } = useContext(AuthProvider);

  const { state } = useLocation();
  const { roomId, itemName } = useParams();
  const navigate = useNavigate();

  const room = state?.room;
  const item = state?.item;

  if (!room) {
  }

  const [itemActionsVisible, setItemActionsVisible] = useState({
    updateStatus: false,
    move: false,
    delete: false,
  });

  const [dropdownInfo, setDropdownInfo] = useState({
    status: "1234",
    room: room._id,
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [areActionsDisabled, setAreActionsDisabled] = useState(true);
  const [selectBtn, setSelectBtn] = useState(false);
  const [itemTableData, setItemTableData] = useState([]);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleDeleteToggle(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setAreActionsDisabled(false);
    } else {
      setAreActionsDisabled(true);
      resetActionModal();
    }
  }, [selectedItems]);

  useEffect(() => {
    if (!selectBtn) {
      setSelectedItems([]);
    }
  }, [selectBtn]);

  useEffect(() => {
    async function fetchItemData() {
      try {
        const payload = `${item.itemName}/${
          item.itemModel === "" ? `""` : item.itemModel
        }/${room._id}`;

        const fetchUrl = getEndpoint("room", "getItems", payload);

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          setItemTableData(responseBody.data);
          setIsLoading(false);
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchItemData();
  }, []);

  function handleAction(identifier) {
    setItemActionsVisible((prev) => ({ ...prev, [identifier]: true }));
  }

  function resetActionModal() {
    setItemActionsVisible({
      updateStatus: false,
      move: false,
      delete: false,
    });
  }

  function handleItemSelect(id) {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleDropdownChange(identifier, payload) {
    setDropdownInfo((prev) => ({
      ...prev,
      [identifier]: payload.id,
    }));
  }

  async function handleUpdateStatus() {
    try {
      const fetchUrl = getEndpoint("item", "updateMultipleData");

      const response = await fetch(fetchUrl, {
        method: "PATCH",
        body: JSON.stringify({
          item_ids: selectedItems,
          statusId: dropdownInfo.status,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const responseBody = await response.json();
        navigate("/rooms");
      }
      if (response.status == 401) {
        handleLogout();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleMoveItems() {
    try {
      const fetchUrl = getEndpoint("item", "moveMultipleData");

      const response = await fetch(fetchUrl, {
        method: "PATCH",
        body: JSON.stringify({
          item_ids: selectedItems,
          new_room_id: dropdownInfo.room,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const responseBody = await response.json();
        navigate("/rooms");
      }
      if (response.status == 401) {
        handleLogout();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDeleteToggle(isVisible) {
    setIsDeleteVisible(isVisible);
  }

  function handleConfirmDelete() {
    async function deleteItemData() {
      try {
        const fetchUrl = getEndpoint("item", "deleteMultipleData");

        const response = await fetch(fetchUrl, {
          method: "DELETE",
          body: JSON.stringify({
            item_ids: selectedItems,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          handleDeleteToggle(false);
          navigate("/rooms");
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    deleteItemData();
  }

  return (
    <>
      <header className="flex items-center gap-2">
        <Link
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          to={`/rooms/room/${roomId}`}
          state={{ rowData: room }}
        >
          <ArrowLeftIcon />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Item Details</h2>
      </header>

      <section className="flex flex-col md:flex-row gap-4">
        <aside className="md:w-2/3 space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-[14.6rem]">
            <header className="flex flex-col space-y-1.5 p-6 bg-primary/5 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold tracking-tight text-2xl">
                    {itemName}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    onClick={() => setSelectBtn((prev) => !prev)}
                  >
                    <SquareIcon isSelected={selectBtn} /> Select
                  </button>
                </div>
              </div>
            </header>
            <article className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FloorIcon cssClass="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Floor:</span>
                    {room.roomFloorName}
                  </div>
                  <div className="flex gap-2 text-sm">
                    <PackageIcon cssClass="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Category:</span>
                    <span className="max-w-[19rem]">
                      {item.itemCategoryName} ({item.itemSubCategoryName})
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <RoomIcon />
                    <span className="font-medium">Room:</span>
                    {room.roomName}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PenNibIcon cssClass="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Make/Model No:</span>
                    {item.itemModel !== "" ? (
                      item.itemModel
                    ) : (
                      <span className="italic text-muted-foreground">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </aside>

        <aside className="md:w-1/3 space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-[14.6rem]">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-2xl font-semibold leading-none tracking-tight">
                Actions
              </div>
            </div>
            <div className="p-6 pt-0 space-y-2">
              {itemActionsVisible.updateStatus && (
                <TableFilter
                  dropdownInitialValue="Working"
                  dropdownConfigKey="status"
                  onStateChange={handleDropdownChange}
                  widthSize="100%"
                />
              )}
              {itemActionsVisible.move && (
                <TableFilter
                  dropdownInitialValue={room.roomName}
                  dropdownConfigKey="room"
                  widthSize="100%"
                  onStateChange={handleDropdownChange}
                  apiPayload="0"
                />
              )}
              {!itemActionsVisible.move && (
                <button
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full justify-start"
                  onClick={() =>
                    !itemActionsVisible.updateStatus
                      ? handleAction("updateStatus")
                      : handleUpdateStatus()
                  }
                  disabled={areActionsDisabled}
                >
                  <ClipboardIcon cssClass="mr-2 h-4 w-4" />
                  {itemActionsVisible.updateStatus
                    ? "Confirm"
                    : "Update Status"}
                </button>
              )}
              {!itemActionsVisible.updateStatus && (
                <button
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full justify-start"
                  onClick={() =>
                    !itemActionsVisible.move
                      ? handleAction("move")
                      : handleMoveItems()
                  }
                  disabled={areActionsDisabled}
                >
                  <RoomIcon cssClass="mr-2 h-4 w-4" />
                  {itemActionsVisible.move ? "Confirm" : "Move Items"}
                </button>
              )}
              {!itemActionsVisible.updateStatus && !itemActionsVisible.move && (
                <button
                  className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md h-10 px-4 py-2 w-full justify-start"
                  onClick={() => handleDeleteToggle(true)}
                  disabled={areActionsDisabled}
                >
                  <DeleteIcon />
                  Delete
                </button>
              )}
              {(itemActionsVisible.updateStatus || itemActionsVisible.move) && (
                <button
                  className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md h-10 px-4 py-2 w-full justify-start"
                  onClick={resetActionModal}
                >
                  <CloseIcon />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </aside>
      </section>

      <section>
        <div className="relative w-full rounded-lg border bg-card text-card-foreground shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary/5 border-b transition-colors flex justify-between items-center gap-4 px-4 rounded-t-md">
                <th className="h-12 font-bold text-sidebar/95 flex justify-center items-center w-16">
                  S.N
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-start w-[7.5rem] items-center">
                  Date Acquired
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-start w-28 items-center">
                  Item ID
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-start w-[7.5rem] items-center">
                  Cost
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-center w-24 items-center">
                  Status
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-center w-24 items-center">
                  Source
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
              ) : itemTableData.length !== 0 ? (
                itemTableData.map((item, index) => {
                  const status = item.itemStatus;

                  const statusColor =
                    status === "Working"
                      ? "text-green-600"
                      : status === "Repairable"
                      ? "text-yellow-600"
                      : "text-red-600";

                  const customClass =
                    item.itemSource !== "Purchase"
                      ? "text-foreground"
                      : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 ";

                  return (
                    <tr
                      className="border-b transition-colors text-slate-600 flex justify-between items-center gap-4 p-4 h-[4.5rem]"
                      key={item._id}
                    >
                      <td className="text-center w-16">
                        {selectBtn ? (
                          <div className="flex justify-center items-center ">
                            <button
                              className="cursor-pointer"
                              onClick={() => handleItemSelect(item._id)}
                            >
                              <SquareIcon
                                isSelected={selectedItems.includes(item._id)}
                              />
                            </button>
                          </div>
                        ) : (
                          index + 1 + "."
                        )}
                      </td>
                      <td className="text-left w-[7.5rem]">
                        {getDateWithoutTime(item.itemAcquiredDate)}
                      </td>
                      <td className="text-left w-28">
                        {item.itemSerialNumber}
                      </td>
                      <td className="text-left w-[7.5rem]">
                        Rs. {currencyFormatter(item.itemCost)}
                      </td>
                      <td
                        className={`text-center w-24 font-semibold ${statusColor}`}
                      >
                        {item.itemStatus}
                      </td>
                      <td className="text-center w-24">
                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${customClass}`}
                        >
                          {item.itemSource}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 h-24 text-center" colSpan="10">
                    No item found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <DeleteModal
        title="Delete Items"
        isModalVisible={isDeleteVisible}
        onToggle={handleDeleteToggle}
        confirmDelete={handleConfirmDelete}
        message="Are you sure you want to delete these items?"
        canDelete={true}
      />
    </>
  );
}
