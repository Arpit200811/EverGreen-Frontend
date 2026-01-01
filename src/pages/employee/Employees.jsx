import { useEffect, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Users, Search, Edit3, Trash2, X, UserPlus, Camera,
  ShieldCheck, ShieldAlert, Phone, Mail, IdCard, MapPin, Calendar as CalendarIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API, { BASE_URL } from "../../api/axios";

// --- 1. VALIDATION SCHEMA ---
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(20, "Name cannot exceed 20 characters")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup
    .string()
    .required("Mobile is required")
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian number"),
  aadharNo: yup
    .string()
    .required("Aadhar is required")
    .matches(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
  dob: yup.string().required("DOB is required"),
  address: yup.string().required("Address is required"),
  password: yup.string().when("$isNew", {
    is: true,
    then: (s) => s.required("Password is required").min(6, "Min 6 chars"),
    otherwise: (s) => s.notRequired(),
  }),
});

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- 2. REACT HOOK FORM ---
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { isNew: !editingEmployee }
  });

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/users/all");
      const emp = res.data.filter((u) => u.role === "EMPLOYEE");
      setEmployees(emp);
      setFiltered(emp);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  useEffect(() => {
    let data = [...employees];
    if (search) {
      data = data.filter((e) => `${e.name} ${e.email} ${e.mobile}`.toLowerCase().includes(search.toLowerCase()));
    }
    if (statusFilter !== "ALL") {
      data = data.filter((e) => statusFilter === "ACTIVE" ? e.isActive : !e.isActive);
    }
    setFiltered(data);
  }, [search, statusFilter, employees]);

  // --- 3. SAVE LOGIC ---
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      let savedEmployee;
      if (editingEmployee) {
        const res = await API.put(`/users/${editingEmployee._id}`, formData);
        savedEmployee = res.data;
      } else {
        const res = await API.post("/auth/register", { ...formData, role: "EMPLOYEE" });
        savedEmployee = res.data;
      }

      if (imageFile && savedEmployee?._id) {
        const data = new FormData();
        data.append("profileImage", imageFile);
        await API.put(`/users/${savedEmployee._id}/image`, data);
      }
      closeModal();
      fetchEmployees();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    } finally { setLoading(false); }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setImageFile(null);
    setImagePreview(null);
    reset();
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setImagePreview(emp.profileImage ? `${BASE_URL}${emp.profileImage}` : null);
    setValue("name", emp.name);
    setValue("email", emp.email);
    setValue("mobile", emp.mobile || "");
    setValue("aadharNo", emp.aadharNo || "");
    setValue("dob", emp.dob || "");
    setValue("address", emp.address || "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      fetchEmployees();
      setShowDeleteConfirm(null);
    } catch (error) { console.error(error); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.isActive).length,
    inactive: employees.filter((e) => !e.isActive).length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
            <p className="text-slate-500 font-medium">Overview of your professional team</p>
          </div>
          <button
            onClick={() => { reset(); setShowModal(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95 font-bold"
          >
            <UserPlus size={20} /> Add New Member
          </button>
        </div>

        {/* --- STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Staff" value={stats.total} icon={Users} color="bg-blue-600" />
          <StatCard label="Active" value={stats.active} icon={ShieldCheck} color="bg-emerald-600" />
          <StatCard label="Inactive" value={stats.inactive} icon={ShieldAlert} color="bg-rose-600" />
        </div>

        {/* --- FILTERS & TABLE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 bg-slate-50/30">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, or phone..."
                className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-3 bg-white border-none rounded-2xl shadow-sm text-sm font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Members</option>
              <option value="INACTIVE">Inactive Members</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Id</th>
                  <th className="px-8 py-5">Employee Detail</th>
                  <th className="px-8 py-5">Contacts</th>
                  <th className="px-8 py-5">Identity</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((emp, index) => (
                  <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-bold text-slate-300">{index + 1}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                          {emp.profileImage ? (
                            <img src={`${BASE_URL}${emp.profileImage}`} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100">
                              {emp.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">{emp.name}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium italic">
                            <Mail size={10} /> {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="space-y-1 text-xs">
                          <p className="font-bold text-slate-700 flex items-center gap-2"><Phone size={12} className="text-emerald-500" /> {emp.mobile}</p>
                          <p className="font-medium text-slate-400 flex items-center gap-2"><MapPin size={12} /> {emp.address?.slice(0, 15)}...</p>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 flex items-center gap-2"><IdCard size={12} className="text-blue-500" /> {emp.aadharNo}</span>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Verified</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        emp.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}>
                        {emp.isActive ? "Online" : "Away"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(emp)} className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(emp._id)} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL --- */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="px-8 py-6 bg-emerald-600 flex justify-between items-center text-white">
                    <h3 className="text-xl font-black">{editingEmployee ? "Refine Profile" : "Register Member"}</h3>
                    <button type="button" onClick={closeModal} className="p-2 hover:bg-white/20 rounded-full"><X /></button>
                  </div>

                  <div className="p-8 max-h-[70vh] overflow-y-auto">
                    {/* Image Upload */}
                    <div className="flex justify-center mb-8">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-50 overflow-hidden bg-slate-100 shadow-inner flex items-center justify-center">
                          {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <Users className="text-slate-300 w-12 h-12" />}
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-emerald-600 p-3 rounded-2xl cursor-pointer shadow-xl text-white">
                          <Camera size={18} />
                          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput label="Full Name (Max 20)" maxLength={20} icon={Users} {...register("name")} error={errors.name?.message} />
                      <FormInput label="Official Email" icon={Mail} {...register("email")} error={errors.email?.message} />
                      <FormInput label="Mobile (10 Digits)" maxLength={10} icon={Phone} {...register("mobile")} error={errors.mobile?.message} />
                      <FormInput label="DOB" icon={CalendarIcon} type="date" {...register("dob")} error={errors.dob?.message} />
                      <FormInput label="Aadhar ID (12 Digits)" maxLength={12} icon={IdCard} {...register("aadharNo")} error={errors.aadharNo?.message} />
                      <FormInput label="Address" icon={MapPin} {...register("address")} error={errors.address?.message} />
                      {!editingEmployee && (
                        <div className="md:col-span-2">
                          <FormInput label="Password" type="password" {...register("password")} error={errors.password?.message} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t flex gap-4">
                    <button type="button" onClick={closeModal} className="flex-1 font-bold text-slate-500">Discard</button>
                    <button type="submit" disabled={loading} className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl">
                      {loading ? "Syncing..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- DELETE CONFIRMATION --- */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Delete?</h3>
              <p className="text-slate-500 text-sm mb-8">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex justify-between items-center group hover:-translate-y-1 transition-all">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tighter">{value}</p>
    </div>
    <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}><Icon size={24} /></div>
  </div>
);

const FormInput = forwardRef(({ label, error, type = "text", icon: Icon, ...props }, ref) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />}
      <input
        ref={ref}
        type={type}
        {...props}
        className={`w-full bg-slate-50 border-none rounded-2xl ${Icon ? 'pl-12' : 'px-4'} py-3.5 text-sm font-bold text-slate-700 focus:ring-2 ${error ? 'focus:ring-rose-500/20 ring-1 ring-rose-200' : 'focus:ring-emerald-500/20'} transition-all`}
      />
    </div>
    {error && <p className="text-[10px] text-rose-500 font-bold ml-2 italic">{error}</p>}
  </div>
));