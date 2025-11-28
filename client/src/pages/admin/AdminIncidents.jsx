import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdMoreVert } from "react-icons/md";
import ActionsMenu from "../../components/ActionsMenu.jsx";

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

  // ----------------- DUMMY DATA (Matches backend schema) -------------------
  const fetchIncidents = async () => {
    // Replace this later:
    // const res = await axios.get("http://localhost:8000/api/v1/incidents", { params: filters, withCredentials: true });
    // setIncidents(res.data.data.incidents);

    const dummy = {
      incidents: [
        {
          _id: "101",
          title: "System freeze on login",
          category: "software",
          priority: "critical",
          status: "open",
          createdBy: "harshit",
          assignedTo: "support",
          assignedDept: "IT",
          createdAt: "2025-01-20T10:00",
          updatedAt: "2025-01-21T12:00",
        },
        {
          _id: "102",
          title: "VPN not connecting",
          category: "network",
          priority: "high",
          status: "in-progress",
          createdBy: "aman",
          assignedTo: "senior_support",
          assignedDept: "HR",
          createdAt: "2025-01-22T09:20",
          updatedAt: "2025-01-23T14:05",
        },
      ],
      totalPages: 6,
    };

    setIncidents(dummy.incidents);
    setTotalPages(dummy.totalPages);
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

  return (
    <div className="space-y-10">

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-primary"
      >
        Incidents
      </motion.h1>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="font-semibold text-primary mb-4">All Incidents</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">Title</th>
                <th className="py-3">Category</th>
                <th className="py-3">Priority</th>
                <th className="py-3">Status</th>
                <th className="py-3">Created By</th>
                <th className="py-3">Assigned To</th>
                <th className="py-3">Dept</th>
                <th className="py-3">Created At</th>
                <th className="py-3">Updated At</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500">
                    No incidents found
                  </td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc._id} className="border-b text-gray-700">
                    <td className="py-3">{inc.title}</td>
                    <td className="py-3">{inc.category}</td>
                    <td className="py-3">{inc.priority}</td>
                    <td className="py-3">{inc.status}</td>
                    <td className="py-3">{inc.createdBy}</td>
                    <td className="py-3">{inc.assignedTo}</td>
                    <td className="py-3">{inc.assignedDept}</td>
                    <td className="py-3">{inc.createdAt}</td>
                    <td className="py-3">{inc.updatedAt}</td>
                    <td className="py-3 text-center relative">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => setOpenMenu(openMenu === inc._id ? null : inc._id)}
                      >
                        <MdMoreVert size={20} />
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

        {/* PAGINATION */}
        <Pagination totalPages={totalPages} page={filters.page} onPage={handlePage} />
      </div>
    </div>
  );
};

export default AdminIncidents;

/* ---------------------- REUSABLE COMPONENTS ----------------------- */

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <select
      className="p-3 border rounded-lg focus:ring-2 focus:ring-primary mt-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{label} (All)</option>
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      className="p-3 border rounded-lg focus:ring-2 focus:ring-primary mt-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label}`}
    />
  </div>
);

const Pagination = ({ totalPages, page, onPage }) => (
  <div className="flex justify-center mt-6 gap-2">
    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => onPage(i + 1)}
        className={`px-4 py-2 rounded-lg border ${page === i + 1 ? "bg-primary text-white" : "bg-white text-gray-700"
          }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
);
