import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react";

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().min(10, "Message must be at least 10 characters").required(),
});

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await emailjs.send(
        'service_fc3jqtl', 
        'template_20u1l1x', 
        { name: data.name, email: data.email, message: data.message }, 
        'rLQfghCG61ev7XIoI'
      );
      toast.success("Message sent! We'll be in touch soon.");
      reset();
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <footer id="contact" className="bg-[#020617] text-slate-400 pt-20 overflow-hidden relative">
      <Toaster position="bottom-center" />
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">

          {/* LEFT - Form Section */}
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 sm:p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-white text-3xl font-black tracking-tighter mb-2">Get in Touch</h3>
              <p className="text-sm font-medium text-slate-500">Have a special request? Send us a message.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <input
                    {...register("name")}
                    placeholder="Your Name"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                  {errors.name && <p className="text-rose-500 text-[10px] font-bold ml-2 uppercase tracking-wider">{errors.name.message}</p>}
                </div>
                <div className="space-y-1">
                  <input
                    {...register("email")}
                    placeholder="Email Address"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                  {errors.email && <p className="text-rose-500 text-[10px] font-bold ml-2 uppercase tracking-wider">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Tell us about your requirement..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                />
                {errors.message && <p className="text-rose-500 text-[10px] font-bold ml-2 uppercase tracking-wider">{errors.message.message}</p>}
              </div>

              <button
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : <>Send Message <Send size={18} /></>}
              </button>
            </form>
          </div>

          {/* RIGHT - Contact Details & Map */}
          <div className="flex flex-col justify-between py-4">
            <div className="space-y-10">
              <div>
                <h3 className="text-white text-3xl font-black tracking-tighter mb-6">Headquarters</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-800">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Office Location</p>
                      <p className="text-white font-bold">Dildarnagar, Ghazipur, <br />Uttar Pradesh 232326, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-800">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">24/7 Helpline</p>
                      <p className="text-white font-bold">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Google Map Card */}
            <div className="mt-10 rounded-[2rem] overflow-hidden border border-slate-800 h-48 sm:h-64 shadow-2xl relative group">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14421.365345710688!2d83.696135!3d25.359858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e09f7a77b8f97%3A0x8673327d7f6c6d0!2sDildarnagar%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                loading="lazy"
                className="grayscale invert opacity-60 group-hover:opacity-100 transition-opacity duration-500 border-0"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="border-t border-slate-800/50 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-[10px] font-bold text-white">E</div>
            <span className="text-white font-black tracking-tight">Evergreen <span className="text-emerald-500">EMS</span></span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            © {new Date().getFullYear()} Precision Management. Built for Excellence.
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-500">Privacy</a>
            <a href="#" className="hover:text-emerald-500">Terms</a>
            <a href="#" className="hover:text-emerald-500">Support</a>
          </div>
        </div>
      </div>
      
      {/* Floating WhatsApp Action */}
      <a 
        href="https://wa.me/919219927533" 
        target="_blank"
        className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-500 text-[#020617] rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all z-[100]"
      >
        <MessageCircle size={28} />
      </a>
    </footer>
  );
}