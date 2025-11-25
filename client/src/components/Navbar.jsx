import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-between items center py-5 mx-8 sm:mx-20 xl:mx-32">
            <div className="cursor-pointer w-34 sm:w-44 text-primary text-xl font-bold" onClick={() => navigate("/")}>IncidentIQ</div>
            <button onClick={() => navigate("/login")} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5">Login</button>
      </div>
    )
}

export default Navbar


// onClick={() => navigate('/')}
// onClick={() => navigate('/login')}