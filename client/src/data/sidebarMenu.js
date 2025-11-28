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
    { label: "Dashboard", path: "/team-lead/dashboard", icon: "MdSpaceDashboard" },
    { label: "Incidents", path: "/team-lead/incidents", icon: "MdReport" },
    { label: "Create Incident", path: "/team-lead/incidents/create", icon: "MdAddCircle" },
    { label: "Users", path: "/team-lead/users", icon: "MdPeople" },
    { label: "Settings", path: "/team-lead/settings", icon: "MdSettings" },
  ],

  // ---------------- SUPPORT & SENIOR SUPPORT (same menu) ----------------
  support: [
    { label: "Dashboard", path: "/support/dashboard", icon: "MdSpaceDashboard" },
    { label: "Assigned Incidents", path: "/support/incidents/assigned", icon: "MdAssignment" },
    { label: "Escalated Incidents", path: "/support/incidents/escalated", icon: "MdUpgrade" },
    { label: "Resolved", path: "/support/incidents/resolved", icon: "MdDoneAll" },
    { label: "Settings", path: "/support/settings", icon: "MdSettings" },
  ],

  senior_support: [
    { label: "Dashboard", path: "/support/dashboard", icon: "MdSpaceDashboard" },
    { label: "Assigned Incidents", path: "/support/incidents/assigned", icon: "MdAssignment" },
    { label: "Escalated Incidents", path: "/support/incidents/escalated", icon: "MdUpgrade" },
    { label: "Resolved", path: "/support/incidents/resolved", icon: "MdDoneAll" },
    { label: "Settings", path: "/support/settings", icon: "MdSettings" },
  ],

  // ---------------- EMPLOYEE ----------------
  employee: [
    { label: "My Incidents", path: "/employee/incidents", icon: "MdReport" },
    { label: "Create Incident", path: "/employee/incidents/create", icon: "MdAddCircle" },
    { label: "Profile", path: "/employee/profile", icon: "MdPerson" },
  ],
};
