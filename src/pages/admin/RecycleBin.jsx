import { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  RotateCcw,
  Trash,
  Users,
  Ticket,
  Calendar,
  UserCheck,
  Search,
  Loader2,
} from "lucide-react";

export default function RecycleBin() {
  const [tab, setTab] = useState("EMPLOYEE");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = tab === "EMPLOYEE" ? "/bin/employees" : "/bin/tickets";
      const res = await API.get(url);
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  // --- SWEETALERT RESTORE ---
  const restoreItem = async (id) => {
    const result = await Swal.fire({
      title: "Restore Item?",
      text: `Do you want to move this ${tab.toLowerCase()} back to active list?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, restore it!",
      background: "#ffffff",
      customClass: { popup: "rounded-[2rem]" },
    });

    if (result.isConfirmed) {
      try {
        const url =
          tab === "EMPLOYEE"
            ? `/bin/employees/${id}/restore`
            : `/bin/tickets/${id}/restore`;
        await API.patch(url);
        Swal.fire(
          "Restored!",
          "Item has been restored successfully.",
          "success",
        );
        fetchData();
      } catch (err) {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  // --- SWEETALERT PERMANENT DELETE ---
  const permanentDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action is permanent and cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete forever!",
      background: "#ffffff",
      customClass: { popup: "rounded-[2rem]" },
    });

    if (result.isConfirmed) {
      try {
        const url =
          tab === "EMPLOYEE"
            ? `/bin/employees/${id}/permanent`
            : `/bin/tickets/${id}/permanent`;
        await API.delete(url);
        Swal.fire("Deleted!", "The record has been purged.", "success");
        fetchData();
      } catch (err) {
        Swal.fire("Error", "Could not delete item", "error");
      }
    }
  };

  const filteredData = data.filter((item) =>
    (item.name || item.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 lg:p-10 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Trash2 className="text-rose-500" size={32} />
            Recycle Bin
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
            Deleted items are safely stored here for recovery.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder={`Search ${tab === "EMPLOYEE" ? "Staff" : "Tickets"}...`}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setTab("EMPLOYEE")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
            tab === "EMPLOYEE"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Users size={16} /> EMPLOYEES
        </button>
        <button
          onClick={() => setTab("TICKET")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
            tab === "TICKET"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Ticket size={16} /> TICKETS
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Retrieving archives...
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
              Bin is clean and empty
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Record Details</th>
                  <th className="px-8 py-5">Deleted At</th>
                  <th className="px-8 py-5">Authorizing Admin</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-2xl ${tab === "EMPLOYEE" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"}`}
                          >
                            {tab === "EMPLOYEE" ? (
                              <Users size={20} />
                            ) : (
                              <Ticket size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {tab === "EMPLOYEE" ? item.name : item.title}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400">
                              {tab === "EMPLOYEE"
                                ? item.email || "No email provided"
                                : `${item.deviceType || "Unknown Device"} - ${item.issueDescription || "No description"}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                          <Calendar size={14} className="text-slate-400" />
                          {new Date(item.deletedAt).toLocaleDateString([], {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <UserCheck size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-slate-600">
                            {item.deletedBy?.name || "System Admin"}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => restoreItem(item._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                          >
                            <RotateCcw size={14} /> Restore
                          </button>
                          <button
                            onClick={() => permanentDelete(item._id)}
                            className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
