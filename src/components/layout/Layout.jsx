import { useState } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";
export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);

  return (
    <div className="flex">
      <Sidebar isOpen={open} closeSidebar={closeSidebar} />

      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="p-6 bg-gray-100 min-h-screen">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
