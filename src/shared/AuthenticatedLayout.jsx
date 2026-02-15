import { useState } from "react";
import { Outlet } from "react-router";
import AppNavigation from "./AppNavigation.jsx";

const AuthenticatedLayout = () => {
  const [desktopNavCollapsed, setDesktopNavCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <AppNavigation
        desktopCollapsed={desktopNavCollapsed}
        onDesktopToggle={() => setDesktopNavCollapsed((prev) => !prev)}
      />
      <div
        className={`pb-20 transition-all duration-300 ease-out md:pb-0 ${
          desktopNavCollapsed ? "md:pl-0" : "md:pl-64"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
