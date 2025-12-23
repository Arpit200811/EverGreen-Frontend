import { useState } from "react";
import API from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setMsg("Email required");

    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      setMsg("✅ Password reset link sent to email");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2 text-center">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 mb-4 text-center">
          Enter your email to receive reset link
        </p>

        {msg && (
          <p className="text-sm text-center mb-3 text-blue-600">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="border p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
