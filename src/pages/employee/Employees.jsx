import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  /* ---------------- FETCH EMPLOYEES ---------------- */
  const fetchEmployees = async () => {
    const res = await API.get('/users/all');
    const emp = res.data.filter(u => u.role === 'EMPLOYEE');
    setEmployees(emp);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ---------------- SIMPLE VALIDATION ---------------- */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- ADD EMPLOYEE ---------------- */
  const handleAddEmployee = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await API.post('/auth/register', {
        ...form,
        role: 'EMPLOYEE'
      });

      setForm({ name: '', email: '', password: '' });
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
        <h2 className="text-xl sm:text-2xl font-semibold">Employees</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={() => setShowModal(true)}
        >
          + Add Employee
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-[640px] w-full text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">S.N</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp._id} className="border-t">
                <td className="p-3 font-medium whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="p-3 font-medium whitespace-nowrap">
                  {emp.name}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {emp.email}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      emp.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Add Employee
            </h3>

            <div className="space-y-3">
              <div>
                <input
                  className="border p-2 w-full rounded text-sm sm:text-base"
                  placeholder="Name"
                  value={form.name}
                  onChange={e =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  className="border p-2 w-full rounded text-sm sm:text-base"
                  placeholder="Email"
                  value={form.email}
                  onChange={e =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  className="border p-2 w-full rounded text-sm sm:text-base"
                  placeholder="Password"
                  value={form.password}
                  onChange={e =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border rounded w-full sm:w-auto"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto"
                onClick={handleAddEmployee}
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
