import { useState, useRef, useContext } from "react";
import ReactDOM from "react-dom";

import RoomIcon from "../../components/icons/RoomIcon";
import TableFilter from "../../components/TableFilter.jsx";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

function validateLength(text) {
  return text.length === 0;
}

export default function AddRoomModal({ isModalVisible, onToggle, onSuccess }) {
  const roomNameRef = useRef(null);
  const roomAllottedToRef = useRef(null);

  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(null);
  const [isEmpty, setIsEmpty] = useState({
    roomName: false,
    roomTypeId: false,
    floorId: false,
  });

  const { accessToken, handleLogout } = useContext(AuthProvider);

  function handleFloorSelection(identifier, selectedFloorOption) {
    setSelectedFloorId(selectedFloorOption.id);

    setIsEmpty((prevState) => ({
      ...prevState,
      floorId: false,
    }));
  }

  function handleRoomTypeSelection(identifier, selectedRoomTypeOption) {
    setSelectedRoomTypeId(selectedRoomTypeOption.id);

    setIsEmpty((prevState) => ({
      ...prevState,
      roomTypeId: false,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const enteredRoomName = roomNameRef.current?.value;
    const enteredRoomAllottedTo = roomAllottedToRef.current?.value;

    const isEmptyCheck = {
      roomName: validateLength(enteredRoomName),
      roomTypeId: selectedRoomTypeId === null,
      floorId: selectedFloorId === null,
    };
    setIsEmpty(isEmptyCheck);

    async function postRoomData(roomData) {
      try {
        const fetchUrl = getEndpoint("room", "addData");

        const response = await fetch(fetchUrl, {
          method: "POST",
          body: JSON.stringify(roomData),
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

    if (
      !isEmptyCheck.roomName &&
      !isEmptyCheck.roomTypeId &&
      !isEmptyCheck.floorId
    ) {
      const roomData = {
        room_name: enteredRoomName,
        room_floor_id: selectedFloorId,
        room_type_id: selectedRoomTypeId,
        allotted_to: enteredRoomAllottedTo,
      };
      postRoomData(roomData);
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
            Add New Room
          </h2>
          <p className="text-sm text-muted-foreground">Create a new room</p>
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
                ref={roomNameRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="room-name"
                placeholder="e.g. Lecture Room 305"
                onChange={() =>
                  setIsEmpty((prevState) => ({
                    ...prevState,
                    roomName: false,
                  }))
                }
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.roomName ? "Please enter room name" : ""}
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
                ref={roomAllottedToRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="room-allotted-to"
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2"></div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
              htmlFor="room-floor"
            >
              Floor: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="h-2"></div>
            <TableFilter
              dropdownInitialValue="Select floor"
              dropdownConfigKey="floor"
              widthSize="100%"
              customPlaceholderStyle="text-muted-foreground"
              onStateChange={handleFloorSelection}
              id="room-floor"
            />
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.floorId ? "Please select a floor" : ""}
            </div>
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
              dropdownInitialValue="Select room type"
              dropdownConfigKey="roomType"
              widthSize="100%"
              customPlaceholderStyle="text-muted-foreground"
              onStateChange={handleRoomTypeSelection}
              id="room-type"
            />
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.roomTypeId ? "Please select a room type" : ""}
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
