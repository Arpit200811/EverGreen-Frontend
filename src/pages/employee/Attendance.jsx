import { useEffect, useState } from "react";
import API from "../../api/axios";
import { ClipLoader } from "react-spinners";

export default function EmployeeAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState(null);

  const fetchAttendance = async () => {
    setLoading(true);
    const res = await API.get("/attendance/my");
    setRecords(res.data);

    const todayDate = new Date().toISOString().slice(0, 10);
    const todayRecord = res.data.find(r => r.date === todayDate);
    setToday(todayRecord);

    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    await API.post("/attendance/check-in");
    fetchAttendance();
  };

  const handleCheckOut = async () => {
    await API.post("/attendance/check-out");
    fetchAttendance();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">My Attendance</h1>

      {/* ---------- TODAY CARD ---------- */}
      <div className="bg-white shadow rounded p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <p className="font-semibold">Today</p>
          <p className="text-sm text-gray-600">
            {today ? today.status : "Not Checked In"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {!today && (
            <button
              onClick={handleCheckIn}
              className="bg-emerald-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Check In
            </button>
          )}

          {today && !today.checkOut && (
            <button
              onClick={handleCheckOut}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Check Out
            </button>
          )}
        </div>
      </div>

      {/* ---------- HISTORY ---------- */}
      <div className="bg-white shadow rounded overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <ClipLoader color="#059669" />
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Hours</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r,index) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3 whitespace-nowrap">{index+1}</td>
                  <td className="p-3 whitespace-nowrap">{r.date}</td>
                  <td className="p-3 whitespace-nowrap">
                    {r.checkIn
                      ? new Date(r.checkIn).toLocaleTimeString()
                      : "—"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {r.checkOut
                      ? new Date(r.checkOut).toLocaleTimeString()
                      : "—"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {r.workingHours || "—"}
                  </td>
                  <td className="p-3 font-medium whitespace-nowrap">
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
