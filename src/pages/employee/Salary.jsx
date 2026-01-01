import React, { useState, useEffect } from "react";
import { 
  IndianRupee, Download, Calculator, Calendar, 
  User, CheckCircle, AlertCircle, History, FileText 
} from "lucide-react";
import API, { BASE_URL } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function SalaryManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default: Current Month "YYYY-MM"
  const [salaries, setSalaries] = useState([]); // Admin ke liye list
  const [history, setHistory] = useState([]);   // Employee ke liye history

  useEffect(() => {
    if (user?.role === "ADMIN") {
      // Admin might want to fetch all generated salaries for selected month
      // logic: fetchAllSalaries(month);
    } else {
      fetchEmployeeHistory();
    }
  }, [month]);

  // --- ADMIN ACTIONS ---
const generateSalaries = async () => {
  try {
    setLoading(true);
    const res = await API.post(`/salary/generate?month=${month}`);
    
    setSalaries(res.data.salaries);

    // Success Popup
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: `Salaries generated successfully for ${month}`,
      confirmButtonColor: '#10b981', // Emerald-600 color to match your theme
      timer: 3000,
      timerProgressBar: true,
      background: '#ffffff',
      borderRadius: '2rem'
    });

  } catch (err) {
    console.error(err);

    // Error Popup
    Swal.fire({
      icon: 'error',
      title: 'Generation Failed',
      text: err.response?.data?.message || "Something went wrong while generating salaries.",
      confirmButtonColor: '#e11d48', // Rose-600
    });

  } finally {
    setLoading(false);
  }
};

  // --- EMPLOYEE ACTIONS ---
  const fetchEmployeeHistory = async () => {
    try {
      const res = await API.get(`/salary/${user._id}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadSlip = (empId, m) => {
    window.open(`${BASE_URL}/salary/${empId}/slip?month=${m}`, "_blank");
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payroll Management</h1>
          <p className="text-slate-500 font-medium">Manage and track employee compensation</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <Calendar className="text-slate-400 ml-2" size={20} />
          <input 
            type="month" 
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent border-none font-bold text-slate-700 focus:ring-0"
          />
          {user?.role === "ADMIN" && (
            <button 
              onClick={generateSalaries}
              disabled={loading}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50"
            >
              <Calculator size={18} /> {loading ? "Generating..." : "Generate"}
            </button>
          )}
        </div>
      </div>

      {/* --- CONTENT FOR ADMIN --- */}
      {/* --- CONTENT FOR ADMIN --- */}
{user?.role === "ADMIN" && salaries.length > 0 && (
  <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">
        Payroll Overview: {month}
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
            <th className="px-8 py-5">Employee Detail</th>
            <th className="px-8 py-5 text-center">Attendance</th>
            <th className="px-8 py-5">Deductions</th>
            <th className="px-8 py-5">Net Salary</th>
            <th className="px-8 py-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {salaries.map((s) => (
            <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  {/* Profile Image ya Initial */}
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                    {s.employee?.profileImage ? (
                      <img 
                        src={`${BASE_URL}${s.employee.profileImage}`} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-black text-emerald-600 text-sm">
                        {s.employee?.name?.charAt(0) || "E"}
                      </span>
                    )}
                  </div>
                  <div>
                    {/* Yahan Name dikhega */}
                    <p className="font-black text-slate-800 text-sm">
                      {s.employee?.name || "Unknown Employee"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      ID: {s.employee?._id?.slice(-6) || "N/A"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">{s.presentDays} Days</span>
                  <span className="text-[10px] text-rose-500 font-bold uppercase">
                    {s.absentDays} Absent
                  </span>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-rose-600">-₹{s.leaveDeduction.toFixed(0)}</span>
                  <span className="text-[9px] text-slate-400 font-medium italic">Unpaid Leaves</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="text-lg font-black text-emerald-600 tracking-tighter">
                  ₹{s.netSalary.toLocaleString()}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <button 
                  onClick={() => downloadSlip(s.employee._id || s.employee, s.month)}
                  className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 active:scale-90"
                  title="Download Payslip"
                >
                  <Download size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* --- CONTENT FOR EMPLOYEE (HISTORY) --- */}
      {user?.role === "EMPLOYEE" && (
        <div className="space-y-6">
          {/* Summary Stats for latest month */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <SalaryStatCard label="Base Salary" value={user.baseSalary} color="bg-blue-600" icon={IndianRupee} />
             <SalaryStatCard label="Last Paid" value={history[0]?.netSalary || 0} color="bg-emerald-600" icon={CheckCircle} />
             <SalaryStatCard label="Yearly Avg" value="--" color="bg-slate-800" icon={History} />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50">
               <h3 className="text-lg font-black text-slate-800">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-4">Month</th>
                    <th className="px-8 py-4">Attendance</th>
                    <th className="px-8 py-4">Deductions</th>
                    <th className="px-8 py-4">Net Amount</th>
                    <th className="px-8 py-4 text-right">Slip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50/20">
                      <td className="px-8 py-5 font-black text-slate-700">{record.month}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-500">{record.presentDays}P / {record.absentDays}A</td>
                      <td className="px-8 py-5 text-rose-500 font-bold">-₹{record.leaveDeduction}</td>
                      <td className="px-8 py-5 font-black text-slate-800">₹{record.netSalary}</td>
                      <td className="px-8 py-5 text-right">
                         <button 
                           onClick={() => downloadSlip(user._id, record.month)}
                           className="flex items-center gap-2 ml-auto bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                         >
                           <FileText size={14} /> PDF Slip
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- SUB COMPONENTS ---

const SalaryStatCard = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex justify-between items-center group">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">
        {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
      </p>
    </div>
    <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
  </div>
);