import React, { useState } from "react";
import { motion } from "framer-motion";
// import axios from "axios";
import { MdSettings, MdLock, MdPerson, MdBusiness, MdAssignment } from "react-icons/md";

const ROLES = ["employee", "support", "senior_support", "team_lead", "admin"];
const DEPARTMENTS = ["IT", "HR"];

const AdminSettings = () => {
  const [loading, setLoading] = useState({
    role: false,
    dept: false,
    incidentDept: false,
    password: false,
  });
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
    setLoading((prev) => ({ ...prev, role: true }));

    try {
      // TODO: Uncomment when connecting to backend
      // const res = await axios.patch(
      //   `http://localhost:8000/api/v1/users/changeRole/${roleForm.userId}`,
      //   { role: roleForm.newRole },
      //   { withCredentials: true }
      // );
      // if (res.data.success) {
      //   alert("User role updated successfully!");
      //   setRoleForm({ userId: "", newRole: "" });
      // }

      alert("Change Role API placeholder hit");
      setRoleForm({ userId: "", newRole: "" });
    } catch (error) {
      console.error("Change Role Error:", error);
      alert(error.response?.data?.message || "Failed to update role!");
    } finally {
      setLoading((prev) => ({ ...prev, role: false }));
    }
  };

  // ASSIGN / CHANGE USER DEPARTMENT
  const handleAssignDept = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, dept: true }));

    try {
      // TODO: Uncomment when connecting to backend
      // const res = await axios.patch(
      //   `http://localhost:8000/api/v1/users/assignDepartment/${deptForm.userId}`,
      //   { department: deptForm.department },
      //   { withCredentials: true }
      // );
      // if (res.data.success) {
      //   alert("Department assigned successfully!");
      //   setDeptForm({ userId: "", department: "" });
      // }

      alert("Assign Department API placeholder hit");
      setDeptForm({ userId: "", department: "" });
    } catch (error) {
      console.error("Assign Department Error:", error);
      alert(error.response?.data?.message || "Failed to assign department!");
    } finally {
      setLoading((prev) => ({ ...prev, dept: false }));
    }
  };

  // MANUAL INCIDENT DEPARTMENT CHANGE
  const handleIncidentDeptChange = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, incidentDept: true }));

    try {
      // TODO: Uncomment when connecting to backend
      // const res = await axios.post(
      //   `http://localhost:8000/api/v1/incidents/changeAssignDeptManual/${incidentDeptForm.incidentId}`,
      //   { newDept: incidentDeptForm.newDept },
      //   { withCredentials: true }
      // );
      // if (res.data.success) {
      //   alert("Incident department changed successfully!");
      //   setIncidentDeptForm({ incidentId: "", newDept: "" });
      // }

      alert("Change Incident Department API placeholder hit");
      setIncidentDeptForm({ incidentId: "", newDept: "" });
    } catch (error) {
      console.error("Change Incident Department Error:", error);
      alert(error.response?.data?.message || "Failed to change incident department!");
    } finally {
      setLoading((prev) => ({ ...prev, incidentDept: false }));
    }
  };

  // UPDATE PASSWORD
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password & confirm password mismatch");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));

    try {
      // TODO: Uncomment when connecting to backend
      // const res = await axios.post(
      //   "http://localhost:8000/api/v1/users/updatePassword",
      //   {
      //     currentPassword: passwordForm.currentPassword,
      //     newPassword: passwordForm.newPassword,
      //   },
      //   { withCredentials: true }
      // );
      // if (res.data.success) {
      //   alert("Password updated successfully!");
      //   setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      //   setShowPasswordCard(false);
      // }

      alert("Password Update API placeholder hit");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordCard(false);
    } catch (error) {
      console.error("Update Password Error:", error);
      alert(error.response?.data?.message || "Failed to update password!");
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <MdSettings className="text-4xl" />
          Admin Settings
        </h1>
        <p className="text-gray-600">Manage user roles, departments, incidents, and account settings</p>
      </motion.div>

      {/* ----------------------------------------------- */}
      {/* CHANGE USER ROLE */}
      {/* ----------------------------------------------- */}
      <SettingsCard
        title="Change User Role"
        icon={<MdPerson className="text-xl" />}
        description="Update a user's role in the system"
      >
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

          <PrimaryButton title="Update Role" loading={loading.role} />
        </form>
      </SettingsCard>

      {/* ----------------------------------------------- */}
      {/* ASSIGN USER DEPARTMENT */}
      {/* ----------------------------------------------- */}
      <SettingsCard
        title="Assign / Change User Department"
        icon={<MdBusiness className="text-xl" />}
        description="Assign or change a user's department"
      >
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

          <PrimaryButton title="Update Department" loading={loading.dept} />
        </form>
      </SettingsCard>

      {/* ----------------------------------------------- */}
      {/* CHANGE INCIDENT ASSIGNED DEPARTMENT (MANUAL) */}
      {/* ----------------------------------------------- */}
      <SettingsCard
        title="Reassign Incident Department (Manual)"
        icon={<MdAssignment className="text-xl" />}
        description="Manually change the assigned department for an incident"
      >
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

          <PrimaryButton title="Change Department" loading={loading.incidentDept} />
        </form>
      </SettingsCard>

      {/* ----------------------------------------------- */}
      {/* UPDATE PASSWORD (COLLAPSIBLE) */}
      {/* ----------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          className="w-full px-6 py-4 bg-primary text-white rounded-xl hover:bg-[#053B2C] transition font-medium shadow-sm flex items-center justify-center gap-2"
          onClick={() => setShowPasswordCard((prev) => !prev)}
        >
          <MdLock className="text-xl" />
          <span>{showPasswordCard ? "Hide Password Update" : "Update Password"}</span>
        </button>

        {showPasswordCard && (
          <SettingsCard
            title="Update Password"
            icon={<MdLock className="text-xl" />}
            description="Change your account password"
          >
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <InputField
                type="password"
                label="Current Password"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(v) =>
                  setPasswordForm((p) => ({ ...p, currentPassword: v }))
                }
              />

              <InputField
                type="password"
                label="New Password"
                placeholder="Enter new password (min 6 characters)"
                value={passwordForm.newPassword}
                onChange={(v) =>
                  setPasswordForm((p) => ({ ...p, newPassword: v }))
                }
              />

              <InputField
                type="password"
                label="Confirm Password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(v) =>
                  setPasswordForm((p) => ({ ...p, confirmPassword: v }))
                }
              />

              <PrimaryButton title="Change Password" loading={loading.password} />
            </form>
          </SettingsCard>
        )}
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------
// REUSABLE COMPONENTS BELOW
// ---------------------------------------------------------

const SettingsCard = ({ title, icon, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
  >
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h2 className="font-semibold text-primary text-xl">{title}</h2>
      </div>
      {description && (
        <p className="text-sm text-gray-500 ml-8">{description}</p>
      )}
    </div>
    {children}
  </motion.div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
      placeholder={placeholder || `Enter ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
        </option>
      ))}
    </select>
  </div>
);

const PrimaryButton = ({ title, loading = false }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-[#053B2C] transition font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
    <span>{title}</span>
  </button>
);

export default AdminSettings;
