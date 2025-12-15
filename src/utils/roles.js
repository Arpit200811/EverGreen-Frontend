export const sidebarMenu = {
  ADMIN: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Employees", path: "/add-employee" },
    { label: "Tickets", path: "/tickets" },
    { label: "Attendance", path: "/admin-attendance" },
    { label: "Salary", path: "/salary" },
    { label: "Live Map", path: "/live-map" },
  ],

  EMPLOYEE: [
    { label: "My Tickets", path: "/my-tickets" },
    { label: "Attendance", path: "/employee-attendance" },
    { label: "Leave Applications", path: "/leaves" },
  ],

  CUSTOMER: [
    { label: "Create Ticket", path: "/tickets/create" },
    { label: "My Tickets", path: "/my-tickets" },
  ],
};
