import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/api.js";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#064E3B", "#0D765A", "#10A37F", "#14B08A"];

const SupportDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [priorityData, setPriorityData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // TODO: Uncomment when connecting to backend
        const res = await api.get(
          "/v1/users/getSupportDashboard",
          { withCredentials: true }
        );
        const data = res.data.data;
        
        setKpis(data.kpis);
        setPriorityData(data.byPriority);      // [{ name, value }]
        setCategoryData(data.byCategory);      // [{ name, value }]
        setTrendData(data.resolvedTrend);      // [{ week, count }]

      } catch (error) {
        console.error("Support Dashboard Error:", error);
        alert("Failed to load support dashboard data!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!kpis || !priorityData || !categoryData || !trendData) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">Support Dashboard</h1>
        <p className="text-gray-600">
          Workload overview and performance metrics for your assigned incidents.
        </p>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Assigned to Me" value={kpis.assignedToMe} accentClass="bg-primary" />
        <KpiCard title="In Progress" value={kpis.inProgress} accentClass="bg-yellow-500" />
        <KpiCard title="Resolved (Total)" value={kpis.resolved} accentClass="bg-green-500" />
        <KpiCard title="SLA Breached" value={kpis.slaBreached} accentClass="bg-red-500" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRIORITY PIE */}
        <ChartCard title="Incidents by Priority">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* CATEGORY BAR */}
        <ChartCard title="Incidents by Category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#064E3B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* RESOLVED TREND */}
        <ChartCard title="Resolved Incidents by Week">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10A37F"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* RECENT INCIDENTS TABLE (placeholder for now) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-primary mb-2">My Recent Assigned Incidents</h2>
        <p className="text-sm text-gray-500">
          You can connect this section later using <code>getMyAssignedIncidents</code> and sort by{" "}
          <code>createdAt</code> in descending order.
        </p>
      </motion.div>
    </div>
  );
};

/* ---------------- KPI CARD ---------------- */
const KpiCard = ({ title, value, accentClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between"
  >
    <div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>
    </div>
    <div className={`${accentClass} text-white rounded-full p-3 text-xs`} />
  </motion.div>
);

/* ---------------- GENERIC CHART CARD ---------------- */
const ChartCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
  >
    <h2 className="text-lg font-semibold text-primary mb-4">{title}</h2>
    {children}
  </motion.div>
);

export default SupportDashboard;


