import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import IncidentHistory from "../pages/IncidentHistory.jsx";

const ActionsMenu = ({ incident, onClose }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const role = currentUser?.role;

  const [showHistory, setShowHistory] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

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
  const isCreator =
    currentUser?._id?.toString() ===
    incident?.createdBy?._id?.toString() ||
    currentUser?._id?.toString() === incident?.createdBy?.toString();

  const isAssignee =
    currentUser?._id?.toString() ===
    incident?.assignedTo?._id?.toString();

  const canViewHistory =
    role === "admin" ||
    role === "team_lead" ||
    isCreator ||
    isAssignee;

  const canClose =
    role === "admin" || isCreator;

  const canReopen = role === "admin";

  // -------- ACTION HANDLERS --------
  // const viewHistory = () => {                        //no need to navigate
  //   navigate(`/incident/${incident._id}/history`);
  //   onClose();
  // };

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
            onClick={() => {
              setShowHistory(true);
              setSelectedIncidentId(incident._id);
            }}
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
      {showHistory && (
        <IncidentHistory
          incidentId={selectedIncidentId}
          onClose={() => setShowHistory(false)}
        />
      )}
    </motion.div>
  );
};

export default ActionsMenu;
