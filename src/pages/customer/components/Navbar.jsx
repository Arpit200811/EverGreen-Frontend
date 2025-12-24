import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, X, Bell, LayoutDashboard, TicketPlus, Home, Info, Wrench, Phone } from "lucide-react";
import { useState } from "react";

export default function Navbar({ user, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Smooth scroll function
  const scrollToSection = (id) => {
    setIsOpen(false); // Mobile menu close karein
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isCustomer = user?.role === "CUSTOMER";

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform">
              E
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Evergreen <span className="text-emerald-600">EMS</span>
            </h1>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {/* Home / Top Scroll */}
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
              >
                Home
              </button>

              {/* Section Links */}
              <button onClick={() => scrollToSection('about')} className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">About</button>
              <button onClick={() => scrollToSection('services')} className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Services</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Contact</button>

              {/* Dashboard Link - Only for Admin/Staff */}
              {!isCustomer && (
                <Link 
                  to={user?.role === "ADMIN" ? "/dashboard" : "/employee"}
                  className="text-sm font-bold text-emerald-600 flex items-center gap-1"
                >
                  <LayoutDashboard size={14} /> Admin Panel
                </Link>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {/* --- USER PROFILE & ACTIONS --- */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-black text-slate-800 leading-none capitalize">{user?.name}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">{user?.role}</p>
                </div>
                
                <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold border border-emerald-200">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={logout}
                  className="ml-2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4 shadow-xl">
          <div className="flex flex-col gap-2">
            <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-emerald-50 rounded-xl">
              <Home size={18} /> Home
            </button>
            <button onClick={() => scrollToSection('about')} className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-emerald-50 rounded-xl">
              <Info size={18} /> About
            </button>
            <button onClick={() => scrollToSection('services')} className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-emerald-50 rounded-xl">
              <Wrench size={18} /> Services
            </button>
            <button onClick={() => scrollToSection('contact')} className="flex items-center gap-3 px-4 py-3 text-slate-600 font-bold hover:bg-emerald-50 rounded-xl">
              <Phone size={18} /> Contact
            </button>
            <div className="border-t border-slate-100 my-2"></div>
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-rose-600 font-bold hover:bg-rose-50 rounded-xl w-full text-left">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}