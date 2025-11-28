import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
} from "recharts";

const COLORS = ["#064E3B", "#0D765A", "#10A37F"];

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [priorityCount, setPriorityCount] = useState(null);
  const [avgResolutionTime, setAvgResolutionTime] = useState(null);
  const [activeClosed, setActiveClosed] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // REAL API EXAMPLE:
        // const res = await axios.get("http://localhost:8000/api/v1/dashboard/overview", { withCredentials: true });
        // setOverview(res.data.data);

        // ------------------ DUMMY DATA (matches backend schema) ------------------
        const dummyOverview = {
          totalIncidents: 40,
          statusWiseCount: {
            open: 10,
            "in-progress": 8,
            resolved: 12,
            closed: 10,
          },
          categoryWiseCount: [
            { name: "software", value: 11 },
            { name: "hardware", value: 13 },
            { name: "network", value: 7 },
            { name: "other", value: 9 },
          ],
          departmentWiseCount: [
            { name: "IT", value: 22 },
            { name: "HR", value: 8 },
          ],
        };

        const dummyPriority = {
          critical: 6,
          high: 12,
          medium: 15,
          low: 7,
        };

        const dummyActiveClosed = {
          active: 18,
          closed: 22,
        };

        const dummyAvgResTime = 4.2;

        setOverview(dummyOverview);
        setPriorityCount(dummyPriority);
        setActiveClosed(dummyActiveClosed);
        setAvgResolutionTime(dummyAvgResTime);
      } catch (error) {
        console.log("Dashboard Error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!overview || !priorityCount || !activeClosed) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  }

  const priorityChartData = [
    { name: "critical", value: priorityCount.critical },
    { name: "high", value: priorityCount.high },
    { name: "medium", value: priorityCount.medium },
    { name: "low", value: priorityCount.low },
  ];

  return (
    <div className="space-y-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-primary"
      >
        Admin Dashboard
      </motion.h1>

      {/* ---------------- CARDS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Incidents" value={overview.totalIncidents} />
        <Card title="Open" value={overview.statusWiseCount.open} />
        <Card title="In Progress" value={overview.statusWiseCount["in-progress"]} />
        <Card title="Resolved" value={overview.statusWiseCount.resolved} />
        <Card title="Closed" value={overview.statusWiseCount.closed} />
        <Card title="Active" value={activeClosed.active} />
        <Card title="Closed (Overall)" value={activeClosed.closed} />
        <Card title="Avg Resolution Time" value={`${avgResolutionTime} hrs`} />
      </div>

      {/* ---------------- CHARTS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* PRIORITY PIE */}
        <ChartCard title="Incidents by Priority">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
              >
                {priorityChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* CATEGORY */}
        <ChartCard title="Incidents by Category">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={overview.categoryWiseCount}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#064E3B" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* DEPARTMENT */}
        <ChartCard title="Incidents by Department">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={overview.departmentWiseCount}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0D765A" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ---------------- RECENT INCIDENTS ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
      >
        <h2 className="font-semibold text-primary mb-4">Recent Incidents</h2>
        <div className="text-gray-500 text-sm">
          Connect later using: GET /incidents/recent
        </div>
      </motion.div>
    </div>
  );
};

/* ---------------- Reusable Card Component ---------------- */
const Card = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
  >
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-2xl font-semibold text-primary">{value}</p>
  </motion.div>
);

/* ---------------- Chart Wrapper ---------------- */
const ChartCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
  >
    <h2 className="font-semibold text-primary mb-4">{title}</h2>
    {children}
  </motion.div>
);

export default AdminDashboard;
