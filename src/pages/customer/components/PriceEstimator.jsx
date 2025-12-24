import { useState } from "react";
import { Calculator, ChevronRight, Info, Wrench, Tablet, Laptop, Tv, Zap } from "lucide-react";

const services = [
  { 
    id: "laptop", 
    name: "Laptop/PC", 
    icon: Laptop, 
    basePrice: 499,
    issues: [
      { label: "Screen Replacement", price: 2500 },
      { label: "Keyboard Repair", price: 800 },
      { label: "OS Installation", price: 500 },
      { label: "Battery Change", price: 1200 },
    ]
  },
  { 
    id: "ac", 
    name: "Air Conditioner", 
    icon: Zap, 
    basePrice: 599,
    issues: [
      { label: "General Cleaning", price: 400 },
      { label: "Gas Charging", price: 1800 },
      { label: "PCB Repair", price: 1500 },
      { label: "Installation", price: 1200 },
    ]
  },
  { 
    id: "smartphone", 
    name: "Smartphone", 
    icon: Tablet, 
    basePrice: 299,
    issues: [
      { label: "Display Touch", price: 1500 },
      { label: "Charging Port", price: 400 },
      { label: "Battery Replacement", price: 900 },
      { label: "Speaker Repair", price: 300 },
    ]
  },
  { 
    id: "tv", 
    name: "LED TV", 
    icon: Tv, 
    basePrice: 799,
    issues: [
      { label: "Backlight Issue", price: 1200 },
      { label: "Panel Repair", price: 3500 },
      { label: "Power Board", price: 1000 },
      { label: "Wall Mounting", price: 500 },
    ]
  }
];

export default function PriceEstimator() {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedIssue, setSelectedIssue] = useState(services[0].issues[0]);

  const totalPrice = selectedService.basePrice + selectedIssue.price;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4">
            <Calculator size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Instant Quote</span>
          </div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
            Smart Price Estimator
          </h3>
          <p className="text-slate-500 mt-2 font-medium">Check estimated repair costs before booking.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          
          {/* Left Side: Selection */}
          <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="space-y-8">
              {/* Device Selection */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">1. Select Device</label>
                <div className="grid grid-cols-2 gap-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedService(s);
                        setSelectedIssue(s.issues[0]);
                      }}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                        selectedService.id === s.id 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                        : "border-slate-100 hover:border-emerald-200 text-slate-600"
                      }`}
                    >
                      <s.icon size={20} />
                      <span className="font-bold text-sm">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Issue Selection */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">2. Select Issue</label>
                <div className="space-y-2">
                  {selectedService.issues.map((issue, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIssue(issue)}
                      className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all ${
                        selectedIssue.label === issue.label
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-transparent hover:border-slate-200"
                      }`}
                    >
                      <span className="font-bold text-sm">{issue.label}</span>
                      <ChevronRight size={16} className={selectedIssue.label === issue.label ? "opacity-100" : "opacity-0"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Result */}
          <div className="w-full md:w-[380px] bg-emerald-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <Wrench size={200} />
             </div>

             <div className="relative z-10">
                <p className="text-emerald-200 text-xs font-black uppercase tracking-[0.2em] mb-8">Estimated Total</p>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold">₹</span>
                    <span className="text-7xl font-black tracking-tighter">{totalPrice}</span>
                </div>
                <p className="text-emerald-100/60 text-xs font-medium italic">*Prices may vary based on actual spare parts cost.</p>
             </div>

             <div className="relative z-10 mt-12 space-y-4">
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-emerald-900">
                        <Info size={16} />
                    </div>
                    <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">Includes Visiting Charges & Minor Fault Fix</p>
                </div>
                
                <button className="w-full bg-white text-emerald-700 py-5 rounded-2xl font-black shadow-xl hover:bg-emerald-50 transition-all active:scale-95">
                    Proceed to Booking
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}