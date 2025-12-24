import { Target, Users, ShieldCheck, Zap } from "lucide-react";

const FeaturePoint = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4 items-start group">
    <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
      <Icon size={24} />
    </div>
    <div>
      <h5 className="font-bold text-slate-800 text-lg mb-1">{title}</h5>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#fcfdfd] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- LEFT SIDE: THE IMAGE/VISUAL --- */}
          <div className="relative">
            {/* Decorative Background Blob */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-100 rounded-full blur-[80px] opacity-60"></div>
            
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" 
                alt="Our Service Excellence" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-8 right-8 bg-white p-6 rounded-[2rem] shadow-xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ISO Certified</p>
                  <p className="text-lg font-black text-slate-800">Quality Assured</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: CONTENT --- */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] px-3 py-1 bg-emerald-50 rounded-full">
                Our Story
              </span>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                Revolutionizing <span className="text-emerald-600">Service Management</span> Since 2024.
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Evergreen EMS was born out of a simple need: To make high-quality repair services as easy as ordering food online. We bridge the gap between skilled engineers and people who value time.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-8 pt-4">
              <FeaturePoint 
                icon={Target} 
                title="Our Mission" 
                desc="To provide transparent, reliable, and swift electronic repairs at scale."
              />
              <FeaturePoint 
                icon={Users} 
                title="Elite Engineers" 
                desc="Only top 5% of certified technicians join our specialized service force."
              />
              <FeaturePoint 
                icon={Zap} 
                title="Swift Action" 
                desc="Automated ticket routing ensures your technician is assigned in minutes."
              />
              <FeaturePoint 
                icon={ShieldCheck} 
                title="Total Safety" 
                desc="Every service is insured and performed under strict safety protocols."
              />
            </div>

            <div className="pt-6">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-700 transition-colors shadow-lg shadow-slate-200">
                Learn More About Our Process
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}