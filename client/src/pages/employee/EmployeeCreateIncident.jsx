import React, { useState } from "react";
import { motion } from "framer-motion";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Departments available in the organization.
// Keep this in sync with backend enums and admin settings.
const DEPARTMENTS = ["IT", "HR"];

const EmployeeCreateIncident = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  // Initialize autoData with empty values so fields are visible from start
  const [autoData, setAutoData] = useState({
    category: "",
    priority: "",
    status: "",
    assignedDept: currentUser?.department || "",
    assignedTo: "",
    dueAt: "",
    nextEscalationAt: "",
  });

  // Optional manual override for assigned department (used by employee or team lead).
  // This will be applied AFTER creation using the changeAssignDeptManual controller.
  const [manualDept, setManualDept] = useState("");
  const [showManualDept, setShowManualDept] = useState(false);

  const [loadingAuto, setLoadingAuto] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  // --------------------- AUTO CLASSIFY ---------------------
  const handleAutoClassify = async () => {
    if (!form.title || !form.description) {
      alert("Please fill Title and Description first!");
      return;
    }

    setLoadingAuto(true);

    try {
      // TODO: Uncomment when backend preview endpoint is ready
      // const res = await axios.post(
      //   "http://localhost:8000/api/v1/incidents/classify-preview",
      //   { title: form.title, description: form.description },
      //   { withCredentials: true }
      // );
      // const previewData = res.data.data;
      // setAutoData({
      //   category: previewData.category,
      //   priority: previewData.priority,
      //   status: previewData.status || "open",
      //   assignedDept: previewData.assignedDept || currentUser?.department,
      //   assignedTo: previewData.assignedTo,
      //   dueAt: previewData.dueAt,
      //   nextEscalationAt: previewData.nextEscalationAt,
      // });

      // ------------------ DUMMY AUTOMATION DATA (for testing) ------------------
      const dummyAutomation = {
        category: "software",
        priority: "high",
        status: "open",
        assignedDept: currentUser?.department || "IT",
        assignedTo: "support-user-1",
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextEscalationAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      };

      setAutoData(dummyAutomation);

    } catch (err) {
      console.error("Auto Classify Error:", err);
      alert("Error in auto classification!");
    }

    setLoadingAuto(false);
  };

  // --------------------- CREATE INCIDENT ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Please fill all required fields!");
      return;
    }

    if (!autoData.category || !autoData.priority) {
      alert("Please run Auto Classify first!");
      return;
    }

    setLoadingCreate(true);

    try {
      // TODO: Uncomment when connecting to backend
      // const res = await axios.post(
      //   "http://localhost:8000/api/v1/incidents/createIncident",
      //   {
      //     title: form.title,
      //     description: form.description,
      //   },
      //   { withCredentials: true }
      // );
      //
      // const createdIncident = res.data.data;
      //
      // // Optional manual department override using changeAssignDeptManual controller.
      // // Backend will also recalculate assignedTo for the new department.
      // if (manualDept && manualDept !== createdIncident.assignedDept) {
      //   await axios.post(
      //     `http://localhost:8000/api/v1/incidents/changeAssignDeptManual/${createdIncident._id}`,
      //     { newDept: manualDept },
      //     { withCredentials: true }
      //   );
      // }
      //
      // alert("Incident created successfully!");
      // navigate("../incidents");

      // Dummy success for now
      alert("Incident Created Successfully! (dummy)");
      navigate("../incidents");

    } catch (err) {
      console.error("Create Incident Error:", err);
      alert(err.response?.data?.message || "Error creating incident!");
    }

    setLoadingCreate(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
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
        <h1 className="text-4xl font-bold text-primary">Create New Incident</h1>
        <p className="text-gray-600">Fill in the details below to create and auto-classify your incident</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MAIN FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6"
        >
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Incident Details</h2>
            <p className="text-sm text-gray-500 mt-1">Provide basic information about the incident</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TITLE */}
            <div className="lg:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter a brief summary of the issue"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="lg:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition h-40 resize-none"
                placeholder="Describe the issue in detail. Include any error messages, steps to reproduce, or relevant context."
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* AUTO CLASSIFY BUTTON */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              disabled={loadingAuto || !form.title || !form.description}
              onClick={handleAutoClassify}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-[#053B2C] disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-sm flex items-center gap-2"
            >
              {loadingAuto ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>🤖</span>
                  <span>Auto Classify Incident</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-500">
              AI will automatically classify and assign this incident
            </p>
          </div>
        </motion.div>

        {/* AUTO-GENERATED FIELDS SECTION - Always Visible */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6"
        >
          <div className="flex flex-col gap-3 border-b border-gray-300 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span>⚙️</span>
                <span>Auto-Generated Information</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                These fields are computed automatically from your incident details.
              </p>
            </div>

            {/* Manual Assigned Department Override */}
            <div className="flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={() => setShowManualDept((prev) => !prev)}
                className="px-4 py-2 text-sm border border-primary/40 text-primary rounded-lg bg-white hover:bg-primary/5 transition font-medium"
              >
                {showManualDept ? "Hide Manual Selection" : "Change Assigned Department"}
              </button>
              {showManualDept && (
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-xs font-medium text-gray-600">
                    Select Department for Assignment
                  </label>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    value={manualDept || autoData.assignedDept}
                    onChange={(e) => setManualDept(e.target.value)}
                  >
                    <option value="">Use my department ({currentUser?.department || "N/A"})</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500">
                    Final agent assignment will be recalculated automatically by the backend.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AutoField
              label="Category"
              value={autoData.category}
              icon="📁"
              isEmpty={!autoData.category}
            />
            <AutoField
              label="Priority"
              value={autoData.priority}
              icon="⚡"
              isEmpty={!autoData.priority}
            />
            <AutoField
              label="Status"
              value={autoData.status}
              icon="📊"
              isEmpty={!autoData.status}
            />
            <AutoField
              label="Assigned Department"
              value={manualDept || autoData.assignedDept}
              icon="🏢"
              isEmpty={!(manualDept || autoData.assignedDept)}
            />
            <AutoField
              label="Assigned To"
              value={autoData.assignedTo}
              icon="👤"
              isEmpty={!autoData.assignedTo}
            />
            <AutoField
              label="Due Date"
              value={formatDate(autoData.dueAt)}
              icon="📅"
              isEmpty={!autoData.dueAt}
            />
            <AutoField
              label="Next Escalation"
              value={formatDate(autoData.nextEscalationAt)}
              icon="⏰"
              isEmpty={!autoData.nextEscalationAt}
              className="lg:col-span-3"
            />
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-end gap-4 pt-4"
        >
          <button
            type="button"
            onClick={() => navigate("../incidents")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loadingCreate || !autoData.category || !autoData.priority}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-[#053B2C] transition font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingCreate ? "Creating Incident..." : "Create Incident"}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

/* ------------------------- AUTO FIELD COMPONENT ------------------------- */
const AutoField = ({ label, value, icon, isEmpty, className = "" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
        <span>{icon}</span>
        <span>{label}</span>
      </label>
      <div
        className={`px-4 py-3 rounded-lg border transition ${
          isEmpty
            ? "bg-white border-gray-200 text-gray-400"
            : "bg-white border-primary/30 text-gray-800 font-medium shadow-sm"
        }`}
      >
        {isEmpty ? (
          <span className="italic">Not classified yet</span>
        ) : (
          <span className="capitalize">{value}</span>
        )}
      </div>
    </div>
  );
};

export default EmployeeCreateIncident;
