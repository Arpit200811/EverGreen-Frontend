import { Wrench, Clock, ShieldCheck, PhoneCall, ArrowRight } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <div className="relative group bg-white rounded-[2rem] p-8 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(5,150,105,0.15)] border border-slate-100 flex flex-col items-center text-center overflow-hidden">
    {/* Hover Effect Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative z-10">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      
      <h4 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">
        {desc}
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        Learn More <ArrowRight size={12} />
      </div>
    </div>
  </div>
);

export default function WhyUs() {
  const features = [
    {
      icon: Wrench,
      title: "Certified Experts",
      desc: "Every engineer is background-verified and holds premium certifications for high-end repairs."
    },
    {
      icon: Clock,
      title: "60-Min Arrival",
      desc: "Our automated dispatch system ensures a technician reaches your doorstep within an hour."
    },
    {
      icon: ShieldCheck,
      title: "Warranty Backed",
      desc: "Enjoy peace of mind with our 30-day post-service warranty on all hardware replacements."
    },
    {
      icon: PhoneCall,
      title: "Priority Support",
      desc: "Our dedicated concierge desk is available 24/7 to track and resolve your service tickets."
    }
  ];

  return (
    <section className="py-24 bg-[#f8fafc] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4">
            The Evergreen Advantage
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
            We don't just fix devices, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              We restore your productivity.
            </span>
          </h3>
          <p className="text-slate-400 font-medium">
            Over 10,000 households trust our ecosystem for reliable, transparent, and ultra-fast service management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Trust Bar */}
        <div className="mt-20 py-8 border-y border-slate-200 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-xl font-black text-slate-400 tracking-tighter uppercase italic">Verified Partners</span>
            <div className="h-6 w-px bg-slate-300 hidden md:block"></div>
            <span className="text-sm font-bold text-slate-500 tracking-widest uppercase">Trusted by 200+ Corporate Clients</span>
        </div>
      </div>
    </section>
  );
}