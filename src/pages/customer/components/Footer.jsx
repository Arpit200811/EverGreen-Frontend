import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-black">E</div>
            <h2 className="text-xl font-black text-white tracking-tight">Evergreen EMS</h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            India's most trusted ecosystem for doorstep electronic repairs and service management. We bring certified engineers to your home.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-emerald-400 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 italic">Quick Links</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-emerald-400 transition-colors">Home</button></li>
            <li><a href="#services" className="hover:text-emerald-400 transition-colors">Our Services</a></li>
            <li><a href="#about" className="hover:text-emerald-400 transition-colors">How it Works</a></li>
            <li><a href="#booking" className="hover:text-emerald-400 transition-colors">Book a Repair</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold mb-6 italic">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><MapPin size={18} className="text-emerald-500" /> Varanasi, Uttar Pradesh, India</li>
            <li className="flex gap-3"><Phone size={18} className="text-emerald-500" /> +91 98765 43210</li>
            <li className="flex gap-3"><Mail size={18} className="text-emerald-500" /> support@evergreenems.com</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6 italic">Stay Updated</h4>
          <p className="text-xs mb-4 text-slate-500 uppercase font-black tracking-widest">Subscribe to our newsletter</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email address" className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-emerald-500" />
            <button className="bg-emerald-500 text-slate-900 px-4 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all">Go</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Evergreen EMS. All rights reserved.
      </div>
    </footer>
  );
}