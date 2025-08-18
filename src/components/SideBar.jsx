import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import PackageIcon from "./icons/PackageIcon.jsx";
import DashboardIcon from "./icons/DashboardIcon.jsx";
import HouseIcon from "./icons/HouseIcon.jsx";
import ColumnChartIcon from "./icons/ColumnChartIcon.jsx";
import ClipboardIcon from "./icons/ClipboardIcon.jsx";
import CategoryIcon from "./icons/CategoryIcon.jsx";
import UserIcon from "./icons/UserIcon.jsx";
import LogoutIcon from "./icons/LogoutIcon.jsx";

import { AuthProvider } from "../store/AuthProvider.jsx";
import getEndpoint from "../constants/apiEndpoints.js";

const NAV_LINKS = [
  {
    path: "/rooms",
    icon: <HouseIcon />,
    title: "Rooms",
  },
  {
    path: "/inventory",
    icon: <PackageIcon cssClass="h-[1.2rem] w-[1.2rem]" />,
    title: "Inventory",
  },
  {
    path: "/analytics",
    icon: <ColumnChartIcon />,
    title: "Analytics",
  },
  {
    path: "/activity",
    icon: <ClipboardIcon />,
    title: "Activity Log",
  },
  {
    path: "/categories",
    icon: <CategoryIcon />,
    title: "Categories",
  },
  {
    path: "/users",
    icon: <UserIcon />,
    title: "Users",
  },
];

export default function SideBar() {
  const pathLocation = useLocation();
  const [userData, setUserData] = useState({});
  const { accessToken, handleLogout } = useContext(AuthProvider);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const fetchUrl = getEndpoint("user", "getCurrentUserData");

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json();
          setUserData(responseBody.data);
        }
        if (response.status == 401) {
          handleLogout();
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserData();
  }, []);

  const activeClass =
    "bg-sidebar-foreground/20 text-sidebar-foreground font-medium";

  return (
    <aside className="flex sticky top-0 h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <header className="flex h-16 items-center px-4">
        <Link className="flex items-center gap-2 text-2xl font-semibold" to="/">
          <PackageIcon cssClass="h-8 w-8" />
          <span>DOECE IMS</span>
        </Link>
      </header>

      <article className="shrink-0 bg-border w-[90%] h-[0.5px] mx-auto"></article>

      <section className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 space-y-1">
          <Link
            className={`flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground text-sidebar-foreground/80 ${
              pathLocation.pathname === "/" ? activeClass : ""
            }`}
            to="/"
          >
            <DashboardIcon />
            Dashboard
          </Link>

          {NAV_LINKS.map((navlink) => {
            return (
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground text-sidebar-foreground/80 ${
                  pathLocation.pathname.includes(navlink.path) &&
                  navlink.title !== "Add New Item"
                    ? activeClass
                    : ""
                }`}
                to={navlink.path}
                key={navlink.title}
              >
                {navlink.icon}
                {navlink.title}
              </Link>
            );
          })}
        </nav>
      </section>

      <footer className="mt-auto p-4">
        <article className="flex items-center gap-2 rounded-lg border border-sidebar-border p-4 bg-sidebar-foreground/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {userData.username !== undefined
              ? userData.username[0].toUpperCase()
              : ""}
          </div>
          <div>
            <p className="text-xs font-medium">{userData.username}</p>
            <p className="text-xs text-sidebar-foreground/70">
              {userData.email}
            </p>
          </div>
        </article>
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-9 rounded-md px-3 mt-4 w-full gap-1 bg-sidebar-foreground/10 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-foreground/20 hover:text-sidebar-foreground"
          to="/login"
          onClick={handleLogout}
        >
          <LogoutIcon />
          Log out
        </Link>
      </footer>
    </aside>
  );
}
