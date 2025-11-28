import React, { useState } from "react";
import { motion } from "framer-motion";

const ROLES = ["employee", "support", "senior_support", "team_lead", "admin"];
const DEPARTMENTS = ["IT", "HR"];

const AdminSettings = () => {
  // ---------- Change User Role ----------
  const [roleForm, setRoleForm] = useState({
    userId: "",
    newRole: "",
  });

  // ---------- Assign Department ----------
  const [deptForm, setDeptForm] = useState({
    userId: "",
    department: "",
  });

  // ---------- Change Incident Assigned Dept ----------
  const [incidentDeptForm, setIncidentDeptForm] = useState({
    incidentId: "",
    newDept: "",
  });

  // ---------- Update Password (collapsible) ----------
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ---------------------------------------------------------
  //                       API HANDLERS
  // ---------------------------------------------------------

  // CHANGE ROLE
  const handleChangeRole = async (e) => {
    e.preventDefault();
    console.log("ChangeRole Payload:", roleForm);

    // Example API:
    // await axios.patch(
    //   `/api/v1/admin/users/${roleForm.userId}/change-role`,
    //   { role: roleForm.newRole },
    //   { withCredentials: true }
    // );

    alert("Change Role API placeholder hit");
  };

  // ASSIGN / CHANGE USER DEPARTMENT
  const handleAssignDept = async (e) => {
    e.preventDefault();
    console.log("AssignDept Payload:", deptForm);

    // Example:
    // await axios.patch(
    //   `/api/v1/admin/users/${deptForm.userId}/assign-department`,
    //   { department: deptForm.department },
    //   { withCredentials: true }
    // );

    alert("Assign Department API placeholder hit");
  };

  // MANUAL INCIDENT DEPARTMENT CHANGE
  const handleIncidentDeptChange = async (e) => {
    e.preventDefault();
    console.log("IncidentDept Payload:", incidentDeptForm);

    // Example:
    // await axios.patch(
    //   `/api/v1/incidents/${incidentDeptForm.incidentId}/change-dept`,
    //   { newDept: incidentDeptForm.newDept },
    //   { withCredentials: true }
    // );

    alert("Change Incident Department API placeholder hit");
  };

  // UPDATE PASSWORD
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password & confirm password mismatch");
      return;
    }

    console.log("Password Update Payload:", passwordForm);

    // Example:
    // await axios.patch(
    //   `/api/v1/auth/update-password`,
    //   {
    //     currentPassword: passwordForm.currentPassword,
    //     newPassword: passwordForm.newPassword,
    //   },
    //   { withCredentials: true }
    // );

    alert("Password Update API placeholder hit");
  };

  return (
    <div className="space-y-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-primary"
      >
        Admin Settings
      </motion.h1>

      {/* ----------------------------------------------- */}
      {/* CHANGE USER ROLE */}
      {/* ----------------------------------------------- */}
      <SettingsCard title="Change User Role">
        <form onSubmit={handleChangeRole} className="space-y-4">

          <InputField
            label="User ID"
            placeholder="Enter User ID"
            value={roleForm.userId}
            onChange={(v) => setRoleForm((p) => ({ ...p, userId: v }))}
          />

          <SelectField
            label="New Role"
            value={roleForm.newRole}
            onChange={(v) => setRoleForm((p) => ({ ...p, newRole: v }))}
            options={ROLES}
          />

          <PrimaryButton title="Update Role" />
        </form>
      </SettingsCard>

      {/* ----------------------------------------------- */}
      {/* ASSIGN USER DEPARTMENT */}
      {/* ----------------------------------------------- */}
      <SettingsCard title="Assign / Change User Department">
        <form onSubmit={handleAssignDept} className="space-y-4">

          <InputField
            label="User ID"
            placeholder="Enter User ID"
            value={deptForm.userId}
            onChange={(v) => setDeptForm((p) => ({ ...p, userId: v }))}
          />

          <SelectField
            label="Department"
            value={deptForm.department}
            onChange={(v) => setDeptForm((p) => ({ ...p, department: v }))}
            options={DEPARTMENTS}
          />

          <PrimaryButton title="Update Department" />
        </form>
      </SettingsCard>

      {/* ----------------------------------------------- */}
      {/* CHANGE INCIDENT ASSIGNED DEPARTMENT (MANUAL) */}
      {/* ----------------------------------------------- */}
      <SettingsCard title="Reassign Incident Department (Manual)">
        <form onSubmit={handleIncidentDeptChange} className="space-y-4">

          <InputField
            label="Incident ID"
            placeholder="Enter Incident ID"
            value={incidentDeptForm.incidentId}
            onChange={(v) =>
              setIncidentDeptForm((p) => ({ ...p, incidentId: v }))
            }
          />

          <SelectField
            label="New Department"
            value={incidentDeptForm.newDept}
            onChange={(v) =>
              setIncidentDeptForm((p) => ({ ...p, newDept: v }))
            }
            options={DEPARTMENTS}
          />

          <PrimaryButton title="Change Department" />
        </form>
      </SettingsCard>

      {/* ----------------------------------------------- */}
      {/* UPDATE PASSWORD (COLLAPSIBLE) */}
      {/* ----------------------------------------------- */}

      <button
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#053B2C]"
        onClick={() => setShowPasswordCard((prev) => !prev)}
      >
        Update Password
      </button>

      {showPasswordCard && (
        <SettingsCard title="Update Password">
          <form onSubmit={handleUpdatePassword} className="space-y-4">

            <InputField
              type="password"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(v) =>
                setPasswordForm((p) => ({ ...p, currentPassword: v }))
              }
            />

            <InputField
              type="password"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(v) =>
                setPasswordForm((p) => ({ ...p, newPassword: v }))
              }
            />

            <InputField
              type="password"
              label="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={(v) =>
                setPasswordForm((p) => ({ ...p, confirmPassword: v }))
              }
            />

            <PrimaryButton title="Change Password" />
          </form>
        </SettingsCard>
      )}
    </div>
  );
};

// ---------------------------------------------------------
// REUSABLE COMPONENTS BELOW
// ---------------------------------------------------------

const SettingsCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4"
  >
    <h2 className="font-semibold text-primary text-lg">{title}</h2>
    {children}
  </motion.div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type={type}
      className="p-3 border rounded-lg focus:ring-2 focus:ring-primary mt-1"
      placeholder={placeholder || `Enter ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600">{label}</label>
    <select
      className="p-3 border rounded-lg focus:ring-2 focus:ring-primary mt-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const PrimaryButton = ({ title }) => (
  <button
    type="submit"
    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#053B2C] transition"
  >
    {title}
  </button>
);

export default AdminSettings;
