import { useEffect, useState } from "react";
import API from "../../api/axios";
import { ClipLoader } from "react-spinners";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/attendance/all");
      setRecords(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
        Attendance Report
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <ClipLoader color="#059669" size={40} />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full min-w-[600px] text-sm sm:text-base border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Hours</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length ? (
                records.map((r) => (
                  <tr
                    key={r._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium">{r.employee?.name || "—"}</td>
                    <td className="p-3">{r.date}</td>
                    <td className="p-3">
                      {r.checkIn
                        ? new Date(r.checkIn).toLocaleTimeString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      {r.checkOut
                        ? new Date(r.checkOut).toLocaleTimeString()
                        : "—"}
                    </td>
                    <td className="p-3">{r.workingHours || "—"}</td>
                    <td className="p-3 font-semibold">{r.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
