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
    // Fields to ignore (Mongoose metadata)
    const ignoreFields = ['_id', '__v', 'createdAt', 'updatedAt', 'timestamp'];

    // Fields that are ObjectIds - we need to handle them specially
    const objectIdFields = ['assignedTo', 'createdBy'];

    // Human-readable field labels
    const fieldLabels = {
      status: 'Status',
      priority: 'Priority',
      category: 'Category',
      assignedTo: 'Assigned To',
      assignedDept: 'Assigned Department',
      escalationLevel: 'Escalation Level',
      title: 'Title',
      description: 'Description',
      dueAt: 'Due Date',
      nextEscalationAt: 'Next Escalation',
      resolvedAt: 'Resolved At'
    };

    const keys = new Set([
      ...Object.keys(before || {}),
      ...Object.keys(after || {}),
    ]);

    const changes = [...keys]
      .filter(key => !ignoreFields.includes(key))
      .filter(key => {
        const beforeVal = before?.[key];
        const afterVal = after?.[key];

        // Handle ObjectIds
        if (objectIdFields.includes(key)) {
          const beforeStr = beforeVal?._id ? beforeVal._id.toString() : beforeVal?.toString() || null;
          const afterStr = afterVal?._id ? afterVal._id.toString() : afterVal?.toString() || null;
          return beforeStr !== afterStr;
        }

        // Handle dates
        if (beforeVal instanceof Date || afterVal instanceof Date) {
          const beforeDate = beforeVal ? new Date(beforeVal).toISOString() : null;
          const afterDate = afterVal ? new Date(afterVal).toISOString() : null;
          return beforeDate !== afterDate;
        }

        return beforeVal !== afterVal;
      });

    if (changes.length === 0) {
      return <div className="text-gray-500 text-xs italic">No changes</div>;
    }

    return (
      <div className="space-y-2">
        {changes.map((key) => {
          let beforeVal = before?.[key];
          let afterVal = after?.[key];

          // Format ObjectIds
          if (objectIdFields.includes(key)) {
            beforeVal = beforeVal?._id ? beforeVal._id.toString() : beforeVal?.toString() || null;
            afterVal = afterVal?._id ? afterVal._id.toString() : afterVal?.toString() || null;
          }

          // Format dates
          if (beforeVal instanceof Date || afterVal instanceof Date) {
            beforeVal = beforeVal ? new Date(beforeVal).toLocaleString() : null;
            afterVal = afterVal ? new Date(afterVal).toLocaleString() : null;
          }

          // Handle null/undefined
          beforeVal = beforeVal ?? "—";
          afterVal = afterVal ?? "—";

          return (
            <div key={key} className="text-xs border-l-2 border-primary/20 pl-2 py-1">
              <span className="font-medium text-gray-700">{fieldLabels[key] || key}:</span>
              <div className="mt-0.5">
                <span className="text-red-600 line-through mr-2">{String(beforeVal)}</span>
                <span className="text-green-700 font-medium">→ {String(afterVal)}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
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
                      {log.changedBy ? (
                        <>
                          {log.changedBy.name}
                          <div className="text-xs text-gray-500">{log.changedBy.role}</div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">System</span>
                      )}
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
