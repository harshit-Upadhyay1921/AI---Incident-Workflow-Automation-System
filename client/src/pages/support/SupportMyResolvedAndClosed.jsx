import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/api.js";
import { MdMoreVert } from "react-icons/md";
import ActionsMenu from "../../components/ActionsMenu.jsx";
import { useNavigate } from "react-router-dom";

const SupportMyResolvedAndClosed = () => {
  const [incidents, setIncidents] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // ---------------- FETCH RESOLVED/CLOSED INCIDENTS ----------------
  const fetchIncidents = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        "/v1/users/getMyResolveCloseIncidents",
        { withCredentials: true }
      );
      setIncidents(res.data.data);

    } catch (error) {
      console.error("Resolved/Closed Fetch Error:", error);
      alert("Failed to load resolved/closed incidents!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Format date
  const formatDate = (d) =>
    new Date(d).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Priority badge colors
  const getPriorityColor = (p) => {
    const map = {
      critical: "bg-red-100 text-red-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-blue-100 text-blue-700",
    };
    return map[p] || "bg-gray-100 text-gray-700";
  };

  // Status badge colors
  const getStatusColor = (s) => {
    const map = {
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-200 text-gray-700",
    };
    return map[s] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-primary">My Resolved & Closed Incidents</h1>
        <p className="text-gray-600">
          View incidents you have resolved or that were closed after assignment.
        </p>
      </motion.div>

      {/* SUMMARY */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-xl border shadow-sm"
      >
        <h2 className="text-lg font-semibold text-primary mb-1">
          My Resolved / Closed Incidents
        </h2>
        <p className="text-sm text-gray-500">
          These incidents were previously assigned to you and are now completed.
        </p>
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-primary">Resolved & Closed Incidents</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {incidents.length} incidents
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary mx-auto" />
              <p className="text-gray-600 mt-2">Loading incidents...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Created By</th>
                  <th className="px-6 py-4 font-semibold">Dept</th>
                  <th className="px-6 py-4 font-semibold">Created At</th>
                  <th className="px-6 py-4 font-semibold">Updated At</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl">📭</span>
                        <p>No resolved or closed incidents</p>
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
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            inc.status
                          )}`}
                        >
                          {inc.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">{inc.createdBy.name}</td>

                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {inc.assignedDept}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        {formatDate(inc.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        {formatDate(inc.updatedAt)}
                      </td>

                      <td className="px-6 py-4 text-center relative">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full"
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

export default SupportMyResolvedAndClosed;
