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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Attendance</h1>

      {/* ---------- TODAY CARD ---------- */}
      <div className="bg-white shadow rounded p-4 flex justify-between items-center">
        <div>
          <p className="font-semibold">Today</p>
          <p className="text-sm text-gray-600">
            {today ? today.status : "Not Checked In"}
          </p>
        </div>

        <div className="flex gap-3">
          {!today && (
            <button
              onClick={handleCheckIn}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Check In
            </button>
          )}

          {today && !today.checkOut && (
            <button
              onClick={handleCheckOut}
              className="bg-blue-600 text-white px-4 py-2 rounded"
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
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Check In</th>
                <th className="p-3">Check Out</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r._id} className="border-t">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">
                    {r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "—"}
                  </td>
                  <td className="p-3">
                    {r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "—"}
                  </td>
                  <td className="p-3">{r.workingHours || "—"}</td>
                  <td className="p-3 font-medium">
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
