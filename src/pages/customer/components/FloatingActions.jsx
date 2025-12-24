import { MessageCircle, Phone, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingActions() {
  const [showScroll, setShowScroll] = useState(false);

  // Scroll to top dikhane ke liye logic
  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, [showScroll]);

  return (
    <>
      {/* --- WHATSAPP FLOATING BUTTON --- */}
      <a
        href="https://wa.me/919219927533" // Apna Number yahan dalein
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-[100] group flex items-center"
      >
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-2xl border border-emerald-100 group-hover:pr-6 transition-all duration-300">
          <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <MessageCircle size={24} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Chat with us</span>
            <span className="text-sm font-bold text-slate-800">WhatsApp</span>
          </div>
        </div>
      </a>

      {/* --- MOBILE ONLY STICKY CALL BUTTON --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-100 p-4 flex gap-4 z-[90] md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <a 
          href="tel:+919219927533" 
          className="flex-1 bg-slate-900 text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all active:scale-95"
        >
          <Phone size={18} /> Call Specialist
        </a>
        <a 
          href="#booking" 
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 bg-emerald-500 text-[#022c22] flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          Book Repair
        </a>
      </div>

      {/* --- SCROLL TO TOP --- */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-24 right-6 p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl shadow-xl transition-all duration-500 z-[100] hover:bg-emerald-600 hover:text-white ${
          showScroll ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}