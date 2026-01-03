import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/api.js";
import { MdMoreVert, MdFilterList } from "react-icons/md";
import ActionsMenu from "../../components/ActionsMenu.jsx";
import { useNavigate } from "react-router-dom";

const AdminIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    createdBy: "",
    assignedTo: "",
    assignedDept: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 10,
  });
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // ----------------- FETCH INCIDENTS -------------------
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/incidents/getAllIncidents", {
        params: {
          status: filters.status,
          priority: filters.priority,
          category: filters.category,
          createdBy: filters.createdBy,
          assignedTo: filters.assignedTo,
          assignedDept: filters.assignedDept,
          sortBy: filters.sortBy,
          order: filters.order,
          page: filters.page,
          limit: filters.limit,
        },
      },
        { withCredentials: true }
      );
      const incidentsData = res.data.data;
      setIncidents(incidentsData.incidents);
      setTotalPages(incidentsData.totalPages);
    } catch (error) {
      console.error("Fetch Incidents Error:", error);
      alert("Failed to load incidents!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
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

  // Get priority badge color
  const getPriorityColor = (priority) => {
    const colors = {
      critical: "bg-red-100 text-red-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-blue-100 text-blue-700",
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-primary">Incidents Management</h1>
        <p className="text-gray-600">View and manage all incidents across the organization</p>
      </motion.div>

      {/* ---------------- FILTER BAR ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <MdFilterList className="text-primary text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

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

          {/* CATEGORY */}
          <Select
            label="Category"
            value={filters.category}
            onChange={(v) => handleFilter("category", v)}
            options={["software", "hardware", "network", "other"]}
          />

          {/* CREATED BY */}
          <Input
            label="Created By"
            value={filters.createdBy}
            onChange={(v) => handleFilter("createdBy", v)}
          />

          {/* ASSIGNED TO */}
          <Input
            label="Assigned To"
            value={filters.assignedTo}
            onChange={(v) => handleFilter("assignedTo", v)}
          />

          {/* ASSIGNED DEPT */}
          <Select
            label="Assigned Dept"
            value={filters.assignedDept}
            onChange={(v) => handleFilter("assignedDept", v)}
            options={["IT", "HR"]}
          />
        </div>

        {/* SORTING */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
          <Select
            label="Sort By"
            value={filters.sortBy}
            onChange={(v) => handleFilter("sortBy", v)}
            options={["createdAt", "updatedAt", "priority", "status"]}
          />

          <Select
            label="Order"
            value={filters.order}
            onChange={(v) => handleFilter("order", v)}
            options={["asc", "desc"]}
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
          <h2 className="text-lg font-semibold text-primary">All Incidents</h2>
          <p className="text-sm text-gray-500 mt-1">Total: {incidents.length} incidents</p>
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
                  <th className="px-6 py-4 font-semibold text-gray-700">Assigned To</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Dept</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Created At</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
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
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                          {inc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPriorityColor(inc.priority)}`}>
                          {inc.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(inc.status)}`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {typeof inc.createdBy === "object" ? inc.createdBy?.name : inc.createdBy}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {typeof inc.assignedTo === "object" ? inc.assignedTo?.name : inc.assignedTo}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {inc.assignedDept}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {formatDate(inc.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full transition"
                          onClick={() => setOpenMenu(openMenu === inc._id ? null : inc._id)}
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

        {/* PAGINATION */}
        {!loading && incidents.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <Pagination totalPages={totalPages} page={filters.page} onPage={handlePage} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminIncidents;

/* ---------------------- REUSABLE COMPONENTS ----------------------- */

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
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

const Input = ({ label, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Search ${label.toLowerCase()}...`}
    />
  </div>
);

const Pagination = ({ totalPages, page, onPage }) => (
  <div className="flex justify-center items-center gap-2">
    <button
      onClick={() => onPage(Math.max(1, page - 1))}
      disabled={page === 1}
      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Previous
    </button>
    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
      const pageNum = i + 1;
      return (
        <button
          key={pageNum}
          onClick={() => onPage(pageNum)}
          className={`px-4 py-2 rounded-lg border transition ${page === pageNum
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
        >
          {pageNum}
        </button>
      );
    })}
    <button
      onClick={() => onPage(Math.min(totalPages, page + 1))}
      disabled={page === totalPages}
      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Next
    </button>
  </div>
);
