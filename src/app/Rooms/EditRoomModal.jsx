import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

import RoomIcon from "../../components/icons/RoomIcon";
import TableFilter from "../../components/TableFilter.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

export default function EditRoomModal({ modalData, onToggle }) {
  const [dropdownInfo, setDropdownInfo] = useState({ floor: "", roomType: "" });
  const [modalFieldData, setModalFieldData] = useState({
    name: "",
    allottedTo: "",
    floor: "",
    roomType: "",
  });

  const [isEmpty, setIsEmpty] = useState({
    name: false,
  });

  const { accessToken, handleLogout } = useContext(AuthProvider);
  const navigate = useNavigate();

  useEffect(() => {
    setModalFieldData({
      name: modalData.payload.roomName || "",
      allottedTo: modalData.payload.allottedTo || "",
      floor: modalData.payload.roomFloorName || "",
      roomType: modalData.payload.roomTypeName || "",
    });

    setDropdownInfo({
      floor: modalData.payload.roomFloorId || "",
      roomType: modalData.payload.roomTypeId || "",
    });
  }, [modalData]);

  function handleSubmit(event) {
    event.preventDefault();

    const isEmptyCheck = { name: modalFieldData.name.length === 0 };
    setIsEmpty(isEmptyCheck);

    async function updateRoomData() {
      try {
        const fetchUrl = getEndpoint("room", "editData", modalData.payload._id);

        const response = await fetch(fetchUrl, {
          method: "PATCH",
          body: JSON.stringify({
            room_name: modalFieldData.name,
            allotted_to: modalFieldData.allottedTo,
            room_floor_id: dropdownInfo.floor,
            room_type_id: dropdownInfo.roomType,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          onToggle(false);
          navigate("/rooms");
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (!isEmptyCheck.name) {
      updateRoomData();
    }
  }

  function handleDropdownChange(identifier, payload) {
    setDropdownInfo((prev) => ({
      ...prev,
      [identifier]: payload.id,
    }));
  }

  function handleInputChange(identifier, value) {
    setModalFieldData((prevData) => ({ ...prevData, [identifier]: value }));

    setIsEmpty((prevState) => ({
      ...prevState,
      [identifier]: false,
    }));
  }

  if (!modalData.visible) {
    return null;
  }

  return ReactDOM.createPortal(
    <section className="fixed top-0 left-0 flex items-center justify-center bg-black/80 w-full h-full z-[1000] transition-all duration-400 ease-in-out">
      <div className="fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg sm:max-w-[525px]">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left bg-primary/5 p-4 rounded-t-lg">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            Edit Room
          </h2>
        </div>
        <form className="grid" onSubmit={handleSubmit}>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="room-name"
            >
              Room Name: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <RoomIcon />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="room-name"
                value={modalFieldData.name}
                onChange={(event) =>
                  handleInputChange("name", event.target.value)
                }
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.name ? "Please enter room name" : ""}
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="room-allotted-to"
            >
              Allotted To:
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="room-allotted-to"
                value={modalFieldData.allottedTo}
                onChange={(event) =>
                  handleInputChange("allottedTo", event.target.value)
                }
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2"></div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="room-floor"
            >
              Floor: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="h-2"></div>
            <TableFilter
              key={`${modalData.visible}-${modalFieldData.floor}`}
              dropdownInitialValue={modalFieldData.floor}
              dropdownConfigKey="floor"
              widthSize="100%"
              onStateChange={handleDropdownChange}
              id="room-floor"
            />
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2"></div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="room-type"
            >
              Room Type: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="h-2"></div>
            <TableFilter
              key={`${modalData.visible}-${modalFieldData.roomType}`}
              dropdownInitialValue={modalFieldData.roomType}
              dropdownConfigKey="roomType"
              widthSize="100%"
              onStateChange={handleDropdownChange}
              id="room-type"
            />
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2"></div>
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
              Edit
            </button>
          </div>
        </form>
      </div>
    </section>,
    document.getElementById("modal-root")
  );
}
