import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/api.js"
import { MdMoreVert, MdFilterList } from "react-icons/md";
import ActionsMenu from "../../components/ActionsMenu";
import { useNavigate } from "react-router-dom";

const SupportMyAssigned = () => {
  const [incidents, setIncidents] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const navigate = useNavigate();
  // ------------------ FETCH INCIDENTS ------------------
  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        "/v1/users/getMyAssignIncidents",
        { params: filters, withCredentials: true }
      );
      setIncidents(res.data.data);
      
    } catch (err) {
      console.error("Assigned Fetch Error:", err);
      alert("Failed to fetch assigned incidents!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [filters]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: "bg-red-100 text-red-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-blue-100 text-blue-700",
    };
    return colors[priority] || "bg-gray-200 text-gray-700";
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-200 text-gray-700",
    };
    return colors[status] || "bg-gray-200 text-gray-700";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-4xl font-bold text-primary">My Assigned Incidents</h1>
        <p className="text-gray-600 text-sm">
          Here are the incidents assigned to you
        </p>
      </motion.div>

      {/* ---------------- FILTER BAR ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-2 mb-6">
          <MdFilterList className="text-primary text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* STATUS */}
          <Select
            label="Status"
            value={filters.status}
            onChange={(v) => handleFilter("status", v)}
            options={["open", "in-progress", "resolved", "closed"]}
          />

          {/* PRIORITY */}
          <Select
            label="Priority"
            value={filters.priority}
            onChange={(v) => handleFilter("priority", v)}
            options={["critical", "high", "medium", "low"]}
          />

        </div>
      </motion.div>

      {/* ---------------- TABLE ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-primary">Assigned Incidents</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {incidents.length} incidents
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600">Loading incidents...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Priority</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Created By</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Created At</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📭</span>
                        <p>No incidents found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  incidents.map((inc) => (
                    <tr key={inc._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <button onClick={() => navigate(`/incident/${inc._id}`)} className="font-medium text-gray-900 hover:underline text-left w-full">{inc.title}</button>
                      </td>

                      <td className="px-6 py-4 capitalize">{inc.category}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                            inc.priority
                          )}`}
                        >
                          {inc.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(
                            inc.status
                          )}`}
                        >
                          {inc.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {inc.createdBy?.name || inc.createdBy || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {formatDate(inc.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-center relative">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full transition"
                          onClick={() =>
                            setOpenMenu(openMenu === inc._id ? null : inc._id)
                          }
                        >
                          <MdMoreVert size={20} className="text-gray-600" />
                        </button>

                        {openMenu === inc._id && (
                          <ActionsMenu
                            incident={inc}
                            onClose={() => setOpenMenu(null)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SupportMyAssigned;

/* ---------------------- REUSABLE COMPONENTS ----------------------- */

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-500 mb-1">{label}</label>
    <select
      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All {label}</option>
      {options.map((op) => (
        <option key={op} value={op}>
          {op.charAt(0).toUpperCase() + op.slice(1)}
        </option>
      ))}
    </select>
  </div>
);
