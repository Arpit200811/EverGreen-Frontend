import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2, Lock, Mail, CheckCircle2, Leaf } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
        const { user, token } = res.data;
        
        // Success Message Logic
        const welcomeQuotes = {
          ADMIN: "Welcome back, Commander! Ready to manage the system?",
          EMPLOYEE: "Great to see you! Let's make today productive.",
          CUSTOMER: "Hello! We're glad you're here with us today."
        };

        toast.success(welcomeQuotes[user.role] || "Login Successful!", {
          duration: 4000,
          icon: '🚀',
          style: {
            borderRadius: '15px',
            background: '#065f46',
            color: '#fff',
            fontWeight: 'bold'
          }
        });

        // 1 second delay taaki user message dekh sake
        setTimeout(() => {
          login(user, token);
          if (user.role === "ADMIN") navigate("/dashboard");
          else if (user.role === "EMPLOYEE") navigate("/employee");
          else navigate("/customer");
        }, 1200);

      } catch (err) {
        const errMsg = err.response?.data?.message || "Invalid credentials. Try again.";
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] px-4 relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Background Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(5,150,105,0.15)] border border-emerald-50 p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200 rotate-3 group hover:rotate-0 transition-transform">
              <Leaf className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Evergreen <span className="text-emerald-600">EMS</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-2 uppercase tracking-widest">Secure Gateway</p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="email"
                  name="email"
                  {...formik.getFieldProps('email')}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all ${formik.touched.email && formik.errors.email ? 'ring-2 ring-red-100' : ''}`}
                  placeholder="name@company.com"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="password"
                  name="password"
                  {...formik.getFieldProps('password')}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all ${formik.touched.password && formik.errors.password ? 'ring-2 ring-red-100' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{formik.errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">Sign In Now <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" /></span>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-50">
            <Link to="/register" className="text-center text-xs font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-tighter">
              New Account?
            </Link>
            <Link to="/forgot-password" className="text-center text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-tighter">
              Forgot Key?
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-400 mt-8 uppercase tracking-[0.3em] opacity-60">
          Powered by Evergreen Systems
        </p>
      </div>
    </div>
  );
}