import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  UserPlus,
  Camera,
} from "lucide-react";
import API, { BASE_URL } from "../../api/axios";

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    mobile: "",
    aadharNo: "",
    address: "",
    password: "",
  });

  /* ================= FETCH ================= */
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/users/all");
      const emp = res.data.filter((u) => u.role === "EMPLOYEE");
      setEmployees(emp);
      setFiltered(emp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    let data = [...employees];

    if (search) {
      data = data.filter((e) =>
        `${e.name} ${e.email} ${e.mobile}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter((e) =>
        statusFilter === "ACTIVE" ? e.isActive : !e.isActive
      );
    }

    setFiltered(data);
  }, [search, statusFilter, employees]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);
      let savedEmployee;

      if (editingEmployee) {
        const res = await API.put(`/users/${editingEmployee._id}`, form);
        savedEmployee = res.data;
      } else {
        const res = await API.post("/auth/register", {
          ...form,
          role: "EMPLOYEE",
        });
        savedEmployee = res.data;
      }

      if (imageFile && savedEmployee?._id) {
        const formData = new FormData();
        formData.append("profileImage", imageFile);
        await API.put(`/users/${savedEmployee._id}/image`, formData);
      }

      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setImageFile(null);
    setImagePreview(null);
    setForm({
      name: "",
      email: "",
      dob: "",
      mobile: "",
      aadharNo: "",
      address: "",
      password: "",
    });
  };

  /* ================= EDIT ================= */
  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setImagePreview(emp.profileImage || null);
    setForm({
      name: emp.name,
      email: emp.email,
      dob: emp.dob || "",
      mobile: emp.mobile || "",
      aadharNo: emp.aadharNo || "",
      address: emp.address || "",
    });
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      fetchEmployees();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.isActive).length,
    inactive: employees.filter((e) => !e.isActive).length,
  };
const  formatAadhaar = (value = "") => {
  return value
    .replace(/\D/g, "")           // non-digits remove
    .replace(/(.{4})/g, "$1 ")    // 4 digit ke baad space
    .trim();
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* HEADER */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Employee Management</h1>
                <p className="text-sm text-gray-500">
                  Manage your team members
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <UserPlus size={16} /> Add Employee
            </button>
          </div>
        </div>
        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or mobile..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 border rounded-lg"
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">DOB</th>
                <th className="p-4">Aadhaar</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, index) => (
                <tr key={emp._id} className="border-t">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {emp.profileImage ? (
                          <img
                            src={`${BASE_URL}${emp.profileImage}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="mx-auto mt-2 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{emp.name}</p>
                        <p className="text-sm text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{emp.mobile || "--"}</td>
                  <td className="p-4 whitespace-nowrap">{emp.dob || "--"}</td>
                  <td className="p-4 hidden md:table-cell whitespace-nowrap">
                    {emp.aadharNo ? formatAadhaar(emp.aadharNo) : "--"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {emp.address || "--"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        emp.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {emp.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"
                        title="Edit Employee"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(emp._id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-lg mx-2">
              <div className="bg-green-600 p-6 flex justify-between">
                <h3 className="text-white font-bold">
                  {editingEmployee ? "Edit Employee" : "Add Employee"}
                </h3>
                <button onClick={resetForm}>
                  <X className="text-white" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-2 border-green-600 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="text-gray-400 w-10 h-10" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer">
                      <Camera className="text-white w-4 h-4" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                  />
                  <Input
                    label="Email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />
                  <Input
                    label="Mobile"
                    value={form.mobile}
                    onChange={(v) => setForm({ ...form, mobile: v })}
                  />
                  <Input
                    label="DOB"
                    type="date"
                    value={form.dob}
                    onChange={(v) => setForm({ ...form, dob: v })}
                  />
                  <Input
                    label="Aadhaar"
                    value={form.aadharNo}
                    onChange={(v) => setForm({ ...form, aadharNo: v })}
                  />
                  <Input
                    label="Address"
                    value={form.address}
                    onChange={(v) => setForm({ ...form, address: v })}
                  />
                  {!editingEmployee && (
                    <Input
                      label="Password"
                      type="password"
                      value={form.password}
                      onChange={(v) => setForm({ ...form, password: v })}
                    />
                  )}
                </div>
              </div>

              <div className="p-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetForm}
                  className="border rounded p-2 flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white rounded p-2 flex-1"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-4">
              <p className="mb-4">Delete this employee?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="border px-4 py-2 rounded flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="bg-red-600 text-white px-4 py-2 rounded flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */
const Stat = ({ label, value, icon: Icon, green, red }) => (
  <div className="bg-white border rounded-lg p-5 flex justify-between">
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p
        className={`text-3xl font-bold ${
          green ? "text-green-600" : red ? "text-red-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
      <Icon />
    </div>
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-3 py-2 rounded-lg"
    />
  </div>
);
