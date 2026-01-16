
import React, { useState } from "react";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  X,
  Shield,
  LogOut,
  User,
  Mail,
  Briefcase,
  Calendar,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const ProfileModal = ({ open, onClose }) => {
  const { currentUser, logout, setCurrentUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const res = await api.post(
        "/v1/users/updateAvatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert("Profile picture updated");
      window.location.reload(); // simplest + safe
    } catch (err) {
      console.error(err);
      alert("Failed to update avatar");
    } finally {
      setUploading(false);
    }
  };


  return (
    <AnimatePresence>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 font-outfit"
      >
        {/* MODAL */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border ring-1 ring-black/5"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-8 py-6 border-b bg-gray-50/50">
            <div>
              <h2 className="text-2xl font-bold text-[#064E3B]">Profile Settings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your personal information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-8 space-y-8 relative">
            {/* PROFILE HEADER */}
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="h-28 w-28 rounded-full p-1 border-2 border-dashed border-[#064E3B]/30">
                  <img
                    src={currentUser?.avatar || "../assets/avatar.jpg"}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <label className="absolute inset-1 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition">
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-[10px] text-white uppercase tracking-wide">
                      Edit
                    </span>
                    <input type="file" hidden onChange={handleAvatarChange} />
                  </label>
                </div>

                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                    <div className="animate-spin h-8 w-8 border-4 border-gray-200 border-t-[#064E3B] rounded-full" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {currentUser?.name}
                  </h3>
                  <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/20">
                    {currentUser?.role?.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Mail className="w-4 h-4" />
                  {currentUser?.email}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge icon={<Briefcase />} text={currentUser?.department} />
                  <Badge
                    icon={<Calendar />}
                    text={`Joined ${new Date(
                      currentUser?.createdAt
                    ).toLocaleDateString()}`}
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* ACCOUNT DETAILS */}
            <Section title="Account Details" icon={<User />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoCard
                  label="Department"
                  value={currentUser?.department}
                  icon={<Briefcase />}
                />
                <InfoCard
                  label="Account Status"
                  value={currentUser?.isActive ? "Active" : "Inactive"}
                  badge
                  isActive={currentUser?.isActive}
                  icon={<CheckCircle2 />}
                />
              </div>
            </Section>

            {/* SECURITY */}
            <Section title="Security & Session" icon={<Shield />}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border hover:bg-gray-50 font-semibold">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Change Password
                </button>

                <button
                  onClick={logout}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 hover:bg-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </Section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ---------- Helpers ---------- */

const Section = ({ title, icon, children }) => (
  <div>
    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h4>
    {children}
  </div>
);

const Badge = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border text-xs font-medium text-gray-600">
    {icon}
    {text}
  </div>
);

const InfoCard = ({ label, value, badge, isActive, icon }) => (
  <div className="bg-white rounded-xl border p-4 hover:border-[#064E3B]/30 transition">
    <p className="text-xs text-gray-500 font-semibold uppercase mb-2 flex items-center gap-2">
      {icon}
      {label}
    </p>
    {badge ? (
      <span
        className={`text-sm font-bold ${isActive ? "text-emerald-700" : "text-gray-600"
          }`}
      >
        {value}
      </span>
    ) : (
      <p className="text-base font-medium text-gray-900">{value}</p>
    )}
  </div>
);
export default ProfileModal