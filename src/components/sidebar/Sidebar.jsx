import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { sidebarMenu } from "../../utils/roles";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import {BASE_URL} from '../../api/axios'

export default function Sidebar({ isOpen, closeSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // 🔔 demo notification count (later API se wire kar sakte ho)
  const ticketCount = 3;

  /* ---------------- MOBILE DETECT ---------------- */
  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return null;

  const menu = sidebarMenu[user.role] || [];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeSidebar}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 256,
          x: isMobile ? (isOpen ? 0 : -300) : 0,
        }}
        transition={{
          width: { duration: 0.35, ease: "easeInOut" },
          x: { type: "spring", stiffness: 120 },
        }}
        className="fixed md:static top-0 left-0 z-50
          bg-emerald-700 text-white min-h-screen
          shadow-xl flex flex-col"
      >
        {/* ---------- PROFILE HEADER ---------- */}
        <div className="p-4 flex items-center justify-between border-b border-emerald-600">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={`${BASE_URL}${user.profileImage}`}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {user.name?.[0] || "U"}
                </div>
              )}

              {/* Online indicator */}
              <span className="absolute -bottom-1 -right-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </span>
            </div>

            {!collapsed && (
              <div className="leading-tight">
                <p className="font-semibold text-sm">
                  {user.name}
                </p>
                <p className="text-xs text-emerald-200">
                  {user.role}
                </p>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/80 hover:text-white"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* ---------- MENU ---------- */}
        <ul className="flex-1 p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path;

            return (
              <li key={item.path} className="relative group">
                <Link
                  to={item.path}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`
                    flex items-center gap-3
                    px-3 py-2 rounded-lg
                    transition-all
                    ${
                      isActive
                        ? "bg-emerald-600 font-semibold"
                        : "hover:bg-emerald-600/80"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r" />
                  )}

                  <Icon size={18} />

                  {!collapsed && (
                    <span className="text-sm">
                      {item.label}
                    </span>
                  )}

                  {/* 🔔 Ticket badge */}
                  {item.label === "Tickets" &&
                    ticketCount > 0 &&
                    !collapsed && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {ticketCount}
                      </span>
                    )}
                </Link>

                {/* Tooltip (collapsed only) */}
                {collapsed && (
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2
                      ml-2 px-2 py-1 text-xs rounded
                      bg-black text-white opacity-0
                      group-hover:opacity-100 transition"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* ---------- LOGOUT ---------- */}
        <div className="p-3 border-t border-emerald-600">
          <button
            onClick={logout}
            className={`
              w-full flex items-center gap-3
              px-3 py-2 rounded-lg
              hover:bg-red-600 transition
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={18} />
            {!collapsed && (
              <span className="text-sm">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
