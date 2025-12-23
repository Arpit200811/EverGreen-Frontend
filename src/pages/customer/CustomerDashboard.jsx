import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import WhyUs from "./components/WhyUs";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import CreateTicket from "./CreateTicket"
import { useAuth } from "../../context/AuthContext";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="">
      <Navbar user={user} logout={logout} />
      <Hero />
      <Services />
      <About />
      <WhyUs />
      <CreateTicket />
      <Testimonials />
      <Contact />
    </div>
  );
}
