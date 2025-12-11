import React, { useState } from "react";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("IT");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/v1/auth/register", {
        name,
        email,
        role,
        department,
        password
      });

      const user = res.data.data;

      login(user);

      if (user.role === "employee") {
        navigate("/employee/my-incidents");
      }else if(user.role === "senior_support"){
        navigate("/support/dashboard");
      }
      else {
        navigate(`/${user.role}/dashboard`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Somethin went wrong!");
    }

  }
  return (
    <div className="min-h-screen flex flex-col">

      {/* MAIN WRAPPER */}
      <div className="flex flex-col lg:flex-row flex-grow">

        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 bg-primary text-white px-10 sm:px-16 xl:px-24 py-16 space-y-10"
        >
          <h1 className="text-5xl font-bold">IncidentIQ</h1>

          <h2 className="text-3xl font-semibold">
            Create your IncidentIQ account
          </h2>

          <div className="space-y-4 text-lg text-gray-100">
            <p>• Establish your unified identity inside the IncidentIQ ecosystem</p>
            <p>• Get personalized automation based on your organization’s needs</p>
            <p>• Access dashboards, workflows, and integrations in one place</p>
            <p>• Manage incidents, escalations, and SLAs effortlessly</p>
          </div>

          <p className="text-gray-200 text-sm">
            Need help? <span className="text-white underline cursor-pointer">Contact us</span>
          </p>
        </motion.div>

        {/* RIGHT PANEL (FORM) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 flex justify-center items-start py-16 px-6 sm:px-10 xl:px-20 bg-gray-50"
        >
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">

            <h2 className="text-2xl font-semibold text-primary">
              Sign up for an IncidentIQ account
            </h2>

            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary font-semibold cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* ROLE */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter your role (e.g., Employee, Manager)"
                  className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* DEPARTMENT */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department (e.g., IT, HR)"
                  className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-[#053B2C] transition"
              >
                Create Account
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
