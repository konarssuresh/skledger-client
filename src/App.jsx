import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux";

import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import { themeSelector } from "./store/userPreferenceSlice";

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
      <Route path="/dashboard" element={<div>Dashboard</div>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
