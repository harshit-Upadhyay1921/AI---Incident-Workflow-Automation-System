import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
// import axios from "axios"; // Uncomment when ready

// --- UTILITY ICONS (Inline to avoid external deps) ---
const Icons = {
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
  Clock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const STATUS_STEPS = ["open", "in-progress", "resolved", "closed"];

const IncidentDetails = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const [incident, setIncident] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle closing the modal window
  const handleClose = () => {
    // Navigate back to the previous page
    window.history.back();
  };

  const incidentId = window.location.pathname.split("/").pop();

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise((r) => setTimeout(r, 600));

        // DUMMY INCIDENT
        const dummyIncident = {
          _id: incidentId,
          title: "System Freeze on Login",
          description: "The system becomes unresponsive immediately after the user enters credentials on the main portal. This affects approximately 20% of users in the Marketing department.",
          category: "Software",
          priority: "critical", // critical, high, medium, low
          status: "in-progress", // Try changing this to test stepper
          createdBy: { name: "Harshit", email: "harshit@example.com", _id: "u101", role: "Employee" },
          assignedTo: { name: "Support Agent", email: "agent@support.com", _id: "u202" },
          assignedDept: "IT Operations",
          escalationLevel: 2,
          nextEscalationAt: "2025-01-28T10:00:00",
          dueAt: "2025-01-30T18:00:00",
          resolvedAt: null,
          createdAt: "2025-01-20T10:00:00",
          updatedAt: "2025-01-21T11:30:00",
        };

        // DUMMY HISTORY
        const dummyHistory = [
          { _id: "h1", action: "created", changedBy: { name: "Harshit", role: "employee" }, createdAt: "2025-01-20T10:00:00", note: "Incident reported via portal." },
          { _id: "h2", action: "assigned", changedBy: { name: "System", role: "admin" }, createdAt: "2025-01-20T10:01:00", note: "Auto-assigned to IT Operations." },
          { _id: "h3", action: "status_change", changedBy: { name: "Support Agent", role: "support" }, createdAt: "2025-01-21T09:00:00", note: "Changed status to In-Progress." },
        ];

        setIncident(dummyIncident);
        setHistory(dummyHistory);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [incidentId]);

  // -------- PERMISSIONS --------
  const canMarkInProgress = ["support", "senior_support"].includes(role);
  const canMarkResolved = ["support", "senior_support"].includes(role);
  const canClose = role === "admin" || currentUser?._id === incident?.createdBy?._id;
  const canReopen = role === "admin";

  if (loading) return null; // Or a spinner overlay

  return (
    <AnimatePresence>
      {/* 1. BACKDROP & OVERLAY WRAPPER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose} // Click outside to close
      >
        {/* 2. MAIN MODAL WINDOW */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-gray-50 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
          onClick={(e) => e.stopPropagation()} // Prevent close on modal click
        >
          
          {/* --- HEADER --- */}
          <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800">{incident.title}</h1>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getPriorityColor(incident.priority)}`}>
                  {incident.priority}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Ticket ID: <span className="font-mono text-gray-700">#{incident._id}</span>
              </p>
            </div>

            {/* HEADER ACTIONS (Professional Placement) */}
            <div className="flex items-center gap-3">
              {incident.status === "open" && canMarkInProgress && (
                <HeaderBtn label="Start Investigation" color="blue" onClick={() => console.log("Mark In Progress")} />
              )}
              {incident.status !== "resolved" && incident.status !== "closed" && canMarkResolved && (
                <HeaderBtn label="Resolve Incident" color="green" onClick={() => console.log("Mark Resolved")} />
              )}
              {incident.status === "resolved" && canClose && (
                <HeaderBtn label="Close Ticket" color="gray" onClick={() => console.log("Close")} />
              )}
              {incident.status === "closed" && canReopen && (
                <HeaderBtn label="Reopen" color="red" onClick={() => console.log("Reopen")} />
              )}
              
              <button 
                onClick={handleClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
              >
                <Icons.Close />
              </button>
            </div>
          </div>

          {/* --- SCROLLABLE BODY --- */}
          <div className="flex-1 overflow-y-auto p-8">
            
            {/* 1. PROFESSIONAL STATUS STEPPER */}
            <div className="mb-10">
              <StatusStepper currentStatus={incident.status} />
            </div>

            {/* 2. GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT COL (Main Info) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Description Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-800 rounded-full"></span>      
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {incident.description}
                  </p>
                </div>

                {/* History / Activity Log */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gray-600 rounded-full"></span>
                    Activity Log
                  </h3>
                  <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                    {history.map((h, i) => (
                      <div key={h._id} className="relative">
                        {/* Timeline Dot */}
                        <span className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-300 rounded-full border-2 border-white ring-1 ring-gray-100"></span>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                           <div>
                              <p className="text-sm font-semibold text-gray-800 capitalize">
                                {h.action.replace("_", " ")}
                              </p>
                              <p className="text-xs text-gray-500">
                                by <span className="font-medium text-gray-700">{h.changedBy.name}</span> ({h.changedBy.role})
                              </p>
                              {h.note && <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">{h.note}</p>}
                           </div>
                           <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(h.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COL (Sidebar Details) */}
              <div className="space-y-6">
                
                {/* People Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">People involved</h4>
                  
                  <div className="space-y-4">
                    <UserRow label="Reported By" user={incident.createdBy} />
                    <div className="h-px bg-gray-100"></div>
                    <UserRow label="Assigned To" user={incident.assignedTo} sub={incident.assignedDept} />
                  </div>
                </div>

                {/* SLA & Dates Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">SLA & Timing</h4>
                  
                  <div className="space-y-3">
                    <DateRow label="Created" date={incident.createdAt} />
                    <DateRow label="Last Updated" date={incident.updatedAt} />
                    <div className="h-px bg-gray-100 my-2"></div>
                    <DateRow label="Due Date" date={incident.dueAt} isRed={true} />
                    <div className="flex justify-between items-center text-sm mt-3">
                       <span className="text-gray-500">Escalation Lvl</span>
                       <span className="font-mono font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">L{incident.escalationLevel}</span>
                    </div>
                  </div>
                </div>

                 {/* Category Card */}
                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <span className="text-gray-500 text-sm font-medium">Category</span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg">
                      {incident.category}
                    </span>
                 </div>

              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncidentDetails;

/* ---------------------- SUB-COMPONENTS ---------------------- */

// 1. Sleek Stepper Component
const StatusStepper = ({ currentStatus }) => {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="w-full flex items-center justify-between relative px-4">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 translate-y-[-50%] rounded"></div>
      
      {/* Active Progress Line */}
      <div 
        className="absolute top-1/2 left-0 h-1 bg-emerald-750 -z-0 translate-y-[-50%] transition-all duration-500 rounded"
        style={{ width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
      ></div>

      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="relative z-10 flex flex-col items-center group cursor-default">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isCompleted ? "#064E3B" : "#e5e7eb", // Indigo-600 or Gray-200
                scale: isCurrent ? 1.2 : 1,
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300`}
            >
              {isCompleted ? (
                <span className="text-white"><Icons.Check /></span>
              ) : (
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              )}
            </motion.div>
            
            <div className={`absolute top-10 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isCompleted ? 'text-emerald-800' : 'text-gray-400'}`}>
              {step.replace("-", " ")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 2. Header Action Button
const HeaderBtn = ({ label, color, onClick }) => {
  const colors = {
    blue: "bg-indigo-600 hover:bg-indigo-700 text-white",
    green: "bg-emerald-600 hover:bg-emerald-700 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
    gray: "bg-gray-600 hover:bg-gray-700 text-white",
  };
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all transform active:scale-95 ${colors[color]}`}
    >
      {label}
    </button>
  );
};

// 3. User Row for Sidebar
const UserRow = ({ label, user, sub }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-bold text-sm">
      {user?.name?.charAt(0) || "?"}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
      {sub && <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">{sub}</span>}
    </div>
  </div>
);

// 4. Date Row for Sidebar
const DateRow = ({ label, date, isRed }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500 flex items-center gap-2">
      <span className="opacity-70"><Icons.Calendar /></span> {label}
    </span>
    <span className={`font-medium ${isRed ? "text-red-600" : "text-gray-700"}`}>
      {date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) : "-"}
    </span>
  </div>
);

// Helper for Priority Colors
const getPriorityColor = (p) => {
  switch (p) {
    case "critical": return "bg-red-100 text-red-700 border border-red-200";
    case "high": return "bg-orange-100 text-orange-700 border border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    default: return "bg-blue-100 text-blue-700 border border-blue-200";
  }
};