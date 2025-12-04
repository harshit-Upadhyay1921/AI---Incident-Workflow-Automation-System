
import React, { useState } from "react";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fake login for now
    login({
      name: "team_lead",
      email: email,
      role: "support",  // important!
    });

    navigate("/support/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN PAGE */}
      <div className="flex flex-col lg:flex-row items-center justify-between mx-8 sm:mx-16 xl:mx-24 py-15 gap-16 flex-grow">
        {/* LEFT SIDE TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }} a
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-5xl font-bold text-primary my-10">IncidentIQ</h1>
          <h2 className="text-3xl sm:text-5xl font-bold text-primary leading-tight">
            Get Login to access <br /> IncidentIQ’s Automated ITSM
          </h2>

          <div className="space-y-2 text-gray-600 text-lg">
            <p>⚡ Smart automation for your enterprise</p>
            <p>⚙️ Auto handling of incidents</p>
            <p>🔗 Integrated webhooks for easier management</p>
          </div>
        </motion.div>

        {/* LOGIN FORM */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 max-w-md w-full"
        >
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-primary text-center">
              Login to Continue
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-[#053B2C] transition"
              >
                Login
              </button>
            </form>

            {/* SIGNUP LINK */}
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-primary font-semibold cursor-pointer hover:underline"
              >
                Create an account
              </span>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
