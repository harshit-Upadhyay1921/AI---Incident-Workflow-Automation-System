// // import React, { useRef, useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import api from "../api/api";
// // import { useAuth } from "../context/AuthContext";

// // const ProfileModal = ({ isOpen, onClose }) => {
// //   const { currentUser, logout } = useAuth();
// //   const fileRef = useRef(null);
// //   const [uploading, setUploading] = useState(false);

// //   if (!isOpen) return null;

// //   // ---------------- AVATAR UPLOAD ----------------
// //   const handleAvatarChange = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const formData = new FormData();
// //     formData.append("avatar", file);

// //     try {
// //       setUploading(true);
// //       const res = await api.post(
// //         "/v1/users/updateAvatar",
// //         formData,
// //         {
// //           headers: { "Content-Type": "multipart/form-data" },
// //           withCredentials: true,
// //         }
// //       );
// //       alert("Profile picture updated");
// //       window.location.reload(); // simplest + safe
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to update avatar");
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   return (
// //     <AnimatePresence>
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         exit={{ opacity: 0 }}
// //         onClick={onClose}
// //         className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
// //       >
// //         <motion.div
// //           initial={{ scale: 0.95, y: 20, opacity: 0 }}
// //           animate={{ scale: 1, y: 0, opacity: 1 }}
// //           exit={{ scale: 0.95, y: 20, opacity: 0 }}
// //           transition={{ duration: 0.2 }}
// //           onClick={(e) => e.stopPropagation()}
// //           className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
// //         >

// //           {/* HEADER */}
// //           <div className="px-6 py-4 border-b flex justify-between items-center">
// //             <h2 className="text-xl font-bold text-primary">My Profile</h2>
// //             <button
// //               onClick={onClose}
// //               className="text-gray-400 hover:text-gray-600"
// //             >
// //               ✕
// //             </button>
// //           </div>

// //           {/* BODY */}
// //           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

// //             {/* LEFT — AVATAR */}
// //             <div className="flex flex-col items-center gap-4">
// //               <div className="w-32 h-32 rounded-full overflow-hidden border">
// //                 <img
// //                   src={currentUser?.avatar || "/avatar-placeholder.png"}
// //                   alt="avatar"
// //                   className="w-full h-full object-cover"
// //                 />
// //               </div>

// //               <input
// //                 ref={fileRef}
// //                 type="file"
// //                 accept="image/*"
// //                 hidden
// //                 onChange={handleAvatarChange}
// //               />

// //               <button
// //                 disabled={uploading}
// //                 onClick={() => fileRef.current.click()}
// //                 className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
// //               >
// //                 {uploading ? "Uploading..." : "Change Photo"}
// //               </button>
// //             </div>

// //             {/* RIGHT — INFO */}
// //             <div className="md:col-span-2 space-y-6">

// //               {/* BASIC INFO */}
// //               <Card title="Basic Information">
// //                 <InfoRow label="Name" value={currentUser?.name} />
// //                 <InfoRow label="Email" value={currentUser?.email} />
// //                 <InfoRow label="Role" value={currentUser?.role} />
// //                 <InfoRow label="Department" value={currentUser?.department} />
// //               </Card>

// //               {/* ACCOUNT STATUS */}
// //               <Card title="Account Status">
// //                 <InfoRow
// //                   label="Status"
// //                   value={currentUser?.isActive ? "Active" : "Inactive"}
// //                 />
// //                 <InfoRow
// //                   label="Joined"
// //                   value={new Date(currentUser?.createdAt).toLocaleDateString()}
// //                 />
// //               </Card>

// //               {/* SECURITY */}
// //               <Card title="Security Actions">
// //                 <div className="flex gap-3">
// //                   <button
// //                     className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
// //                     onClick={() => alert("Change password flow")}
// //                   >
// //                     Change Password
// //                   </button>
// //                   <button
// //                     className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
// //                     onClick={logout}
// //                   >
// //                     Logout
// //                   </button>
// //                 </div>
// //               </Card>

// //             </div>
// //           </div>
// //         </motion.div>
// //       </motion.div>
// //     </AnimatePresence>
// //   );
// // };

// // export default ProfileModal;

// // /* ---------------- SMALL REUSABLE UI ---------------- */

// // const Card = ({ title, children }) => (
// //   <div className="border rounded-xl p-4">
// //     <h3 className="text-sm font-semibold text-gray-500 mb-3">{title}</h3>
// //     <div className="space-y-2">{children}</div>
// //   </div>
// // );

// // const InfoRow = ({ label, value }) => (
// //   <div className="flex justify-between text-sm">
// //     <span className="text-gray-500">{label}</span>
// //     <span className="font-medium text-gray-800">{value || "—"}</span>
// //   </div>
// // );



// import React, { useState} from "react";
// import api from "../api/api.js";
// import { useAuth } from "../context/AuthContext.jsx";
// import { motion, AnimatePresence } from "framer-motion";
// import { Camera, X, Shield, LogOut, User, Mail, Briefcase, Calendar, CheckCircle2, Lock } from 'lucide-react';

// /**
//  * ----------------------------------------------------------------------------
//  * MOCK ENVIRONMENT (For Preview Only)
//  * ----------------------------------------------------------------------------
//  * This section mocks your 'useAuth' and 'api' so the component renders here.
//  * You can ignore this part when copying the ProfileModal back to your project.
//  */

// // Mock User Data
// // const MOCK_USER = {
// //   name: "Alexander Pierce",
// //   email: "alex.pierce@company.com",
// //   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
// //   role: "senior_developer",
// //   department: "Engineering",
// //   isActive: true,
// //   createdAt: "2023-08-15T10:00:00Z"
// // };

// // Mock Auth Context
// // const AuthContext = createContext(null);
// // const useAuth = () => useContext(AuthContext);

// // // Mock API
// // const api = {
// //   post: (url, data) => new Promise((resolve) => {
// //     setTimeout(() => {
// //       resolve({ data: { data: { ...MOCK_USER, avatar: URL.createObjectURL(data.get('avatar')) } } });
// //     }, 1500);
// //   })
// // };

// /**
//  * ----------------------------------------------------------------------------
//  * YOUR UPDATED PROFILE MODAL
//  * ----------------------------------------------------------------------------
//  */
// export const ProfileModal = ({ open, onClose }) => {
//   const { currentUser, logout, setCurrentUser } = useAuth();
//   const [uploading, setUploading] = useState(false);

//   // --- THEME & STYLES ---
//   // Using the requested primary color #064E3B
//   const styles = {
//     primary: "bg-[#064E3B]",
//     primaryText: "text-[#064E3B]",
//     primaryBorder: "border-[#064E3B]",
//     primaryLight: "bg-[#064E3B]/10",
//     button: "bg-[#064E3B] hover:bg-[#064E3B]/90 text-white shadow-md shadow-[#064E3B]/20",
//     ring: "focus:ring-[#064E3B]",
//   };

//   if (!open) return null;

//   // --- LOGIC (Preserved) ---
//   const handleAvatarChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("avatar", file);

//     try {
//       setUploading(true);
//       const res = await api.post("/v1/users/updateAvatar", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setCurrentUser(res.data.data);
//     } catch (err) {
//       alert(err.response?.data?.message || "Avatar upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {/* BACKDROP */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 font-outfit"
//       >
//         {/* MODAL CONTAINER */}
//         <motion.div
//           initial={{ scale: 0.95, opacity: 0, y: 20 }}
//           animate={{ scale: 1, opacity: 1, y: 0 }}
//           exit={{ scale: 0.95, opacity: 0, y: 20 }}
//           transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
//           onClick={(e) => e.stopPropagation()}
//           className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 ring-1 ring-black/5"
//         >
//           {/* HEADER */}
//           <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
//             <div>
//               <h2 className={`text-2xl font-bold ${styles.primaryText} tracking-tight`}>Profile Settings</h2>
//               <p className="text-sm text-gray-500 mt-1 font-medium">Manage your personal information</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2.5 rounded-full hover:bg-gray-200/80 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* BODY */}
//           <div className="p-8 space-y-8 bg-white relative">

//             {/* PROFILE HEADER SECTION */}
//             <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
//               {/* Avatar Upload */}
//               <div className="relative group shrink-0">
//                 <div className={`relative h-28 w-28 rounded-full p-1 border-2 border-dashed ${styles.primaryBorder} border-opacity-30`}>
//                     <img
//                     src={currentUser?.avatar || "/avatar-placeholder.png"}
//                     alt="avatar"
//                     className="w-full h-full rounded-full object-cover shadow-sm"
//                     />
//                     {/* Hover Overlay */}
//                     <label className="absolute inset-1 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-sm z-10">
//                     <Camera className="w-6 h-6 text-white mb-1" />
//                     <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">Edit</span>
//                     <input type="file" hidden onChange={handleAvatarChange} />
//                     </label>
//                 </div>

//                 {/* Loading Spinner */}
//                 {uploading && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full z-20">
//                     <div className={`animate-spin h-8 w-8 border-4 border-gray-200 border-t-[#064E3B] rounded-full`} />
//                   </div>
//                 )}
//               </div>

//               {/* User Details */}
//               <div className="text-center sm:text-left flex-1 min-w-0">
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
//                     <h3 className="text-2xl font-bold text-gray-900 truncate">
//                         {currentUser?.name}
//                     </h3>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${styles.primaryLight} ${styles.primaryText} border border-[#064E3B]/20`}>
//                         {currentUser?.role?.replace("_", " ")}
//                     </span>
//                 </div>

//                 <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm font-medium mb-4">
//                     <Mail className="w-4 h-4" />
//                     {currentUser?.email}
//                 </div>

//                 <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
//                      {/* Quick Stats / Badges */}
//                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
//                         <Briefcase className="w-3.5 h-3.5 text-gray-400" />
//                         {currentUser?.department}
//                      </div>
//                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
//                         <Calendar className="w-3.5 h-3.5 text-gray-400" />
//                         Joined {new Date(currentUser?.createdAt).toLocaleDateString()}
//                      </div>
//                 </div>
//               </div>
//             </div>

//             <hr className="border-gray-100" />

//             {/* INFO GRID */}
//             <div>
//                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
//                     <User className="w-4 h-4" /> Account Details
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <InfoCard 
//                         label="Department" 
//                         value={currentUser?.department} 
//                         icon={<Briefcase className="w-4 h-4" />}
//                     />
//                     <InfoCard
//                         label="Account Status"
//                         value={currentUser?.isActive ? "Active" : "Inactive"}
//                         badge
//                         isActive={currentUser?.isActive}
//                         icon={<CheckCircle2 className="w-4 h-4" />}
//                     />
//                 </div>
//             </div>

//             {/* SECURITY ACTIONS */}
//             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
//               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
//                 <Shield className="w-4 h-4" /> Security & Session
//               </h4>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={() => alert("Change password flow")}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
//                 >
//                   <Lock className="w-4 h-4 text-gray-400" />
//                   Change Password
//                 </button>

//                 <button
//                   onClick={logout}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 font-semibold hover:bg-red-100/80 transition-all duration-200"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Sign Out
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// // --- HELPER COMPONENTS ---

// const InfoCard = ({ label, value, badge, isActive, icon }) => (
//   <div className="group bg-white rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:border-[#064E3B]/30 hover:shadow-sm">
//     <div className="flex items-center justify-between mb-2">
//         <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide flex items-center gap-2">
//             {icon && <span className="text-gray-300 group-hover:text-[#064E3B] transition-colors">{icon}</span>}
//             {label}
//         </p>
//     </div>

//     {badge ? (
//       <div className="flex items-center gap-2">
//           <span className={`relative flex h-2.5 w-2.5`}>
//             <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
//             <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActive ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
//           </span>
//           <span className={`text-sm font-bold ${isActive ? 'text-emerald-700' : 'text-gray-600'}`}>
//             {value}
//           </span>
//       </div>
//     ) : (
//       <p className="text-base font-medium text-gray-900">{value}</p>
//     )}
//   </div>
// );


// /**
//  * ----------------------------------------------------------------------------
//  * APP COMPONENT (Demo Harness)
//  * ----------------------------------------------------------------------------
//  */
// // export default function App() {
// //   const [currentUser, setCurrentUser] = useState(MOCK_USER);
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   const logout = () => {
// //     alert("Logged out!");
// //     setIsModalOpen(false);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ currentUser, logout, setCurrentUser }}>
// //       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">

// //         {/* Font Import for Outfit */}
// //         <style>{`
// //           @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
// //           .font-outfit { font-family: 'Outfit', sans-serif; }
// //         `}</style>

// //         <div className="text-center space-y-6 max-w-lg">
// //           <div className="h-16 w-16 bg-[#064E3B] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[#064E3B]/20 transform -rotate-6">
// //             <User className="text-white w-8 h-8" />
// //           </div>

// //           <h1 className="text-4xl font-bold text-gray-900 font-outfit">
// //             Profile Modal <span className="text-[#064E3B]">Redesign</span>
// //           </h1>

// //           <p className="text-gray-500 text-lg leading-relaxed">
// //             Click the button below to view the professional profile modal with the 
// //             <span className="font-mono text-sm bg-gray-200 px-1 py-0.5 rounded mx-1">#064E3B</span> 
// //             theme and Outfit font.
// //           </p>

// //           <button
// //             onClick={() => setIsModalOpen(true)}
// //             className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#064E3B] text-white rounded-full font-bold text-lg shadow-xl shadow-[#064E3B]/30 hover:scale-105 hover:bg-[#064E3B]/90 transition-all duration-300 active:scale-95 font-outfit"
// //           >
// //             Open Profile Settings
// //             <Camera className="w-5 h-5" />
// //           </button>
// //         </div>

// //         {/* The Component You Asked For */}
// //         <ProfileModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

// //       </div>
// //     </AuthContext.Provider>
// //   );
// // }

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
                    src={currentUser?.avatar || "/avatar-placeholder.png"}
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