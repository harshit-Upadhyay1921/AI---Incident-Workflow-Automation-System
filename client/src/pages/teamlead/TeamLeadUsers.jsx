import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import axios from "axios";
import { MdSearch, MdFilterList, MdPeople } from "react-icons/md";

const TeamLeadUsers = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    role: "",
    department: "",
    isActive: "",
    search: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 10,
  });

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: Uncomment when connecting to backend
      // const res = await axios.get(
      //   "http://localhost:8000/api/v1/users/getAllUsers",
      //   { params: filters, withCredentials: true }
      // );
      // setUsers(res.data.data.users);
      // setTotalPages(res.data.data.totalPages);

      // ---- DUMMY DATA (matching backend schema) ----
      const dummyResponse = {
        users: [
          {
            _id: "1",
            name: "Harshit",
            email: "harshit@example.com",
            role: "employee",
            department: "IT",
            isActive: true,
            createdAt: "2025-01-12T10:00:00Z",
          },
          {
            _id: "2",
            name: "Aman",
            email: "aman@example.com",
            role: "support",
            department: "HR",
            isActive: false,
            createdAt: "2025-01-15T09:20:00Z",
          },
          {
            _id: "3",
            name: "Rohit",
            email: "rohit@example.com",
            role: "team_lead",
            department: "IT",
            isActive: true,
            createdAt: "2025-01-18T12:10:00Z",
          },
          {
            _id: "4",
            name: "Priya",
            email: "priya@example.com",
            role: "senior_support",
            department: "IT",
            isActive: true,
            createdAt: "2025-01-20T14:30:00Z",
          },
        ],
        totalPages: 3,
      };

      setUsers(dummyResponse.users);
      setTotalPages(dummyResponse.totalPages);
    } catch (error) {
      console.error("User Fetch Error:", error);
      alert("Failed to load users!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // ---------------- HANDLE FILTER CHANGE ----------------
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format role name
  const formatRole = (role) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-primary">Users Management</h1>
        <p className="text-gray-600">View and manage all users in your organization</p>
      </motion.div>

      {/* ------------------ FILTERS ------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <MdFilterList className="text-primary text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">Filters & Search</h2>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-4">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* ROLE */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="employee">Employee</option>
              <option value="support">Support</option>
              <option value="senior_support">Senior Support</option>
              <option value="team_lead">Team Lead</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* DEPARTMENT */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {/* ACTIVE STATUS */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Account Status</label>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
              value={filters.isActive}
              onChange={(e) => handleFilterChange("isActive", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* SORT BY */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="createdAt">Created At</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
          </div>

          {/* ORDER */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Order</label>
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
              value={filters.order}
              onChange={(e) => handleFilterChange("order", e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* ------------------ USERS TABLE ------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
              <MdPeople className="text-xl" />
              Users
            </h2>
            <p className="text-sm text-gray-500 mt-1">Total: {users.length} users</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Department</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">👥</span>
                        <p>No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {user.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ------------------ PAGINATION ------------------ */}
        {!loading && users.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      filters.page === pageNum
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
                disabled={filters.page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeamLeadUsers;
