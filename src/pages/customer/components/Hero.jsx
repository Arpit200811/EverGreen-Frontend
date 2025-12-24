import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react";

const Counter = ({ label, end, suffix = "", icon: Icon }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 group">
    <div className="flex justify-center mb-3 text-emerald-400 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <p className="text-4xl font-black tracking-tight">
      <CountUp end={end} duration={2.5} separator="," />{suffix}
    </p>
    <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mt-1">{label}</p>
  </div>
);

export default function Hero() {
  const [text] = useTypewriter({
    words: ["Smart Repairs.", "Trusted Engineers.", "Doorstep Service."],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <section className="relative bg-[#022c22] text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">System Live: 24/7 Support</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
          The Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
            {text}
          </span>
          <Cursor cursorStyle="_" cursorColor="#10b981" />
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-emerald-100/70 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          The all-in-one ecosystem to register service issues, track elite engineers, 
          and experience seamless repairs at your doorstep.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
          <Link
            to="/tickets/create"
            className="group w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-[#022c22] px-10 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20"
          >
            Raise Ticket Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/tickets"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md px-10 py-5 rounded-2xl font-black transition-all"
          >
            Track My Status
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-24">
          <Counter label="Tickets Solved" end={12500} icon={ShieldCheck} suffix="+" />
          <Counter label="Expert Team" end={250} icon={Activity} suffix="+" />
          <Counter label="Response Time" end={30} icon={Zap} suffix="m" />
          <Counter label="User Rating" end={5} icon={ShieldCheck} suffix="/5" />
        </div>
      </div>
    </section>
  );
}