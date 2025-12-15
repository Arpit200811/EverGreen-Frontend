import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AdminTickets from "../pages/admin/Tickets";
import ProtectedRoute from "./ProtectedRoute";
import CreateTicket from "../pages/customer/CreateTicket";
import Employees from "../pages/employee/Employees";
import EmployeeTickets from "../pages/employee/MyTickets";
import TicketDetail from "../pages/tickets/TicketDetail";
import EmployeeAttendance from "../pages/employee/Attendance";
import AdminAttendance from "../pages/admin/Attendance";
export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/tickets" element={<AdminTickets />} />
          <Route path="/add-employee" element={<Employees />} />
          <Route path="/admin-attendance" element={<AdminAttendance />} />
        </Route>
      </Route>

      {/* EMPLOYEE ROUTES */}
      <Route element={<ProtectedRoute roles={["EMPLOYEE"]} />}>
        <Route element={<Layout />}>
          <Route path="/employee" element={<div>Employee Home</div>} />
          <Route path="/my-tickets" element={<EmployeeTickets/>} />
          <Route path="/employee-attendance" element={<EmployeeAttendance/>} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
        <Route element={<Layout />}>
          <Route path="/tickets/create" element={<CreateTicket/>} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Route>
      </Route>

    </Routes>
  );
}
