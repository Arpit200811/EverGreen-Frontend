import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AdminTickets from "../pages/admin/Tickets";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard/*" element={<AdminDashboard />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
        </Route>
      </Route>
    </Routes>
  );
}
              