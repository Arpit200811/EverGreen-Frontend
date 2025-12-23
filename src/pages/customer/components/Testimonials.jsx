import { Star } from "lucide-react";

const TestimonialCard = ({ name }) => (
  <div className="bg-white/10 rounded-xl p-6 text-center">
    <div className="flex justify-center mb-2">
      {[...Array(5)].map((_, i) => <Star key={i} size={16} />)}
    </div>
    <p className="text-sm mb-2">Excellent service, fast and professional!</p>
    <p className="font-semibold">{name}</p>
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-24 bg-emerald-700 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-4xl font-bold mb-14">Customer Reviews</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard name="Amit Sharma" />
          <TestimonialCard name="Neha Verma" />
          <TestimonialCard name="Rahul Singh" />
        </div>
      </div>
    </section>
  );
}
