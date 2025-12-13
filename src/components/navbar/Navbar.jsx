import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-4 md:px-6">

      <button
        className="md:hidden p-2 rounded hover:bg-gray-100 transition"
        onClick={toggleSidebar}
      >
        <Menu size={26} />
      </button>

      <h1 className="text-xl font-semibold text-emerald-700">
        Evergreen EMS
      </h1>

      <div className="flex items-center gap-4">
        <span className="hidden md:block text-gray-600">Welcome {user.role}</span>
        <button className="bg-red-500 text-white px-4 py-1 rounded-md">
          Logout
        </button>
      </div>
    </div>
  );
}
