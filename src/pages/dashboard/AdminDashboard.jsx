import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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
    <div className="p-6 space-y-6">

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-sm text-gray-500">Employees</h3>
            <p className="text-2xl font-bold">42</p>
          </CardContent>
        </Card>

        <Card className="shadow rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-sm text-gray-500">Active Tickets</h3>
            <p className="text-2xl font-bold">18</p>
          </CardContent>
        </Card>

        <Card className="shadow rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-sm text-gray-500">Today's Attendance</h3>
            <p className="text-2xl font-bold">28</p>
          </CardContent>
        </Card>

        <Card className="shadow rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-sm text-gray-500">On Duty</h3>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Attendance graph */}
        <Card className="shadow rounded-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Attendance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ticket Pie Chart */}
        <Card className="shadow rounded-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ticket Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ticketData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ticketData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Salary Bar Graph */}
      <Card className="shadow rounded-xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Salary Expense</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
