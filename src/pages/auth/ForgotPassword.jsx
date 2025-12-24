import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { Mail, Loader2, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address");

    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset link dispatched!", {
        style: { borderRadius: '12px', background: '#065f46', color: '#fff' }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] px-4 relative">
      <Toaster position="top-center" />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-10">
        <KeyRound size={200} className="text-emerald-700 rotate-12" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-emerald-50 p-8 sm:p-10">
          
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Login
          </Link>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={32} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  Lost your Key?
                </h1>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Enter your registered email and we'll send you a secure link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      type="email"
                      placeholder="e.g. rahul@company.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Send Recovery Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Check your Inbox</h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                A secure password reset link has been sent to <br />
                <span className="text-slate-800 font-bold">{email}</span>
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline"
              >
                Didn't get the email? Try again
              </button>
            </div>
          )}

          {/* Help Text */}
          <p className="text-center text-[10px] font-bold text-slate-300 mt-10 uppercase tracking-[0.2em]">
            Evergreen Security Protocol
          </p>
        </div>
      </div>
    </div>
  );
}