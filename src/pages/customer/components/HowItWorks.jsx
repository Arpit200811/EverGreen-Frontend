import { ClipboardList, UserCheck, ShieldCheck, Sparkles } from "lucide-react";

const Step = ({ number, title, desc, icon: Icon, isLast }) => (
  <div className="relative flex flex-col items-center text-center group">
    {/* Connector Line (Desktop Only) */}
    {!isLast && (
      <div className="hidden lg:block absolute top-12 left-1/2 w-full h-[2px] bg-emerald-100 -z-0">
        <div className="w-0 h-full bg-emerald-500 group-hover:w-full transition-all duration-1000"></div>
      </div>
    )}

    {/* Icon Circle */}
    <div className="relative z-10 w-24 h-24 bg-white border-4 border-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 group-hover:border-emerald-500 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-emerald-900/5">
      <Icon size={40} strokeWidth={1.5} />
      <span className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white text-xs font-black rounded-full flex items-center justify-center border-4 border-white">
        {number}
      </span>
    </div>

    <h4 className="text-xl font-black text-slate-800 mb-3">{title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed px-4">{desc}</p>
  </div>
);

export default function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      title: "Raise Ticket",
      desc: "Fill a simple 1-minute form detailing your issue and preferred time."
    },
    {
      icon: UserCheck,
      title: "AI Matching",
      desc: "Our system assigns the best-rated certified engineer near your location."
    },
    {
      icon: ShieldCheck,
      title: "Secure Service",
      desc: "Technician arrives, verifies the issue, and provides a transparent quote."
    },
    {
      icon: Sparkles,
      title: "Happy Device",
      desc: "Get your device fixed with a 30-day warranty. Pay only when satisfied."
    }
  ];

  return (
    <section id="services" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4 inline-block">
            Seamless Journey
          </span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            How Evergreen Works
          </h3>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto font-medium">
            From booking to resolution, we've automated everything to ensure you get the fastest service.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              number={index + 1} 
              {...step} 
              isLast={index === steps.length - 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}