import {
  Menu,
  Bell,
  CheckCircle,
  UserPlus,
  Calendar,
  DollarSign,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New employee added",
      icon: UserPlus,
      time: "2 min ago",
      unread: true,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 2,
      text: "Attendance updated",
      icon: Calendar,
      time: "15 min ago",
      unread: true,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      id: 3,
      text: "Salary generated",
      icon: DollarSign,
      time: "1 hour ago",
      unread: false,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ]);

  const notificationRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <nav className="sticky top-0 z-40 w-full h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between">
      {/* --- LEFT SECTION: Logo & Mobile Toggle --- */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Menu size={22} />
        </motion.button>

        <div className="hidden sm:block">
          <h1 className="text-xl font-black tracking-tighter text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              E
            </div>
            Evergreen <span className="text-emerald-600">EMS</span>
          </h1>
        </div>
      </div>

      {/* --- MIDDLE SECTION: Search Bar --- */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search analytics, employees..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      {/* --- RIGHT SECTION: Actions & Profile --- */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(!open)}
            className={`p-2.5 rounded-2xl transition-all relative ${
              open
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bell
              size={22}
              className={
                unreadCount > 0
                  ? "animate-[wiggle_1s_ease-in-out_infinite]"
                  : ""
              }
            />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                    {unreadCount} NEW
                  </span>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 border-b border-slate-50 last:border-none"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}
                      >
                        <item.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            item.unread
                              ? "font-bold text-slate-900"
                              : "text-slate-600"
                          }`}
                        >
                          {item.text}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          {item.time}
                        </p>
                      </div>
                      {item.unread && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-center text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-slate-50">
                  View All Notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown */}
        {/* <div className="relative" ref={userRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all border border-transparent hover:border-slate-300"
          >
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-slate-800 leading-none">
                Admin User
              </p>
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">
                Super Admin
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-500 transition-transform ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-slate-200 p-2 z-50"
              >
                <div className="p-3 mb-2 border-b border-slate-50 lg:hidden text-center">
                  <p className="font-bold text-slate-800">Admin User</p>
                </div>
                <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors">
                  <User size={18} /> Profile
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors">
                  <Settings size={18} /> Settings
                </button>
                <div className="h-px bg-slate-100 my-2 mx-2"></div>
                <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors">
                  <LogOut size={18} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(10deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }
      `}</style>
    </nav>
  );
}
