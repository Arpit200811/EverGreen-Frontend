import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Home Owner",
    image: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    text: "Excellent service! The technician arrived on time and fixed my laptop within an hour. Highly impressed with the professionalism.",
  },
  {
    name: "Neha Verma",
    role: "Business Owner",
    image: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    text: "Very reliable platform. My office AC issue was resolved smoothly. The tracking system is a game changer for service updates.",
  },
  {
    name: "Rahul Singh",
    role: "Freelancer",
    image: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    text: "Great experience! The doorstep service is super convenient. No more carrying heavy appliances to local shops. Truly amazing!",
  },
  {
    name: "Pooja Patel",
    role: "Tech Enthusiast",
    image: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    text: "The support team was polite and very helpful. The entire process from raising a ticket to resolution was seamless and transparent.",
  },
];

const RatingStars = ({ rating }) => (
  <div className="flex gap-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < rating
            ? "text-amber-400 fill-amber-400"
            : "text-white/20"
        }
      />
    ))}
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#064e3b] text-white relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-900/40 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full mb-4 inline-block">
            Wall of Love
          </span>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Trusted by Hundreds.
          </h3>
          <p className="text-emerald-100/60 font-medium">
            Join 10,000+ satisfied users who have experienced our seamless 
            repair management ecosystem.
          </p>
        </div>

        <div className="relative px-4 sm:px-12">
          {/* Custom Navigation Buttons */}
          <button className="swiper-prev absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 hover:bg-emerald-500 text-white rounded-2xl flex items-center justify-center transition-all border border-white/10 group active:scale-90 hidden sm:flex">
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <button className="swiper-next absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 hover:bg-emerald-500 text-white rounded-2xl flex items-center justify-center transition-all border border-white/10 group active:scale-90 hidden sm:flex">
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            navigation={{
              nextEl: ".swiper-next",
              prevEl: ".swiper-prev",
            }}
            pagination={{ 
                clickable: true,
                dynamicBullets: true 
            }}
            spaceBetween={30}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8 h-full flex flex-col hover:bg-white/[0.08] transition-all duration-300 group">
                  <div className="text-emerald-500/30 mb-6 group-hover:text-emerald-400 transition-colors">
                    <Quote size={40} fill="currentColor" />
                  </div>

                  <p className="text-lg font-medium text-emerald-50/90 leading-relaxed mb-8 flex-grow">
                    “{item.text}”
                  </p>

                  <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-white/10 shadow-lg"
                    />
                    <div className="text-left">
                      <p className="font-black text-white tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{item.role}</p>
                      <div className="mt-1">
                        <RatingStars rating={item.rating} />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet { background: rgba(255,255,255,0.2) !important; opacity: 1; }
        .swiper-pagination-bullet-active { background: #10b981 !important; width: 24px !important; border-radius: 10px !important; }
      `}</style>
    </section>
  );
}