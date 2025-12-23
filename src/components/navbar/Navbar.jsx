import { Menu, Bell, X, CheckCircle, UserPlus, Calendar, DollarSign } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New employee added", icon: UserPlus, time: "2 min ago", unread: true },
    { id: 2, text: "Attendance updated", icon: Calendar, time: "15 min ago", unread: true },
    { id: 3, text: "Salary generated", icon: DollarSign, time: "1 hour ago", unread: false },
  ]);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-5">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold text-emerald-700">
          Evergreen EMS
        </h1>
      </div>

      {/* Right - Notification */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-100 transition-all relative group"
        >
          <Bell size={20} className={`text-gray-700 transition-transform ${open ? 'rotate-12' : 'group-hover:rotate-12'}`} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-600">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex gap-2">
                {notifications.length > 0 && unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No notifications</p>
                  <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`px-4 py-3 border-b last:border-none cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-transparent group ${
                        item.unread ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          item.unread 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-gray-100 text-gray-500'
                        } transition-colors`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${
                            item.unread ? 'font-medium text-gray-900' : 'text-gray-600'
                          }`}>
                            {item.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                        </div>
                        {item.unread ? (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
                        ) : (
                          <CheckCircle size={16} className="text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}