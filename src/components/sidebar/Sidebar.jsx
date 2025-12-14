import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { sidebarMenu } from "../../utils/roles";

export default function Sidebar({ isOpen, closeSidebar }) {
  const { user } = useAuth();
  if (!user) return null;
  const menu = sidebarMenu[user.role] || [];
  const isMobile = window.innerWidth < 768;
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <motion.div
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{ x: isMobile ? (isOpen ? 0 : -300) : 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="
          fixed md:static 
          top-0 left-0 
          w-64 bg-emerald-700 text-white 
          min-h-screen p-5 shadow-xl 
          z-50
        "
      >
        <h2 className="text-2xl font-bold mb-6">Menu</h2>

        <ul className="space-y-4">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={isMobile ? closeSidebar : undefined}
                className="block py-2 px-3 rounded-lg hover:bg-emerald-600 transition"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
