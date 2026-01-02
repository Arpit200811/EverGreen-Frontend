import {
  LayoutDashboard,
  Users,
  Ticket,
  CalendarCheck,
  IndianRupee,
  MapPin,
  ClipboardList,
  FileText,
  PlusCircle,
} from "lucide-react";

export const sidebarMenu = {
  ADMIN: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Employees",
      path: "/add-employee",
      icon: Users,
    },
    {
      label: "Tickets",
      path: "/tickets",
      icon: Ticket,
    },
    {
      label: "Attendance",
      path: "/admin-attendance",
      icon: CalendarCheck,
    },
    {
      label: "Leave Applications",
      path: "/leaves",
      icon: FileText,
    },
    {
      label: "Salary",
      path: "/salary-management",
      icon: IndianRupee,
    },
    {
      label: "Live Map",
      path: "/live-map",
      icon: MapPin,
    },
    {
      label: "Applicant",
      path: "/applicant",
      icon: Users,
    },
  ],

  EMPLOYEE: [
    {
      label: "My Tickets",
      path: "/my-tickets",
      icon: ClipboardList,
    },
    {
      label: "Attendance",
      path: "/employee-attendance",
      icon: CalendarCheck,
    },
    {
      label: "Leave Applications",
      path: "/leaves",
      icon: FileText,
    },
  ],

  CUSTOMER: [
    {
      label: "Create Ticket",
      path: "/tickets/create",
      icon: PlusCircle,
    },
    {
      label: "My Tickets",
      path: "/my-tickets",
      icon: Ticket,
    },
  ],
};
