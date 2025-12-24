import { Laptop, Smartphone, Printer, Fan, ArrowRight, ShieldCheck } from "lucide-react";

const ServiceCard = ({ icon: Icon, title, desc }) => (
  <div className="group relative bg-white rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(5,150,105,0.12)] overflow-hidden">
    {/* Background Decorative Element */}
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out -z-0"></div>

    <div className="relative z-10">
      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
        <Icon size={28} />
      </div>
      
      <h4 className="font-black text-slate-800 text-xl mb-3 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        {desc}
      </p>

      <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
        Book Now <ArrowRight size={14} />
      </div>
    </div>
  </div>
);

export default function Services() {
  const services = [
    { 
      icon: Laptop, 
      title: "Laptop Repair", 
      desc: "Hardware upgrades, screen replacement, and software troubleshooting for all brands." 
    },
    { 
      icon: Smartphone, 
      title: "Mobile Repair", 
      desc: "Expert care for your smartphones, from battery issues to complex motherboard repairs." 
    },
    { 
      icon: Printer, 
      title: "Printer Repair", 
      desc: "Quick fixing for inkjet, laser, and industrial printers with genuine spare parts." 
    },
    { 
      icon: Fan, 
      title: "Appliances", 
      desc: "Maintenance and repair services for ACs, Fridges, and other essential home appliances." 
    },
  ];

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldCheck size={14} /> Professional Excellence
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              World-class services, <br />
              <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">at your doorstep.</span>
            </h3>
          </div>
          <p className="text-slate-400 font-medium max-w-xs text-sm">
            We provide certified engineers for all your electronic needs with a 30-day service warranty.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-20 bg-slate-900 rounded-[3rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <h4 className="text-white text-2xl font-bold relative z-10">
            Don't see what you're looking for? 
            <span className="text-emerald-400 ml-2">We fix everything.</span>
          </h4>
          <button className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-3 rounded-xl font-black transition-all relative z-10">
            Contact Custom Support
          </button>
        </div>
      </div>
    </section>
  );
}