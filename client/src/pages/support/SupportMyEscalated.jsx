import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import axios from "axios";
import { MdMoreVert, MdFilterList } from "react-icons/md";
import ActionsMenu from "../../components/ActionsMenu.jsx";
import { useNavigate } from "react-router-dom";

const SupportMyEscalated = () => {
    const [incidents, setIncidents] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // No pagination needed—your controller returns ALL escalated or breached incidents
    const fetchIncidents = async () => {
        setLoading(true);

        try {
            // const res = await axios.get(
            //   "http://localhost:8000/api/v1/incidents/getMyEscalatedOrSlaBreached",
            //   { withCredentials: true }
            // );
            // setIncidents(res.data.data);

            // ------------------ DUMMY (Matches backend schema) ------------------
            const dummy = [
                {
                    _id: "201",
                    title: "Server CPU usage 95%",
                    category: "software",
                    priority: "critical",
                    status: "in-progress",
                    createdBy: { name: "Harshit", email: "harshit@example.com" },
                    assignedDept: "IT",
                    createdAt: "2025-01-25T09:20:00Z",
                    escalationLevel: 2,
                    dueAt: "2025-01-27T10:00:00Z",
                },
                {
                    _id: "202",
                    title: "Payroll system freeze",
                    category: "hardware",
                    priority: "high",
                    status: "open",
                    createdBy: { name: "Aman", email: "aman@example.com" },
                    assignedDept: "HR",
                    createdAt: "2025-01-24T11:10:00Z",
                    escalationLevel: 1,
                    dueAt: "2025-01-26T08:00:00Z",
                },
            ];

            setIncidents(dummy);
        } catch (error) {
            console.error("My Escalated Fetch Error:", error);
            alert("Failed to load escalated incidents!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    // Format date nicely
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
            open: "bg-blue-100 text-blue-700",
            "in-progress": "bg-yellow-100 text-yellow-700",
            resolved: "bg-green-100 text-green-700",
            closed: "bg-gray-100 text-gray-700",
        };
        return map[s] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">

            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <h1 className="text-4xl font-bold text-primary">My Escalated / SLA Breached</h1>
                <p className="text-gray-600">
                    These incidents require your urgent attention based on escalation rules or SLA deadlines.
                </p>
            </motion.div>

            {/* SUMMARY CARD */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-xl border shadow-sm"
            >
                <h2 className="text-lg font-semibold text-primary mb-1">My Escalated Incidents</h2>
                <p className="text-sm text-gray-500">
                    These incidents have either escalated above your support level or have breached their SLA deadlines.
                </p>
            </motion.div>

            {/* TABLE */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-primary">Escalated Incidents</h2>
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
                                    <th className="px-6 py-4 font-semibold">Escalation Level</th>
                                    <th className="px-6 py-4 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {incidents.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <span className="text-4xl">📭</span>
                                                <p>No escalated or breached incidents</p>
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
                                                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(inc.priority)}`}>
                                                    {inc.priority}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(inc.status)}`}>
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

                                            <td className="px-6 py-4 text-center font-semibold text-red-600">
                                                {inc.escalationLevel}
                                            </td>

                                            <td className="px-6 py-4 text-center relative">
                                                <button
                                                    className="p-2 hover:bg-gray-100 rounded-full"
                                                    onClick={() => setOpenMenu(openMenu === inc._id ? null : inc._id)}
                                                >
                                                    <MdMoreVert size={20} className="text-gray-600" />
                                                </button>

                                                {openMenu === inc._id && (
                                                    <ActionsMenu incident={inc} onClose={() => setOpenMenu(null)} />
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

export default SupportMyEscalated;
