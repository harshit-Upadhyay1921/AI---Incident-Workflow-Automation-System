export const sidebarMenu = {
  // ---------------- ADMIN ----------------
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: "MdSpaceDashboard" },
    { label: "Incidents", path: "/admin/incidents", icon: "MdReport" },
    { label: "Users", path: "/admin/users", icon: "MdPeople" },
    { label: "Settings", path: "/admin/settings", icon: "MdSettings" },
  ],

  // ---------------- TEAM LEAD ----------------
  team_lead: [
    { label: "Dashboard", path: "/team_lead/dashboard", icon: "MdSpaceDashboard" },
    { label: "Incidents", path: "/team_lead/incidents", icon: "MdReport" },
    { label: "Create Incident", path: "/team_lead/createIncident", icon: "MdAddCircle" },
    { label: "My Incidents", path: "/team_lead/myIncidents", icon: "MdReport"},
    { label: "Users", path: "/team_lead/users", icon: "MdPeople" },
  ],

  // ---------------- SUPPORT & SENIOR SUPPORT (same menu) ----------------
  support: [
    { label: "Dashboard", path: "/support/dashboard", icon: "MdSpaceDashboard" },
    // Uses getMyAssignedIncidents controller
    { label: "My Assigned Incidents", path: "/support/incidents/assigned", icon: "MdAssignment" },
    // Uses getMyEscalatedOrSlaBreached controller
    { label: "My Escalated / SLA-Breached", path: "/support/incidents/escalated", icon: "MdUpgrade" },
    // Uses getMyResolvedOrClosedIncidents controller
    { label: "My Resolved & Closed", path: "/support/incidents/resolved-closed", icon: "MdDoneAll" },
  ],

  senior_support: [
    { label: "Dashboard", path: "/support/dashboard", icon: "MdSpaceDashboard" },
    { label: "My Assigned Incidents", path: "/support/incidents/assigned", icon: "MdAssignment" },
    { label: "My Escalated / SLA-Breached", path: "/support/incidents/escalated", icon: "MdUpgrade" },
    { label: "My Resolved & Closed", path: "/support/incidents/resolved-closed", icon: "MdDoneAll" },
  ],

  // ---------------- EMPLOYEE ----------------
  employee: [
    // Uses createIncident controller (same UI as team lead create)
    { label: "Create Incident", path: "/employee/create-incident", icon: "MdAddCircle" },
    // Uses getAllIncidents (filtered by createdBy) or a dedicated getMyCreatedIncidents
    { label: "My Incidents", path: "/employee/my-incidents", icon: "MdReport" },

    { label: "Profile", path: "/employee/profile", icon: "MdPerson" },
  ],
};
