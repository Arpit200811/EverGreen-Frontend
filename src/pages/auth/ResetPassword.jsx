import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password) return setMsg("Password required");

    try {
      setLoading(true);
      await API.post(`/auth/reset-password/${token}`, { password });
      setMsg("✅ Password reset successful");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        {msg && (
          <p className="text-center text-sm mb-3 text-blue-600">
            {msg}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="border p-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
