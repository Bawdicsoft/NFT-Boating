import { Link } from "react-router-dom";
import "./Header.scss";
import Dropdown from "./Dropdown/Dropdown";
import logo from "./../../Assets/logo.png"
import React from "react";


function Header() {
  return (
    <div className="Header">
      <div className="Container">
        <img src={logo} alt="NFT Yacht" />
        <div className="Nav">
          <div className="naveLink">
            <Link to="/">Home</Link>
            <Link to="/become-a-member">Become a Member</Link>
            {/* <Link to="/booking">Booking</Link> */}
            <Link to="/dashboard">Dashboard</Link>
            {/* <Link to="/single-page">Single Page</Link> */}
          </div>

          <Dropdown />
        </div>
      </div>
    </div>
  );
}

export default Header;
