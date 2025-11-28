import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ActionsMenu = ({ incident, onClose }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const role = currentUser?.role;

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // -------- ROLE-BASED VISIBILITY --------
  const canViewHistory =
    role === "admin" ||
    role === "team_lead" ||
    currentUser?._id === incident.createdBy ||
    currentUser?._id === incident.assignedTo;

  const canClose =
    role === "admin" || currentUser?._id === incident.createdBy;
    
  const canReopen = role === "admin";

  // -------- ACTION HANDLERS --------
  const viewHistory = () => {
    navigate(`/incidents/${incident._id}/history`);
    onClose();
  };

  const closeIncident = async () => {
    // await axios.patch(`/api/incidents/${incident._id}/close`);
    alert("Close Incident API Placeholder");
    onClose();
  };

  const reopenIncident = async () => {
    // await axios.patch(`/api/incidents/${incident._id}/reopen`);
    alert("Reopen Incident API Placeholder");
    onClose();
  };

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-20"
    >
      <ul className="py-2 text-sm text-gray-700">

        {canViewHistory && (
          <li
            onClick={viewHistory}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            View History
          </li>
        )}

        {canClose && (
          <li
            onClick={closeIncident}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
          >
            Close Incident
          </li>
        )}

        {canReopen && (
          <li
            onClick={reopenIncident}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-green-600"
          >
            Reopen Incident
          </li>
        )}
      </ul>
    </motion.div>
  );
};

export default ActionsMenu;
