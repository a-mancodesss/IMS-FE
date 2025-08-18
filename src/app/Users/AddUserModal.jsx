import { useState, useRef, useContext } from "react";
import ReactDOM from "react-dom";

import { AuthProvider } from "../../store/AuthProvider.jsx";
import getEndpoint from "../../constants/apiEndpoints.js";

function validateLength(text) {
  return text.length === 0;
}

export default function AddRoomModal({ isModalVisible, onToggle, onSuccess }) {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const roleRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);

  const [isEmpty, setIsEmpty] = useState({
    username: false,
    email: false,
    role: false,
    phoneNumber: false,
    password: false,
  });

  const { accessToken, handleLogout } = useContext(AuthProvider);

  function handleSubmit(event) {
    event.preventDefault();
    const enteredUserName = usernameRef.current?.value;
    const enteredUserEmail = emailRef.current?.value;
    const enteredUserRole = roleRef.current?.value;
    const enteredUserPhoneNumber = phoneNumberRef.current?.value;
    const enteredUserPassword = passwordRef.current?.value;

    const isEmptyCheck = {
      username: validateLength(enteredUserName),
      email: validateLength(enteredUserEmail),
      role: validateLength(enteredUserRole),
      phoneNumber: validateLength(enteredUserPhoneNumber),
      password: validateLength(enteredUserPassword),
    };
    setIsEmpty(isEmptyCheck);

    async function postUserData() {
      try {
        const fetchUrl = getEndpoint("user", "addData");

        const response = await fetch(fetchUrl, {
          method: "POST",
          body: JSON.stringify({
            username: enteredUserName,
            email: enteredUserEmail,
            password: enteredUserPassword,
            role: enteredUserRole,
            phone_number: enteredUserPhoneNumber,
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

    if (
      !isEmptyCheck.username &&
      !isEmptyCheck.email &&
      !isEmptyCheck.role &&
      !isEmptyCheck.phoneNumber &&
      !isEmptyCheck.password
    ) {
      postUserData();
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
            Add New User
          </h2>
          <p className="text-sm text-muted-foreground">Create a new user</p>
        </div>
        <form className="grid" onSubmit={handleSubmit}>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="user-name"
            >
              Username: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={usernameRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="user-name"
                onChange={() =>
                  setIsEmpty((prevState) => ({
                    ...prevState,
                    username: false,
                  }))
                }
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.username ? "Please enter a valid username" : ""}
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="user-email"
            >
              Email: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={emailRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="user-email"
                onChange={() =>
                  setIsEmpty((prevState) => ({
                    ...prevState,
                    email: false,
                  }))
                }
                type="email"
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.email ? "Please enter a valid email" : ""}
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="user-role"
            >
              Role: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={roleRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="user-role"
                value="Admin"
                onChange={() =>
                  setIsEmpty((prevState) => ({
                    ...prevState,
                    role: false,
                  }))
                }
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.role ? "Please enter a valid role" : ""}
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="user-phone-number"
            >
              Phone Number: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={phoneNumberRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="user-phone-number"
                onChange={() =>
                  setIsEmpty((prevState) => ({
                    ...prevState,
                    phoneNumber: false,
                  }))
                }
                type="number"
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.phoneNumber ? "Please enter a valid phone number" : ""}
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="user-password"
            >
              Password: <span className="text-[#ff6365]">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={passwordRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="user-password"
                onChange={() =>
                  setIsEmpty((prevState) => ({
                    ...prevState,
                    password: false,
                  }))
                }
                type="password"
              />
            </div>
            <div className="text-[#ff6365] h-3 text-sm mt-1 mb-2">
              {isEmpty.password ? "Please enter a valid password" : ""}
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
