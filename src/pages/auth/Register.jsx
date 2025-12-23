import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../../api/axios";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),

      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number")
        .required("Mobile number is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");

        await API.post("/auth/register", {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          role: "CUSTOMER",
        });

        navigate("/");
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-700">
            Customer Registration
          </h1>
          <p className="text-gray-500 mt-1">
            Create your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Rahul Sharma"
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="example@gmail.com"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm text-gray-600">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="9876543210"
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/" className="text-emerald-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
