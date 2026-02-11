import { Navigate, Route, Routes } from "react-router";

import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";

function App() {
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
