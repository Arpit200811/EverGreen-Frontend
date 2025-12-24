import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../../api/axios";
import { Loader2, Mail, Lock, User, Phone, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
      name: Yup.string().min(3, "Too short!").required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter valid 10 digit Indian number")
        .required("Mobile number is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters required")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");

        await API.post("/auth/register", {
          ...values,
          role: "CUSTOMER",
        });

        toast.success("Account Created! Redirecting to login...", {
          icon: '🎉',
          style: {
            borderRadius: '12px',
            background: '#065f46',
            color: '#fff',
          },
        });

        setTimeout(() => navigate("/"), 2000);
      } catch (err) {
        const msg = err.response?.data?.message || "Registration failed. Try again.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] px-4 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-lg z-10">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-emerald-50 p-6 sm:p-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl mb-4">
              <UserPlus size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Join <span className="text-emerald-600">Evergreen</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">
              Start your journey with our EMS today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="text"
                  name="name"
                  {...formik.getFieldProps('name')}
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all ${formik.touched.name && formik.errors.name ? 'ring-2 ring-red-100' : ''}`}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{formik.errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input
                    type="email"
                    name="email"
                    {...formik.getFieldProps('email')}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="email@site.com"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input
                    type="tel"
                    name="phone"
                    {...formik.getFieldProps('phone')}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="password"
                  name="password"
                  {...formik.getFieldProps('password')}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-slate-900 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Create My Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-50 text-center">
            <p className="text-sm font-bold text-slate-400">
              Already part of the family?{" "}
              <Link to="/" className="text-emerald-600 hover:text-emerald-800 transition-colors ml-1">
                Sign In
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
              <ShieldCheck size={12} /> Data Protected by SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}