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
  Legend,
} from "recharts";

const COLORS = ["#064E3B", "#0D765A", "#10A37F", "#14B08A"];

const TeamLeadDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [priorityCount, setPriorityCount] = useState(null);
  const [avgResolutionTime, setAvgResolutionTime] = useState(null);
  const [activeClosed, setActiveClosed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // TODO: Uncomment when connecting to backend
        const [overviewRes, priorityRes, avgTimeRes, activeClosedRes] = await Promise.all([
          api.get("/v1/users/getOverview", { withCredentials: true }),
          api.get("/v1/users/getCountPriority", { withCredentials: true }),
          api.get("/v1/users/getAvgResolutionTime", { withCredentials: true }),
          api.get("/v1/users/getActiveCloseIncidents", { withCredentials: true }),
        ]);
        
        const overviewData = overviewRes.data.data;
        setOverview({
          totalIncidents: overviewData.totalIncidents,
          statusWiseCount: {
            open: overviewData.byStatus.open,
            "in-progress": overviewData.byStatus.inProgress,
            resolved: overviewData.byStatus.resolved,
            closed: overviewData.byStatus.closed,
          },
          categoryWiseCount: Object.entries(overviewData.byCategory).map(([name, value]) => ({ name, value })),
          departmentWiseCount: Object.entries(overviewData.byDepartment).map(([name, value]) => ({ name, value })),
        });
        setPriorityCount(priorityRes.data.data);
        setAvgResolutionTime(avgTimeRes.data.data);
        setActiveClosed(activeClosedRes.data.data);
        
      } catch (error) {
        console.error("Dashboard Error:", error);
        alert("Failed to load dashboard data!");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!overview || !priorityCount || !activeClosed) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>No data available</p>
      </div>
    );
  }

  const priorityChartData = [
    { name: "Critical", value: priorityCount.critical },
    { name: "High", value: priorityCount.high },
    { name: "Medium", value: priorityCount.medium },
    { name: "Low", value: priorityCount.low },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">Team Lead Dashboard</h1>
        <p className="text-gray-600">Overview of incidents and team performance</p>
      </motion.div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Incidents"
          value={overview.totalIncidents}
          color="bg-primary"
        />
        <StatCard
          title="Open"
          value={overview.statusWiseCount.open}
          color="bg-blue-500"
        />
        <StatCard
          title="In Progress"
          value={overview.statusWiseCount["in-progress"]}
          color="bg-yellow-500"
        />
        <StatCard
          title="Resolved"
          value={overview.statusWiseCount.resolved}
          color="bg-green-500"
        />
        <StatCard
          title="Closed"
          value={overview.statusWiseCount.closed}
          color="bg-gray-500"
        />
        <StatCard
          title="Active"
          value={activeClosed.active}
          color="bg-emerald-500"
        />
        <StatCard
          title="Closed (Overall)"
          value={activeClosed.closed}
          color="bg-slate-500"
        />
        <StatCard
          title="Avg Resolution Time"
          value={`${avgResolutionTime?.toFixed(1) || 0} hrs`}
          color="bg-purple-500"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRIORITY PIE CHART */}
        <ChartCard title="Incidents by Priority">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={priorityChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
              >
                {priorityChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* CATEGORY BAR CHART */}
        <ChartCard title="Incidents by Category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={overview.categoryWiseCount}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#064E3B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* DEPARTMENT BAR CHART */}
        <ChartCard title="Incidents by Department">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={overview.departmentWiseCount}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0D765A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

/* ---------------- STAT CARD COMPONENT ---------------- */
const StatCard = ({ title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
      </div>
      <div className={`${color} text-white rounded-full p-3 text-xs`} />
    </div>
  </motion.div>
);

/* ---------------- CHART CARD COMPONENT ---------------- */
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

export default TeamLeadDashboard;
