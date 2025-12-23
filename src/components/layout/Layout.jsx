import { useState } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);
  const isCustomer = user?.role === "CUSTOMER";
  return (
    <div className="h-screen flex overflow-hidden">
      {!isCustomer && (
        <Sidebar isOpen={open} closeSidebar={closeSidebar} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isCustomer && (
          <div className="flex-shrink-0">
            <Navbar toggleSidebar={toggleSidebar} />
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
