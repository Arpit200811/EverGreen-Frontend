import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks"; 
import Services from "./components/Services";
import PriceEstimator from "./components/PriceEstimator"; 
import About from "./components/About";
import WhyUs from "./components/WhyUs";
import CreateTicket from "./CreateTicket";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ"; 
import Footer from "./components/Footer"; 
import { useAuth } from "../../context/AuthContext";
import FloatingActions from "./components/FloatingActions";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white">
      <Navbar user={user} logout={logout} />
      <Hero />
      <div id="about">
        <HowItWorks />
      </div>
      <div id="services">
        <Services />
      </div>
      <PriceEstimator />
      <WhyUs />
      <About />
      <div id="booking" className="bg-slate-50 py-12">
         <CreateTicket />
      </div>
      <Testimonials />
      <div id="contact">
        <FAQ />
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
}