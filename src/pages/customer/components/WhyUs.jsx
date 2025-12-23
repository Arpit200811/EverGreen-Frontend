import { Wrench, Clock, ShieldCheck, PhoneCall } from "lucide-react";

const FeatureCard = ({ icon, title }) => (
  <div className="bg-white rounded-xl p-6 text-center shadow">
    <div className="text-emerald-600 mb-4 flex justify-center">{icon}</div>
    <h4 className="font-semibold">{title}</h4>
  </div>
);

export default function WhyUs() {
  return (
    <section className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <FeatureCard icon={<Wrench />} title="Certified Engineers" />
          <FeatureCard icon={<Clock />} title="Fast Service" />
          <FeatureCard icon={<ShieldCheck />} title="Secure Platform" />
          <FeatureCard icon={<PhoneCall />} title="24×7 Support" />
        </div>
      </div>
    </section>
  );
}
