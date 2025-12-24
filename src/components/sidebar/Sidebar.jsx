import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { sidebarMenu } from "../../utils/roles";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { BASE_URL } from '../../api/axios';

export default function Sidebar({ isOpen, closeSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return null;
  const menu = sidebarMenu[user.role] || [];

  return (
    <>
      {/* 🔹 SMOOTH OVERLAY FOR MOBILE */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 88 : 280,
          x: isMobile ? (isOpen ? 0 : -300) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#0f172a] text-slate-300 shadow-2xl flex flex-col border-r border-slate-800"
      >
        {/* 🔹 HEADER: BRANDING */}
        <div className="h-20 flex items-center px-6 mb-4 justify-between">
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20">
                E
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Evergreen</span>
            </motion.div>
          )}
          {collapsed && (
             <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto text-white font-black">E</div>
          )}
        </div>

        {/* 🔹 USER PROFILE SECTION (HIGH POLISH) */}
        <div className={`px-4 mb-6 transition-all ${collapsed ? "text-center" : ""}`}>
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 ${collapsed ? "justify-center" : ""}`}>
            <div className="relative shrink-0">
              {user.profileImage ? (
                <img src={`${BASE_URL}${user.profileImage}`} className="w-10 h-10 rounded-xl object-cover" alt="avatar" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center font-bold text-white border border-slate-500/30">
                  {user.name?.[0]}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full" />
            </div>
            
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.role}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* 🔹 NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {!collapsed && <p className="text-[10px] font-bold text-slate-500 px-3 mb-2 uppercase tracking-[0.2em]">Main Menu</p>}
          
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={isMobile ? closeSidebar : undefined}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}
              >
                {/* Active Bar Indicator */}
                {isActive && (
                  <motion.div layoutId="activeBar" className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />
                )}

                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""} />

                {!collapsed && (
                  <span className="text-sm font-semibold tracking-wide flex-1">{item.label}</span>
                )}

                {/* Notification Badge */}
                {item.label === "Tickets" && !collapsed && (
                  <span className="bg-rose-500 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-md">3</span>
                )}

                {/* Tooltip for Collapsed Mode */}
                {collapsed && (
                  <div className="absolute left-16 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:left-20 transition-all shadow-xl border border-slate-700 whitespace-nowrap z-[100]">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 🔹 FOOTER: SETTINGS & LOGOUT */}
        <div className="p-4 space-y-2">
          {!collapsed && <div className="h-px bg-slate-800 mx-2 mb-4" />}
          
          <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-all ${collapsed ? "justify-center" : ""}`}>
            <Settings size={20} />
            {!collapsed && <span className="text-sm font-semibold">Settings</span>}
          </button>

          <button
            onClick={logout}
            className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
          </button>
          
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex mt-4 w-full items-center justify-center p-2 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors text-slate-500"
          >
            <ChevronLeft className={`transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
      </motion.aside>
    </>
  );
}