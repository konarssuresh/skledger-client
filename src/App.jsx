import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux";

import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import DashboardPage from "./pages/dashboard";
import TransactionsPage from "./pages/transactions";
import SettingsPage from "./pages/settings";
import { themeSelector } from "./store/userPreferenceSlice";
import RouteProtector from "./RouteProtector";
import AuthenticatedLayout from "./shared/AuthenticatedLayout";

function App() {
  const theme = useSelector(themeSelector);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<RouteProtector />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
