import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
// import Navbar from "../components/Navbar.jsx";
import LandingMiddle from "../components/LandingMiddle.jsx";
import Footer from "../components/Footer.jsx";
// Landing Page
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Navbar code for landing page only*/}
      <div className="flex justify-between items center py-5 mx-8 sm:mx-20 xl:mx-32">
            <div className="cursor-pointer w-34 sm:w-44 text-primary text-xl font-bold" onClick={() => navigate("/")}>IncidentIQ</div>
            <button onClick={() => navigate("/login")} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5">Login</button>
      </div>
      <Header />
      <LandingMiddle/>
      <Footer/>
    </div>
  );
}

export default LandingPage;

