import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const Counter = ({ label, end, suffix = "" }) => (
  <div className="bg-white/10 rounded-xl p-4">
    <p className="text-3xl font-bold">
      <CountUp end={end} duration={2} />{suffix}
    </p>
    <p className="text-emerald-100">{label}</p>
  </div>
);

export default function Hero() {
  const [text] = useTypewriter({
    words: ["Smart Repairs", "Trusted Engineers", "Doorstep Service"],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <section className="bg-gradient-to-br from-emerald-600 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-28 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
          {text}<Cursor cursorColor="#fff" />
        </h2>
        <p className="text-lg text-emerald-100 max-w-3xl mx-auto mb-10">
          One platform to register issues, track engineers, and get professional
          repair service at your doorstep.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/tickets/create"
            className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold"
          >
            Raise Ticket
          </Link>
          <Link
            to="/tickets"
            className="border border-white px-8 py-4 rounded-xl"
          >
            Track Status
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <Counter label="Tickets Solved" end={10000} />
          <Counter label="Engineers" end={250} />
          <Counter label="Avg Response (min)" end={30} />
          <Counter label="Rating" end={5} suffix="★" />
        </div>
      </div>
    </section>
  );
}
