import { useState, useRef } from "react";

import FormInput from "./FormInput.jsx";
import VisibilityIcon from "../../components/icons/VisibilityIcon.jsx";
import PackageIcon from "../../components/icons/PackageIcon.jsx";
import { API_BASE_URL } from "../../utils/envVars.js";

function validateLength(text) {
  return text.length === 0;
}

export default function LoginPage({ handleLogin }) {
  const username = useRef(null);
  const password = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isEmpty, setIsEmpty] = useState({
    username: false,
    password: false,
  });

  function handleSubmit(event) {
    event.preventDefault();

    const enteredUsername = username.current.value;
    const enteredPassword = password.current.value;

    const isEmptyCheck = {
      username: validateLength(enteredUsername),
      password: validateLength(enteredPassword),
    };

    setIsEmpty(isEmptyCheck);

    async function postUserData(userData) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          handleLogin(
            responseBody.data.accessToken,
            responseBody.data.refreshToken
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (!isEmptyCheck.username && !isEmptyCheck.password) {
      const userData = {
        username: enteredUsername,
        password: enteredPassword,
      };

      postUserData(userData);
    }
  }

  return (
    <section className="flex items-center justify-center h-full">
      <article className="w-80 rounded-md p-6 bg-white shadow-md">
        <header className="flex flex-col items-center px-4">
          <div className="flex flex-col items-center gap-2 text-2xl font-bold text-sidebar">
            <PackageIcon cssClass="h-9 w-9" />
            <span className="text-center">
              DOECE Inventory Management System
            </span>
          </div>
          <p className="my-4 font-bold text-[1.35rem] text-center">Login</p>
        </header>
        <form onSubmit={handleSubmit}>
          <FormInput
            ref={username}
            type="text"
            label="Username"
            name="username"
            error={isEmpty.username}
            handleChange={() =>
              setIsEmpty((prevState) => ({
                ...prevState,
                username: false,
              }))
            }
          />
          <div className="relative">
            <FormInput
              ref={password}
              type={isVisible ? "text" : "password"}
              label="Password"
              name="password"
              error={isEmpty.password}
              handleChange={() =>
                setIsEmpty((prevState) => ({
                  ...prevState,
                  password: false,
                }))
              }
            />
            <button
              className="bg-background border-none absolute top-[44px] right-3"
              type="button"
              onClick={() => setIsVisible((prevValue) => !prevValue)}
            >
              <VisibilityIcon isVisible={isVisible} />
            </button>
          </div>
          <section className="login-form-actions">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-10 mt-2 text-base [&_svg]:size-5"
            >
              Login
            </button>
          </section>
        </form>
      </article>
    </section>
  );
}
