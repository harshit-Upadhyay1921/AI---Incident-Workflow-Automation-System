import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdPerson, MdLock, MdEmail, MdBusiness, MdAccountCircle } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

const EmployeeProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UPDATE PASSWORD
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.patch(
        "/v1/users/updatePassword",
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Password updated successfully!");
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordCard(false);
      }
    } catch (error) {
      console.error("Update Password Error:", error);
      alert(error.response?.data?.message || "Failed to update password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
          <MdPerson className="text-4xl" />
          My Profile
        </h1>
        <p className="text-gray-600">View and manage your profile information</p>
      </motion.div>

      {/* PROFILE INFORMATION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <MdAccountCircle className="text-4xl text-primary" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{currentUser?.name}</h2>
            <p className="text-gray-600 capitalize">{currentUser?.role?.replace("_", " ")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <MdEmail className="text-2xl text-primary" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{currentUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MdBusiness className="text-2xl text-primary" />
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-800">{currentUser?.department}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* UPDATE PASSWORD CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdLock className="text-2xl text-primary" />
            Change Password
          </h2>
          <button
            onClick={() => setShowPasswordCard(!showPasswordCard)}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            {showPasswordCard ? "Cancel" : "Update Password"}
          </button>
        </div>

        {showPasswordCard && (
          <form onSubmit={handleUpdatePassword} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default EmployeeProfile;

