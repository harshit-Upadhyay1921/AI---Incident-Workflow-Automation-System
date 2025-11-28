import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    role: "",
    department: "",
    isActive: "",
    search: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 5,
  });

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    try {
      // REAL API:
      // const res = await axios.get("http://localhost:8000/api/v1/users", { params: filters, withCredentials: true });
      // setUsers(res.data.data.users);

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
            createdAt: "2025-01-12T10:00",
          },
          {
            _id: "2",
            name: "Aman",
            email: "aman@example.com",
            role: "support",
            department: "HR",
            isActive: false,
            createdAt: "2025-01-15T09:20",
          },
          {
            _id: "3",
            name: "Rohit",
            email: "rohit@example.com",
            role: "team_lead",
            department: "IT",
            isActive: true,
            createdAt: "2025-01-18T12:10",
          },
        ],
        totalPages: 3,
      };

      setUsers(dummyResponse.users);
      setTotalPages(dummyResponse.totalPages);
    } catch (error) {
      console.log("User Fetch Error:", error);
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

  return (
    <div className="space-y-10">

      {/* PAGE HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-primary"
      >
        Users Management
      </motion.h1>

      {/* ------------------ FILTERS ------------------ */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* ROLE */}
          <select
            className="p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
          >
            <option value="">Role (All)</option>
            <option value="employee">Employee</option>
            <option value="support">Support</option>
            <option value="senior_support">Senior Support</option>
            <option value="team_lead">Team Lead</option>
            <option value="admin">Admin</option>
          </select>

          {/* DEPARTMENT */}
          <select
            className="p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            value={filters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
          >
            <option value="">Department (All)</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
          </select>

          {/* ACTIVE STATUS */}
          <select
            className="p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            value={filters.isActive}
            onChange={(e) => handleFilterChange("isActive", e.target.value)}
          >
            <option value="">Account Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* SORT BY */}
          <select
            className="p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            <option value="createdAt">Created At</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>

          {/* ORDER */}
          <select
            className="p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            value={filters.order}
            onChange={(e) => handleFilterChange("order", e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by name or email…"
          className="w-full mt-4 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {/* ------------------ USERS TABLE ------------------ */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-semibold text-primary mb-4">Users</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Department</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr key={user._id} className="border-b text-gray-700">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2 capitalize">{user.role}</td>
                  <td className="py-2">{user.department}</td>

                  <td className="py-2">
                    {user.isActive ? (
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="py-2">{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ------------------ PAGINATION ------------------ */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg border ${
                filters.page === i + 1
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminUsers;
