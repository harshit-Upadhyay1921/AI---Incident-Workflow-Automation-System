import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/api.js";

const IncidentHistory = ({ incidentId, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/v1/incidents/getIncidentHistory/${incidentId}`,
          { withCredentials: true }
        );
        setHistory(res.data.data);

      } catch {
        alert("Failed to load incident history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [incidentId]);

  const formatDate = (d) =>
    new Date(d).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const renderDiff = (before = {}, after = {}) => {
    const keys = new Set([
      ...Object.keys(before || {}),
      ...Object.keys(after || {}),
    ]);

    return [...keys]
      .filter((key) => before?.[key] !== after?.[key])
      .map((key) => (
        <div key={key} className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-gray-400 font-medium">{key}</div>
          <div className="text-red-600">
            {before?.[key] ?? "—"}
          </div>
          <div className="text-green-700 font-medium">
            {after?.[key] ?? "—"}
          </div>
        </div>
      ));
  };


  return (
    /* ---------- BACKDROP ---------- */
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      {/* ---------- MODAL ---------- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-6 max-h-[85vh] overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Incident History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Changed By</th>
                  <th className="px-4 py-3 text-left">Before → After</th>
                  <th className="px-4 py-3 text-left">Time</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {history.map((log) => (
                  <tr key={log._id}>
                    <td className="px-4 py-3 capitalize font-medium">
                      {log.action}
                    </td>

                    <td className="px-4 py-3">
                      {log.changedBy.name}
                      <div className="text-xs text-gray-500">
                        {log.changedBy.role}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                        {renderDiff(log.before, log.after)}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-600">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default IncidentHistory;
