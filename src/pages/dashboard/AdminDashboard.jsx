import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  const attendanceData = [
    { day: "Mon", count: 22 },
    { day: "Tue", count: 28 },
    { day: "Wed", count: 32 },
    { day: "Thu", count: 30 },
    { day: "Fri", count: 26 },
  ];

  const ticketData = [
    { name: "Open", value: 12 },
    { name: "In Progress", value: 7 },
    { name: "Completed", value: 20 },
  ];

  const salaryData = [
    { month: "Sep", amount: 240000 },
    { month: "Oct", amount: 260000 },
    { month: "Nov", amount: 250000 },
    { month: "Dec", amount: 270000 },
  ];

  const COLORS = ["#22c55e", "#0ea5e9", "#e11d48"];

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Employees", value: 48 },
          { label: "Active Tickets", value: 18 },
          { label: "Today's Attendance", value: 28 },
          { label: "On Duty", value: 12 },
        ].map((item, idx) => (
          <Card key={idx} className="shadow rounded-xl">
            <CardContent className="p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm text-gray-500">
                {item.label}
              </h3>
              <p className="text-xl sm:text-2xl font-bold">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Attendance graph */}
        <Card className="shadow rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Weekly Attendance
            </h3>
            <div className="h-[220px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Pie Chart */}
        <Card className="shadow rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Ticket Status
            </h3>
            <div className="h-[220px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ticketData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Bar Graph */}
      <Card className="shadow rounded-xl">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Monthly Salary Expense
          </h3>
          <div className="h-[260px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
