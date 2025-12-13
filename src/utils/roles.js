export const sidebarMenu = {
  ADMIN: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Employees", path: "/employees" },
    { label: "Tickets", path: "/admin/tickets" },
    { label: "Attendance", path: "/attendance" },
    { label: "Salary", path: "/salary" },
    { label: "Live Map", path: "/live-map" },
  ],

  EMPLOYEE: [
    { label: "My Tickets", path: "/tickets" },
    { label: "Attendance", path: "/attendance" },
    { label: "Leave Applications", path: "/leaves" },
  ],

  CUSTOMER: [
    { label: "Create Ticket", path: "/tickets/create" },
    { label: "My Tickets", path: "/my-tickets" },
  ],
};
