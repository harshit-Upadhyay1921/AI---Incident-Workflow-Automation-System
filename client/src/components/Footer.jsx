import { Link } from "react-router-dom";
import { FaGlobe, FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-200 pt-14 pb-10 px-8 sm:px-16 xl:px-24">

      {/* TOP CTA */}
      <div className="text-center pb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Request info or schedule a demo
        </h2>

        <button className="mt-6 px-8 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition">
          Contact Us
        </button>
      </div>

      {/* FOOTER CONTENT */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-200">

        {/* LEFT BRANDING */}
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <span className="text-xl font-bold text-primary">IncidentIQ</span>
          <span className="text-gray-500">| Modern ITSM Platform</span>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-6 text-gray-600 text-xl">
          <FaGlobe />
          <FaYoutube className="cursor-pointer hover:text-primary" />
          <FaLinkedin className="cursor-pointer hover:text-primary" />
          <FaFacebook className="cursor-pointer hover:text-primary" />
          <FaInstagram className="cursor-pointer hover:text-primary" />
          <FaTiktok className="cursor-pointer hover:text-primary" />
        </div>
      </div>

      {/* BOTTOM LINKS */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-600">

        <Link className="hover:text-primary transition">United States - Global</Link>
        <Link className="hover:text-primary transition">Site terms</Link>
        <Link className="hover:text-primary transition">GDPR</Link>
        <Link className="hover:text-primary transition">Privacy statement</Link>
        <Link className="hover:text-primary transition">Your privacy choices</Link>
        <Link className="hover:text-primary transition">Cookie policy</Link>
        <Link className="hover:text-primary transition">Cookie preferences</Link>
        <Link className="hover:text-primary transition">Sitemap</Link>
        <Link className="hover:text-primary transition">Business continuity</Link>
        <Link className="hover:text-primary transition">Accessibility</Link>

      </div>

      {/* COPYRIGHT */}
      <div className="mt-6 text-center lg:text-left text-sm text-gray-500">
        © {new Date().getFullYear()} IncidentIQ. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
