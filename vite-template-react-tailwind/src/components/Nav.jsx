import React from "react";
import { Link } from "react-router-dom";

const NavButton = ({ icon, children }) => {
  return (
    <div className="w-auto inline-block px-6 py-4 border-r-2 font-bold cursor-pointer transition-all duration-300 hover:bg-yellow-500">
      <i className={icon + " w-3 mr-3 font-bold"}></i>
      <div className="inline-block">{children}</div>
    </div>
  );
};

const Nav = () => {
  return (
    <div className="relative border-b-2 z-20">
      <Link to="/attendance">
        <NavButton icon={"fa-regular fa-calendar"}>Attendance</NavButton>
      </Link>
      <Link to="/register">
        <NavButton icon={"fa-regular fa-id-card"}>Register</NavButton>
      </Link>
      <Link to="/update">
        <NavButton icon={"fa-regular fa-pen"}>Update</NavButton>
      </Link>
      <Link to="/delete">
        <NavButton icon={"fa-solid fa-trash"}>Delete</NavButton>
      </Link>
      <Link to="/detail">
        <NavButton icon={"fa-solid fa-chart-simple"}>Detail</NavButton>
      </Link>
      <Link to="/emptydb">
        <NavButton icon={"fa-solid fa-skull-crossbones"}>Empty DB</NavButton>
      </Link>
    </div>
  );
};

export default Nav;
