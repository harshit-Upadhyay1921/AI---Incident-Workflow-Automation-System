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
import TeamLeadDashboard from "./pages/teamlead/TeamLeadDashboard.jsx";
import TeamLeadIncidents from "./pages/teamlead/TeamLeadIncidents.jsx";
import TeamLeadUsers from "./pages/teamlead/TeamLeadUsers.jsx";
import TeamLeadCreateInc from "./pages/teamlead/TeamLeadCreateInc.jsx";
import TeamLeadMyIncidents from "./pages/teamlead/TeamLeadMyIncidents.jsx";
import SupportDashboard from "./pages/support/SupportDashboard.jsx";
import SupportMyAssigned from "./pages/support/SupportMyAssigned.jsx";
import IncidentDetails from "./pages/IncidentDetails.jsx";
import SupportMyEscalated from "./pages/support/SupportMyEscalated.jsx";
import SupportMyResolvedAndClosed from "./pages/support/SupportMyResolvedAndClosed.jsx";
import EmployeeMyIncidents from "./pages/employee/EmployeeMyIncidents.jsx"; 
import EmployeeCreateIncident from "./pages/employee/EmployeeCreateIncident.jsx";
// import IncidentHistory from "./pages/IncidentHistory.jsx";

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
          {/* Team Lead */}
          <Route path="/team_lead/dashboard" element={<TeamLeadDashboard/>}/>
          <Route path="/team_lead/incidents" element={<TeamLeadIncidents/>}/>
          <Route path="/team_lead/users" element={<TeamLeadUsers/>}/>
          <Route path="/team_lead/createIncident" element={<TeamLeadCreateInc/>}/>
          <Route path="/team_lead/myIncidents" element={<TeamLeadMyIncidents/>}/>
          {/* SUPPORT & SENIOR SUPPORT */}
          <Route path="/support/dashboard" element={<SupportDashboard />} />
          <Route path="/support/incidents/assigned" element={<SupportMyAssigned />} />
          <Route path="/support/incidents/escalated" element={<SupportMyEscalated />} />
          <Route path="/support/incidents/resolved-closed" element={<SupportMyResolvedAndClosed />} />
          {/* Employee */}
          <Route path="/employee/my-incidents" element={<EmployeeMyIncidents/>}/>
          <Route path="/employee/create-incident" element={<EmployeeCreateIncident/>}/>
        </Route>

        <Route path="/incident/:id" element={<IncidentDetails/>}/>
        {/* <Route path="/incident/:id/history" element={<IncidentHistory/>}/> */}
      </Routes>

    </div>
  )
}

export default App

