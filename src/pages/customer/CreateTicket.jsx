import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ClipLoader } from "react-spinners";
import { createTicket } from "../../api/tickets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import {
  User, Phone, MapPin, Laptop, Layers, MessageSquare, 
  Wrench, ShieldCheck, Clock, CheckCircle2, Tv, Zap, Smartphone
} from "lucide-react";

const schema = yup.object({
  customerName: yup.string().required("Customer name is required"),
  mobile: yup.string().matches(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number").required("Mobile number is required"),
  location: yup.string().required("Location is required"),
  deviceType: yup.string().required("Device type is required"),
  deviceModel: yup.string().required("Device model is required"),
  issueDescription: yup.string().required("Issue description is required"),
});

const deviceCategories = [
  { id: "Laptop", icon: Laptop, label: "Laptop" },
  { id: "AC", icon: Zap, label: "Air Conditioner" },
  { id: "Smartphone", icon: Smartphone, label: "Mobile" },
  { id: "TV", icon: Tv, label: "Television" },
];

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { deviceType: "" }
  });

  const handleDeviceSelect = (id) => {
    setSelectedDevice(id);
    setValue("deviceType", id);
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const payload = { ...formData, customer: user._id };
      await createTicket(payload);
      
      Swal.fire({
        icon: "success",
        title: "<span style='color:#065f46'>Request Received!</span>",
        html: "<b>Ticket ID:</b> #" + Math.floor(100000 + Math.random() * 900000) + "<br>We'll call you in 15 minutes.",
        confirmButtonColor: "#10b981",
        customClass: { popup: 'rounded-[2.5rem]' }
      });
      navigate("/tickets");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops!", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-4 bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Progress Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Book a Service</h2>
                <p className="text-slate-500 font-medium">Get your electronics fixed by certified experts.</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold italic">
                            {i === 4 ? '4.9★' : ''}
                        </div>
                    ))}
                </div>
                <p className="text-xs font-black text-slate-600 uppercase pr-2">12k+ Happy Customers</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT: FORM AREA */}
          <div className="lg:col-span-8 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
              
              {/* Step 1: Device Selection */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-xs italic">01</span>
                    <h3 className="text-xl font-black text-slate-800 italic">Select Category</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {deviceCategories.map((device) => (
                    <button
                      key={device.id}
                      type="button"
                      onClick={() => handleDeviceSelect(device.id)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                        selectedDevice === device.id 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100" 
                        : "border-slate-50 bg-slate-50 hover:border-emerald-200 text-slate-400"
                      }`}
                    >
                      <device.icon size={32} strokeWidth={selectedDevice === device.id ? 2.5 : 1.5} />
                      <span className="font-black text-[10px] uppercase tracking-widest">{device.label}</span>
                    </button>
                  ))}
                </div>
                {errors.deviceType && <p className="text-rose-500 text-[10px] font-bold ml-2 tracking-wide uppercase">! Please select a device</p>}
              </div>

              {/* Step 2: Personal & Device Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-xs italic">02</span>
                    <h3 className="text-xl font-black text-slate-800 italic">Technical Details</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand/Model</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input {...register("deviceModel")} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none border border-slate-50" placeholder="e.g. MacBook Air M2" />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input {...register("location")} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none border border-slate-50" placeholder="Area / Street Name" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Describe Issue</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <textarea {...register("issueDescription")} rows={3} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none border border-slate-50 resize-none" placeholder="What exactly is the problem?" />
                  </div>
                </div>
              </div>

              {/* Step 3: Contact */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-xs italic">03</span>
                    <h3 className="text-xl font-black text-slate-800 italic">Contact Info</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6 pb-4">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input {...register("customerName")} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none border border-slate-50" placeholder="Full Name" />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input {...register("mobile")} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none border border-slate-50" placeholder="Mobile Number" />
                    </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-emerald-900/10 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-4 group"
              >
                {loading ? <ClipLoader color="#fff" size={24} /> : (
                    <>
                        <span className="uppercase tracking-[0.2em] text-sm">Send Service Request</span>
                        <CheckCircle2 className="group-hover:translate-x-2 transition-transform" />
                    </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: TRUST BADGES */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-emerald-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <h4 className="text-2xl font-black mb-6 italic leading-tight">Why Book With Us?</h4>
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><ShieldCheck className="text-emerald-400" /></div>
                        <div><p className="font-black text-sm uppercase tracking-wider">Zero Compromise</p><p className="text-xs text-emerald-100/60 font-medium">100% Genuine spare parts with warranty.</p></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><Clock className="text-emerald-400" /></div>
                        <div><p className="font-black text-sm uppercase tracking-wider">Fast Response</p><p className="text-xs text-emerald-100/60 font-medium">Engineer visit within 60-90 minutes.</p></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><Wrench className="text-emerald-400" /></div>
                        <div><p className="font-black text-sm uppercase tracking-wider">Expert Hands</p><p className="text-xs text-emerald-100/60 font-medium">Certified & Background verified technicians.</p></div>
                    </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Support Hotline</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner"><Phone size={20} /></div>
                    <div>
                        <p className="text-xl font-black text-slate-800">1800-419-090</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Mon - Sat (9am - 8pm)</p>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}