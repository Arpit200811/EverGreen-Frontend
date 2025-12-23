import { Link } from "react-router-dom";

export default function Navbar({ user, logout }) {
  return (
    <nav className="sticky top-0 bg-emerald-700 text-white shadow">
      <div className="w-full px-6 py-4 flex justify-between items-center flex justify-between items-center navbar-sticky">
        <h1 className="text-2xl font-extrabold">Evergreen EMS</h1>
        <div className="flex items-center gap-6 text-sm">
          <a href="#about" className="hover:underline">
            About
          </a>
          <a href="#services" className="hover:underline">
            Services
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
          <a href="#tickets-create" className="hover:underline">
            Raise Ticket
          </a>
          <span className="hidden sm:block">Hi, {user?.name}</span>
          <button
            onClick={logout}
            className="bg-white text-emerald-700 px-4 py-1.5 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
