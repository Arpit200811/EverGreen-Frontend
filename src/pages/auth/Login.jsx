import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2, Lock, Mail } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: { email: "", password: "" },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");

        const res = await API.post("/auth/login", values);
        login(res.data.user, res.data.token);

        const role = res.data.user.role;

        if (role === "ADMIN") navigate("/dashboard");
        else if (role === "EMPLOYEE") navigate("/employee");
        else navigate("/customer"); // ✅ FIX
      } catch (err) {
        setError(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700">
            Evergreen EMS
          </h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}   // ✅ FIX
                value={formik.values.email}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="admin@evergreen.com"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}   // ✅ FIX
                value={formik.values.password}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold disabled:opacity-70"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/register" className="text-emerald-600 hover:underline">
            Create account
          </Link>

          <Link to="/forgot-password" className="text-emerald-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © Evergreen EMS • Secure Login
        </p>
      </div>
    </div>
  );
}
