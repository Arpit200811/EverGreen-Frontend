import { Laptop, Smartphone, Printer, Fan } from "lucide-react";

const ServiceCard = ({ icon, title }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
    <div className="text-emerald-600 mb-4 flex justify-center">{icon}</div>
    <h4 className="font-semibold text-lg">{title}</h4>
  </div>
);

export default function Services() {
  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-4xl font-bold text-center mb-14">Our Services</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <ServiceCard icon={<Laptop />} title="Laptop Repair" />
          <ServiceCard icon={<Smartphone />} title="Mobile Repair" />
          <ServiceCard icon={<Printer />} title="Printer Repair" />
          <ServiceCard icon={<Fan />} title="AC & Appliances" />
        </div>
      </div>
    </section>
  );
}
