import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon.jsx";
import EditIcon from "../../components/icons/EditIcon.jsx";
import DeleteIcon from "../../components/icons/DeleteIcon.jsx";
import FloorIcon from "../../components/icons/FloorIcon.jsx";
import UserIcon from "../../components/icons/UserIcon.jsx";
import RoomIcon from "../../components/icons/RoomIcon.jsx";
import PackageIcon from "../../components/icons/PackageIcon.jsx";
import CircleCheckIcon from "../../components/icons/CircleCheckIcon.jsx";
import PenNibIcon from "../../components/icons/PenNibIcon.jsx";
import AlertIcon from "../../components/icons/AlertIcon.jsx";
import VisibilityIcon from "../../components/icons/VisibilityIcon.jsx";

import EditRoomModal from "./EditRoomModal.jsx";
import DeleteModal from "../../components/DeleteModal.jsx";
import LoadingIndicator from "../../components/LoadingIndicator.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants${API_BASE_URL}Endpoints.js";
import { API_BASE_URL } from "../../utils/envVars.js";

export default function RoomDetail() {
  const { accessToken, handleLogout } = useContext(AuthProvider);
  const navigate = useNavigate();

  const { state } = useLocation();
  const { roomId } = useParams();

  const room = state?.rowData;

  if (!room) {
  }

  const [roomStatusBreakdown, setRoomStatusBreakdown] = useState({
    working: 0,
    repairable: 0,
    notWorking: 0,
  });
  const [itemTableData, setitemTableData] = useState([]);
  const [editModal, setEditModal] = useState({
    visible: false,
    payload: "",
  });
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isDeletePossible, setIsDeletePossible] = useState({
    totalItems: 0,
    possible: true,
    message: "Are you sure you want to delete this room?",
  });
  const [isLoading, setIsLoading] = useState(true);

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
    async function fetchItemData() {
      try {
        const fetchUrl = `${API_BASE_URL}/v1/rooms/${roomId}/item-details`;

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          setitemTableData(responseBody.data);

          const breakdown = { working: 0, repairable: 0, notWorking: 0 };
          responseBody.data.forEach((eachData) => {
            breakdown.working += eachData.workingCount;
            breakdown.repairable += eachData.repairableCount;
            breakdown.notWorking += eachData.notWorkingCount;
          });
          setRoomStatusBreakdown(breakdown);
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

  function handleModalToggle(isVisible, modalPayload = "") {
    setEditModal({ visible: isVisible, payload: modalPayload });
  }

  function handleDeleteToggle(isVisible) {
    setIsDeleteVisible(isVisible);
    setIsDeletePossible((prev) => ({ ...prev, totalItems: room.totalItems }));

    if (!isVisible) {
      setIsDeletePossible({
        totalItems: 0,
        possible: true,
        message: "Are you sure you want to delete this category?",
      });
    }
  }

  function handleConfirmDelete() {
    if (!(isDeletePossible.totalItems === 0)) {
      setIsDeletePossible((prev) => ({
        ...prev,
        possible: false,
        message: "The room must be empty before deletion.",
      }));
      return;
    }

    async function deleteRoomData() {
      try {
        const fetchUrl = getEndpoint("room", "deleteData", room._id);

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
          navigate("/rooms");
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    deleteRoomData();
  }

  return (
    <>
      <header className="flex items-center gap-2">
        <Link
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          to="/rooms"
        >
          <ArrowLeftIcon />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Room Details</h2>
      </header>

      <section className="flex flex-col md:flex-row gap-4">
        <aside className="md:w-2/3 space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-[11.5rem]">
            <header className="flex flex-col space-y-1.5 p-6 bg-primary/5 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold tracking-tight text-2xl">
                    {room.roomName}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    onClick={() => handleModalToggle(true, room)}
                  >
                    <EditIcon cssClass="mr-2 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 rounded-md px-3"
                    onClick={() => handleDeleteToggle(true)}
                  >
                    <DeleteIcon cssClass="mr-2 h-4 w-4" />
                    Delete
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
                    <UserIcon cssClass="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Allotted To:</span>
                    {room.allottedTo !== undefined ? (
                      <span className="max-w-[15rem]">{room.allottedTo}</span>
                    ) : (
                      <span className="italic text-muted-foreground">
                        Not assigned
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <RoomIcon />
                    <span className="font-medium">Room Type:</span>
                    {room.roomTypeName}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PackageIcon cssClass="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Total Items:</span>
                    {room.totalItems}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </aside>

        <aside className="md:w-1/3 space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-[11.5rem]">
            <div className="flex flex-col p-3">
              <h3 className="font-semibold">Status Breakdown</h3>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-[7.5rem]">
                <LoadingIndicator />
              </div>
            ) : (
              <div className="space-y-4 p-3 pt-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CircleCheckIcon />
                      Working
                    </div>
                    <div>
                      {roomStatusBreakdown.working} / {room.totalItems}
                    </div>
                  </div>
                  <div className="relative w-full overflow-hidden rounded-full bg-muted h-1.5">
                    <div
                      className="h-full w-full flex-1 bg-primary transition-all"
                      style={{
                        transform: `translateX(-${
                          room.totalItems === 0
                            ? 100
                            : 100 -
                              (roomStatusBreakdown.working / room.totalItems) *
                                100
                        }%)`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <PenNibIcon />
                      Repairable
                    </div>
                    <div>
                      {roomStatusBreakdown.repairable} / {room.totalItems}
                    </div>
                  </div>
                  <div className="relative w-full overflow-hidden rounded-full bg-muted h-1.5">
                    <div
                      className="h-full w-full flex-1 bg-primary transition-all"
                      style={{
                        transform: `translateX(-${
                          room.totalItems === 0
                            ? 100
                            : 100 -
                              (roomStatusBreakdown.repairable /
                                room.totalItems) *
                                100
                        }%)`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <AlertIcon />
                      Not-working
                    </div>
                    <div>
                      {roomStatusBreakdown.notWorking} / {room.totalItems}
                    </div>
                  </div>
                  <div className="relative w-full overflow-hidden rounded-full bg-muted h-1.5">
                    <div
                      className="h-full w-full flex-1 bg-primary transition-all"
                      style={{
                        transform: `translateX(-${
                          room.totalItems === 0
                            ? 100
                            : 100 -
                              (roomStatusBreakdown.notWorking /
                                room.totalItems) *
                                100
                        }%)`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
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
                <th className="h-12 font-bold text-sidebar/95 flex justify-start w-80 items-center">
                  Name
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-start w-56 items-center">
                  Make/Model No.
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-center w-[8.5rem] items-center">
                  Status
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-center w-28 items-center">
                  Total Quantity
                </th>
                <th className="h-12 font-bold text-sidebar/95 flex justify-center w-24 items-center">
                  View
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
                  const additionalValue =
                    item.itemDescription !== ""
                      ? `(${item.itemDescription})`
                      : null;

                  return (
                    <tr
                      className="border-b transition-colors text-slate-600 flex justify-between items-center gap-4 p-4 h-[4.5rem]"
                      key={index}
                    >
                      <td className="text-center w-16">{index + 1}.</td>
                      <td>
                        <div className="flex flex-col">
                          <div className="justify-start w-80">
                            {item.itemName}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {additionalValue}
                          </div>
                        </div>
                      </td>
                      <td className="text-left w-56">{item.itemModel}</td>
                      <td className="text-center w-[8.5rem]">
                        <div className="flex justify-center items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-green-500/30 ring-offset-1"></div>
                            <span className="text-xs">{item.workingCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 ring-1 ring-yellow-500/30 ring-offset-1"></div>
                            <span className="text-xs">
                              {item.repairableCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-red-500/30 ring-offset-1"></div>
                            <span className="text-xs">
                              {item.notWorkingCount}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center w-28">{item.totalCount}</td>
                      <td>
                        <div className="flex justify-center items-center gap-2 w-24">
                          <Link
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 h-9 w-9 border border-[#292929] text-[#565656] hover:bg-[#ebebeb]"
                            to={`/rooms/room/${roomId}/${item.itemName}`}
                            state={{ room, item }}
                          >
                            <VisibilityIcon
                              isVisible={true}
                              cssClass="fill-[#565656] hover:fill-[#565656]"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 h-24 text-center" colSpan="10">
                    No item in this room.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <EditRoomModal
        key={`${editModal.visible}${123}`}
        modalData={editModal}
        onToggle={handleModalToggle}
      />
      <DeleteModal
        title="Delete Room"
        isModalVisible={isDeleteVisible}
        onToggle={handleDeleteToggle}
        confirmDelete={handleConfirmDelete}
        message={isDeletePossible.message}
        canDelete={isDeletePossible.possible}
      />
    </>
  );
}
