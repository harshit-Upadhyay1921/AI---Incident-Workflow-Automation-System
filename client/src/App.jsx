import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx"; 
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminIncidents from "./pages/admin/AdminIncidents.jsx";
import AdminSettings from "./pages/admin/AdminsSetting.jsx";

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* PROTECTED PAGES */}
        <Route element={<ProtectedLayout />}>
          {/* ADMIN */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/incidents" element={<AdminIncidents />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* support & employee routes later */}

        </Route>
      </Routes>

    </div>
  )
}

export default App

