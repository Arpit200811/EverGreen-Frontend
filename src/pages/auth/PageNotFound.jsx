import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, Ghost } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 overflow-hidden relative">
      
      {/* 🔹 Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />

      <div className="max-w-2xl w-full text-center z-10">
        {/* 🔹 Animated Illustration */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
             {/* Large Shadowy 404 Text */}
            <h1 className="text-[12rem] md:text-[16rem] font-black text-slate-200/60 leading-none select-none">
              404
            </h1>
            {/* Floating Ghost Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <motion.div
                 animate={{ rotate: [0, 5, -5, 0] }}
                 transition={{ duration: 5, repeat: Infinity }}
                 className="bg-white p-6 rounded-3xl shadow-2xl shadow-slate-200"
               >
                 <Ghost size={80} className="text-emerald-500" strokeWidth={1.5} />
               </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 🔹 Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
            Lost in Space?
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            The page you are looking for doesn't exist or has been moved. 
            Don't worry, our ghost will guide you back.
          </p>
        </motion.div>

        {/* 🔹 Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Home size={18} />
            Back to Dashboard
          </button>
        </motion.div>

        {/* 🔹 Quick Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-8 border-t border-slate-200"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Need Help?</p>
          <div className="flex justify-center gap-8 text-sm font-bold text-slate-600">
            <a href="/support" className="hover:text-emerald-600 transition-colors">Support</a>
            <a href="/docs" className="hover:text-emerald-600 transition-colors">Documentation</a>
            <a href="/search" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
              <Search size={14} /> Search
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}