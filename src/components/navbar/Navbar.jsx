import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-4 sm:px-6 md:px-6">

      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100 transition"
        onClick={toggleSidebar}
      >
        <Menu size={26} />
      </button>

      {/* Logo / Title */}
      <h1 className="text-lg sm:text-xl font-semibold text-emerald-700 truncate">
        Evergreen EMS
      </h1>

      {/* User Info & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="hidden sm:block text-gray-600 text-sm sm:text-base truncate">
          Welcome {user.name}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-sm sm:text-base transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
