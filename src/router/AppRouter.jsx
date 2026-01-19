import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

/* ========== AUTH ========== */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import NotFound from "../pages/auth/PageNotFound";

/* ========== ADMIN ========== */
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AdminTickets from "../pages/admin/Tickets";
import AdminAttendance from "../pages/admin/Attendance";
import AdminMapContainer from "../pages/admin/LiveMap";
import SalaryManagement from "../pages/employee/Salary";
import RecycleBin from "../pages/admin/RecycleBin";


/* ========== EMPLOYEE ========== */
import Employees from "../pages/employee/Employees";
import EmployeeTickets from "../pages/employee/MyTickets";
import EmployeeAttendance from "../pages/employee/Attendance";
import EmployeeDashboard from "../pages/employee/EmployeeDashbord";
import LeaveManagement from "../pages/employee/Leaves"


/* ========== CUSTOMER ========== */
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CreateTicket  from "../pages/customer/CreateTicket";
import TicketDetail from "../pages/tickets/TicketDetail";

export default function AppRouter() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/tickets" element={<AdminTickets />} />
          <Route path="/add-employee" element={<Employees />} />
          <Route path="/admin-attendance" element={<AdminAttendance />} />
          <Route path="/salary-management" element={<SalaryManagement />} />
          <Route path="/live-map" element={<AdminMapContainer />} />
          <Route path='/bin' element={<RecycleBin />} />
        </Route>
      </Route>

      {/* ================= EMPLOYEE ROUTES ================= */}
      <Route element={<ProtectedRoute roles={["EMPLOYEE"]} />}>
        <Route element={<Layout />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/my-tickets" element={<EmployeeTickets />} />
          <Route path="/employee-attendance" element={<EmployeeAttendance />} />
          <Route path="/leaves" element={<LeaveManagement />} />
        </Route>
      </Route>

      {/* ================= CUSTOMER ROUTES ================= */}
      <Route element={<ProtectedRoute roles={["CUSTOMER"]} />}>
        <Route element={<Layout />}>
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Route>
      </Route>

    </Routes>
  );
}
