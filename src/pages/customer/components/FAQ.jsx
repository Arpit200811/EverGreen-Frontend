import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`border-b border-slate-200 last:border-0 transition-all ${isOpen ? 'bg-emerald-50/30' : ''}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 px-4 text-left group"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-emerald-700' : 'text-slate-700 group-hover:text-emerald-600'}`}>
          {question}
        </span>
        <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-4 pb-6 text-slate-500 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Are your service engineers background verified?",
      answer: "Yes, absolutely. Every engineer on our platform undergoes a strict 3-level verification process, including identity checks, criminal record verification, and technical skill certification."
    },
    {
      question: "What if the issue is not resolved after repair?",
      answer: "We offer a 30-day service warranty. If the same problem persists within 30 days of repair, we will re-assign an engineer to fix it at zero additional service cost."
    },
    {
      question: "How do I pay for the service?",
      answer: "You can pay via UPI, Credit/Debit Cards, or Cash directly to the engineer after the service is completed and you are satisfied with the work."
    },
    {
      question: "Is there a visiting charge if I don't proceed with repair?",
      answer: "A minimal diagnostic fee of ₹199 is applicable if the engineer visits and you decide not to go ahead with the repair. This covers their travel and time."
    }
  ];

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full mb-4">
            <HelpCircle size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Support Center</span>
          </div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
            Common Questions
          </h3>
          <p className="text-slate-500 mt-2 font-medium">Everything you need to know about our service process.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
        
        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-emerald-900 rounded-[2rem] text-white">
            <p className="text-emerald-200 font-bold mb-2 text-sm uppercase tracking-widest">Still have questions?</p>
            <h4 className="text-2xl font-black mb-6">We're here to help you 24/7</h4>
            <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+919219927533" className="bg-white text-emerald-900 px-8 py-3 rounded-xl font-black hover:bg-emerald-50 transition-all shadow-lg">Call Us Now</a>
                <a href="https://wa.me/919219927533" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black hover:bg-emerald-400 transition-all shadow-lg">WhatsApp Chat</a>
            </div>
        </div>
      </div>
    </section>
  );
}