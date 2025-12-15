import { useEffect, useState } from "react";
import API from "../../api/axios";
import { ClipLoader } from "react-spinners";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await API.get("/attendance/all");
    setRecords(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Report</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <ClipLoader color="#059669" />
        </div>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Employee</th>
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
                  <td className="p-3 font-medium">
                    {r.employee?.name}
                  </td>
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
                  <td className="p-3 font-semibold">
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
